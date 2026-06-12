import type { Resources } from '../engine/state';
import { STARTING_RESOURCES } from '../engine/state';

export type IdeologyId = 'populist' | 'vanguard' | 'religious';

/**
 * Starting weights per the brief (§5): same systems, different openings.
 * Each entry overrides STARTING_RESOURCES.
 */
export const IDEOLOGIES: Record<IdeologyId, Partial<Resources>> = {
  // Fast and fragile: high sympathizers, thin cadre, low cohesion.
  populist: {
    sympathizers: 60,
    cadre: 6,
    cohesion: 40,
  },
  // Slow and durable: low sympathizers, high cadre.
  vanguard: {
    sympathizers: 20,
    cadre: 18,
    cohesion: 60,
  },
  // Narrow coalition ceiling but converts repression to legitimacy more
  // efficiently — modeled here as a higher starting legitimacy base.
  religious: {
    sympathizers: 35,
    cadre: 10,
    legitimacy: 40,
    cohesion: 55,
  },
};

export function createIdeologyResources(id: IdeologyId): Resources {
  return { ...STARTING_RESOURCES, ...IDEOLOGIES[id] };
}
