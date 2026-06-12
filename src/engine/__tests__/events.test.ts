import { describe, expect, it } from 'vitest';
import { DECK } from '../../content/events';
import { ACTIONS } from '../actions';
import type { EventCard } from '../events';
import { drawEvent, matches, resolveEvent, selectProse } from '../events';
import { martyrConversion } from '../formulas';
import { createRng } from '../rng';
import { CRACKDOWN_FLAG, step } from '../reducer';
import { createInitialState } from '../state';

const card = (overrides: Partial<EventCard>): EventCard => ({
  id: 'test-card',
  trigger: {},
  weight: 10,
  prose: [{ text: 'default' }],
  choices: [
    { id: 'a', label: 'A', effect: {}, outcome: [{ text: 'a' }] },
    { id: 'b', label: 'B', effect: {}, outcome: [{ text: 'b' }] },
  ],
  ...overrides,
});

describe('matches', () => {
  it('evaluates resource ranges, flags, turn, and faction conditions together', () => {
    const state = { ...createInitialState({ legitimacy: 50, heat: 20 }), turn: 10, flags: ['press'] };
    expect(matches({ resource: { legitimacy: { gte: 40, lte: 60 } } }, state)).toBe(true);
    expect(matches({ resource: { legitimacy: { gte: 60 } } }, state)).toBe(false);
    expect(matches({ flags: ['press'], notFlags: ['strike-called'] }, state)).toBe(true);
    expect(matches({ flags: ['strike-called'] }, state)).toBe(false);
    expect(matches({ notFlags: ['press'] }, state)).toBe(false);
    expect(matches({ turn: { gte: 5, lte: 15 } }, state)).toBe(true);
    expect(matches({ turn: { gte: 11 } }, state)).toBe(false);
    expect(matches({ factionPresent: ['hardliners'] }, state)).toBe(true);
    expect(matches({ factionMood: { hardliners: { gte: 90 } } }, state)).toBe(false);
    expect(matches(undefined, state)).toBe(true);
  });
});

describe('selectProse', () => {
  it('picks the first matching conditional variant, else the default', () => {
    const variants = [
      { when: { resource: { legitimacy: { gte: 60 } as const } }, text: 'high' },
      { text: 'default' },
    ];
    expect(selectProse(variants, createInitialState({ legitimacy: 80 }))).toBe('high');
    expect(selectProse(variants, createInitialState({ legitimacy: 30 }))).toBe('default');
  });
});

describe('drawEvent', () => {
  it('is deterministic per seed and only draws eligible cards', () => {
    const deck = [
      card({ id: 'early', trigger: { turn: { lte: 5 } } }),
      card({ id: 'late', trigger: { turn: { gte: 20 } } }),
    ];
    const state = { ...createInitialState(), turn: 3 };
    for (let seed = 0; seed < 20; seed++) {
      const a = drawEvent(deck, state, createRng(seed));
      const b = drawEvent(deck, state, createRng(seed));
      expect(a).toEqual(b);
      expect(a?.id).toBe('early');
    }
  });

  it('respects once: fired cards are not redrawn', () => {
    const deck = [card({ id: 'only' })];
    const state = { ...createInitialState(), firedEvents: ['only'] };
    expect(drawEvent(deck, state, createRng(1))).toBeUndefined();
  });
});

describe('pending events and resolveEvent', () => {
  it('a pending event blocks step until resolved', () => {
    const pending = { ...createInitialState(), pendingEventId: 'test-card' };
    const after = step(pending, ACTIONS.organize, createRng(1));
    expect(after).toEqual(pending);
  });

  it('resolveEvent applies effects, sets flags, and marks the card fired', () => {
    const c = card({
      choices: [
        {
          id: 'take',
          label: 'Take',
          effect: { resources: { materiel: 5 }, moods: { labor: 4 }, setFlags: ['done'] },
          outcome: [{ text: 'taken' }],
        },
        { id: 'leave', label: 'Leave', effect: {}, outcome: [{ text: 'left' }] },
      ],
    });
    const state = { ...createInitialState(), pendingEventId: 'test-card' };
    const after = resolveEvent(state, c, 'take', createRng(1));
    expect(after.resources.materiel).toBe(state.resources.materiel + 5);
    expect(after.factions.find((f) => f.id === 'labor')!.mood).toBe(54);
    expect(after.flags).toContain('done');
    expect(after.firedEvents).toContain('test-card');
    expect(after.pendingEventId).toBeUndefined();
  });

  it('resolving a crackdown card clears the crackdown flag', () => {
    const c = card({ trigger: { flags: [CRACKDOWN_FLAG] }, once: false });
    const state = {
      ...createInitialState(),
      flags: [CRACKDOWN_FLAG],
      pendingEventId: 'test-card',
    };
    const after = resolveEvent(state, c, 'a', createRng(1));
    expect(after.flags).not.toContain(CRACKDOWN_FLAG);
  });

  it('an unavailable choice (requires unmet) is rejected', () => {
    const c = card({
      choices: [
        {
          id: 'rich',
          label: 'Rich',
          requires: { resource: { materiel: { gte: 999 } } },
          effect: { resources: { legitimacy: 50 } },
          outcome: [{ text: 'x' }],
        },
        { id: 'poor', label: 'Poor', effect: {}, outcome: [{ text: 'y' }] },
      ],
    });
    const state = { ...createInitialState(), pendingEventId: 'test-card' };
    expect(resolveEvent(state, c, 'rich', createRng(1))).toEqual(state);
  });
});

describe('the repression dial (exit criterion)', () => {
  const massacre = DECK.find((c) => c.id === 'picket-massacre')!;

  it('the massacre reads differently at low and high legitimacy', () => {
    const low = { ...createInitialState({ legitimacy: 25, heat: 60 }), flags: ['strike-called'] };
    const high = { ...createInitialState({ legitimacy: 75, heat: 60 }), flags: ['strike-called'] };
    const lowProse = selectProse(massacre.prose, low);
    const highProse = selectProse(massacre.prose, high);
    expect(lowProse).not.toBe(highProse);
    expect(highProse).toContain('the city watched');
  });

  it('escalating flips the legitimacy outcome by accumulated state', () => {
    expect(martyrConversion(75)).toBeGreaterThan(0);
    expect(martyrConversion(25)).toBeLessThan(0);

    const play = (legitimacy: number) => {
      const state = {
        ...createInitialState({ legitimacy, heat: 60 }),
        flags: ['strike-called'],
        pendingEventId: 'picket-massacre',
      };
      return resolveEvent(state, massacre, 'escalate', createRng(1)).resources.legitimacy;
    };
    expect(play(75)).toBeGreaterThan(75);
    expect(play(25)).toBeLessThan(25);
  });

  it('a raid queues a crackdown card from the dial pool only', () => {
    const state = createInitialState({ heat: 99, cadre: 50, materiel: 50 });
    let sawCrackdown = false;
    for (let seed = 0; seed < 40; seed++) {
      const after = step(state, ACTIONS.lay_low, createRng(seed), DECK);
      if (after.log.some((e) => e.kind === 'raid')) {
        sawCrackdown = true;
        expect(after.pendingEventId).toBeDefined();
        const drawn = DECK.find((c) => c.id === after.pendingEventId)!;
        expect(drawn.trigger.flags).toContain(CRACKDOWN_FLAG);
      }
    }
    expect(sawCrackdown).toBe(true);
  });
});
