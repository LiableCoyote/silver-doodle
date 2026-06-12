import { VOICES } from './factions';
import type { GameState } from '../engine/state';

/**
 * The promise ledger, rendered. Mechanical selection, prose in voice — the
 * thesis (every path to power has a price) made visible at the end of the
 * game. No RNG: the epilogue is a pure function of the end-state.
 */
export interface Epilogue {
  beats: string[];
  debts: number;
}

const OPENING_BEATS: Record<GameState['status'], string> = {
  active: '',
  cascade:
    'The morning after begins. The portrait is down, the ministries are quiet, and the ledger — the one nobody kept on paper — opens itself whether you wanted it open or not.',
  decapitated:
    'What the survivors carry out is not victory and not quite defeat: a list of names, a few addresses that are no longer safe, and the particular tiredness of people who built something that was taken apart faster than it was built.',
  irrelevant:
    'The window closed the way windows close — not with a slam but a draft you stopped noticing. The regime\'s gazette barely mentions you; when it does, it is in the past tense, filed under disturbances, already a footnote to a calmer season.',
  split:
    'The movement\'s obituary, when it is finally written, will be an argument over the name — who it belonged to, who let it go, whose fault the letting-go was. Everyone involved will be right, which is the whole problem.',
};

interface DebtCheck {
  test: (state: GameState) => boolean;
  beat: (state: GameState) => string;
}

const FLAG_DEBTS: DebtCheck[] = [
  {
    test: (s) => s.flags.includes('guarantees-given'),
    beat: () =>
      'The officers hold your signature, and signatures are the one thing this regime\'s successors have always honored: the army survives the revolution intact, its colonels reassigned rather than replaced, its ledgers unopened. You wanted the palace without a siege. This is what that costs.',
  },
  {
    test: (s) => s.flags.includes('reprisal-lists'),
    beat: () =>
      'Ilya\'s list has a second page now, names added in the weeks it bought you. You signed it the way you signed everything that season — with silence, which is also a signature, just one that doesn\'t show up in the archive.',
  },
  {
    test: (s) => s.flags.includes('armed-wing'),
    beat: () =>
      'There is an army inside the movement that answers to Ilya before it answers to anyone the movement elected. It did its job. It is still armed, and it has not been told to stop being an army.',
  },
  {
    test: (s) => s.flags.includes('armory-promise'),
    beat: () =>
      'A promise was made to the hardliners — rifles, eventually, properly accounted — and it was never kept, only postponed. The interest on an unkept promise compounds the same as any other debt, and Ilya has always been a careful bookkeeper.',
  },
  {
    test: (s) =>
      s.flags.includes('negotiation-channel') ||
      s.flags.includes('amnesty-offer') ||
      s.flags.includes('settlement-sought'),
    beat: () =>
      'Vera\'s channels are still open, and the old regime\'s men are already using them — quietly, through the same intermediaries, to ask that the quiet they were promised be honored. She kept her word. She expects you to keep hers.',
  },
];

const FACTION_CLOSE_LINES: Record<string, string> = {
  moderates:
    'returns as the loyal opposition it always was, in everything but the word "opposition" — Vera\'s committees draft the new government\'s objections before the new government has finished drafting itself.',
  hardliners:
    'never disarmed and never disbanded — Ilya\'s people call it vigilance, and they are not entirely wrong, which is the trouble.',
  labor:
    'is back at the gates within the month, this time over wages — Goran says the revolution was never the point, the mills were, and he was telling the truth the whole time.',
  students:
    'is already writing the history that makes this government the next thing to overthrow — Mira\'s circles do not forget who was patient and who was not.',
};

const DEPARTED_LINES: Record<string, string> = {
  moderates:
    'Vera\'s committees did not dissolve when she walked — they reconvened, and they did not invite you. The professional classes she took with her are the new government\'s loudest critics, citing, with documents, exactly how this was done.',
  hardliners:
    'Ilya\'s people kept the rifles he walked out with, and the list of the taken he left on the table has grown. They did not join the new order. They are watching it the way they watched the old one.',
  labor:
    'The river district is its own country now in everything but name — Goran\'s unions, his kitchens, his four hundred hands, all running on a ledger you do not get to see. He calls it solidarity. He means independence.',
  students:
    'Mira\'s circle resurfaced in another city months ago, under another name, already further along than you were at their age. The line on the printing-den door — about never waiting — reads, in hindsight, like a verdict on everyone who stayed.',
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
    const name = VOICES[faction.id].name;
    beats.push(`${name}'s tendency ${FACTION_CLOSE_LINES[faction.id]}`);
  }
  return beats;
}

function closingBeat(status: GameState['status'], debts: number): string {
  if (status === 'cascade') {
    if (debts <= 1) return 'For once, the receipts are short. You may yet keep what you built.';
    if (debts <= 3)
      return 'The receipts are long but not yet due. What you built can survive paying them — if it pays them soon.';
    return 'The second revolution is already scheduled. Only its date is open.';
  }
  // Losses: debts still count, but the frame is "promises that died unpaid".
  if (debts <= 1) return 'There was little enough owed, in the end — which is its own kind of small mercy.';
  if (debts <= 3)
    return 'These were promises made on the assumption of a future that did not arrive. Someone, eventually, will have to explain to the people who were promised that the promises died with the movement.';
  return 'The promises outlived the movement that made them, and now belong to no one — which means, in practice, that everyone who is owed will spend years being told they imagined the debt.';
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
