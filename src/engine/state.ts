import type { FactionState } from './factions';
import { createFactions } from './factions';

/**
 * The resource economy from the design brief. All are held on 0-100 scales
 * except cadre and materiel, which are unbounded "stockpile" counts —
 * keeping their ceilings open is what makes "spend cadre" a real cost.
 *
 * Cohesion is NOT stored here: it is derived from faction moods
 * (see cohesion() in formulas.ts) — the coalition is the mechanic.
 */
export interface Resources {
  /** Narrative capital. Gates recruitment, raises defection odds. Volatile. */
  legitimacy: number;
  /** Disciplined core members (quality). */
  cadre: number;
  /** Mass support (quantity, unreliable), 0-100. */
  sympathizers: number;
  /** Money, weapons, printing presses — the logistics layer. */
  materiel: number;
  /** Accumulated regime attention, 0-100. High heat triggers raids. */
  heat: number;
  /** The world's master clock, 0-100. Decays toward stability each turn. */
  grievance: number;
}

export type GameStatus =
  | 'active'
  | 'decapitated' // cadre hit zero under raids
  | 'irrelevant' // grievance decayed away — the window closed
  | 'split' // a split left less than a coalition standing
  | 'cascade'; // proxy win condition until milestone 4's real loyalty system

/**
 * Structured record of a turn's notable happenings. The engine logs facts;
 * the content layer (src/content) turns them into prose.
 */
export interface TurnEvent {
  turn: number;
  kind: 'action' | 'raid' | 'split' | 'event';
  detail: string;
  /** For 'split': which faction departed. */
  factionId?: FactionState['id'];
}

export interface GameState {
  turn: number;
  resources: Resources;
  factions: FactionState[];
  status: GameStatus;
  /** Campaign memory: set and read by event cards. */
  flags: string[];
  /** Once-only cards that have already fired. */
  firedEvents: string[];
  /** An event awaiting the player's choice; blocks the next action. */
  pendingEventId?: string;
  /** Consecutive turns the cascade conditions have held (see formulas.ts). */
  cascadeMomentum: number;
  log: TurnEvent[];
}

export const STARTING_RESOURCES: Resources = {
  legitimacy: 30,
  cadre: 10,
  sympathizers: 50,
  materiel: 30,
  heat: 0,
  grievance: 70,
};

export function createInitialState(
  overrides: Partial<Resources> = {},
  factions: FactionState[] = createFactions(),
): GameState {
  return {
    turn: 0,
    resources: { ...STARTING_RESOURCES, ...overrides },
    factions,
    status: 'active',
    flags: [],
    firedEvents: [],
    pendingEventId: undefined,
    cascadeMomentum: 0,
    log: [],
  };
}
