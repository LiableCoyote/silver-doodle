/**
 * The calendar. Turns are half-weeks; turn 0 is the day the Popular Front
 * wins the elections. The engine keeps integer turns — dates are content.
 * Pure arithmetic, deterministic, no Date.now().
 */

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
] as const;

/** Days in each 1936 month we touch (1936 was a leap year). */
const DAYS: Record<string, number> = {
  February: 29,
  March: 31,
  April: 30,
  May: 31,
  June: 30,
  July: 31,
};

/**
 * turn 0 = 19 February 1936 (Azaña charged with forming a government);
 * each turn advances 3 or 4 days (half-weeks), so turn 43 = 19 July.
 */
export function turnDate(turn: number): string {
  let day = 19;
  let monthIndex = 1; // February
  let remaining = Math.max(0, Math.floor(turn));
  while (remaining > 0) {
    day += remaining % 2 === 1 ? 4 : 3; // alternate 4/3 → 7 days per 2 turns
    remaining--;
    const month = MONTHS[monthIndex];
    if (day > DAYS[month]) {
      day -= DAYS[month];
      monthIndex++;
    }
  }
  return `${day} ${MONTHS[monthIndex]} 1936`;
}

export const RISING_DATE = '19 July 1936';
