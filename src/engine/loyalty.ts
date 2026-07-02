import { clamp } from './formulas';
import type { RNG } from './rng';
import type { GameState } from './state';

/**
 * The security apparatus. Loyalty is to the REGIME (0-100), hidden from
 * the player as a number — the UI shows written intelligence bands only.
 * Victory is not a health bar: it's two of these three standing aside.
 */
export type UnitId = 'garrison' | 'police' | 'guard';

export interface SecurityUnit {
  id: UnitId;
  loyalty: number;
  /** Has stood aside. Irreversible — a soldier cannot un-refuse. */
  refused: boolean;
}

export const UNIT_IDS: UnitId[] = ['garrison', 'police', 'guard'];

/** Conscripts are the biggest and softest; the guard flips last or never. */
export const STARTING_LOYALTY: Record<UnitId, number> = {
  garrison: 70,
  police: 80,
  guard: 95,
};

export function createUnits(): SecurityUnit[] {
  return UNIT_IDS.map((id) => ({ id, loyalty: STARTING_LOYALTY[id], refused: false }));
}

/**
 * Flags the loyalty engine reads. Exported so the content validator can
 * count them as consumed — these are milestone-3 plants paying off.
 */
export const ENGINE_READ_FLAGS = [
  'mutual-aid',
  'garrison-contacts',
  'garrison-outreach',
  'chaplain-sermon',
  'officers-letter',
  'guarantees-given',
  'first-refusal',
  'reprisal-lists',
  'railway-pact',
  'unit-refused',
  'sotelo',
] as const;

/** After Calvo Sotelo, the officers close ranks: extra recovery per turn. */
export const SOTELO_RECOVERY = 1;

export const REFUSAL_THRESHOLD_BASE = 40;
export const OFFICERS_LETTER_THRESHOLD_BONUS = 5;
export const CONTAGION_LOYALTY_LOSS = 14;
export const FIRST_REFUSAL_SHOCK = 8;
/** With the railwaymen in the planning, troops cannot be massed in time. */
export const RAILWAY_PACT_LOSS_FACTOR = 0.5;
/** Units needed standing aside before the regime cannot hold the capital. */
export const REFUSALS_TO_WIN = 2;

/**
 * Erosion multiplier from campaign flags. Ilya's reprisal list, once it
 * exists, stiffens every spine in uniform — all erosion halves.
 */
function erosionScale(state: GameState, unit: UnitId): number {
  let scale = 1;
  if (unit === 'garrison') {
    if (state.flags.includes('garrison-outreach')) scale *= 1.5;
    if (state.flags.includes('chaplain-sermon')) scale *= 1.5;
  }
  if (state.flags.includes('reprisal-lists')) scale *= 0.5;
  return scale;
}

/** The guard erodes only once the morning after has been promised away. */
function isErodible(state: GameState, unit: SecurityUnit): boolean {
  if (unit.refused) return false;
  if (unit.id === 'guard') return state.flags.includes('guarantees-given');
  return true;
}

/**
 * Per-turn loyalty dynamics: recovery toward the regime, legitimacy
 * pressure on garrison and police, shared-origin erosion of the garrison
 * while its families eat at your kitchens.
 */
export function driftLoyalty(state: GameState): SecurityUnit[] {
  const { legitimacy, sympathizers } = state.resources;
  return state.units.map((unit) => {
    if (unit.refused) return unit;
    let loyalty = unit.loyalty;
    // The regime re-consolidates whatever you neglect.
    if (loyalty < STARTING_LOYALTY[unit.id]) loyalty += 1;
    // After Calvo Sotelo, the officers close ranks.
    if (state.flags.includes('sotelo') && loyalty < STARTING_LOYALTY[unit.id]) {
      loyalty += SOTELO_RECOVERY;
    }
    if (isErodible(state, unit)) {
      let erosion = 0;
      if (unit.id !== 'guard' && legitimacy >= 60) {
        erosion += (legitimacy - 60) / 20;
      }
      if (
        unit.id === 'garrison' &&
        state.flags.includes('mutual-aid') &&
        state.flags.includes('garrison-contacts') &&
        sympathizers >= 50
      ) {
        erosion += 1;
      }
      loyalty -= erosion * erosionScale(state, unit.id);
    }
    return { ...unit, loyalty: clamp(loyalty, 0, 100) };
  });
}

/** The most promising target for outreach: lowest loyalty, still erodible. */
export function outreachTarget(state: GameState): SecurityUnit | undefined {
  const candidates = state.units.filter((u) => isErodible(state, u));
  if (candidates.length === 0) return undefined;
  return candidates.reduce((min, u) => (u.loyalty < min.loyalty ? u : min));
}

