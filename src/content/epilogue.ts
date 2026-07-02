import { VOICES } from './factions';
import type { GameState } from '../engine/state';

/**
 * The promise ledger, rendered. Mechanical selection, prose in voice — the
 * thesis (every path to power has a price) made visible at the end of the
 * game. No RNG: the epilogue is a pure function of the end-state.
 *
 * The critical reframe of the Spanish Spring: winning the city ends
 * nothing. The war begins on the 20th of July either way; the debts
 * become what they historically became.
 */
export interface Epilogue {
  beats: string[];
  debts: number;
}

const OPENING_BEATS: Record<GameState['status'], string> = {
  active: '',
  cascade:
    'The morning after the 19th of July begins with the city held and the telephone lines to Madrid full of other cities that were not. The ledger — the one nobody kept on paper — opens itself now, because a war has started, and wars are paid for out of exactly this kind of account.',
  decapitated:
    'What the survivors carry into the summer is not victory and not quite defeat: a list of names, addresses that are no longer safe, and the particular tiredness of people who built something that was taken apart faster than it was built. The rising will find this city organized by nobody. What that means arrives on the 19th of July, on schedule.',
  irrelevant:
    'The movement demobilized the way movements do — not with a vote but a draft you stopped noticing. By July the committee is a letterhead. Vallarga will meet the 19th unorganized, and the gazette that barely mentioned you will shortly be edited by people who keep better lists.',
  split:
    'The alliance\'s obituary will be an argument over the name — who it belonged to, who let it go, whose fault the letting-go was. Everyone involved will be right, which is the whole problem, and none of them will be finished arguing by the 19th of July, when the argument is settled from the Cuartel steps.',
  fallen:
    'The city fell in a morning. The wireless kept reading instructions to stay calm until the moment it began reading other instructions, in the same announcer\'s voice. What happens now happens to lists of names — and the lists were always better organized than anyone admitted.',
};

interface DebtCheck {
  test: (state: GameState) => boolean;
  beat: (state: GameState) => string;
}

const FLAG_DEBTS: DebtCheck[] = [
  {
    test: (s) => s.flags.includes('guarantees-given'),
    beat: () =>
      'The Guardia Civil holds your signature: the corps survives intact, its casa-cuartel unentered, its habits unexamined — guarantees given when its neutrality was the price of the morning. Every town this war now runs through has a casa-cuartel, and every one of them knows what Vallarga promised. You wanted the city without a siege. This is what that costs, payable for years.',
  },
  {
    test: (s) => s.flags.includes('reprisal-lists'),
    beat: () =>
      'The faístas\' list has a second page now, names added in the weeks your silence bought. In the cities the war has already hardened, they are calling such arrangements checas — and when that word reaches Vallarga it will arrive with your signature on it, the kind that does not show up in any archive.',
  },
  {
    test: (s) => s.flags.includes('armed-wing'),
    beat: () =>
      'There is an armed force inside the alliance that answers to the defense committees before it answers to anything elected, and this morning it is the most necessary thing you own: the columns forming for the front will be built on it. Militias win mornings. Commanding them afterward is a different institution, and nobody has founded it yet.',
  },
  {
    test: (s) => s.flags.includes('armory-promise'),
    beat: () =>
      'The promise of arms — made to the faístas, postponed all spring, properly accounted never — comes due today at the worst possible rate: they are asking again, at the hour when refusing is impossible and granting is irreversible. Unkept promises compound like any other debt, and the confederation has always been a careful bookkeeper about exactly one thing.',
  },
  {
    test: (s) =>
      s.flags.includes('negotiation-channel') ||
      s.flags.includes('amnesty-offer') ||
      s.flags.includes('settlement-sought'),
    beat: () =>
      'The prietistas\' channels to the Gobierno Civil are still open, and this morning they run the other way: the Republic\'s men asking that the cohabitation they were promised be honored — the institutions preserved, the war run through the state and not around it. Prieto kept his word all spring. He expects the alliance to keep it through a war, which is where such words go to be tested.',
  },
];

