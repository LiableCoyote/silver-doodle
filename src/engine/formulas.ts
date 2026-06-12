import type { RNG } from './rng';
import type { Resources } from './state';

export const BOUNDED_KEYS: Array<keyof Resources> = [
  'legitimacy',
  'sympathizers',
  'heat',
  'cohesion',
  'grievance',
];

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Bounded resources live on 0-100; cadre/materiel are open stockpiles (floor 0). */
export function clampResources(resources: Resources): Resources {
  const clamped = { ...resources };
  for (const key of BOUNDED_KEYS) {
    clamped[key] = clamp(clamped[key], 0, 100);
  }
  clamped.cadre = Math.max(0, clamped.cadre);
  clamped.materiel = Math.max(0, clamped.materiel);
  return clamped;
}

/** Per-turn drift that runs regardless of the player's action. */
export const PASSIVE = {
  /** Grievance decays toward stability — the window closes if you stall. */
  grievanceDecay: 1.5,
  /** Heat cools slightly on its own; lay_low cools it much more. */
  heatDecay: 1,
  /** Legitimacy is volatile and erodes without active reinforcement. */
  legitimacyDecay: 0.5,
};

export const EFFECTS: Record<string, Partial<Resources>> = {
  organize: { sympathizers: -5, cadre: 3, materiel: -2, heat: 1, cohesion: 1 },
  agitate: { legitimacy: 8, sympathizers: 6, heat: 12, cohesion: -3, materiel: -3 },
  fundraise: { materiel: 10, heat: 3, cohesion: -1 },
  lay_low: { heat: -8, sympathizers: -3, legitimacy: -2, cohesion: 1 },
};

export const RAID_THRESHOLD = 70;
export const RAID_MAX_PROBABILITY_HEAT = 100;

/**
 * Above RAID_THRESHOLD, each turn risks a raid. Probability scales linearly
 * from 0 at the threshold to 1 at full heat (100).
 */
export function raidProbability(heat: number): number {
  if (heat <= RAID_THRESHOLD) return 0;
  return (heat - RAID_THRESHOLD) / (RAID_MAX_PROBABILITY_HEAT - RAID_THRESHOLD);
}

export interface RaidResult {
  occurred: boolean;
  cadreLoss: number;
  materielLoss: number;
  heatRelief: number;
  cohesionLoss: number;
}

/** Rolls for a regime raid given current heat. Raids hurt, but reset heat. */
export function rollRaid(heat: number, cadre: number, materiel: number, rng: RNG): RaidResult {
  const probability = raidProbability(heat);
  if (rng() >= probability) {
    return { occurred: false, cadreLoss: 0, materielLoss: 0, heatRelief: 0, cohesionLoss: 0 };
  }
  const severity = 0.2 + rng() * 0.2; // 20-40% of stockpiles
  return {
    occurred: true,
    cadreLoss: Math.round(cadre * severity),
    materielLoss: Math.round(materiel * severity),
    heatRelief: 30,
    cohesionLoss: 5,
  };
}

export const CASCADE_TURN_THRESHOLD = 40;
export const CASCADE_LEGITIMACY_THRESHOLD = 80;
export const CASCADE_HEAT_CEILING = 60;

/**
 * Placeholder win check until milestone 4's loyalty-cascade system lands:
 * sustaining high legitimacy under manageable heat for long enough reads
 * as "the security apparatus is starting to turn."
 */
export function checkCascade(resources: Resources, turn: number): boolean {
  return (
    turn >= CASCADE_TURN_THRESHOLD &&
    resources.legitimacy >= CASCADE_LEGITIMACY_THRESHOLD &&
    resources.heat <= CASCADE_HEAT_CEILING
  );
}
