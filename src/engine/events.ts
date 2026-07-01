import type { FactionId, FactionState } from './factions';
import { clampMood, presentFactions } from './factions';
import { applyBrutalityBacklash } from './loyalty';
import { clampResources, cohesion, martyrConversion } from './formulas';
import type { RNG } from './rng';
import type { GameState, Resources } from './state';

/**
 * Declarative event schema. Content files contain data only — no functions —
 * so the validator can statically analyze every card and game state stays
 * serializable.
 */
export interface Range {
  gte?: number;
  lte?: number;
}

export interface Condition {
  resource?: Partial<Record<keyof Resources, Range>>;
  cohesion?: Range;
  factionMood?: Partial<Record<FactionId, Range>>;
  /** All listed factions must still be in the coalition. */
  factionPresent?: FactionId[];
  /** All must be set. */
  flags?: string[];
  /** None may be set. */
  notFlags?: string[];
  turn?: Range;
}

/** A prose block gated on state. No `when` = the default variant. */
export interface ProseVariant {
  when?: Condition;
  text: string;
}

export interface ChoiceEffect {
  resources?: Partial<Resources>;
  moods?: Partial<Record<FactionId, number>>;
  setFlags?: string[];
  clearFlags?: string[];
  /**
   * The repression dial: applies a legitimacy delta computed from current
   * legitimacy (martyrConversion in formulas.ts). Same choice, opposite
   * outcome, decided by accumulated state.
   */
  martyrConversion?: boolean;
}

export interface EventChoice {
  id: string;
  label: string;
  /** Choice is unavailable (greyed out) unless met. */
  requires?: Condition;
  effect: ChoiceEffect;
  /** Result prose, also state-conditional (evaluated pre-effect). */
  outcome: ProseVariant[];
}

export interface EventCard {
  id: string;
  trigger: Condition;
  /** Draw weight among eligible cards. */
  weight: number;
  /** Fires at most once per campaign. Default true. */
  once?: boolean;
  /**
   * History on a schedule: the card becomes DUE at this turn and fires
   * with priority over random draws at the first opening (a pending
   * crackdown can delay it a turn — history arrives, sometimes late by
   * a mail-coach). Still subject to trigger and firedEvents.
   */
  scheduledTurn?: number;
  /** Visual hook (PLAN.md §6) — reserved, unrendered in v1. */
  art?: string;
  prose: ProseVariant[];
  choices: EventChoice[];
}

function inRange(value: number, range: Range | undefined): boolean {
  if (!range) return true;
  if (range.gte !== undefined && value < range.gte) return false;
  if (range.lte !== undefined && value > range.lte) return false;
  return true;
}

export function matches(condition: Condition | undefined, state: GameState): boolean {
  if (!condition) return true;
  if (condition.resource) {
    for (const [key, range] of Object.entries(condition.resource)) {
      if (!inRange(state.resources[key as keyof Resources], range)) return false;
    }
  }
  if (!inRange(cohesion(state.factions), condition.cohesion)) return false;
  if (condition.factionMood) {
    for (const [id, range] of Object.entries(condition.factionMood)) {
      const faction = state.factions.find((f) => f.id === id);
      if (!faction || !faction.present || !inRange(faction.mood, range)) return false;
    }
  }
  if (condition.factionPresent) {
    for (const id of condition.factionPresent) {
      if (!state.factions.some((f) => f.id === id && f.present)) return false;
    }
  }
  if (condition.flags?.some((flag) => !state.flags.includes(flag))) return false;
  if (condition.notFlags?.some((flag) => state.flags.includes(flag))) return false;
  if (!inRange(state.turn, condition.turn)) return false;
  return true;
}

/** First variant whose `when` matches; otherwise the default (no `when`). */
export function selectProse(variants: ProseVariant[], state: GameState): string {
  const conditional = variants.find((v) => v.when && matches(v.when, state));
  if (conditional) return conditional.text;
  return variants.find((v) => !v.when)?.text ?? '';
}

export function eligibleEvents(deck: EventCard[], state: GameState): EventCard[] {
  return deck.filter(
    (card) =>
      (card.once === false || !state.firedEvents.includes(card.id)) &&
      matches(card.trigger, state),
  );
}

/** Weighted draw among eligible cards. Returns undefined when none qualify. */
export function drawEvent(
  deck: EventCard[],
  state: GameState,
  rng: RNG,
): EventCard | undefined {
  const eligible = eligibleEvents(deck, state);
  if (eligible.length === 0) return undefined;
  const total = eligible.reduce((sum, card) => sum + card.weight, 0);
  let roll = rng() * total;
  for (const card of eligible) {
    roll -= card.weight;
    if (roll < 0) return card;
  }
  return eligible[eligible.length - 1];
}

export function availableChoices(card: EventCard, state: GameState): EventChoice[] {
  return card.choices.filter((c) => matches(c.requires, state));
}

/**
 * Applies an event choice. The second reducer entry point beside step():
 * an event choice can kill or crown you, so status is re-checked here.
 */
export function resolveEvent(
  state: GameState,
  card: EventCard,
  choiceId: string,
  _rng: RNG,
): GameState {
  if (state.status !== 'active' || state.pendingEventId !== card.id) return state;
  const choice = card.choices.find((c) => c.id === choiceId);
  if (!choice || !matches(choice.requires, state)) return state;

  const effect = choice.effect;
  let resources = { ...state.resources };
  let units = state.units;
  if (effect.resources) {
    for (const [key, delta] of Object.entries(effect.resources) as Array<
      [keyof Resources, number]
    >) {
      resources[key] += delta;
    }
  }
  if (effect.martyrConversion) {
    const conversion = martyrConversion(state.resources.legitimacy);
    resources.legitimacy += conversion;
    // The barracks read the same broadsheets: a successfully framed
    // massacre erodes the apparatus too. Chaos doesn't — it frightens
    // soldiers toward obedience.
    units = applyBrutalityBacklash(state, conversion);
  }
  resources = clampResources(resources);

  let factions: FactionState[] = state.factions;
  if (effect.moods) {
    factions = factions.map((f) =>
      f.present && effect.moods![f.id] !== undefined
        ? { ...f, mood: clampMood(f.mood + effect.moods![f.id]!) }
        : f,
    );
  }

  let flags = state.flags;
  if (effect.setFlags) flags = [...new Set([...flags, ...effect.setFlags])];
  if (effect.clearFlags) flags = flags.filter((f) => !effect.clearFlags!.includes(f));
  // Answering a crackdown settles it, whichever way the dial turned.
  if (card.trigger.flags?.includes('crackdown')) {
    flags = flags.filter((f) => f !== 'crackdown');
  }

  let status: GameState['status'] = 'active';
  if (resources.cadre <= 0) status = 'decapitated';
  else if (resources.grievance <= 0) status = 'irrelevant';
  else if (presentFactions(factions).length < 2) status = 'split';

  return {
    ...state,
    resources,
    factions,
    flags,
    status,
    units,
    pendingEventId: undefined,
    firedEvents: state.firedEvents.includes(card.id)
      ? state.firedEvents
      : [...state.firedEvents, card.id],
    log: [
      ...state.log,
      { turn: state.turn, kind: 'event', detail: `${card.id}: ${choice.id}` },
    ],
  };
}
