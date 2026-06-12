import type { ActionType } from '../engine/actions';
import type { FactionId, FactionState } from '../engine/factions';
import type { RNG } from '../engine/rng';

/**
 * Each faction is a character, not a meter. Tone shows mood before the
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
    name: 'Vera',
    title: 'the Moderates',
    bands: [
      [
        'Vera returns your letters unopened now. Her secretary says she is "consulting with friends."',
        '"I will not put my people in front of guns to decorate your legend." She does not raise her voice. She never does.',
      ],
      [
        '"You ask me to defend this at dinner tables you\'ve never sat at." Vera\'s notes have gotten shorter.',
        '"There were names I could once mention to the magistrates. I no longer mention names."',
      ],
      [
        '"It can be managed," Vera says, which from her is neither yes nor no.',
        'Vera proposes language for the next pamphlet. Half of it is hedges. The other half is good.',
      ],
      [
        '"The professional classes are listening. Do not give them a reason to stop." Vera almost smiles.',
        'Vera brings two magistrates to the back room. They do not give their names. They do not need to.',
      ],
      [
        '"I have waited my whole life to say this plainly: it is working." Vera\'s hand shakes on the teacup.',
        'Vera drafts statutes for a government that does not exist yet. "Someone must," she says.',
      ],
    ],
    reactions: {
      lay_low: '"Discipline. Finally." Vera approves, in her way: she stops drafting her resignation.',
      fundraise: '"Respectable money respects quiet bookkeeping. This was well done."',
      agitate: '"You have made us look like arsonists. I will be explaining this for a month."',
    },
    departure:
      'Vera resigns by letter, hand-delivered, sealed. Three pages, no anger in any of them — which is how you know it is final. She thanks you for "an education in the limits of persuasion." The professional committees go with her: the lawyers, the sympathetic clerks, the money that asked no questions. The room is louder without her, and smaller.',
    betrayal:
      'Within the week, the magistrates have names. Vera always did keep meticulous files.',
  },

  hardliners: {
    name: 'Ilya',
    title: 'the Hardliners',
    bands: [
      [
        'Ilya has stopped arguing in meetings. He sits by the door and cleans his nails with a knife, which is an argument.',
        '"You are building a debating society with a martyrs\' wall." Ilya doesn\'t look at you when he says it.',
      ],
      [
        '"Every month we wait, they hang someone we could have armed." Ilya\'s patience is a rope, fraying.',
        'Ilya keeps a list of comrades taken. He reads it aloud now, at the end of meetings, uninvited.',
      ],
      [
        '"Fine. We do it your way. This season." Ilya cracks his knuckles like he\'s counting them.',
        'Ilya drills the new cadre in the cellar. He\'s good with them — patient, even. It surprises everyone but the cadre.',
      ],
      [
        '"Now you see it. Now you finally see it." Ilya is almost warm tonight, which means something is burning somewhere.',
        'Ilya embraces you, once, hard, like a man testing a load-bearing wall.',
      ],
      [
        '"I used to dream of this. Now I sleep instead." Ilya laughs at his own joke. No one knew he had one.',
        'Ilya\'s people walk taller. He tells them: "Patience won this. Write that down before I deny it."',
      ],
    ],
    reactions: {
      agitate: '"More. Louder. While they\'re still deciding whether to be afraid." Ilya is grinning.',
      lay_low: '"Hide, then. The dead are very discreet too." Ilya leaves before the vote.',
      organize: '"Study circles." Ilya spits. But he sends two of his best to teach in them anyway.',
    },
    departure:
      'Ilya doesn\'t write letters. He empties the armory in a night — rifles, the good press, four of your best organizers — and leaves the door standing open so you understand it wasn\'t theft, it was a verdict. On the table where the maps used to be: his list of the taken, weighted down with a single cartridge.',
    betrayal:
      'A police circular names three safehouses, with sketches. Ilya knew them all. The cartridge on the table was for you to understand whose names came next.',
  },

  labor: {
    name: 'Goran',
    title: 'the Labor wing',
    bands: [
      [
        '"My people eat speeches now. Twelve-hour shifts and your name is a curse in the canteens." Goran says it flat, like a foreman reading tonnage.',
        'Goran stops bringing the shift rosters. "Why count what you\'re going to spend like water?"',
      ],
      [
        '"The mills gave you four hundred hands. Show me what you gave the mills." Goran waits. He can wait all night.',
        '"Bread first. Doctrine after supper." Goran\'s mood is arithmetic, and the sums are short.',
      ],
      [
        'Goran reports steady numbers from the river district. "Steady," from him, is high praise.',
        '"The men ask if it\'s worth it. I tell them ask me payday." Goran shrugs. "It\'s a system."',
      ],
      [
        '"Strike fund is fat. Kitchens are stocked. You could call out three mills tomorrow and feed them for a month." Goran allows himself one cigarette.',
        'Goran brings his daughter to the meeting. He doesn\'t say why. Everyone understands why.',
      ],
      [
        '"Forty years my family fed this city. First time the city might feed us back." Goran\'s voice doesn\'t change. His eyes do.',
        'The canteens sing now. Goran pretends it\'s bad for discipline and knows every verse.',
      ],
    ],
    reactions: {
      organize: '"Mutual aid filled two kitchens this week. That\'s two hundred families who know our name now." Goran nods slowly.',
      fundraise: '"Money\'s money. Just remember whose rent it was first."',
      agitate: '"Fine words. The overseers docked my whole floor a day\'s wage for listening to them."',
    },
    departure:
      'Goran takes the union rolls, the strike fund, and the kitchens — everything that feeds someone. "No hard feelings," he says, shaking your hand like a man closing an account. "But I buried two organizers this year, and you spent the wreaths on pamphlets." The river district goes dark to you the same night. Four hundred hands, withdrawn as one.',
    betrayal:
      'Goran doesn\'t inform — he negotiates. The factory owners get labor peace; the police get the names of everyone in the movement who isn\'t his. He\'d call it protecting his own. He always did.',
  },

  students: {
    name: 'Mira',
    title: 'the Students',
    bands: [
      [
        'Mira\'s circle has stopped coming. She comes alone, sits in the back, and corrects the minutes — her only remaining loyalty.',
        '"We gave you our years. You gave us minutes of meetings." Mira\'s voice cracks on "years," and she hates that it does.',
      ],
      [
        '"Half my cell thinks you\'ve gone gray inside. I\'m running out of counterarguments." Mira looks tired in a way no twenty-year-old should.',
        'Mira\'s pamphlets have gotten sharper, and they\'ve started quoting people who aren\'t you.',
      ],
      [
        'Mira argues both sides of everything, brilliantly, then votes with the majority and sulks about it.',
        '"It\'s slow. I know it has to be slow. I know it. Tell me again why it has to be slow."',
      ],
      [
        'Mira\'s circle doubled again. They hold seminars in the medical faculty now, behind a lecture on anatomy. "Fitting," she says.',
        '"I read your last dispatch to forty people in a cellar and nobody breathed." Mira is glowing and pretending not to.',
      ],
      [
        '"My professor asked me today who writes our pamphlets. I said: the future. He didn\'t laugh." Mira laughs enough for both of them.',
        'Mira has started keeping an archive. "Someone has to remember this right," she says, and you realize she expects to win.',
      ],
    ],
    reactions: {
      agitate: '"Every wall in the university quarter by morning. Give us six hours." Mira is already gone.',
      organize: '"Study circles we can do. Study circles we were born for." Mira\'s people fan out by faculty.',
      lay_low: '"Quiet. Again." Mira folds the unprinted leaflet in half, in quarters, in eighths, until it disappears.',
    },
    departure:
      'There\'s no letter and no scene — the students are simply gone, the way weather changes. Their printing den is swept clean, even the floor. On the door, in Mira\'s handwriting, a single line from one of your own early pamphlets — the one about never waiting. Within a month you hear them in other cities, under another name, faster and angrier and certain you were the lesson, not the teacher.',
    betrayal:
      'Students talk. Not to the police — at parties, in letters home, to lovers. It reaches the police anyway. It always does.',
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