/** Officer outreach: conviction travels only as far as your standing does. */
export function applyOutreach(state: GameState): SecurityUnit[] {
  const target = outreachTarget(state);
  if (!target) return state.units;
  let erosion = 3 + 5 * (state.resources.legitimacy / 100);
  if (target.id === 'garrison' && state.flags.includes('garrison-contacts')) {
    erosion *= 2;
  }
  erosion *= erosionScale(state, target.id);
  return state.units.map((u) =>
    u.id === target.id ? { ...u, loyalty: clamp(u.loyalty - erosion, 0, 100) } : u,
  );
}

/**
 * Brutality backlash: a successfully framed massacre reaches the barracks
 * too. Chaos (negative conversion) frightens soldiers toward obedience —
 * no backlash.
 */
export function applyBrutalityBacklash(
  state: GameState,
  conversion: number,
): SecurityUnit[] {
  if (conversion <= 0) return state.units;
  const loss = conversion / 2;
  return state.units.map((u) =>
    isErodible(state, u)
      ? { ...u, loyalty: clamp(u.loyalty - loss * erosionScale(state, u.id), 0, 100) }
      : u,
  );
}

/** The one-time shock when word spreads that refusal is possible. */
export function applyFirstRefusalShock(state: GameState): SecurityUnit[] {
  return state.units.map((u) =>
    u.refused ? u : { ...u, loyalty: clamp(u.loyalty - FIRST_REFUSAL_SHOCK, 0, 100) },
  );
}

export function refusalThreshold(state: GameState): number {
  return (
    REFUSAL_THRESHOLD_BASE +
    (state.flags.includes('officers-letter') ? OFFICERS_LETTER_THRESHOLD_BONUS : 0)
  );
}

/**
 * The regime deploys what it can spare: street work goes to the
 * least-trusted standing unit (conscripts first, the Guard last) — which
 * is exactly how regimes hand their own waverers the chance to refuse.
 */
export function deploymentUnit(units: SecurityUnit[]): SecurityUnit | undefined {
  const standing = units.filter((u) => !u.refused);
  if (standing.length === 0) return undefined;
  return standing.reduce((min, u) => (u.loyalty < min.loyalty ? u : min));
}

export interface DeploymentResult {
  unit: UnitId;
  refused: boolean;
  units: SecurityUnit[];
}

/**
 * A deployment puts one unit's obedience to the test. Refusal is
 * contagious: every other unit watches it happen and learns.
 */
export function rollDeployment(state: GameState, rng: RNG): DeploymentResult | undefined {
  const unit = deploymentUnit(state.units);
  if (!unit) return undefined;
  const threshold = refusalThreshold(state);
  const probability = Math.max(0, (threshold - unit.loyalty) / threshold);
  if (rng() >= probability) {
    return { unit: unit.id, refused: false, units: state.units };
  }
  const units = state.units.map((u) => {
    if (u.id === unit.id) return { ...u, refused: true };
    if (u.refused) return u;
    return { ...u, loyalty: clamp(u.loyalty - CONTAGION_LOYALTY_LOSS, 0, 100) };
  });
  return { unit: unit.id, refused: true, units };
}

export function refusedCount(units: SecurityUnit[]): number {
  return units.filter((u) => u.refused).length;
}

/** The appointment history keeps whether you are ready or not. */
export const RISING_TURN = 43;

export interface RisingResult {
  /** Units that had already, visibly, stopped being reliable for the plotters. */
  standing: UnitId[];
  /** Units that break with their officers in the moment itself. */
  joined: UnitId[];
  won: boolean;
}

/**
 * The rising: every unit is tested in the same hour, wavering first —
 * and the hour has its own contagion. A unit that stands with the street
 * (or already, visibly, had) knocks loyalty off every unit still
 * deciding, exactly the way the day actually resolved in the cities:
 * the corps that declared last declared after watching the street win.
 */
export function resolveRising(state: GameState, rng: RNG): RisingResult {
  const threshold = refusalThreshold(state);
  const standing: UnitId[] = [];
  const joined: UnitId[] = [];
  const order = [...state.units].sort((a, b) => a.loyalty - b.loyalty);
  let contagion = 0;
  for (const unit of order) {
    if (unit.refused) {
      standing.push(unit.id);
      contagion += CONTAGION_LOYALTY_LOSS;
      continue;
    }
    const effective = Math.max(0, unit.loyalty - contagion);
    const probability = Math.max(0, (threshold - effective) / threshold);
    if (rng() < probability) {
      joined.push(unit.id);
      contagion += CONTAGION_LOYALTY_LOSS;
    }
  }
  return {
    standing,
    joined,
    won: standing.length + joined.length >= REFUSALS_TO_WIN,
  };
}
