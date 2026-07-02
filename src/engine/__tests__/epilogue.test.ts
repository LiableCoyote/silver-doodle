import { describe, expect, it } from 'vitest';
import { composeDispatch } from '../../content/dispatch';
import { generateEpilogue } from '../../content/epilogue';
import type { GameState } from '../state';
import { createInitialState } from '../state';

function withStatus(status: GameState['status'], overrides: Partial<GameState> = {}): GameState {
  return { ...createInitialState(), status, ...overrides };
}

describe('generateEpilogue', () => {
  it('a heavy-debt cascade win names every debt and lands the 4+ closing', () => {
    const state = withStatus('cascade', {
      flags: ['guarantees-given', 'reprisal-lists', 'armed-wing', 'negotiation-channel'],
      factions: createInitialState().factions.map((f) =>
        f.id === 'hardliners' ? { ...f, mood: 20 } : f.id === 'students' ? { ...f, present: false } : f,
      ),
      units: createInitialState().units.map((u) =>
        u.id === 'garrison' || u.id === 'police' ? { ...u, refused: true } : u,
      ),
    });

    const epilogue = generateEpilogue(state);

    const joined = epilogue.beats.join(' ');
    expect(joined).toContain('signature');
    expect(joined.toLowerCase()).toContain('checas');
    expect(joined.toLowerCase()).toContain('armed force inside the alliance');
    expect(joined).toContain('JSU');
    expect(epilogue.debts).toBeGreaterThanOrEqual(4);
    expect(epilogue.beats[0]).toContain('morning after the 19th');
    expect(epilogue.beats[epilogue.beats.length - 1]).toContain('second war');
  });

  it('a clean win has few debts and a short epilogue', () => {
    const state = withStatus('cascade');
    const epilogue = generateEpilogue(state);
    expect(epilogue.debts).toBeLessThanOrEqual(1);
    expect(epilogue.beats.length).toBeLessThanOrEqual(3);
  });

  it.each<[GameState['status']]>([['decapitated'], ['irrelevant'], ['split']])(
    'loss status %s has a loss opening, not the cascade beat',
    (status) => {
      const state = withStatus(status);
      const epilogue = generateEpilogue(state);
      expect(epilogue.beats[0]).not.toContain('morning after the 19th');
      expect(epilogue.beats[0].length).toBeGreaterThan(0);
    },
  );

  it('is deterministic: two calls on the same state produce identical output', () => {
    const state = withStatus('cascade', {
      flags: ['guarantees-given', 'armory-promise'],
    });
    expect(generateEpilogue(state)).toEqual(generateEpilogue(state));
  });
});

describe('composeDispatch', () => {
  it('a refusal outranks a legitimacy swing', () => {
    const prev = createInitialState();
    const next: GameState = {
      ...prev,
      turn: 1,
      resources: { ...prev.resources, legitimacy: prev.resources.legitimacy + 10 },
      log: [{ turn: 1, kind: 'refusal', detail: 'a unit stands aside', unitId: 'garrison' }],
    };
    const dispatch = composeDispatch(prev, next);
    expect(dispatch).toBeDefined();
    expect(dispatch).toContain('broken with its officers');
  });

  it('a quiet turn with no notable deltas returns undefined', () => {
    const prev = createInitialState();
    const next: GameState = { ...prev, turn: 1, log: [] };
    expect(composeDispatch(prev, next)).toBeUndefined();
  });

  it('the grievance warning fires only on the crossing turn', () => {
    const prev = createInitialState();
    prev.resources.grievance = 26;
    const next: GameState = { ...prev, turn: 1, resources: { ...prev.resources, grievance: 24 } };
    const dispatch = composeDispatch(prev, next);
    expect(dispatch).toContain('window is closing');

    // On the next turn, grievance stays below 25 — the warning must not refire.
    const prev2 = next;
    const next2: GameState = { ...prev2, turn: 2, resources: { ...prev2.resources, grievance: 23 } };
    const dispatch2 = composeDispatch(prev2, next2);
    expect(dispatch2 ?? '').not.toContain('window is closing');
  });
});
