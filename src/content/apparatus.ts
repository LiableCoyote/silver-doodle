import type { SecurityUnit, UnitId } from '../engine/loyalty';

/**
 * Intelligence on the security apparatus. Loyalty is never shown as a
 * number — these reports, in the voice of what actually reaches the
 * movement, are the only telemetry. Bands by loyalty quartile:
 * [0-25 wavering, 26-50 restive, 51-75 uneasy, 76-100 loyal].
 */
export interface UnitVoice {
  name: string;
  bands: [string, string, string, string];
  refused: string;
  /** Finale beat if this unit's refusal is what breaks the regime. */
  finaleBeat: string;
}

export const APPARATUS: Record<UnitId, UnitVoice> = {
  garrison: {
    name: 'The Garrison',
    bands: [
      'A sergeant of the third company sat in the back pew at the kitchens’ Sunday dinner, in uniform, and ate, and said nothing, and came back the next week with four others. The kitchen women no longer report the garrison’s mood; they report its appetite.',
      'Leaflets keep turning up folded into the barracks’ bread deliveries, and the colonels have stopped ordering searches — the last search found three in the searchers’ own coats. Letters home ask questions the censors underline and let through anyway.',
      'The conscripts drill as ordered and sing as ordered, a beat behind the drum. Word from the kitchens: the boys still write home cheerfully, but they have started asking which streets their cousins live on.',
      'The garrison is the regime’s: drills crisp, letters dull, the canteen talk all of leave and pay. Your name, when it comes up at all, is a rumor about other cities.',
    ],
    refused:
      'The garrison stands aside. Gates open, rifles grounded, conscripts leaning from the barracks windows to watch the city pass — some of them waving, carefully, with the hand not holding the rifle.',
    finaleBeat:
      'It begins at the Foundry Street barricade: a half-company ordered to clear it, and the lieutenant looks down the line and the line looks back, and somewhere in the second rank a boy from the river district grounds his rifle on the cobbles — one small wooden knock, the loudest sound the city has ever heard. The half-company stands aside. By evening the whole garrison has discovered it was only ever waiting for someone to go first.',
  },
  police: {
    name: 'The Police',
    bands: [
      'Precinct captains are sending their families to the countryside and their files to the stove. Two constables asked the kitchens — through intermediaries, in writing, which is braver than it sounds — what becomes of policemen afterward.',
      'The evening patrols walk shorter routes and look harder at their own informants than at your couriers. Fines are down; the desk sergeants have stopped logging the searches they don’t conduct.',
      'The police work their ledgers as ever, but the bribes have gotten cheaper — a man hedging his pension takes what’s offered. Raids still come when ordered. They are merely no longer thorough.',
      'The police are confident and busy: files current, informants paid, patrols on the dot. The precincts consider you a career opportunity, and arrests are how it pays.',
    ],
    refused:
      'The police have melted off the streets — not joined, not fought, simply evaporated into civilian coats and country relatives, leaving their ledgers for whoever governs next. It is the most honest thing the precincts ever did.',
    finaleBeat:
      'The precincts go quietly, the way clerks go: one morning the stations are simply unmanned, the cells unlocked by someone on the way out, twenty years of informant files left squared on the desks like a resignation letter addressed to history. The constables are home minding their gardens by noon, practicing the sentence "I only ever directed traffic."',
  },
  guard: {
    name: 'The Palace Guard',
    bands: [
      'Unthinkable, and yet: an adjutant of the Guard asked, through three intermediaries, whether your guarantees extend to household regiments. The palace sleeps behind men doing arithmetic.',
      'The Guard still parades like clockwork, but the officers’ mess has gone quiet, and quiet messes are where careers are re-planned. Leave requests are up. Resignations “for reasons of health” have begun.',
      'The Guard is correct, ceremonial, and watchful. A few officers read the foreign papers now. Reading is not wavering — but it is reading.',
      'The Guard would die on the palace steps and consider it a promotion. No leaflet survives an hour inside their barracks, and the men who carry them in do not come back out.',
    ],
    refused:
      'The Guard has declared for "the preservation of order during the transition" — palace-speak for studying the wind and finding it permanent. Their colonel’s letter cites your guarantees, paragraph by paragraph. Vera reads it twice and says only: "Now we owe the wolves a winter."',
    finaleBeat:
      'Last comes the Guard — not in revolt, never in revolt, but in a letter: the household regiments will "secure the palace district in the interest of public order," which on this particular morning means against its occupant. The sovereign’s own clock-makers, choosing the hour. They will want what they were promised. They will want it in writing. It already is.',
  },
};

const BAND_EDGES = [26, 51, 76];

export function loyaltyBand(loyalty: number): number {
  let band = 0;
  for (const edge of BAND_EDGES) {
    if (loyalty >= edge) band++;
  }
  return band;
}

export function intelligenceLine(unit: SecurityUnit): string {
  if (unit.refused) return APPARATUS[unit.id].refused;
  return APPARATUS[unit.id].bands[loyaltyBand(unit.loyalty)];
}

/**
 * The finale: the refusal that broke the regime, the contagion, the fall.
 * Beat one belongs to the second refuser — the unit whose refusal ended it.
 */
export function finaleBeats(units: SecurityUnit[]): string[] {
  const refusedUnits = units.filter((u) => u.refused);
  const beats: string[] = [];
  for (const u of refusedUnits) {
    beats.push(APPARATUS[u.id].finaleBeat);
  }
  beats.push(
    'And then it is over, in the anticlimactic way of all tipping points: no storming, no last stand, only a regime discovering that its orders have become suggestions, and its suggestions have become history. The ministries empty. The telegraph lines hum with resignations. In the square where they burned the portrait, someone has set up a soup kettle, because the kitchens always did understand what comes next better than anyone.\n\nThe city is yours. The morning after has already begun asking its questions.',
  );
  return beats;
}
