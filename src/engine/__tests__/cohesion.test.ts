import { describe, expect, it } from 'vitest';
import { ACTIONS } from '../actions';
import { createFactions, presentFactions } from '../factions';
import { cohesion } from '../formulas';
import { createRng } from '../rng';
import { step } from '../reducer';
import { createInitialState } from '../state';

describe('cohesion formula', () => {
  it('uniform moods of 50 give cohesion 50', () => {
    const factions = createFactions({ moderates: 50, hardliners: 50, labor: 50, students: 50 });
    expect(cohesion(factions)).toBe(50);
  });

  it('polarization is worse than uniform unhappiness at the same mean', () => {
    const polarized = createFactions({ moderates: 90, hardliners: 10, labor: 90, students: 10 });
    const grumpy = createFactions({ moderates: 50, hardliners: 50, labor: 50, students: 50 });
    expect(cohesion(polarized)).toBeLessThan(cohesion(grumpy));
  });

  it('higher spread strictly lowers cohesion when the mean is held equal', () => {
    const tight = createFactions({ moderates: 55, hardliners: 45, labor: 55, students: 45 });
    const wide = createFactions({ moderates: 75, hardliners: 25, labor: 75, students: 25 });
    expect(cohesion(wide)).toBeLessThan(cohesion(tight));
  });

  it('only present factions count', () => {
    const factions = createFactions(
      { moderates: 80, hardliners: 80, labor: 80, students: 0 },
      ['students'],
    );
    expect(cohesion(factions)).toBe(80);
  });
});

describe('splits', () => {
  const polarizedState = () =>
    createInitialState(
      {},
      createFactions({ moderates: 2, hardliners: 98, labor: 5, students: 95 }),
    );

  it('fires when cohesion reaches zero and removes the angriest faction', () => {
    const state = step(polarizedState(), ACTIONS.fundraise, createRng(3));
    const splits = state.log.filter((e) => e.kind === 'split');
    expect(splits.length).toBeGreaterThan(0);
    expect(state.factions.find((f) => f.id === 'moderates')?.present).toBe(false);
  });

  it('the departing faction takes its share of the movement', () => {
    const before = polarizedState();
    const after = step(before, ACTIONS.fundraise, createRng(3));
    expect(after.resources.sympathizers).toBeLessThan(before.resources.sympathizers);
    expect(after.resources.cadre).toBeLessThan(before.resources.cadre);
    // Fundraise earns +10 materiel; the departing quarter must outweigh it.
    expect(after.resources.materiel).toBeLessThan(before.resources.materiel + 10);
  });

  it('a four-faction movement survives its first split', () => {
    const state = step(polarizedState(), ACTIONS.fundraise, createRng(3));
    expect(state.status).toBe('active');
    expect(presentFactions(state.factions)).toHaveLength(3);
  });

  it('an informant roll can spike heat across seeds', () => {
    let informed = 0;
    for (let seed = 0; seed < 50; seed++) {
      const state = step(polarizedState(), ACTIONS.fundraise, createRng(seed));
      if (state.log.some((e) => e.detail.includes('informed'))) informed++;
    }
    // Moderates leave at mood ~5: betrayal probability near 0.9.
    expect(informed).toBeGreaterThan(25);
  });

  it('a split that leaves fewer than two factions ends the game', () => {
    const twoLeft = createInitialState(
      {},
      createFactions({ moderates: 2, hardliners: 95 }, ['labor', 'students']),
    );
    const state = step(twoLeft, ACTIONS.fundraise, createRng(1));
    expect(state.status).toBe('split');
  });
});
