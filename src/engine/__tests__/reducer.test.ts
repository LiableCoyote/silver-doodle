import { describe, expect, it } from 'vitest';
import { ACTIONS } from '../actions';
import { createRng } from '../rng';
import { step } from '../reducer';
import { createInitialState } from '../state';

describe('step', () => {
  it('is deterministic given the same state, action, and rng seed', () => {
    const a = step(createInitialState(), ACTIONS.organize, createRng(7));
    const b = step(createInitialState(), ACTIONS.organize, createRng(7));
    expect(a).toEqual(b);
  });

  it('advances the turn counter', () => {
    const result = step(createInitialState(), ACTIONS.organize, createRng(1));
    expect(result.turn).toBe(1);
  });

  it('keeps resources within their bounds', () => {
    let state = createInitialState();
    const rng = createRng(123);
    for (let i = 0; i < 50; i++) {
      state = step(state, ACTIONS.agitate, rng);
      if (state.status !== 'active') break;
    }
    expect(state.resources.heat).toBeGreaterThanOrEqual(0);
    expect(state.resources.heat).toBeLessThanOrEqual(100);
    expect(state.resources.cadre).toBeGreaterThanOrEqual(0);
    expect(state.resources.materiel).toBeGreaterThanOrEqual(0);
  });

  it('grievance decays toward zero when the player stalls', () => {
    let state = createInitialState();
    const rng = createRng(5);
    const startGrievance = state.resources.grievance;
    state = step(state, ACTIONS.lay_low, rng);
    expect(state.resources.grievance).toBeLessThan(startGrievance);
  });

  it('lay_low cools heat below the raid threshold', () => {
    let state = createInitialState({ heat: 50 });
    const rng = createRng(9);
    state = step(state, ACTIONS.lay_low, rng);
    expect(state.resources.heat).toBeLessThan(50);
  });

  it('does not advance once a terminal status is reached', () => {
    let state = createInitialState({ cadre: 1, heat: 95 });
    const rng = createRng(2);
    // Force a raid by spamming agitate at very high heat until decapitated.
    for (let i = 0; i < 20; i++) {
      state = step(state, ACTIONS.agitate, rng);
    }
    expect(state.status).not.toBe('active');
    const final = step(state, ACTIONS.agitate, rng);
    expect(final).toEqual(state);
  });

  it('reaching near-full heat makes a raid highly likely across seeds', () => {
    const state = createInitialState({ heat: 99, cadre: 100, materiel: 100 });
    let raided = false;
    for (let seed = 0; seed < 50; seed++) {
      const result = step(state, ACTIONS.lay_low, createRng(seed));
      if (result.log.some((line) => line.includes('raided'))) raided = true;
    }
    expect(raided).toBe(true);
  });
});
