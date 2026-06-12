/**
 * The coalition: four tendencies, each with a mood. Cohesion is derived
 * from these (see formulas.ts) — the movement is never a unitary actor.
 */
export type FactionId = 'moderates' | 'hardliners' | 'labor' | 'students';

export const FACTION_IDS: FactionId[] = ['moderates', 'hardliners', 'labor', 'students'];

export interface FactionState {
  id: FactionId;
  /** 0-100. Tone of voice shifts with it; cohesion is computed from it. */
  mood: number;
  /**
   * False once the faction has split off. The array keeps a fixed shape so
   * departed factions stay addressable for epilogue scoring (Act IV hooks).
   */
  present: boolean;
}

export const DEFAULT_MOODS: Record<FactionId, number> = {
  moderates: 50,
  hardliners: 50,
  labor: 50,
  students: 50,
};

export function createFactions(
  moods: Partial<Record<FactionId, number>> = {},
  absent: FactionId[] = [],
): FactionState[] {
  return FACTION_IDS.map((id) => ({
    id,
    mood: moods[id] ?? DEFAULT_MOODS[id],
    present: !absent.includes(id),
  }));
}

export function presentFactions(factions: FactionState[]): FactionState[] {
  return factions.filter((f) => f.present);
}

export function clampMood(mood: number): number {
  return Math.min(100, Math.max(0, mood));
}

/** Per-turn regression toward 50 so moods don't pin at the rails. */
export function driftMood(mood: number): number {
  if (mood > 50) return mood - 1;
  if (mood < 50) return mood + 1;
  return mood;
}
