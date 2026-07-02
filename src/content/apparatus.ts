import type { SecurityUnit, UnitId } from '../engine/loyalty';

/**
 * Intelligence on the city's armed force. Loyalty here means: will they
 * follow the conspiracy's officers when the order comes. It is never
 * shown as a number — these reports, in the voice of what actually
 * reaches the committee, are the only telemetry. Bands by loyalty
 * quartile: [0-25 wavering, 26-50 restive, 51-75 uneasy, 76-100 reliable
 * to the plotters].
 */
export interface UnitVoice {
  name: string;
  bands: [string, string, string, string];
  refused: string;
  /** Finale beat if this unit's stand is part of how the rising fails. */
  finaleBeat: string;
}

export const APPARATUS: Record<UnitId, UnitVoice> = {
  garrison: {
    name: 'El Regimiento',
    bands: [
      'A corporal of the second company came to the comedor on Sunday, in uniform, ate, said nothing, and came back the next week with six others and a football. The kitchen women no longer report the Cuartel\'s mood; they report its appetite. Sergeants have begun asking, in roundabout ways, what the committee would want of them on a bad night.',
      'Leaflets keep turning up folded into the bread deliveries at the Cuartel, and the search for them has become ceremonial — the last one found three in the searching officer\'s own squad. Letters home ask which streets their cousins live on, and the censor underlines the question and lets it through.',
      'The conscripts drill as ordered and sing a beat behind the drum. Word through the families: the boys write home cheerfully enough, but they have started noticing which of their officers meet after hours, and noticing that they notice.',
      'The Regimiento is the conspiracy\'s if the conspiracy calls: drills crisp, the officers\' mess confident, the casino\'s toasts getting shorter and harder. Your name, inside the wire, is a rumor about other cities.',
    ],
    refused:
      'The Regimiento stands aside. Gates open, rifles grounded in the yard, conscripts leaning from the windows of the Cuartel to watch the street go by — some waving, carefully, with the hand not holding the rifle. Their officers are confined to the mess, guarded, politely, by their own men.',
    finaleBeat:
      'At the Cuartel the officers declare the state of war at dawn and order the regiment into the streets — and the regiment considers it. On the parade ground a conscript from the Arrabal grounds his rifle on the stones, one small wooden knock, the loudest sound in Vallarga\'s history; the second rank grounds theirs; a captain reaches for his holster and a sergeant\'s hand closes over his wrist like a verdict. The column that finally leaves the Cuartel marches with the street, not against it.',
  },
  police: {
    name: 'Los Asaltos',
    bands: [
      'The Asalto lieutenants have started sending their families to relatives in the country and their opinions to nobody. Two guardias asked the comedor women — in writing, through intermediaries, which is braver than it sounds — what becomes of policemen who stand with the street.',
      'The evening patrols walk shorter routes and watch the casino balconies harder than the union doorways. Since Madrid, since Castillo, the prefecture\'s roll-calls have the sound of men counting each other.',
      'The Asaltos work their beats correctly and keep the Republic\'s order with the Republic\'s own ambivalence. Searches still come when ordered. They are merely, lately, unlucky ones.',
      'The prefecture is brisk and confident: files current, informants paid, the new captain — transferred in this spring, friend of nobody — running the section like a man expecting an inspection, or an opportunity.',
    ],
    refused:
      'The Asaltos have declared for the street — openly, in formation, rifles slung butt-up through the Arrabal to the cheering of the balconies. It is the Republic\'s own corps choosing the Republic\'s own people, and every conscript in the Cuartel heard the cheering.',
    finaleBeat:
      'The Asaltos come out of the prefecture in column and for one silent half-minute the Arrabal does not know which way they are walking — and then the balconies see the rifles slung butt-up, and the sound the street makes teaches the rest of the city how the morning is going. Where the columns meet the plotters\' patrols, the patrols surrender to men in the same uniform, which spares everyone the worst arithmetic.',
  },
  guard: {
    name: 'La Guardia Civil',
    bands: [
      'Unthinkable, and yet: an intermediary of the casa-cuartel asked, through three removes, whether the committee\'s guarantees extend to the institution — the barracks, the pensions, the corps itself. The tricorns are doing arithmetic. The tricorns doing arithmetic is the whole war, in miniature.',
      'The Guardia Civil patrols the vega in pairs as always, but the pairs linger at ventas they used to pass, and their comandante has twice declined invitations to the officers\' casino in town. Declining that table is a position.',
      'The casa-cuartel is correct, sealed, and watchful. A few of the younger guardias read the wrong newspapers off duty. Reading is not wavering — but it is reading.',
      'The Guardia Civil is the conspiracy\'s surest asset in the province and both sides know it: discipline like masonry, the comandante\'s courtesies to the Gobierno Civil getting shorter by the week. No leaflet survives an hour inside the casa-cuartel, and the men who carry them in do not carry things again.',
    ],
    refused:
      'The Guardia Civil declares for "the maintenance of legal order under the constituted government" — tricorn Latin for: we have counted the city and the city is you. Their comandante\'s note to the Gobierno Civil cites the committee\'s guarantees, clause by clause. Prieto\'s people read it twice and say only: "Now we owe the wolves a winter."',
    finaleBeat:
      'Last and heaviest, the Guardia Civil: the casa-cuartel\'s gates stay shut through the morning while the comandante reads the city like a man reading a verdict he must now join or defy. When the tricorns finally ride out it is to the Gobierno Civil, to place themselves "at the disposal of the constituted authorities" — and every rising in every city this corps has ever broken is in the sentence. Vallarga learns what Spain is learning street by street today: the Guardia Civil does not choose sides; it chooses winners, and it has chosen.',
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
 * The rising fails: one beat per unit that stood with the street, then
 * the close. The war begins anyway; the epilogue keeps the receipt.
 */
export function finaleBeats(units: SecurityUnit[]): string[] {
  const refusedUnits = units.filter((u) => u.refused);
  const beats: string[] = [];
  for (const u of refusedUnits) {
    beats.push(APPARATUS[u.id].finaleBeat);
  }
  beats.push(
    'By nightfall on the 19th of July it is over in Vallarga, in the anticlimactic way of tipping points: the plotters\' officers under arrest in their own mess, the radio reading the committee\'s communiqué in a schoolteacher\'s careful voice, and in the square outside the Gobierno Civil the comedor women set up the kettles, because they have always understood before anyone what a crowd will need next.\n\nThe city is held. Then the other news starts arriving — Sevilla fallen, the Protectorate gone, columns forming on roads with familiar names — and the committee understands, at the hour of its victory, that it has won the first morning of a war.',
  );
  return beats;
}

/**
 * The rising succeeds: how the city fell, and what comes after.
 * Grim and factual — this is what it looked like in the cities that lost.
 */
export function fallenBeats(units: SecurityUnit[]): string[] {
  const stoodAside = units.filter((u) => u.refused).map((u) => APPARATUS[u.id].name);
  const first =
    stoodAside.length > 0
      ? `The state of war is read from the Cuartel steps at dawn, and the columns move before the city can. ${stoodAside.join(' and ')} stood with the street — and stood alone: courage without company is a casualty list. By noon the artillery is on the bridges, the union halls are burning their own files, and the general strike, called two hours too late, becomes a city holding its breath behind shutters.`
      : 'The state of war is read from the Cuartel steps at dawn and the city discovers, in one morning, that it never moved a single rifle\'s allegiance: the columns take the bridges, the prefecture declares for the rising by eight, and the tricorns ride into the Arrabal by nine. The general strike, called from a print room already surrounded, lasts as long as the print room.';
  return [
    first,
    'What follows follows everywhere the rising wins, and it follows the lists: the committee, the union councils, the athenaeum teachers, the comedor women. The lists were always better organized than anyone admitted. Vallarga goes into the war on the other side of the line, a name on the wrong-colored part of the map — and the people who might have held it are the war\'s first column of names in the gazette that no longer prints their letters.',
  ];
}
