/**
 * Headless balance simulator (milestone 1 exit criterion): runs simple
 * fixed strategies across many seeds and ideologies to check that no
 * naive strategy dominates. Run with `npm run sim`.
 */
import type { ActionType } from '../src/engine/actions';
import { ACTIONS } from '../src/engine/actions';
import { createIdeologyResources, IDEOLOGIES, type IdeologyId } from '../src/content/ideologies';
import { createRng } from '../src/engine/rng';
import { step } from '../src/engine/reducer';
import { createInitialState, type GameState, type GameStatus } from '../src/engine/state';

const RUNS_PER_COMBO = 2000;
const MAX_TURNS = 60;

type Strategy = (state: GameState) => ActionType;

const strategies: Record<string, Strategy> = {
  // Naive single-note strategies.
  always_agitate: () => 'agitate',
  always_organize: () => 'organize',
  always_fundraise: () => 'fundraise',
  always_lay_low: () => 'lay_low',

  // A strategy that reads the board: cool down when hot, push legitimacy
  // when safe, otherwise build the base.
  reactive: (state) => {
    const { heat, legitimacy, materiel } = state.resources;
    if (heat > 55) return 'lay_low';
    if (materiel < 10) return 'fundraise';
    if (legitimacy < 70) return 'agitate';
    return 'organize';
  },

  // Cycles through the four actions in a fixed rhythm.
  rotation: (state) => {
    const order: ActionType[] = ['organize', 'fundraise', 'agitate', 'lay_low'];
    return order[state.turn % order.length];
  },
};

interface RunResult {
  status: GameStatus;
  turns: number;
  finalLegitimacy: number;
}

function runOne(strategy: Strategy, ideology: IdeologyId, seed: number): RunResult {
  let state = createInitialState(createIdeologyResources(ideology));
  const rng = createRng(seed);
  while (state.status === 'active' && state.turn < MAX_TURNS) {
    const action = ACTIONS[strategy(state)];
    state = step(state, action, rng);
  }
  return { status: state.status, turns: state.turn, finalLegitimacy: state.resources.legitimacy };
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
  for (const r of results) {
    counts[r.status]++;
    turnSum += r.turns;
    legitimacySum += r.finalLegitimacy;
  }
  return {
    cascadeRate: counts.cascade / total,
    decapitatedRate: counts.decapitated / total,
    irrelevantRate: counts.irrelevant / total,
    splitRate: counts.split / total,
    stalledRate: counts.active / total,
    avgTurns: turnSum / total,
    avgLegitimacy: legitimacySum / total,
  };
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

console.log(`Running ${RUNS_PER_COMBO} seeds x ${Object.keys(strategies).length} strategies x ${Object.keys(IDEOLOGIES).length} ideologies...\n`);

const header = [
  'strategy'.padEnd(16),
  'ideology'.padEnd(11),
  'cascade'.padEnd(9),
  'decap'.padEnd(9),
  'irrelevant'.padEnd(11),
  'split'.padEnd(9),
  'stalled'.padEnd(9),
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
        pct(s.splitRate).padEnd(9),
        pct(s.stalledRate).padEnd(9),
        s.avgTurns.toFixed(1).padEnd(9),
        s.avgLegitimacy.toFixed(1),
      ].join(' '),
    );
  }
}
