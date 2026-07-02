import type { FactionId, FactionState } from '../engine/factions';
import { createFactions } from '../engine/factions';
import type { Resources } from '../engine/state';
import { STARTING_RESOURCES } from '../engine/state';

export type IdeologyId = 'populist' | 'vanguard' | 'religious';

interface IdeologyDef {
  resources: Partial<Resources>;
  /** Starting faction moods — polarization here IS the difficulty setting. */
  moods: Partial<Record<FactionId, number>>;
  /** Factions outside this movement's coalition ceiling. */
  absent: FactionId[];
  /** Title-screen name. */
  name: string;
  /** 2-3 sentence premise, in voice, for the title screen card. */
  blurb: string;
}

/**
 * The organization holding the Alianza Obrera's secretariat — same
 * systems, different openings. Starting weights per the brief (§5).
 */
export const IDEOLOGIES: Record<IdeologyId, IdeologyDef> = {
  // Fast and fragile: big base, thin cadre, polarized coalition.
  populist: {
    resources: { sympathizers: 60, cadre: 6 },
    moods: { moderates: 65, hardliners: 30, labor: 70, students: 45 },
    absent: [],
    name: 'La CNT',
    blurb:
      'The Confederación holds the port, the building trades, and half the mills — a city\'s worth of members and almost no apparatus on purpose, because apparatus is what you are against. Every gain in numbers is a gain in noise the Gobierno Civil can hear. And the alliance you chair contains people the faístas swore never to sit with: the spring will test which oath breaks first.',
  },
  // Slow and durable: small base, deep cadre, tight coalition.
  vanguard: {
    resources: { sympathizers: 20, cadre: 18 },
    moods: { moderates: 55, hardliners: 60, labor: 58, students: 55 },
    absent: [],
    name: 'El PCE',
    blurb:
      'The Party is small in Vallarga and knows it — a few hundred cards, every one of them accounted for, every one of them trained. Discipline buys you what the mass organizations never have: time, and secrets that keep. The cost is visible from the first week: there is no crowd to hide in, and the Brigada Social can very nearly count you.',
  },
  // Narrow coalition ceiling: the faístas will not march under socialist
  // discipline — three tendencies, not four; any split is near-fatal.
  religious: {
    resources: { sympathizers: 35, cadre: 10, legitimacy: 40 },
    moods: { moderates: 55, labor: 55, students: 50 },
    absent: ['hardliners'],
    name: 'La UGT–PSOE',
    blurb:
      'The Casa del Pueblo has what the others envy: standing. Deputies in the Cortes, councillors in the Ayuntamiento, the Popular Front\'s own machinery — legitimacy earned at the ballot box before the spring began. But the faístas will not march under socialist discipline, so the alliance is three tendencies, not four: easier to hold together, and one bad split from being nothing at all.',
  },
};

export function createIdeologyResources(id: IdeologyId): Resources {
  return { ...STARTING_RESOURCES, ...IDEOLOGIES[id].resources };
}

export function createIdeologyFactions(id: IdeologyId): FactionState[] {
  const def = IDEOLOGIES[id];
  return createFactions(def.moods, def.absent);
}
