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
