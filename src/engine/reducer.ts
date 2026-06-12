import type { Action } from './actions';
import type { EventCard } from './events';
import { drawEvent } from './events';
import type { FactionState } from './factions';
import { clampMood, driftMood, presentFactions } from './factions';
import {
  CASCADE_MOMENTUM_REQUIRED,
  cascadeQualifies,
  clampResources,
  cohesion,
  EFFECTS,
  informantProbability,
  MOOD_EFFECTS,
  PASSIVE,
  RAID_MOOD_EFFECTS,
  rollRaid,
  SPLIT_INFORMANT_HEAT,
  SPLIT_MOOD_RELIEF,
} from './formulas';
import type { RNG } from './rng';
import type { GameState, Resources, TurnEvent } from './state';

/**
 * Set by the reducer when a raid lands; crackdown (dial) cards trigger on
 * it, and resolving any event clears it. This is how the regime's violence
 * reaches the player as a choice instead of a stat line.
 */
export const CRACKDOWN_FLAG = 'crackdown';

/** Chance an ordinary eligible card is drawn on a given turn. */
export const EVENT_DRAW_CHANCE = 0.6;

function applyEffects(resources: Resources, effects: Partial<Resources>): Resources {
  const next = { ...resources };
  for (const [key, delta] of Object.entries(effects) as Array<[keyof Resources, number]>) {
    next[key] += delta;
  }
  return next;
}

function applyPassive(resources: Resources): Resources {
  return {
    ...resources,
    grievance: resources.grievance - PASSIVE.grievanceDecay,
    heat: resources.heat - PASSIVE.heatDecay,
    legitimacy: resources.legitimacy - PASSIVE.legitimacyDecay,
  };
}

function applyMoods(
  factions: FactionState[],
  deltas: Record<FactionState['id'], number>,
): FactionState[] {
  return factions.map((f) =>
    f.present ? { ...f, mood: clampMood(f.mood + deltas[f.id]) } : f,
  );
}

interface SplitOutcome {
  factions: FactionState[];
  resources: Resources;
  events: TurnEvent[];
  fatal: boolean;
}

/**
 * Cohesion hit zero: the angriest faction walks out with its share of the
 * movement, and may inform on the rest. Survivable while a coalition
 * (two or more factions) remains; fatal below that.
 */
function resolveSplit(
  factions: FactionState[],
  resources: Resources,
  turn: number,
  rng: RNG,
): SplitOutcome {
  const present = presentFactions(factions);
  const leaver = present.reduce((angriest, f) => (f.mood < angriest.mood ? f : angriest));
  const share = 1 / present.length;

  let next: Resources = {
    ...resources,
    sympathizers: resources.sympathizers - Math.round(resources.sympathizers * share),
    cadre: resources.cadre - Math.round(resources.cadre * share),
    materiel: resources.materiel - Math.round(resources.materiel * share),
  };

  const events: TurnEvent[] = [
    { turn, kind: 'split', detail: `${leaver.id} walked out`, factionId: leaver.id },
  ];

  if (rng() < informantProbability(leaver.mood)) {
    next = { ...next, heat: next.heat + SPLIT_INFORMANT_HEAT };
    events.push({
      turn,
      kind: 'split',
      detail: `${leaver.id} informed on the movement`,
      factionId: leaver.id,
    });
  }

  const remaining = factions.map((f) =>
    f.id === leaver.id
      ? { ...f, present: false }
      : f.present
        ? { ...f, mood: clampMood(f.mood + SPLIT_MOOD_RELIEF) }
        : f,
  );

  return {
    factions: remaining,
    resources: next,
    events,
    fatal: presentFactions(remaining).length < 2,
  };
}

/**
 * Advances the game by one turn. Pure: the same state, action, and RNG
 * stream always produce the same result, which is what makes campaigns
 * replayable from a seed + action log.
 */
export function step(
  state: GameState,
  action: Action,
  rng: RNG,
  deck: EventCard[] = [],
): GameState {
  if (state.status !== 'active') return state;
  // An event is on the table: the movement decides that first.
  if (state.pendingEventId !== undefined) return state;

  const turn = state.turn + 1;
  const log = [...state.log];
  let flags = state.flags;

  let resources = applyEffects(state.resources, EFFECTS[action.type]);
  resources = applyPassive(resources);

  let factions = applyMoods(state.factions, MOOD_EFFECTS[action.type]);
  factions = factions.map((f) => (f.present ? { ...f, mood: driftMood(f.mood) } : f));

  const raid = rollRaid(resources.heat, resources.cadre, resources.materiel, rng);
  if (raid.occurred) {
    resources = {
      ...resources,
      cadre: resources.cadre - raid.cadreLoss,
      materiel: resources.materiel - raid.materielLoss,
      heat: resources.heat - raid.heatRelief,
    };
    factions = applyMoods(factions, RAID_MOOD_EFFECTS);
    if (!flags.includes(CRACKDOWN_FLAG)) flags = [...flags, CRACKDOWN_FLAG];
    log.push({
      turn,
      kind: 'raid',
      detail: `raided — lost ${raid.cadreLoss} cadre, ${raid.materielLoss} materiel`,
    });
  }

  let splitFatal = false;
  if (cohesion(factions) <= 0) {
    const outcome = resolveSplit(factions, resources, turn, rng);
    factions = outcome.factions;
    resources = outcome.resources;
    log.push(...outcome.events);
    splitFatal = outcome.fatal;
  }

  resources = clampResources(resources);

  const cascadeMomentum = cascadeQualifies(resources, factions, turn)
    ? state.cascadeMomentum + 1
    : 0;

  // Cascade is checked first: once the tipping point is reached, the
  // movement has already won regardless of what its other clocks read.
  let status: GameState['status'] = 'active';
  if (cascadeMomentum >= CASCADE_MOMENTUM_REQUIRED) status = 'cascade';
  else if (splitFatal) status = 'split';
  else if (resources.cadre <= 0) status = 'decapitated';
  else if (resources.grievance <= 0) status = 'irrelevant';

  log.push({ turn, kind: 'action', detail: action.type });

  let next: GameState = {
    turn,
    resources,
    factions,
    status,
    flags,
    firedEvents: state.firedEvents,
    pendingEventId: undefined,
    cascadeMomentum,
    log,
  };

  // Draw at most one event. A pending crackdown always presents itself
  // (from the dial cards only); ordinary cards arrive at a pace that
  // leaves room for quiet turns and never preempt a crackdown.
  if (status === 'active') {
    const mustDraw = flags.includes(CRACKDOWN_FLAG);
    const pool = mustDraw
      ? deck.filter((c) => c.trigger.flags?.includes(CRACKDOWN_FLAG))
      : deck.filter((c) => !c.trigger.flags?.includes(CRACKDOWN_FLAG));
    if (mustDraw || rng() < EVENT_DRAW_CHANCE) {
      const card = drawEvent(pool, next, rng);
      if (card) next = { ...next, pendingEventId: card.id };
    }
  }

  return next;
}
