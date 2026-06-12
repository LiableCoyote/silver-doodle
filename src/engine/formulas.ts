import type { ActionType } from './actions';
import type { FactionId, FactionState } from './factions';
import { presentFactions } from './factions';
import type { RNG } from './rng';
import type { Resources } from './state';

export const BOUNDED_KEYS: Array<keyof Resources> = [
  'legitimacy',
  'sympathizers',
  'heat',
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

export const EFFECTS: Record<ActionType, Partial<Resources>> = {
  organize: { sympathizers: -5, cadre: 3, materiel: -2, heat: 1 },
  agitate: { legitimacy: 8, sympathizers: 6, heat: 16, materiel: -3 },
  fundraise: { materiel: 10, heat: 3 },
  lay_low: { heat: -8, sympathizers: -3, legitimacy: -2 },
};

/**
 * Every action pleases some factions and alienates others — there are no
 * neutral verbs in a coalition.
 */
export const MOOD_EFFECTS: Record<ActionType, Record<FactionId, number>> = {
  organize: { moderates: 0, hardliners: 1, labor: 3, students: -1 },
  agitate: { moderates: -4, hardliners: 4, labor: -1, students: 3 },
  fundraise: { moderates: 2, hardliners: -3, labor: 0, students: -1 },
  lay_low: { moderates: 3, hardliners: -4, labor: 1, students: -2 },
};

/** Raids vindicate the hardliners and frighten the moderates. */
export const RAID_MOOD_EFFECTS: Record<FactionId, number> = {
  moderates: -4,
  hardliners: 3,
  labor: -1,
  students: -1,
};

/**
 * The signature formula: cohesion is the average of present-faction moods
 * minus a penalty for the spread. Polarization kills coalitions, not
 * unhappiness: at 1.25, two wings at 90 and two at 10 sit exactly at the
 * split point (50 - 1.25*40 = 0), while four factions all at 30 still
 * hold together at cohesion 30.
 */
export const SPREAD_PENALTY = 1.25;

export function cohesion(factions: FactionState[]): number {
  const present = presentFactions(factions);
  if (present.length === 0) return 0;
  const mean = present.reduce((sum, f) => sum + f.mood, 0) / present.length;
  const variance =
    present.reduce((sum, f) => sum + (f.mood - mean) ** 2, 0) / present.length;
  return mean - SPREAD_PENALTY * Math.sqrt(variance);
}

/** Post-split relief: purges feel clarifying, briefly. */
export const SPLIT_MOOD_RELIEF = 10;
export const SPLIT_INFORMANT_HEAT = 25;
export const SPLIT_INFORMANT_FLOOR = 0.25;

/** How likely the departing faction is to inform, scaled by betrayal felt. */
export function informantProbability(mood: number): number {
  return Math.max(SPLIT_INFORMANT_FLOOR, (50 - mood) / 50);
}

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
  legitimacyLoss: number;
}

/**
 * Until the repression dial lands (milestone 3), arrests read as
 * criminality: raids cost legitimacy. The dial will let accumulated
 * legitimacy convert this loss into martyrdom instead.
 */
export const RAID_LEGITIMACY_LOSS = 8;

/** Rolls for a regime raid given current heat. Raids hurt, but reset heat. */
export function rollRaid(heat: number, cadre: number, materiel: number, rng: RNG): RaidResult {
  const probability = raidProbability(heat);
  if (rng() >= probability) {
    return { occurred: false, cadreLoss: 0, materielLoss: 0, heatRelief: 0, legitimacyLoss: 0 };
  }
  const severity = 0.2 + rng() * 0.2; // 20-40% of stockpiles
  return {
    occurred: true,
    // A raid that finds anyone takes someone: minimum 1 cadre.
    cadreLoss: cadre > 0 ? Math.max(1, Math.round(cadre * severity)) : 0,
    materielLoss: Math.round(materiel * severity),
    heatRelief: 30,
    legitimacyLoss: RAID_LEGITIMACY_LOSS,
  };
}

export const CASCADE_TURN_THRESHOLD = 40;
export const CASCADE_LEGITIMACY_THRESHOLD = 80;
export const CASCADE_HEAT_CEILING = 60;
export const CASCADE_COHESION_FLOOR = 40;

/**
 * Placeholder win check until milestone 4's loyalty-cascade system lands:
 * sustaining high legitimacy under manageable heat for long enough reads
 * as "the security apparatus is starting to turn." The coalition must
 * still be holding together — garrisons don't defect to a movement
 * visibly at war with itself.
 */
export function checkCascade(
  resources: Resources,
  factions: FactionState[],
  turn: number,
): boolean {
  return (
    turn >= CASCADE_TURN_THRESHOLD &&
    resources.legitimacy >= CASCADE_LEGITIMACY_THRESHOLD &&
    resources.heat <= CASCADE_HEAT_CEILING &&
    cohesion(factions) >= CASCADE_COHESION_FLOOR
  );
}
