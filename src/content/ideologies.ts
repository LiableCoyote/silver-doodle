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
}

/**
 * Starting weights per the brief (§5): same systems, different openings.
 */
export const IDEOLOGIES: Record<IdeologyId, IdeologyDef> = {
  // Fast and fragile: big base, thin cadre, polarized coalition.
  populist: {
    resources: { sympathizers: 60, cadre: 6 },
    moods: { moderates: 65, hardliners: 30, labor: 70, students: 45 },
    absent: [],
  },
  // Slow and durable: small base, deep cadre, tight coalition.
  vanguard: {
    resources: { sympathizers: 20, cadre: 18 },
    moods: { moderates: 55, hardliners: 60, labor: 58, students: 55 },
    absent: [],
  },
  // Narrow coalition ceiling: only three tendencies will march with you,
  // so the spread is easier to manage — but any split is one step from fatal.
  religious: {
    resources: { sympathizers: 35, cadre: 10, legitimacy: 40 },
    moods: { moderates: 55, hardliners: 50, labor: 55 },
    absent: ['students'],
  },
};

export function createIdeologyResources(id: IdeologyId): Resources {
  return { ...STARTING_RESOURCES, ...IDEOLOGIES[id].resources };
}

export function createIdeologyFactions(id: IdeologyId): FactionState[] {
  const def = IDEOLOGIES[id];
  return createFactions(def.moods, def.absent);
}
