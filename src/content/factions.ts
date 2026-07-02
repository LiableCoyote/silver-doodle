import type { ActionType } from '../engine/actions';
import type { FactionId, FactionState } from '../engine/factions';
import type { RNG } from '../engine/rng';

/**
 * The alliance's four tendencies, each voiced by the real national
 * figure whose tendency it is — arriving by telegram, printed column,
 * speech, or visit. They are not committee members; they are the
 * standard-bearers the local people quote. Tone shows mood before the
 * number does. The engine logs facts; this file turns them into voice.
 */
export interface FactionVoice {
  name: string;
  title: string;
  /** Lines by mood band: [0-19, 20-39, 40-59, 60-79, 80-100]. */
  bands: string[][];
  /** Reaction when this faction is the one most moved by the turn's action. */
  reactions: Partial<Record<ActionType, string>>;
  /** The departure scene, shown when this faction splits off. */
  departure: string;
  /** Shown if the departed faction informs. */
  betrayal: string;
}

export const VOICES: Record<FactionId, FactionVoice> = {
  moderates: {
    name: 'Prieto',
    title: 'los prietistas',
    bands: [
      [
        'The prietistas no longer bring their deputies to the committee. Their secretary attends, takes no notes, and reports — one assumes — that the alliance has chosen adventure. Prieto\'s last telegram was three words: "You were warned."',
        '"I have spent my life keeping the Republic alive against its enemies. I did not expect to spend this spring keeping it alive against its friends." The column runs in El Liberal; everyone in the city knows which friends.',
      ],
      [
        'The prietista councillors answer the committee\'s letters a week late now, in the passive voice. In Madrid, Prieto is fighting his own party\'s left for the party\'s soul; he has little patience left over for a provincial alliance that keeps proving Largo\'s point.',
        '"Every broken window in Vallarga is a vote for the generals. I can be persuaded of many things, but not that arson is a program." The rebuke is printed, which means it was meant to travel.',
      ],
      [
        '"It can be sustained," the prietistas\' man says of this month\'s course, which from that quarter is neither blessing nor curse but a measured willingness to keep paying.',
        'The prietistas propose language for the alliance\'s next manifesto. Half of it is guardrails. The other half, it must be said, is good.',
      ],
      [
        '"The Republic\'s institutions are listening to this city. Do not give them a reason to stop." The telegram is signed D. Indalecio Prieto, which he does only when he is nearly pleased.',
        'Two magistrates and a colonel of carabineros dine, discreetly, with the alliance\'s lawyers. The prietistas arranged the table. Nobody gives a toast; everybody understands the menu.',
      ],
      [
        '"For the first time since October I permit myself the thought that we may get through this summer standing up." Prieto\'s column is almost gentle. The old pessimist\'s hand shakes a little on the optimism.',
        'The prietistas are drafting municipal ordinances for contingencies they decline to name. "Someone must be ready to govern the day after," their secretary says. "Whichever day after it turns out to be."',
      ],
    ],
    reactions: {
      lay_low: '"Discipline, at last. The Republic\'s enemies feed on our noise; a quiet week starves somebody." The prietistas approve, in their fashion: they stop drafting their withdrawal.',
      fundraise: '"Sound books are a political position. This was well done." High praise, from the tendency that reads ledgers for pleasure.',
      agitate: '"You have handed the right a photograph it will use for a year. I will be explaining this mitin in the Cortes corridor for a month." The prietista rebuke arrives before the posters are dry.',
      outreach: '"Talking to officers — finally, the sedition I have recommended all spring. The Republic will be saved inside the barracks or not at all."',
    },
    departure:
      'The prietistas withdraw by letter on Cortes stationery, hand-delivered, courteous to the last comma — which is how you know it is final. With them goes what they always were: the ministries\' ear, the magistrates who took the alliance\'s calls, the money that voted Republican and asked only for calm. Prieto\'s valediction runs in El Liberal that Sunday: "We wanted to save the Republic with these people. They preferred to be right." The room is more unanimous without them, and much smaller.',
    betrayal:
      'Within the fortnight the civil governor knows the alliance\'s finances to the céntimo. The prietistas kept meticulous files — they were always going to be meticulous about something.',
  },

  hardliners: {
    name: 'Durruti',
    title: 'los faístas',
    bands: [
      [
        'The faístas have stopped arguing in the committee. They sit by the door with their caps on, which in their grammar is a complete sentence.',
        '"You are building a filing cabinet with a martyrs\' shelf." The phrase goes around the athenaeums in a week; it is not clear Durruti said it, and it does not matter — his people needed it said.',
      ],
      [
        '"Every week you wait, they move another officer into place. The conspiracy does not table its motions." The faísta delegate reads the sentence from a paper, which means it came from higher, which means Barcelona is watching.',
        'The faístas keep their own list now — of comrades taken since February. They read it at the end of meetings, uninvited, and the reading gets longer.',
      ],
      [
        '"Good. We do it your way. This month." The faísta delegate cracks the window and smokes at it, watching the street the way sailors watch weather.',
        'The faístas drill the defense groups in the quarry outside town. They are good with the young ones — patient, even. It surprises everyone except the young ones.',
      ],
      [
        '"Now the city is learning what it is for." The delegate is almost warm this week, which means something somewhere is moving that he trusts.',
        'A wire from Barcelona, unsigned, in Durruti\'s unmistakable register: "Tell Vallarga the confederation sees them. Tell them also: rifles, rifles, rifles."',
      ],
      [
        '"We have carried a new world here, in our hearts." The old line, worn smooth as a rail — but the delegate says it quietly this time, like a man checking his pocket for something he is finally about to spend.',
        'The faístas walk taller and drill in daylight. "Patience did this," their delegate concedes, "write it down before I deny it" — Durruti\'s own joke, borrowed with the confidence of people who expect to meet him soon.',
      ],
    ],
    reactions: {
      agitate: '"More. Louder. While the casinos are still deciding whether to be afraid." The faístas are grinning for once.',
      lay_low: '"Hide, then. The cemeteries are very discreet too." The delegate leaves before the vote is counted.',
      organize: '"Athenaeums." The delegate spits, and then sends two of his best people to teach in them anyway, because that is also the tradition.',
      outreach: '"Write to the soldiers, yes — and ask them where the armory keys are kept. A letter that does not mention rifles is a postcard."',
    },
    departure:
      'The faístas do not write letters. In one night the defense groups\' stores are gone — the pistols, the good duplicator, four of your best organizers of the young — and the door of the union hall is left standing open so you understand it was not theft but a verdict. On the committee table, weighted with a single cartridge: their list of the taken since February. Their delegate\'s last words in the doorway are Durruti\'s old ones, said without heat: "We are not afraid of ruins."',
    betrayal:
      'The faístas do not inform — not to police. But the quarrel is published in their press, with dates and amounts and the names of everyone who counselled patience, and the Brigada Social reads the anarchist papers more carefully than anyone.',
  },

  labor: {
    name: 'Largo Caballero',
    title: 'la UGT',
    bands: [
      [
        '"The Casa del Pueblo did not survive October to be spent by a committee." The UGT\'s secretary says it flat, like a man reading tonnage. The strike fund ledger has not been brought to a meeting in a month.',
        'The mill locals have stopped forwarding their rolls. When the UGT stops counting for you, you have already been subtracted.',
      ],
      [
        '"The unions gave this alliance four thousand hands. Show me what the alliance gave the unions." The secretary waits. He is a patient man with an impatient ledger.',
        'A wire from Madrid, from the old man himself, maximal as ever: "The proletariat does not lend itself. It leads or it withdraws." The locals read it aloud in the canteens, approvingly, twice.',
      ],
      [
        'The UGT reports steady dues from the mills. "Steady," in that house\'s dialect, is high praise.',
        '"The men ask if the alliance is worth the levy. I tell them: ask me after the summer." The secretary shrugs. "It is a system."',
      ],
      [
        '"Strike fund is fat, the comedores are stocked, and the mill committees could stop this city in a morning and feed it for a month." The secretary allows himself one cigarette on the Casa del Pueblo steps.',
        'Largo speaks to eighty thousand in Madrid and the wire services carry one line to every Casa del Pueblo in Spain: the working class is done waiting for permission. In Vallarga\'s mills, the line is chalked on the time-clock.',
      ],
      [
        '"Forty years the mills fed this city. First season the city might feed us back." The secretary\'s voice does not change when he says it. His hands do.',
        'The canteens sing now — the old hymns and the new ones. The UGT pretends it is bad for output and knows every verse.',
      ],
    ],
    reactions: {
      organize: '"The mutual-aid rolls grew by two hundred families this week. That is two hundred families who know the Casa del Pueblo\'s address." The secretary nods slowly, which is his ovation.',
      fundraise: '"Money is money. Just remember which shift\'s wages it was first."',
      agitate: '"Fine speeches. The foremen docked my whole floor a day\'s pay for attending them." The ledger comes out; the ledger always comes out.',
      outreach: '"Half those conscripts carry UGT cards or their fathers do. About time somebody wrote to them as family." The secretary supplies three sergeants\' mothers\' addresses from memory.',
    },
    departure:
      'The UGT takes what feeds people: the strike fund, the comedor stores, the mill rolls, the Casa del Pueblo itself — theirs, after all, brick by subscription brick. The secretary shakes your hand like a man closing an account: "Nothing personal. But I buried two organizers this spring and the alliance spent the wreath money on posters." Madrid\'s wire arrives the next day, Largo at his most marmoreal: the UGT walks alone until the others learn seriousness. Four thousand hands, withdrawn as one.',
    betrayal:
      'The UGT does not go to the police; it goes to the governor, as an institution, with an institution\'s complaint — and the annexes to that complaint name every man in the alliance who is not theirs. They would call it regularizing the situation. They always did.',
  },

  students: {
    name: 'Carrillo',
    title: 'las Juventudes',
    bands: [
      [
        'The JSU section sends apologies to the committee now instead of delegates. Their energy has gone somewhere; you can hear it two streets away, organized, and no longer yours.',
        '"We gave the alliance our evenings and our shoe leather. It gave us minutes of meetings." The section secretary is nineteen and does not intend to be nineteen forever.',
      ],
      [
        '"Half my section thinks the committee has gone grey inside. I am running out of counter-arguments." The secretary looks tired in a way particular to the very young.',
        'The JSU\'s wall newspaper has gotten sharper, and it has started quoting people who are not you.',
      ],
      [
        'The JSU argues both sides of every motion, brilliantly, then votes with the majority and sulks about it in perfect formation.',
        '"It is slow. I know it must be slow. I know it. Tell me again why it must be slow." The secretary folds the agenda into smaller and smaller squares.',
      ],
      [
        'The section doubled again — they run night classes in the athenaeum now behind a lecture on gymnastics. "Fitting," the secretary says. Carrillo\'s circular commends Vallarga by name.',
        '"I read the committee\'s last statement to sixty people in the Arrabal and nobody breathed." The secretary is glowing and pretending it is the lamplight.',
      ],
      [
        '"My father asked me who writes our leaflets. I told him: the ones who will run the ministries." He did not laugh. The secretary laughs enough for both of them.',
        'The JSU has started an archive — dues books, photographs, the minutes of everything. "Someone has to remember this correctly," the secretary says, and you realize the youth expect to win.',
      ],
    ],
    reactions: {
      agitate: '"Every wall in the university quarter by morning. Give the section six hours." The secretary is already gone down the stairs.',
      organize: '"Study circles we can do. Study circles are what the JSU is for." The section fans out by faculty and by street.',
      lay_low: '"Quiet. Again." The secretary folds the unprinted leaflet in half, in quarters, in eighths, until it disappears into a pocket.',
      outreach: '"Half the conscripts in the Cuartel are our age. We play them at football on Sundays. You are asking us to do what we are already doing — so ask louder."',
    },
    departure:
      'There is no scene and no letter — the youth are simply gone, the way weather changes. Their print room is swept clean, even the floor. On the door, in the section secretary\'s careful hand, one line from the alliance\'s own February manifesto — the one about never again waiting. Within the month you hear them working the same streets under their own banner, faster and surer and convinced you were the lesson, not the teacher. Carrillo\'s circular does not mention Vallarga again.',
    betrayal:
      'The young talk. Not to the Brigada Social — at dances, in letters to cousins doing their service, across café tables. It reaches the Brigada Social anyway. It always does.',
  },
};

const BAND_EDGES = [20, 40, 60, 80];

export function moodBand(mood: number): number {
  let band = 0;
  for (const edge of BAND_EDGES) {
    if (mood >= edge) band++;
  }
  return band;
}

/** A faction's current line, by mood band. Deterministic given the rng. */
export function voiceLine(faction: FactionState, rng: RNG): string {
  const lines = VOICES[faction.id].bands[moodBand(faction.mood)];
  return lines[Math.floor(rng() * lines.length)];
}

/**
 * The reaction line for the faction most moved (in either direction) by
 * this turn's action, if that faction has one written for it.
 */
export function reactionLine(
  action: ActionType,
  moodDeltas: Record<FactionId, number>,
  factions: FactionState[],
): string | undefined {
  const present = factions.filter((f) => f.present);
  if (present.length === 0) return undefined;
  const mostMoved = present.reduce((top, f) =>
    Math.abs(moodDeltas[f.id]) > Math.abs(moodDeltas[top.id]) ? f : top,
  );
  return VOICES[mostMoved.id].reactions[action];
}
