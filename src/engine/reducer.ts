import type { Action } from './actions';
import {
  clampResources,
  EFFECTS,
  PASSIVE,
  checkCascade,
  rollRaid,
} from './formulas';
import type { RNG } from './rng';
import type { GameState, Resources } from './state';

function applyEffects(resources: Resources, effects: Partial<Resources>): Resources {
  const next = { ...resources };
  for (const [key, delta] of Object.entries(effects) as Array<[keyof Resources, number]>) {
    next[key] += delta;
  }
  return next;
}

function applyPassive(resources: Resources): Resources {
  return {
    ...resources,
    grievance: resources.grievance - PASSIVE.grievanceDecay,
    heat: resources.heat - PASSIVE.heatDecay,
    legitimacy: resources.legitimacy - PASSIVE.legitimacyDecay,
  };
}

/**
 * Advances the game by one turn. Pure: the same state, action, and RNG
 * stream always produce the same result, which is what makes campaigns
 * replayable from a seed + action log.
 */
export function step(state: GameState, action: Action, rng: RNG): GameState {
  if (state.status !== 'active') return state;

  const log = [...state.log];

  let resources = applyEffects(state.resources, EFFECTS[action.type]);
  resources = applyPassive(resources);

  const raid = rollRaid(resources.heat, resources.cadre, resources.materiel, rng);
  if (raid.occurred) {
    resources = {
      ...resources,
      cadre: resources.cadre - raid.cadreLoss,
      materiel: resources.materiel - raid.materielLoss,
      heat: resources.heat - raid.heatRelief,
      cohesion: resources.cohesion - raid.cohesionLoss,
    };
    log.push(
      `Turn ${state.turn + 1}: raided — lost ${raid.cadreLoss} cadre, ${raid.materielLoss} materiel.`,
    );
  }

  resources = clampResources(resources);

  const turn = state.turn + 1;
  // Cascade is checked first: once the tipping point is reached, the
  // movement has already won regardless of what its other clocks read.
  let status: GameState['status'] = 'active';
  if (checkCascade(resources, turn)) status = 'cascade';
  else if (resources.cadre <= 0) status = 'decapitated';
  else if (resources.grievance <= 0) status = 'irrelevant';
  else if (resources.cohesion <= 0) status = 'split';

  log.push(`Turn ${turn}: ${action.type}.`);

  return { turn, resources, status, log };
}
