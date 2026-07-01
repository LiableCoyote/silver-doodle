import { describe, expect, it } from 'vitest';
import { ACTIONS, type ActionType } from '../actions';
import { DECK } from '../../content/events';
import { availableChoices, resolveEvent } from '../events';
import {
  applyBrutalityBacklash,
  applyOutreach,
  driftLoyalty,
  refusalThreshold,
  rollDeployment,
  STARTING_LOYALTY,
} from '../loyalty';
import { createRng, type RNG } from '../rng';
import { step } from '../reducer';
import { createInitialState, type GameState } from '../state';

function withUnits(
  state: GameState,
  loyalty: Partial<Record<'garrison' | 'police' | 'guard', number>>,
  refused: Array<'garrison' | 'police' | 'guard'> = [],
): GameState {
  return {
    ...state,
    units: state.units.map((u) => ({
      ...u,
      loyalty: loyalty[u.id] ?? u.loyalty,
      refused: refused.includes(u.id),
    })),
  };
}

describe('loyalty drift', () => {
  it('recovers toward starting loyalty when nothing presses', () => {
    const state = withUnits(createInitialState({ legitimacy: 30 }), { garrison: 50 });
    const units = driftLoyalty(state);
    expect(units.find((u) => u.id === 'garrison')!.loyalty).toBe(51);
  });

  it('high legitimacy erodes garrison and police but not the guard', () => {
    const state = createInitialState({ legitimacy: 100 });
    const units = driftLoyalty(state);
    // erosion (100-60)/20 = 2, recovery 0 at start values.
    expect(units.find((u) => u.id === 'garrison')!.loyalty).toBe(STARTING_LOYALTY.garrison - 2);
    expect(units.find((u) => u.id === 'police')!.loyalty).toBe(STARTING_LOYALTY.police - 2);
    expect(units.find((u) => u.id === 'guard')!.loyalty).toBe(STARTING_LOYALTY.guard);
  });

  it('kitchen ties erode the garrison while sympathizers hold', () => {
    const base = createInitialState({ legitimacy: 30, sympathizers: 60 });
    const tied = { ...base, flags: ['mutual-aid', 'garrison-contacts'] };
    const garrison = (s: GameState) => driftLoyalty(s).find((u) => u.id === 'garrison')!.loyalty;
    expect(garrison(tied)).toBe(garrison(base) - 1);
  });

  it('reprisal lists halve all erosion', () => {
    const open = createInitialState({ legitimacy: 100 });
    const listed = { ...open, flags: ['reprisal-lists'] };
    const garrison = (s: GameState) => driftLoyalty(s).find((u) => u.id === 'garrison')!.loyalty;
    expect(STARTING_LOYALTY.garrison - garrison(listed)).toBeCloseTo(
      (STARTING_LOYALTY.garrison - garrison(open)) / 2,
    );
  });

  it('guarantees make the guard erodible', () => {
    const state = { ...createInitialState({ legitimacy: 100 }), flags: ['guarantees-given'] };
    const guard = driftLoyalty(state).find((u) => u.id === 'guard')!;
    // Guard still ignores legitimacy pressure (guard-specific), but becomes
    // a valid target for outreach and backlash.
    expect(guard.loyalty).toBe(STARTING_LOYALTY.guard);
    const afterBacklash = applyBrutalityBacklash(state, 10).find((u) => u.id === 'guard')!;
    expect(afterBacklash.loyalty).toBeLessThan(STARTING_LOYALTY.guard);
  });
});

describe('outreach', () => {
  it('targets the most wavering erodible unit and scales with legitimacy', () => {
    const lowLegit = withUnits(createInitialState({ legitimacy: 0 }), { garrison: 40 });
    const highLegit = withUnits(createInitialState({ legitimacy: 100 }), { garrison: 40 });
    const erosionAt = (s: GameState) =>
      40 - applyOutreach(s).find((u) => u.id === 'garrison')!.loyalty;
    expect(erosionAt(lowLegit)).toBe(3);
    expect(erosionAt(highLegit)).toBe(8);
    // Police and guard untouched.
    expect(applyOutreach(highLegit).find((u) => u.id === 'police')!.loyalty).toBe(
      STARTING_LOYALTY.police,
    );
  });

  it('doubles against the garrison when kitchen lines exist', () => {
    const state = {
      ...withUnits(createInitialState({ legitimacy: 50 }), { garrison: 40 }),
      flags: ['garrison-contacts'],
    };
    expect(applyOutreach(state).find((u) => u.id === 'garrison')!.loyalty).toBe(40 - 11);
  });
});

describe('brutality backlash', () => {
  it('positive conversion erodes units; negative does not', () => {
    const state = createInitialState();
    const eroded = applyBrutalityBacklash(state, 12);
    expect(eroded.find((u) => u.id === 'garrison')!.loyalty).toBe(STARTING_LOYALTY.garrison - 6);
    const chaos = applyBrutalityBacklash(state, -8);
    expect(chaos).toEqual(state.units);
  });
});

