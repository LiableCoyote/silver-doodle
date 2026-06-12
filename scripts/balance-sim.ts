/**
 * Headless balance simulator: runs simple fixed strategies across many
 * seeds and ideologies to check that no naive strategy dominates, plus a
 * dial A/B verifying that escalation pays only with accumulated
 * legitimacy. Run with `npm run sim`.
 */
import type { ActionType } from '../src/engine/actions';
import { ACTIONS } from '../src/engine/actions';
import {
  createIdeologyFactions,
  createIdeologyResources,
  IDEOLOGIES,
  type IdeologyId,
} from '../src/content/ideologies';
import { DECK } from '../src/content/events';
import type { EventCard } from '../src/engine/events';
import { availableChoices, resolveEvent } from '../src/engine/events';
import { presentFactions } from '../src/engine/factions';
import { cohesion, MOOD_EFFECTS } from '../src/engine/formulas';
import { createRng, type RNG } from '../src/engine/rng';
import { step } from '../src/engine/reducer';
import { createInitialState, type GameState, type GameStatus } from '../src/engine/state';

const RUNS_PER_COMBO = 2000;
const MAX_TURNS = 60;

type ActionPolicy = (state: GameState) => ActionType;
type EventPolicy = (state: GameState, card: EventCard, rng: RNG) => string;

interface Strategy {
  act: ActionPolicy;
  event: EventPolicy;
}

/** Naive event policy: take whatever is listed first. */
const firstChoice: EventPolicy = (state, card) => availableChoices(card, state)[0].id;

/**
 * Dial-aware, the full curve: without standing the martyrs read as chaos
 * (go quiet); with standing, escalation compounds (escalate); once
 * legitimacy is banked, escalation buys nothing and its heat breaks the
 * cascade window you are trying to hold (go quiet again).
 */
const dialAware: EventPolicy = (state, card) => {
  const choices = availableChoices(card, state);
  const escalate = choices.find((c) => c.effect.martyrConversion);
  const quiet = choices.find((c) => !c.effect.martyrConversion);
  if (escalate && quiet) {
    const { legitimacy } = state.resources;
    return legitimacy >= 50 && legitimacy < 85 ? escalate.id : quiet.id;
  }
  return choices[0].id;
};

const reactiveAction: ActionPolicy = (state) => {
  const { heat, legitimacy, materiel } = state.resources;
  if (heat > 55) return 'lay_low';
  if (materiel < 10) return 'fundraise';
  if (legitimacy < 90) return 'agitate';
  return 'organize';
};

/**
 * Reads the whole board: tends the coalition before it frays, cools heat,
 * pushes legitimacy only when the moderates can stomach it.
 */
const adaptiveAction: ActionPolicy = (state) => {
  const { heat, legitimacy, materiel } = state.resources;
  const present = presentFactions(state.factions);
  const angriest = present.reduce((min, f) => (f.mood < min.mood ? f : min));
  // Only true emergencies interrupt the program: an imminent raid, an
  // empty treasury. Otherwise run hot — raids are survivable now, and the
  // post-raid lull is exactly the window the cascade needs.
  if (heat > 70) return 'lay_low';
  if (materiel < 8) return 'fundraise';
  if (angriest.mood < 42) {
    return (Object.keys(MOOD_EFFECTS) as ActionType[]).reduce((top, a) =>
      MOOD_EFFECTS[a][angriest.id] > MOOD_EFFECTS[top][angriest.id] ? a : top,
    );
  }
  if (legitimacy < 85) return 'agitate';
  return 'organize';
};

const strategies: Record<string, Strategy> = {
  always_agitate: { act: () => 'agitate', event: firstChoice },
  always_organize: { act: () => 'organize', event: firstChoice },
  always_fundraise: { act: () => 'fundraise', event: firstChoice },
  always_lay_low: { act: () => 'lay_low', event: firstChoice },

  reactive: { act: reactiveAction, event: dialAware },

  rotation: {
    act: (state) => {
      const order: ActionType[] = ['organize', 'fundraise', 'agitate', 'lay_low'];
      return order[state.turn % order.length];
    },
    event: firstChoice,
  },

  // Tends the coalition before it frays; the strongest intended play.
  adaptive: { act: adaptiveAction, event: dialAware },

  // Dial A/B, mid-band (climb phase): the action policy holds legitimacy
  // in the 55-75 band, where the brief's claim lives — escalation with
  // standing should compound; measure avgLegit, not cascade.
  mid_escalate: {
    act: (state) => {
      const { heat, legitimacy, materiel } = state.resources;
      if (heat > 70) return 'lay_low';
      if (materiel < 8) return 'fundraise';
      return legitimacy < 70 ? 'agitate' : 'organize';
    },
    event: (state, card) => {
      const choices = availableChoices(card, state);
      return (choices.find((c) => c.effect.martyrConversion) ?? choices[0]).id;
    },
  },
  mid_quiet: {
    act: (state) => {
      const { heat, legitimacy, materiel } = state.resources;
      if (heat > 70) return 'lay_low';
      if (materiel < 8) return 'fundraise';
      return legitimacy < 70 ? 'agitate' : 'organize';
    },
    event: (state, card) => {
      const choices = availableChoices(card, state);
      return (choices.find((c) => !c.effect.martyrConversion) ?? choices[0]).id;
    },
  },

  // Dial A/B, low-legitimacy regime: fundraise-heavy play runs hot enough
  // to draw raids while legitimacy stays near the conversion break-even.
  lo_escalate: {
    act: () => 'fundraise',
    event: (state, card) => {
      const choices = availableChoices(card, state);
      return (choices.find((c) => c.effect.martyrConversion) ?? choices[0]).id;
    },
  },
  lo_quiet: {
    act: () => 'fundraise',
    event: (state, card) => {
      const choices = availableChoices(card, state);
      return (choices.find((c) => !c.effect.martyrConversion) ?? choices[0]).id;
    },
  },
};

