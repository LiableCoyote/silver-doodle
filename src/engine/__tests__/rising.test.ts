import { describe, expect, it } from 'vitest';
import { ACTIONS } from '../actions';
import { turnDate } from '../../content/calendar';
import type { EventCard } from '../events';
import { resolveRising, RISING_TURN } from '../loyalty';
import { createRng } from '../rng';
import { step } from '../reducer';
import { createInitialState, type GameState } from '../state';

function atTurn(state: GameState, turn: number): GameState {
  return { ...state, turn };
}

function withLoyalty(state: GameState, loyalty: number): GameState {
  return { ...state, units: state.units.map((u) => ({ ...u, loyalty })) };
}

describe('the calendar', () => {
  it('starts in February and reaches the rising in mid-July', () => {
    expect(turnDate(0)).toBe('19 February 1936');
    expect(turnDate(43)).toBe('19 July 1936');
    expect(turnDate(21)).toContain('May');
  });
});

describe('scheduled events', () => {
  const scheduled = (turn: number, id = 'sched'): EventCard => ({
    id,
    trigger: {},
    weight: 1,
    scheduledTurn: turn,
    prose: [{ text: 'history' }],
    choices: [
      { id: 'a', label: 'A', effect: {}, outcome: [{ text: 'a' }] },
      { id: 'b', label: 'B', effect: {}, outcome: [{ text: 'b' }] },
    ],
  });
  const random = (): EventCard => ({
    id: 'random-card',
    trigger: {},
    weight: 1000,
    prose: [{ text: 'noise' }],
    choices: [
      { id: 'a', label: 'A', effect: {}, outcome: [{ text: 'a' }] },
      { id: 'b', label: 'B', effect: {}, outcome: [{ text: 'b' }] },
    ],
  });

  it('a due card preempts the random draw, deterministically', () => {
    const deck = [random(), scheduled(3)];
    for (let seed = 0; seed < 10; seed++) {
      const state = atTurn(createInitialState(), 2);
      const after = step(state, ACTIONS.organize, createRng(seed), deck);
      expect(after.pendingEventId).toBe('sched');
    }
  });

  it('fires exactly once, then the random pool resumes', () => {
    const deck = [random(), scheduled(3)];
    const fired = { ...atTurn(createInitialState(), 5), firedEvents: ['sched'] };
    const after = step(fired, ACTIONS.organize, createRng(1), deck);
    expect(after.pendingEventId === undefined || after.pendingEventId === 'random-card').toBe(
      true,
    );
  });

  it('the earliest overdue card fires first', () => {
    const deck = [scheduled(4, 'later'), scheduled(2, 'earlier')];
    const state = atTurn(createInitialState(), 5);
    const after = step(state, ACTIONS.organize, createRng(1), deck);
    expect(after.pendingEventId).toBe('earlier');
  });
});

describe('the rising', () => {
  it('resolves at RISING_TURN and the game ends either way', () => {
    const loyal = withLoyalty(atTurn(createInitialState(), RISING_TURN - 1), 90);
    const after = step(loyal, ACTIONS.lay_low, createRng(1), []);
    expect(after.turn).toBe(RISING_TURN);
    expect(after.status).toBe('fallen');
    expect(step(after, ACTIONS.lay_low, createRng(2), [])).toEqual(after);
  });

  it('an eroded apparatus breaks with the rising across seeds', () => {
    let wins = 0;
    for (let seed = 0; seed < 40; seed++) {
      const eroded = withLoyalty(atTurn(createInitialState(), RISING_TURN - 1), 3);
      const after = step(eroded, ACTIONS.lay_low, createRng(seed), []);
      if (after.status === 'cascade') wins++;
    }
    // p(refuse) ≈ (35−3)/35 ≈ 0.91 per unit; 2-of-3 nearly certain.
    expect(wins).toBeGreaterThan(30);
  });

  it('already-refused units count as standing with the street', () => {
    const state = withLoyalty(atTurn(createInitialState(), RISING_TURN - 1), 3);
    const oneRefused = {
      ...state,
      units: state.units.map((u) => (u.id === 'garrison' ? { ...u, refused: true } : u)),
    };
    const result = resolveRising(oneRefused, createRng(1));
    expect(result.standing).toContain('garrison');
  });

  it('the sotelo flag stiffens recovery', () => {
    const base = createInitialState({ legitimacy: 0 });
    const eroded = {
      ...base,
      units: base.units.map((u) => ({ ...u, loyalty: 40 })),
    };
    const calm = step(eroded, ACTIONS.lay_low, createRng(1), []);
    const closed = step({ ...eroded, flags: ['sotelo'] }, ACTIONS.lay_low, createRng(1), []);
    const loyaltyOf = (s: GameState) => s.units.find((u) => u.id === 'garrison')!.loyalty;
    expect(loyaltyOf(closed)).toBe(loyaltyOf(calm) + 1);
  });
});
