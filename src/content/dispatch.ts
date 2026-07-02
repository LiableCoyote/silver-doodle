import { cohesion } from '../engine/formulas';
import type { GameState } from '../engine/state';

/**
 * The §4.1 turn report, minimal honest version: pick at most two clauses,
 * in priority order, and join them into one short paragraph. Quiet turns
 * are allowed to be quiet — return undefined.
 */
export function composeDispatch(prev: GameState, next: GameState): string | undefined {
  const turnLog = next.log.filter((e) => e.turn === next.turn);
  const clauses: string[] = [];

  const refused = turnLog.find((e) => e.kind === 'refusal');
  if (refused) {
    clauses.push('A unit has broken with its officers — word is moving through the barracks faster than the wire can carry it.');
  }

  const legitimacyDelta = next.resources.legitimacy - prev.resources.legitimacy;
  if (legitimacyDelta >= 5) {
    clauses.push('Vallarga is listening to the alliance in a way it wasn\'t last week.');
  } else if (legitimacyDelta <= -5) {
    clauses.push('The story is slipping — the right\'s papers are telling it now, and not kindly.');
  }

  const sympathizersDelta = next.resources.sympathizers - prev.resources.sympathizers;
  if (sympathizersDelta >= 5) {
    clauses.push('The rooms are filling — more chairs in the athenaeums than you printed agendas for.');
  } else if (sympathizersDelta <= -5) {
    clauses.push('The rooms are emptying, quietly, the way rooms do when people decide a thing has already failed.');
  }

  if (prev.resources.heat < 55 && next.resources.heat >= 55) {
    clauses.push('You are being watched in a new way now — the Brigada Social has been given a budget and a reason.');
  }

  if (prev.resources.grievance >= 25 && next.resources.grievance < 25) {
    clauses.push('The window is closing. The city is getting used to things as they are, which is all the old order has ever needed from a spring.');
  }

  const prevCohesion = cohesion(prev.factions);
  const nextCohesion = cohesion(next.factions);
  if (prevCohesion >= 20 && nextCohesion < 20) {
    clauses.push('The alliance is held together with pins now, and everyone can feel where they are.');
  }

  if (clauses.length === 0) return undefined;
  return clauses.slice(0, 2).join(' ');
}
