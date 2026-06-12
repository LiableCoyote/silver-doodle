import type { EventCard } from '../../engine/events';
import { ACT1_EVENTS } from './act1';
import { ACT2_EVENTS } from './act2';
import { ACT3_EVENTS } from './act3';
import { CRACKDOWN_EVENTS } from './crackdowns';

/** The assembled campaign deck. The engine never imports this — callers pass it in. */
export const DECK: EventCard[] = [
  ...ACT1_EVENTS,
  ...ACT2_EVENTS,
  ...ACT3_EVENTS,
  ...CRACKDOWN_EVENTS,
];

/**
 * Flags set during play whose meaning is rendered by the milestone-5
 * epilogue generator (the promise ledger), not by cards or the engine.
 * Listed here so the content validator knows they are spoken for.
 */
export const EPILOGUE_FLAGS = [
  'informant-purged',
  'clerk-recruited',
  'armory-promise',
  'amnesty-offer',
  'settlement-sought',
] as const;