const FACTION_CLOSE_LINES: Record<string, string> = {
  moderates:
    'enters the war as the loyal opposition inside your own trench — the prietistas will fight beside you and document against you, and their dossier on how this city was held opens with the things you did to hold it.',
  hardliners:
    'never disarmed and never intended to — the faístas call it the revolution and the war the same word now, and they are not entirely wrong, which is the trouble that has a date with this city.',
  labor:
    'is back at the mill gates within the month, war or no war, this time over the war industries\' wages — the UGT says the mills were always the point, and it was telling the truth the whole time.',
  students:
    'is already writing the account that makes this committee the thing the next generation corrects — the JSU archive remembers who was patient and who was not, and archives outlive committees.',
};

const DEPARTED_LINES: Record<string, string> = {
  moderates:
    'The prietistas did not dissolve when they walked — they reconvened nearer the Gobierno Civil, and the war finds them holding the Republic\'s local machinery while you hold the street. Two commands in one held city: Madrid will call it unity. Nobody in Vallarga will.',
  hardliners:
    'The faístas kept what they walked out with, and the columns they raise now march under the confederation\'s banner alone. They did not rejoin the alliance. They are watching it the way they watched every government — from behind their own rifles.',
  labor:
    'The Casa del Pueblo runs its own war now — its funds, its rolls, its comedores, a parallel administration you petition rather than direct. The UGT calls it order. It means custody.',
  students:
    'The JSU resurfaced under its own discipline months ago, and the war has made them indispensable and unaccountable in the same motion. The line they left on the door — about never again waiting — reads, this morning, like a mobilization order they wrote for themselves.',
};

function debtBeats(state: GameState): string[] {
  const beats: string[] = [];
  for (const debt of FLAG_DEBTS) {
    if (debt.test(state)) beats.push(debt.beat(state));
  }
  for (const faction of state.factions.filter((f) => !f.present)) {
    beats.push(DEPARTED_LINES[faction.id]);
  }
  for (const faction of state.factions.filter((f) => f.present && f.mood < 35)) {
    const title = VOICES[faction.id].title;
    beats.push(
      `${title.charAt(0).toUpperCase()}${title.slice(1)}, in all but name, ${FACTION_CLOSE_LINES[faction.id]}`,
    );
  }
  return beats;
}

function closingBeat(status: GameState['status'], debts: number): string {
  if (status === 'cascade') {
    if (debts <= 1)
      return 'For once the receipts are short. The war begins tomorrow regardless — but this city goes into it owing almost nothing to anyone but its dead, and that is the strongest position the summer allows.';
    if (debts <= 3)
      return 'The receipts are long but not yet due; wars defer every reckoning and worsen every rate. What was built here can survive paying them — if it starts paying before the war teaches everyone cheaper arithmetic.';
    return 'The war begins tomorrow, and inside it — on this morning\'s evidence — a second war is already scheduled, between the people who held this city together. Only its date is open. In Barcelona, next May, they will learn what such mornings cost.';
  }
  // Losses: debts still count, but the frame is "promises that died unpaid".
  if (debts <= 1)
    return 'There was little enough owed, in the end — which is its own kind of small mercy, in a season when the owed are the first names on the lists.';
  if (debts <= 3)
    return 'These were promises made on the assumption of a future that did not arrive. The war will spend years teaching everyone who was promised that the promises died here, in the spring, with the movement that made them.';
  return 'The promises outlived the movement that made them, and now belong to no one — which means, in a war, that they belong to whoever prints the next gazette. Vallarga\'s people will spend the duration being told they imagined the debt.';
}

/**
 * Compose the written epilogue from the end-state. Pure: no RNG, same
 * input always produces the same output.
 */
export function generateEpilogue(state: GameState): Epilogue {
  const beats: string[] = [];
  const opening = OPENING_BEATS[state.status];
  if (opening) beats.push(opening);

  let debts = 0;
  if (state.status === 'cascade') {
    const debtLines = debtBeats(state);
    debts = debtLines.length;
    beats.push(...debtLines);
  } else {
    // Losses still count debts for the closing's framing, but the debt
    // beats themselves are not narrated turn-by-turn as a "ledger opening" —
    // the loss already happened. We still tally them for the closing tier.
    debts = debtBeats(state).length;
  }

  beats.push(closingBeat(state.status, debts));
  return { beats, debts };
}