describe('deployments and refusal', () => {
  it('the regime deploys its least loyal standing unit — street work is conscript work', () => {
    const state = withUnits(createInitialState(), { garrison: 60, police: 70, guard: 90 });
    // Garrison is least trusted but still above threshold: deploys, obeys.
    const result = rollDeployment(state, createRng(1))!;
    expect(result.unit).toBe('garrison');
    expect(result.refused).toBe(false);
  });

  it('a wavering unit refuses across seeds, and contagion hits the rest', () => {
    const state = withUnits(createInitialState(), { garrison: 5, police: 4, guard: 6 });
    let refusals = 0;
    for (let seed = 0; seed < 50; seed++) {
      const result = rollDeployment(state, createRng(seed))!;
      if (result.refused) {
        refusals++;
        const others = result.units.filter((u) => u.id !== result.unit);
        for (const o of others) {
          expect(o.loyalty).toBeLessThan(7);
        }
      }
    }
    // p ≈ (35-6)/35 ≈ 0.83 for the most loyal of the three.
    expect(refusals).toBeGreaterThan(25);
  });

  it('the officers letter raises the refusal threshold', () => {
    const base = createInitialState();
    expect(refusalThreshold({ ...base, flags: ['officers-letter'] })).toBe(
      refusalThreshold(base) + 5,
    );
  });

  it('refused units are never deployed again', () => {
    const state = withUnits(createInitialState(), { garrison: 90 }, ['garrison']);
    const result = rollDeployment(state, createRng(1))!;
    expect(result.unit).not.toBe('garrison');
  });
});

describe('the cascade (win) and the campaign (exit criterion)', () => {
  it('two refusals end the regime', () => {
    // Heat 99 forces a deployment; both standing units are at loyalty ~0.
    const state = withUnits(
      createInitialState({ heat: 99, cadre: 50, materiel: 50 }),
      { police: 0, guard: 0 },
      ['garrison'],
    );
    let won = false;
    for (let seed = 0; seed < 30; seed++) {
      const after = step(state, ACTIONS.lay_low, createRng(seed), []);
      if (after.status === 'cascade') {
        won = true;
        expect(after.log.some((e) => e.kind === 'cascade')).toBe(true);
        expect(after.units.filter((u) => u.refused).length).toBe(2);
      }
    }
    expect(won).toBe(true);
  });

  it('a refusal cancels the raid losses', () => {
    const state = withUnits(
      createInitialState({ heat: 99, cadre: 50, materiel: 50 }),
      { garrison: 0, police: 0, guard: 0 },
    );
    for (let seed = 0; seed < 30; seed++) {
      const after = step(state, ACTIONS.lay_low, createRng(seed), []);
      if (after.log.some((e) => e.kind === 'refusal')) {
        expect(after.log.some((e) => e.kind === 'raid')).toBe(false);
        expect(after.resources.cadre).toBe(50);
        return;
      }
    }
    throw new Error('no refusal observed across seeds');
  });

  it('a full populist campaign is winnable (scripted adaptive play)', () => {
    const policy = (state: GameState): ActionType => {
      const { heat, legitimacy, materiel } = state.resources;
      if (heat > 70) return 'lay_low';
      if (materiel < 8) return 'fundraise';
      if (legitimacy >= 70 && materiel >= 12) return 'outreach';
      if (legitimacy < 85) return 'agitate';
      return 'organize';
    };
    const chooseEvent = (state: GameState, rng: RNG) => {
      const card = DECK.find((c) => c.id === state.pendingEventId)!;
      const choices = availableChoices(card, state);
      const escalate = choices.find((c) => c.effect.martyrConversion);
      const quiet = choices.find((c) => !c.effect.martyrConversion);
      const pick =
        escalate && quiet
          ? state.resources.legitimacy >= 50
            ? escalate.id
            : quiet.id
          : choices[0].id;
      return resolveEvent(state, card, pick, rng);
    };
    let wins = 0;
    for (let seed = 0; seed < 30; seed++) {
      let state = createInitialState();
      const rng = createRng(seed);
      while (state.status === 'active' && state.turn < 80) {
        state = state.pendingEventId
          ? chooseEvent(state, rng)
          : step(state, ACTIONS[policy(state)], rng, DECK);
      }
      if (state.status === 'cascade') wins++;
    }
    expect(wins).toBeGreaterThan(0);
  });

  it('a neglectful campaign is losable', () => {
    let state = createInitialState();
    const rng = createRng(7);
    while (state.status === 'active' && state.turn < 80) {
      state = state.pendingEventId
        ? resolveEvent(
            state,
            DECK.find((c) => c.id === state.pendingEventId)!,
            availableChoices(DECK.find((c) => c.id === state.pendingEventId)!, state)[0].id,
            rng,
          )
        : step(state, ACTIONS.lay_low, rng, DECK);
    }
    expect(['decapitated', 'irrelevant', 'split', 'fallen']).toContain(state.status);
  });
});
