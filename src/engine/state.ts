/**
 * The seven resources from the design brief. All are held on 0-100 scales
 * except cadre and materiel, which are unbounded "stockpile" counts —
 * keeping their ceilings open is what makes "spend cadre" a real cost.
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
  /** Internal ideological unity, 0-100. Hits 0 -> the movement splits. */
  cohesion: number;
  /** The world's master clock, 0-100. Decays toward stability each turn. */
  grievance: number;
}

export type GameStatus =
  | 'active'
  | 'decapitated' // cadre hit zero under raids
  | 'irrelevant' // grievance decayed away — the window closed
  | 'split' // cohesion hit zero
  | 'cascade'; // proxy win condition until milestone 4's real loyalty system

export interface GameState {
  turn: number;
  resources: Resources;
  status: GameStatus;
  /** Plain-text turn-by-turn log; replaced by the writing system in milestone 3. */
  log: string[];
}

export const STARTING_RESOURCES: Resources = {
  legitimacy: 30,
  cadre: 10,
  sympathizers: 50,
  materiel: 30,
  heat: 0,
  cohesion: 50,
  grievance: 70,
};

export function createInitialState(overrides: Partial<Resources> = {}): GameState {
  return {
    turn: 0,
    resources: { ...STARTING_RESOURCES, ...overrides },
    status: 'active',
    log: [],
  };
}
