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
    clauses.push('Word is already moving faster than you can write it down.');
  }

  const legitimacyDelta = next.resources.legitimacy - prev.resources.legitimacy;
  if (legitimacyDelta >= 5) {
    clauses.push('The city is listening to you in a way it wasn\'t last week.');
  } else if (legitimacyDelta <= -5) {
    clauses.push('The story is slipping — other people are telling it now, and not kindly.');
  }

  const sympathizersDelta = next.resources.sympathizers - prev.resources.sympathizers;
  if (sympathizersDelta >= 5) {
    clauses.push('The rooms are filling — more chairs than you printed agendas for.');
  } else if (sympathizersDelta <= -5) {
    clauses.push('The rooms are emptying, quietly, the way rooms do when people decide a thing has already failed.');
  }

  if (prev.resources.heat < 55 && next.resources.heat >= 55) {
    clauses.push('You are being watched in a new way now — the surveillance has a budget behind it.');
  }

  if (prev.resources.grievance >= 25 && next.resources.grievance < 25) {
    clauses.push('The window is closing. The city is getting used to things as they are, which is the regime\'s only real victory condition.');
  }

  const prevCohesion = cohesion(prev.factions);
  const nextCohesion = cohesion(next.factions);
  if (prevCohesion >= 20 && nextCohesion < 20) {
    clauses.push('The coalition is held together with pins now, and everyone can feel where they are.');
  }

  if (clauses.length === 0) return undefined;
  return clauses.slice(0, 2).join(' ');
}
