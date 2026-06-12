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
 * Starting weights per the brief (§5): same systems, different openings.
 */
export const IDEOLOGIES: Record<IdeologyId, IdeologyDef> = {
  // Fast and fragile: big base, thin cadre, polarized coalition.
  populist: {
    resources: { sympathizers: 60, cadre: 6 },
    moods: { moderates: 65, hardliners: 30, labor: 70, students: 45 },
    absent: [],
    name: 'The Crowd',
    blurb:
      'You start with the city behind you and almost no one you can rely on. The base is wide and the cadre is thin — every gain in numbers is a gain in noise the regime can hear. The coalition is already pulling apart at the edges: the moderates and the hardliners were never going to agree on what this is.',
  },
  // Slow and durable: small base, deep cadre, tight coalition.
  vanguard: {
    resources: { sympathizers: 20, cadre: 18 },
    moods: { moderates: 55, hardliners: 60, labor: 58, students: 55 },
    absent: [],
    name: 'The Cadre',
    blurb:
      'Few people know your name, and the ones who do would die for it — some of them have already planned to. The coalition starts close together, which buys you time the wide movements never get. The cost is visible from turn one: there is no crowd to hide in, and the regime can count you.',
  },
  // Narrow coalition ceiling: only three tendencies will march with you,
  // so the spread is easier to manage — but any split is one step from fatal.
  religious: {
    resources: { sympathizers: 35, cadre: 10, legitimacy: 40 },
    moods: { moderates: 55, hardliners: 50, labor: 55 },
    absent: ['students'],
    name: 'The Congregation',
    blurb:
      'You begin with something the others don\'t: standing, already earned, before the first leaflet goes out. The students never joined and never will — three tendencies, not four, which makes the coalition easier to hold and harder to lose well. Every crackdown the regime stages becomes a sermon, for or against you. There is no fourth wing to absorb a bad week; any split here is close to the end.',
  },
};

export function createIdeologyResources(id: IdeologyId): Resources {
  return { ...STARTING_RESOURCES, ...IDEOLOGIES[id].resources };
}

export function createIdeologyFactions(id: IdeologyId): FactionState[] {
  const def = IDEOLOGIES[id];
  return createFactions(def.moods, def.absent);
}