interface RunResult {
  status: GameStatus;
  turns: number;
  finalLegitimacy: number;
  splits: number;
  events: number;
}

function runOne(strategy: Strategy, ideology: IdeologyId, seed: number): RunResult {
  let state = createInitialState(
    createIdeologyResources(ideology),
    createIdeologyFactions(ideology),
  );
  const rng = createRng(seed);
  while (state.status === 'active' && state.turn < MAX_TURNS) {
    if (state.pendingEventId) {
      const card = DECK.find((c) => c.id === state.pendingEventId)!;
      state = resolveEvent(state, card, strategy.event(state, card, rng), rng);
      continue;
    }
    state = step(state, ACTIONS[strategy.act(state)], rng, DECK);
  }
  return {
    status: state.status,
    turns: state.turn,
    finalLegitimacy: state.resources.legitimacy,
    splits: state.log.filter((e) => e.kind === 'split' && e.detail.includes('walked')).length,
    events: state.log.filter((e) => e.kind === 'event').length,
  };
}

function summarize(results: RunResult[]) {
  const total = results.length;
  const counts: Record<GameStatus, number> = {
    active: 0,
    decapitated: 0,
    irrelevant: 0,
    split: 0,
    cascade: 0,
  };
  let turnSum = 0;
  let legitimacySum = 0;
  let splitEventSum = 0;
  let eventSum = 0;
  for (const r of results) {
    counts[r.status]++;
    turnSum += r.turns;
    legitimacySum += r.finalLegitimacy;
    splitEventSum += r.splits;
    eventSum += r.events;
  }
  return {
    cascadeRate: counts.cascade / total,
    decapitatedRate: counts.decapitated / total,
    irrelevantRate: counts.irrelevant / total,
    splitRate: counts.split / total,
    stalledRate: counts.active / total,
    avgSplitEvents: splitEventSum / total,
    avgEvents: eventSum / total,
    avgTurns: turnSum / total,
    avgLegitimacy: legitimacySum / total,
  };
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

console.log(
  `Running ${RUNS_PER_COMBO} seeds x ${Object.keys(strategies).length} strategies x ${Object.keys(IDEOLOGIES).length} ideologies (deck: ${DECK.length} cards)...\n`,
);

const header = [
  'strategy'.padEnd(16),
  'ideology'.padEnd(11),
  'cascade'.padEnd(9),
  'decap'.padEnd(9),
  'irrelevant'.padEnd(11),
  'splitLoss'.padEnd(10),
  'stalled'.padEnd(9),
  'splits/run'.padEnd(11),
  'events/run'.padEnd(11),
  'avgTurns'.padEnd(9),
  'avgLegit',
].join(' ');
console.log(header);
console.log('-'.repeat(header.length));

for (const [name, strategy] of Object.entries(strategies)) {
  for (const ideology of Object.keys(IDEOLOGIES) as IdeologyId[]) {
    const results: RunResult[] = [];
    for (let seed = 0; seed < RUNS_PER_COMBO; seed++) {
      results.push(runOne(strategy, ideology, seed));
    }
    const s = summarize(results);
    console.log(
      [
        name.padEnd(16),
        ideology.padEnd(11),
        pct(s.cascadeRate).padEnd(9),
        pct(s.decapitatedRate).padEnd(9),
        pct(s.irrelevantRate).padEnd(11),
        pct(s.splitRate).padEnd(10),
        pct(s.stalledRate).padEnd(9),
        s.avgSplitEvents.toFixed(2).padEnd(11),
        s.avgEvents.toFixed(1).padEnd(11),
        s.avgTurns.toFixed(1).padEnd(9),
        s.avgLegitimacy.toFixed(1),
      ].join(' '),
    );
  }
}
