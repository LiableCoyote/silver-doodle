import type { EventCard } from '../../engine/events';

/**
 * Act I — the quiet build. Study circles, mutual aid, the boring logistics
 * that actually win. Triggers favor early turns and low heat; the window
 * (grievance) is draining the whole time.
 */
export const ACT1_EVENTS: EventCard[] = [
  {
    id: 'study-circle-question',
    trigger: { turn: { lte: 14 }, notFlags: ['crackdown'] },
    weight: 14,
    art: 'study-circle',
    prose: [
      {
        text: 'A young weaver at the Tuesday circle asks why the bosses own the looms her grandmother died at. Twenty faces turn to the front of the room. What you answer becomes what they repeat.',
      },
    ],
    choices: [
      {
        id: 'doctrine',
        label: 'Teach the theory behind it',
        effect: { resources: { sympathizers: -3, cadre: 2 }, moods: { students: 3, labor: -1 } },
        outcome: [
          {
            text: 'Half the room drifts away over the following weeks. The half that stays starts asking better questions, and answering them for others. Mira calls it the best night’s work of the season.',
          },
        ],
      },
      {
        id: 'bread',
        label: 'Talk about bread, wages, rent',
        effect: { resources: { sympathizers: 6 }, moods: { labor: 3, students: -2 } },
        outcome: [
          {
            text: 'The room nods. They bring their cousins next week, and their cousins bring grievances of their own. Goran approves. Mira says you are building a crowd, not a movement, and crowds go home.',
          },
        ],
      },
    ],
  },
  {
    id: 'bread-line-riot',
    trigger: { turn: { lte: 16 }, resource: { grievance: { gte: 50 } } },
    weight: 12,
    art: 'bread-line',
    prose: [
      {
        text: 'A bread line on Foundry Street collapses into a riot — a baker beaten, a window gone, a police wagon rocking on two wheels. Some of the fists belong to people who attend your meetings.',
      },
    ],
    choices: [
      {
        id: 'join',
        label: 'Put cadre in the crowd to steer it',
        effect: { resources: { sympathizers: 7, heat: 8 }, moods: { hardliners: 3, moderates: -4 } },
        outcome: [
          {
            text: 'Your people turn a riot into a march and the march goes home unbroken. The district remembers who kept order when the police only brought clubs. So do the police.',
          },
        ],
      },
      {
        id: 'restrain',
        label: 'Pull your people out',
        effect: { resources: { legitimacy: 3, heat: -2 }, moods: { hardliners: -3, moderates: 3 } },
        outcome: [
          {
            text: 'The riot burns out by evening, ugly and aimless. Your hands are clean. Ilya asks, quietly, what exactly clean hands have ever lifted.',
          },
        ],
      },
    ],
  },
  {
    id: 'printing-press',
    trigger: { turn: { lte: 18 }, resource: { materiel: { gte: 10 } }, notFlags: ['press'] },
    weight: 14,
    art: 'press',
    prose: [
      {
        text: 'A print-shop foreman, dismissed for drink, offers his master’s old flatbed press — disassembled, smuggleable, temperamental. "She jams on cheap paper," he says, patting a crate, "but so do I."',
      },
    ],
    choices: [
      {
        id: 'buy',
        label: 'Buy the press',
        effect: { resources: { materiel: -8 }, setFlags: ['press'], moods: { students: 3 } },
        outcome: [
          {
            text: 'It takes four nights and a borrowed cart. By month’s end the first sheets come off her, smudged and beautiful. Mira names the press Vera, which Vera pretends not to find funny.',
          },
        ],
      },
      {
        id: 'pass',
        label: 'Too dear, too dangerous',
        effect: { resources: { legitimacy: -1 }, moods: { students: -3 } },
        outcome: [
          {
            text: 'The press goes to a commercial jobber who prints wedding invitations with it. Mira keeps hand-copying pamphlets and says nothing, in a way that says a great deal.',
          },
        ],
      },
    ],
  },
  {
    id: 'informant-suspected',
    trigger: { turn: { gte: 4, lte: 20 } },
    weight: 12,
    art: 'informant',
    prose: [
      {
        text: 'The new bookkeeper asks too many questions about names and addresses, and writes nothing down — a man who trusts his memory is a man reporting to someone. Ilya wants an answer tonight.',
      },
    ],
    choices: [
      {
        id: 'expel',
        label: 'Expel him quietly',
        effect: { setFlags: ['informant-purged'], moods: { hardliners: 2, moderates: 1 } },
        outcome: [
          {
            text: 'He protests his innocence all the way down the stairs. Perhaps he was innocent. The meetings feel lighter afterward, and you try not to think about what that proves.',
          },
        ],
      },
      {
        id: 'feed',
        label: 'Feed him false names',
        effect: { resources: { heat: -6 }, moods: { hardliners: 4, moderates: -3 } },
        outcome: [
          {
            text: 'For a month the police watch three taverns where nothing happens and arrest a horse trader with an unfortunate beard. Ilya is delighted. Vera asks what happens to the horse trader. No one answers.',
          },
        ],
      },
      {
        id: 'ignore',
        label: 'You have no proof — let it lie',
        effect: { setFlags: ['informant-loose'], moods: { hardliners: -4 } },
        outcome: [
          {
            text: 'The bookkeeper keeps the ledgers immaculately. Ilya posts a man to watch him and tells you only after the fact. Something in the meetings has gone careful.',
          },
        ],
      },
    ],
  },
  {
    id: 'mutual-aid-kitchen',
    trigger: { turn: { lte: 16 }, resource: { materiel: { gte: 8 } }, notFlags: ['mutual-aid'] },
    weight: 14,
    art: 'kitchen',
    prose: [
      {
        text: 'Goran proposes soup kitchens in the river district — no speeches, no leaflets, just bread and a warm room. "Feed them twice," he says, "and the third time they ask why they’re hungry."',
      },
    ],
    choices: [
      {
        id: 'fund',
        label: 'Fund the kitchens',
        effect: {
          resources: { materiel: -6, sympathizers: 8 },
          setFlags: ['mutual-aid'],
          moods: { labor: 4, hardliners: -1 },
        },
        outcome: [
          {
            text: 'Two rooms, four kettles, a rotation of volunteers. Within a month the kitchens know every family on three streets — who is sick, who is owed wages, who has a son in the garrison. Goran was right about the third time.',
          },
        ],
      },
      {
        id: 'decline',
        label: 'The money is needed elsewhere',
        effect: { moods: { labor: -4, hardliners: 2 } },
        outcome: [
          {
            text: 'Goran takes it without a word, which is worse than an argument. The river district eats thin soup from the church, and the church tells them to be patient.',
          },
        ],
      },
    ],
  },
  {
    id: 'clerk-offer',
    trigger: { turn: { gte: 5, lte: 22 } },
    weight: 10,
    art: 'clerk',
    prose: [
      {
        text: 'A clerk from the Interior Ministry — gray, precise, terrified — offers copies of the watch lists. He wants nothing for it. That is either conscience or a trap, and they look identical at this distance.',
      },
    ],
    choices: [
      {
        id: 'accept',
        label: 'Accept the lists',
        effect: { resources: { heat: -8 }, setFlags: ['clerk-recruited'], moods: { moderates: -2, hardliners: 2 } },
        outcome: [
          {
            text: 'The lists are genuine. Three names you trusted are on the police payroll; two safehouses move that same night. The clerk keeps copying. You keep wondering what he is copying about you.',
          },
        ],
      },
      {
        id: 'decline',
        label: 'Send him away — too neat',
        effect: { moods: { moderates: 2, hardliners: -2 } },
        outcome: [
          {
            text: 'He leaves without protest, which troubles you for a week. Vera approves: "A movement that takes every gift will eventually be handed a bomb."',
          },
        ],
      },
    ],
  },
  {
    id: 'union-dues-quarrel',
    trigger: { turn: { gte: 3, lte: 20 } },
    weight: 10,
    prose: [
      {
        text: 'The month’s funds cover one thing: Goran wants a strike reserve, coin by coin against the day the mills stop; Mira wants ten thousand pamphlets while the bread anger is hot. Both are right. That is the problem.',
      },
    ],
    choices: [
      {
        id: 'fund-reserve',
        label: 'Build the strike reserve',
        effect: { resources: { materiel: 5 }, moods: { labor: 4, students: -3 } },
        outcome: [
          {
            text: 'The reserve grows in a strongbox under a floor. It does nothing, loudly, every day — until the day it will do everything.',
          },
        ],
      },
      {
        id: 'fund-pamphlets',
        label: 'Print while the anger is hot',
        effect: { resources: { legitimacy: 4 }, moods: { students: 4, labor: -3 } },
        outcome: [
          {
            text: 'Ten thousand sheets go out under doors and into lunch pails. For a week the whole quarter argues about the same three sentences. Goran counts the empty strongbox twice, as if counting might fill it.',
          },
        ],
      },
    ],
  },
  {
    id: 'conscription-notice',
    trigger: { turn: { lte: 24 } },
    weight: 10,
    art: 'conscription',
    prose: [
      {
        text: 'New conscription notices go up overnight: the autumn levy doubled, the exemptions for mill workers quietly abolished. Mothers stand reading the posted sheets with their lips moving.',
      },
    ],
    choices: [
      {
        id: 'agitate',
        label: 'Hang your answer beside every notice',
        effect: { resources: { legitimacy: 5, heat: 6 }, moods: { students: 3, moderates: -2 } },
        outcome: [
          {
            text: 'By morning every levy notice in three districts has a twin: WHOSE WAR? WHOSE SONS? The police tear them down by noon, which only confirms the question.',
          },
        ],
      },
      {
        id: 'hide-sons',
        label: 'Help families hide their sons',
        effect: { resources: { sympathizers: 7, materiel: -4 }, moods: { labor: 3, hardliners: -2 } },
        outcome: [
          {
            text: 'False papers, attic rooms, a fishing boat that leaves full and returns empty. Nothing printed, nothing said — but the families know, and a debt like that outlasts any pamphlet.',
          },
        ],
      },
    ],
  },
  {
    id: 'old-professor',
    trigger: { turn: { gte: 4, lte: 26 } },
    weight: 8,
    prose: [
      {
        text: 'An old professor of law — dismissed from his chair a decade ago, famous in a faded way — offers to lecture for you: "On the Lawfulness of Disobedience." Half the city’s respectable discontents would come.',
      },
    ],
    choices: [
      {
        id: 'host',
        label: 'Host the lecture',
        effect: { resources: { legitimacy: 5, heat: 4 }, moods: { moderates: 4, hardliners: -3 } },
        outcome: [
          {
            text: 'Two hundred coats too good for the hall hear an old man prove sedition from first principles. Vera collects four names from the audience worth more than a hundred pamphlets. Ilya waits outside, watching the police watch the door.',
          },
        ],
      },
      {
        id: 'decline',
        label: 'Lectures win nothing',
        effect: { moods: { hardliners: 2, moderates: -3 } },
        outcome: [
          {
            text: 'The professor lectures anyway, in a smaller room, to fewer coats. Vera attends in a private capacity and does not report what was said, which is a kind of report.',
          },
        ],
      },
    ],
  },
  {
    id: 'counterfeit-papers',
    trigger: { turn: { gte: 6, lte: 28 } },
    weight: 8,
    prose: [
      {
        text: 'A forger — an artist, by her samples — offers residence permits, work books, travel passes. Cash price, or she’ll work for the cause if the cause is going somewhere.',
      },
    ],
    choices: [
      {
        id: 'buy',
        label: 'Buy a batch outright',
        effect: { resources: { materiel: -5, heat: -6 } },
        outcome: [
          {
            text: 'Clean papers for the six most-watched cadre. The city swallows them whole; the police files now describe six people who no longer exist.',
          },
        ],
      },
      {
        id: 'recruit',
        label: 'Recruit her into the movement',
        effect: { resources: { cadre: 1, heat: 2 }, moods: { hardliners: 2 } },
        outcome: [
          {
            text: 'She joins for the workmanship, she says — forging for money was getting dull. Her first project is a complete duplicate of the district police commander’s signature, "for emergencies."',
          },
        ],
      },
    ],
  },
  {
    id: 'harvest-rumor',
    trigger: { turn: { lte: 20 }, resource: { grievance: { gte: 40 } } },
    weight: 10,
    prose: [
      {
        text: 'Word from the provinces: the harvest has failed again, worse than the gazettes admit. If true, bread doubles by winter. If false and you shout it, you’re the liar who cried famine.',
      },
    ],
    choices: [
      {
        id: 'spread',
        label: 'Spread it now, while it burns',
        effect: { resources: { grievance: 5, legitimacy: -2 }, moods: { hardliners: 2, moderates: -3 } },
        outcome: [
          {
            when: { resource: { legitimacy: { gte: 55 } } },
            text: 'Coming from you, it is believed before it is checked. The grain merchants start hoarding on the rumor alone, which makes the rumor true. You have learned something about your own weight, and it should frighten you a little.',
          },
          {
            text: 'The rumor races ahead of the proof. When the official figures land somewhere in between, the regime’s papers spend a happy week on the anatomy of your exaggeration.',
          },
        ],
      },
      {
        id: 'verify',
        label: 'Send someone to count the wagons first',
        effect: { resources: { legitimacy: 3 }, moods: { moderates: 2, hardliners: -1 } },
        outcome: [
          {
            text: 'Two weeks later you publish freight manifests, not adjectives: a third of last year’s grain. It lands quieter than a rumor and lasts longer. Even the merchant gazette reprints your table, with attribution it instantly regrets.',
          },
        ],
      },
    ],
  },
  {
    id: 'police-payroll',
    trigger: { turn: { gte: 8, lte: 30 }, resource: { materiel: { gte: 10 } } },
    weight: 8,
    prose: [
      {
        text: 'A desk sergeant in the third precinct will sell warnings — a knock on a window the night before a raid. He names a monthly figure with the boredom of a man quoting grain prices.',
      },
    ],
    choices: [
      {
        id: 'pay',
        label: 'Put him on the payroll',
        effect: { resources: { materiel: -7, heat: -7 }, moods: { moderates: -2, hardliners: -2 } },
        outcome: [
          {
            text: 'The knocks come, and they are accurate. Everyone is faintly ashamed of how well it works — the revolution, renting its safety from the apparatus it means to bury.',
          },
        ],
      },
      {
        id: 'refuse',
        label: 'A bought man stays bought by the highest bidder',
        effect: { moods: { hardliners: 3, moderates: 1 } },
        outcome: [
          {
            text: 'You decline politely enough that he doesn’t take offense. Within the season he is selling the same service to the smugglers’ ring, who reportedly pay better and complain less about ethics.',
          },
        ],
      },
    ],
  },
  {
    id: 'first-safehouse',
    trigger: { turn: { lte: 18 }, notFlags: ['safehouse'] },
    weight: 12,
    prose: [
      {
        text: 'The back room above the cooperage is no longer safe — the cooper’s new apprentice has a policeman brother. You need somewhere with two exits and a landlord who doesn’t ask.',
      },
    ],
    choices: [
      {
        id: 'buy',
        label: 'Rent a proper safehouse',
        effect: { resources: { materiel: -6 }, setFlags: ['safehouse'] },
        outcome: [
          {
            text: 'A printer’s widow lets you the floor above her shop and asks no questions, having already answered them for herself years ago. Two exits, a view of both corners, and the smell of ink as camouflage.',
          },
        ],
      },
      {
        id: 'borrow',
        label: 'Rotate through sympathizers’ parlors',
        effect: { resources: { sympathizers: -4 }, setFlags: ['safehouse'], moods: { moderates: -1 } },
        outcome: [
          {
            text: 'It costs nothing and it costs plenty: every parlor you borrow becomes a household that lies awake after you leave. Two families quietly stop attending meetings. The geography works, for now.',
          },
        ],
      },
    ],
  },
  {
    id: 'schism-pamphlet',
    trigger: { turn: { gte: 6, lte: 26 } },
    weight: 8,
    prose: [
      {
        text: 'A rival circle — four theorists and a duplicating machine — publishes a pamphlet denouncing you as opportunists, adventurists, and (this stings) "provincial." Their footnotes are excellent.',
      },
    ],
    choices: [
      {
        id: 'rebut',
        label: 'Answer in print',
        effect: { resources: { legitimacy: 2, heat: 2 }, moods: { students: 3, labor: -2 } },
        outcome: [
          {
            text: 'Your reply is sharper than their attack and the university quarter keeps score. Goran reads both pamphlets and asks how many loaves of bread either one bakes.',
          },
        ],
      },
      {
        id: 'absorb',
        label: 'Invite them in — better inside than sniping',
        effect: { resources: { sympathizers: 4 }, moods: { students: 2, hardliners: -3, moderates: -2 } },
        outcome: [
          {
            text: 'Three of the four join, bringing the duplicating machine as dowry. They immediately open a debate on the movement’s name. Ilya proposes settling it outside. The debate adjourns.',
          },
        ],
      },
      {
        id: 'ignore',
        label: 'Four men and a duplicator are not a rival',
        effect: { moods: { students: -3 } },
        outcome: [
          {
            text: 'You let it lie. The pamphlet circulates in the lecture halls unanswered, and a season later you meet its arguments again, wearing new students.',
          },
        ],
      },
    ],
  },
  {
    id: 'dockworkers-ask',
    trigger: { turn: { gte: 8, lte: 28 }, notFlags: ['strike-called'] },
    weight: 10,
    prose: [
      {
        text: 'The grain dockers send two men by night: they mean to stop work over a drowned comrade and docked wages, with you or without you. They are early — months early — and they know it, and they don’t care.',
      },
    ],
    choices: [
      {
        id: 'support',
        label: 'Stand with them now',
        effect: { resources: { sympathizers: 5, heat: 8, materiel: -3 }, moods: { labor: 5, moderates: -3 } },
        outcome: [
          {
            text: 'Three days, the harbor still, the city eating its reserves. They win the wages and lose the ringleader, dismissed and blacklisted. The docks remember both halves of that sentence.',
          },
        ],
      },
      {
        id: 'patience',
        label: 'Counsel patience — the hour is wrong',
        effect: { moods: { labor: -4, moderates: 3, hardliners: -2 } },
        outcome: [
          {
            text: 'They strike anyway, smaller and angrier, and are broken in a day. The drowned man’s widow returns your condolence letter unopened. Goran delivers it back to you personally, so you can see his face while you hold it.',
          },
        ],
      },
    ],
  },
  {
    id: 'widow-donation',
    trigger: { turn: { gte: 5, lte: 30 } },
    weight: 8,
    prose: [
      {
        text: 'A mill widow — three sons in the works, a husband in the ground since the boiler accident — brings you her burial savings in a knotted cloth. "For the cause," she says. It is everything she has against her own funeral.',
      },
    ],
    choices: [
      {
        id: 'accept',
        label: 'Accept it — the cause needs it',
        effect: { resources: { materiel: 8 }, moods: { labor: 2, moderates: -2 } },
        outcome: [
          {
            text: 'You take the cloth. It weighs nothing and it weighs more than the strike fund. Goran enters it in the ledger under her full name, in his best hand, and dares anyone to spend it badly.',
          },
        ],
      },
      {
        id: 'refuse',
        label: 'Refuse — take her name, not her grave money',
        effect: { resources: { legitimacy: 3 }, moods: { labor: 3, hardliners: -2 } },
        outcome: [
          {
            text: 'You close her hands back over the knot. By Sunday the whole row knows the story — the movement that wouldn’t take a widow’s last coin — and it recruits better than the coin ever could. Ilya notes you cannot buy rifles with a parable.',
          },
        ],
      },
    ],
  },
  {
    id: 'censored-obituary',
    trigger: { turn: { gte: 10, lte: 32 } },
    weight: 8,
    prose: [
      {
        text: 'Old Tomas, who taught half the cadre their letters, dies at his bench. The censor strikes the obituary’s last line — "he believed the world could be otherwise" — as incitement. The family asks if the line can live somewhere.',
      },
    ],
    choices: [
      {
        id: 'smuggle',
        label: 'Print the line on every wall',
        effect: { resources: { legitimacy: 4, heat: 4 }, moods: { students: 3, labor: 2 } },
        outcome: [
          {
            text: 'HE BELIEVED THE WORLD COULD BE OTHERWISE appears in whitewash on forty walls, unsigned, unkillable. The censor has made a dead typesetter into literature. The police spend a week scrubbing philosophy.',
          },
        ],
      },
      {
        id: 'let-pass',
        label: 'A line is not worth the heat',
        effect: { moods: { hardliners: -3, students: -2 } },
        outcome: [
          {
            text: 'Tomas is buried under the censored text. At the graveside, someone recites the missing line from memory anyway, because censors cannot edit a funeral. It would have cost so little to be the one who said it.',
          },
        ],
      },
    ],
  },
  {
    id: 'night-school',
    trigger: { turn: { gte: 6, lte: 30 }, resource: { materiel: { gte: 6 } } },
    weight: 10,
    prose: [
      {
        text: 'Mira proposes a night school in the loft: letters and arithmetic taught straight, no politics — "the politics," she says, "is that no one else will teach them." Goran offers benches. It needs only money and nerve.',
      },
    ],
    choices: [
      {
        id: 'run',
        label: 'Open the school',
        effect: {
          resources: { materiel: -4, sympathizers: -3, cadre: 2 },
          moods: { students: 4, labor: 2 },
        },
        outcome: [
          {
            text: 'Forty pupils by the second month. Reading produces questions; questions produce the steadiest cadre you have ever recruited — people who came for the alphabet and stayed for the answer.',
          },
        ],
      },
      {
        id: 'agitation-first',
        label: 'Schools after the revolution',
        effect: { moods: { students: -4, hardliners: 2 } },
        outcome: [
          {
            text: 'Mira teaches anyway, unfunded, three pupils in a stairwell with one candle. She stops mentioning it at meetings, which you eventually understand was the warning.',
          },
        ],
      },
    ],
  },
];
