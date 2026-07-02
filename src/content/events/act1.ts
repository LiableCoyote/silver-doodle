import type { EventCard } from '../../engine/events';

/**
 * Act I — the quiet build, February into April. Athenaeums, comedores,
 * the unglamorous logistics that decide everything later. Triggers favor
 * early turns and low heat; the spring's window is draining the whole
 * time. The state is the Republic's own — which makes every search by
 * the Brigada Social its own small lesson in where power actually sits.
 */
export const ACT1_EVENTS: EventCard[] = [
  {
    id: 'study-circle-question',
    trigger: { turn: { lte: 14 }, notFlags: ['crackdown'] },
    weight: 14,
    art: 'study-circle',
    prose: [
      {
        text: 'At the Tuesday night class in the athenaeum, a young weaver asks why the men who own the looms her grandmother died at now fly the Republic\'s colors from the mill gate. Twenty faces turn to the front of the room. What you answer becomes what they repeat.',
      },
    ],
    choices: [
      {
        id: 'doctrine',
        label: 'Teach the theory behind it',
        effect: { resources: { sympathizers: -3, cadre: 2 }, moods: { students: 3, labor: -1 } },
        outcome: [
          {
            text: 'Half the room drifts away over the following weeks. The half that stays starts asking better questions, and answering them for others. The JSU secretary calls it the best night\'s work of the winter.',
          },
        ],
      },
      {
        id: 'bread',
        label: 'Talk about bread, wages, rent',
        effect: { resources: { sympathizers: 6 }, moods: { labor: 3, students: -2 } },
        outcome: [
          {
            text: 'The room nods. They bring their cousins the next Tuesday, and the cousins bring grievances of their own. The UGT approves. The JSU secretary says you are building a crowd, not a movement, and crowds go home.',
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
        text: 'A bread queue on the calle de las Fundiciones collapses into a riot — a baker beaten, a window gone, a municipal wagon rocking on two wheels. Some of the fists belong to people who attend your athenaeum.',
      },
    ],
    choices: [
      {
        id: 'join',
        label: 'Put cadre in the crowd to steer it',
        effect: { resources: { sympathizers: 7, heat: 8 }, moods: { hardliners: 3, moderates: -4 } },
        outcome: [
          {
            text: 'Your people turn a riot into a march and the march goes home unbroken. The quarter remembers who kept order when the Asaltos only brought truncheons. So does the Brigada Social.',
          },
        ],
      },
      {
        id: 'restrain',
        label: 'Pull your people out',
        effect: { resources: { legitimacy: 3, heat: -2 }, moods: { hardliners: -3, moderates: 3 } },
        outcome: [
          {
            text: 'The riot burns out by evening, ugly and aimless. Your hands are clean. The faísta delegate asks, quietly, what exactly clean hands have ever lifted.',
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
        text: 'A print-shop foreman, dismissed for drink, offers his master\'s old flatbed press — disassembled, smuggleable, temperamental. "She jams on cheap paper," he says, patting a crate, "and so do I." The alliance\'s paper currently prints at the mercy of a jobber who votes CEDA.',
      },
    ],
    choices: [
      {
        id: 'buy',
        label: 'Buy the press',
        effect: { resources: { materiel: -8 }, setFlags: ['press'], moods: { students: 3 } },
        outcome: [
          {
            text: 'It takes four nights and a borrowed cart. By month\'s end the first sheets come off her, smudged and beautiful. The JSU names the press La Pasionaria, which the PCE members find moving and everyone else finds funny.',
          },
        ],
      },
      {
        id: 'pass',
        label: 'Too dear, too dangerous',
        effect: { resources: { legitimacy: -1 }, moods: { students: -3 } },
        outcome: [
          {
            text: 'The press goes to a commercial jobber who prints wedding invitations with it. The JSU keeps hand-copying leaflets and says nothing, in a way that says a great deal.',
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
        text: 'The new bookkeeper asks too many questions about names and addresses, and writes nothing down — a man who trusts his memory is a man reporting to someone. The Brigada Social pays for exactly this. The faísta delegate wants an answer tonight.',
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
            text: 'For a month the Brigada Social watches three tabernas where nothing happens and detains a mule dealer with an unfortunate beard. The faístas are delighted. The prietistas\' man asks what happens to the mule dealer. No one answers.',
          },
        ],
      },
      {
        id: 'ignore',
        label: 'You have no proof — let it lie',
        effect: { setFlags: ['informant-loose'], moods: { hardliners: -4 } },
        outcome: [
          {
            text: 'The bookkeeper keeps the ledgers immaculately. The faístas post a man to watch him and tell you only after the fact. Something in the meetings has gone careful.',
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
        text: 'The UGT secretary proposes comedores populares in the Arrabal — no speeches, no leaflets, just bread and a warm room. "Feed them twice," he says, "and the third time they ask why they\'re hungry."',
      },
    ],
    choices: [
      {
        id: 'fund',
        label: 'Fund the comedores',
        effect: {
          resources: { materiel: -6, sympathizers: 8 },
          setFlags: ['mutual-aid'],
          moods: { labor: 4, hardliners: -1 },
        },
        outcome: [
          {
            text: 'Two rooms, four kettles, a rotation of volunteers. Within a month the comedores know every family on three streets — who is sick, who is owed wages, who has a son doing his service in the Cuartel. The secretary was right about the third time.',
          },
        ],
      },
      {
        id: 'decline',
        label: 'The money is needed elsewhere',
        effect: { moods: { labor: -4, hardliners: 2 } },
        outcome: [
          {
            text: 'The secretary takes it without a word, which is worse than an argument. The Arrabal eats thin soup from the parish, and the parish tells them to offer it up.',
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
        text: 'A clerk from the Gobierno Civil — gray, precise, terrified — offers copies of the Brigada Social\'s watch lists. He wants nothing for it. That is either conscience or a trap, and they look identical at this distance.',
      },
    ],
    choices: [
      {
        id: 'accept',
        label: 'Accept the lists',
        effect: { resources: { heat: -8 }, setFlags: ['clerk-recruited'], moods: { moderates: -2, hardliners: 2 } },
        outcome: [
          {
            text: 'The lists are genuine. Three names you trusted are on the Brigada\'s payroll; two meeting rooms move that same night. The clerk keeps copying. You keep wondering what he is copying about you.',
          },
        ],
      },
      {
        id: 'decline',
        label: 'Send him away — too neat',
        effect: { moods: { moderates: 2, hardliners: -2 } },
        outcome: [
          {
            text: 'He leaves without protest, which troubles you for a week. The prietistas approve: "An alliance that takes every gift will eventually be handed a bomb."',
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
        text: 'The month\'s funds cover one thing: the UGT wants a strike reserve, céntimo by céntimo against the day the mills stop; the JSU wants ten thousand leaflets while the February anger is hot. Both are right. That is the problem.',
      },
    ],
    choices: [
      {
        id: 'fund-reserve',
        label: 'Build the strike reserve',
        effect: { resources: { materiel: 5 }, moods: { labor: 4, students: -3 } },
        outcome: [
          {
            text: 'The reserve grows in a strongbox under the Casa del Pueblo\'s floor. It does nothing, loudly, every day — until the day it will do everything.',
          },
        ],
      },
      {
        id: 'fund-pamphlets',
        label: 'Print while the anger is hot',
        effect: { resources: { legitimacy: 4 }, moods: { students: 4, labor: -3 } },
        outcome: [
          {
            text: 'Ten thousand sheets go out under doors and into lunch pails. For a week the whole quarter argues about the same three sentences. The UGT secretary counts the empty strongbox twice, as if counting might fill it.',
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
        text: 'The year\'s quinta is posted overnight: the call-up lists, the medical boards, the exemptions for sons of widows quietly narrowed. Mothers stand reading the posted sheets with their lips moving. The army that drills behind the Cuartel wall is made one list at a time.',
      },
    ],
    choices: [
      {
        id: 'agitate',
        label: 'Hang your answer beside every notice',
        effect: { resources: { legitimacy: 5, heat: 6 }, moods: { students: 3, moderates: -2 } },
        outcome: [
          {
            text: 'By morning every call-up sheet in three districts has a twin: WHOSE ARMY? WHOSE SONS? The Asaltos tear them down by noon, which only confirms the question.',
          },
        ],
      },
      {
        id: 'hide-sons',
        label: 'Help the families of the called-up',
        effect: { resources: { sympathizers: 7, materiel: -4 }, moods: { labor: 3, hardliners: -2 } },
        outcome: [
          {
            text: 'Allowances for the households that lose a wage, letters written for the ones who cannot write, a lawyer for the appeal cases. Nothing printed, nothing said — but the families know, and a debt like that outlasts any leaflet. Their sons take it into the Cuartel with them.',
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
        text: 'An old professor of law from the university — a Republican of the 1931 vintage, famous in a faded way — offers to lecture for the alliance: "On the Right of Resistance in the Constitution of the Republic." Half the city\'s respectable discontents would come.',
      },
    ],
    choices: [
      {
        id: 'host',
        label: 'Host the lecture',
        effect: { resources: { legitimacy: 5, heat: 4 }, moods: { moderates: 4, hardliners: -3 } },
        outcome: [
          {
            text: 'Two hundred coats too good for the athenaeum hear an old man prove, from the Republic\'s own text, when disobedience becomes duty. The prietistas collect four names from the audience worth more than a hundred leaflets. The faísta delegate waits outside, watching the Asaltos watch the door.',
          },
        ],
      },
      {
        id: 'decline',
        label: 'Lectures win nothing',
        effect: { moods: { hardliners: 2, moderates: -3 } },
        outcome: [
          {
            text: 'The professor lectures anyway, in a smaller room, to fewer coats. The prietistas attend in a private capacity and do not report what was said, which is a kind of report.',
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
        text: 'A forger — an artist, by her samples — offers cédulas, work books, travel documents. Cash price, or she\'ll work for the cause if the cause is going somewhere.',
      },
    ],
    choices: [
      {
        id: 'buy',
        label: 'Buy a batch outright',
        effect: { resources: { materiel: -5, heat: -6 } },
        outcome: [
          {
            text: 'Clean papers for the six most-watched militants. The city swallows them whole; the Brigada Social\'s files now describe six people who no longer exist.',
          },
        ],
      },
      {
        id: 'recruit',
        label: 'Recruit her into the movement',
        effect: { resources: { cadre: 1, heat: 2 }, moods: { hardliners: 2 } },
        outcome: [
          {
            text: 'She joins for the workmanship, she says — forging for money was getting dull. Her first project is a complete duplicate of the civil governor\'s signature, "for emergencies."',
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
        text: 'Word from the vega: the winter sowing has failed on the dry lands, worse than the gazettes admit. If true, bread doubles by the summer. If false and you shout it, you\'re the liar who cried famine.',
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
            text: 'Coming from the alliance, it is believed before it is checked. The grain dealers start hoarding on the rumor alone, which makes the rumor true. You have learned something about your own weight in this city, and it should frighten you a little.',
          },
          {
            text: 'The rumor races ahead of the proof. When the official figures land somewhere in between, the right\'s papers spend a happy week on the anatomy of your exaggeration.',
          },
        ],
      },
      {
        id: 'verify',
        label: 'Send someone to count the wagons first',
        effect: { resources: { legitimacy: 3 }, moods: { moderates: 2, hardliners: -1 } },
        outcome: [
          {
            text: 'Two weeks later the alliance publishes freight manifests, not adjectives: a third of last year\'s grain through the market gates. It lands quieter than a rumor and lasts longer. Even the merchants\' gazette reprints your table, with an attribution it instantly regrets.',
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
        text: 'A desk sergeant of the municipal police will sell warnings — a knock on a window the night before a search. He names a monthly figure with the boredom of a man quoting grain prices.',
      },
    ],
    choices: [
      {
        id: 'pay',
        label: 'Put him on the payroll',
        effect: { resources: { materiel: -7, heat: -7 }, moods: { moderates: -2, hardliners: -2 } },
        outcome: [
          {
            text: 'The knocks come, and they are accurate. Everyone is faintly ashamed of how well it works — the workers\' alliance, renting its safety from the apparatus it means to outlive.',
          },
        ],
      },
      {
        id: 'refuse',
        label: 'A bought man stays bought by the highest bidder',
        effect: { moods: { hardliners: 3, moderates: 1 } },
        outcome: [
          {
            text: 'You decline politely enough that he doesn\'t take offense. Within the season he is selling the same service to the contrabandistas of the port, who reportedly pay better and complain less about ethics.',
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
        text: 'The back room above the cooperage is no longer safe — the cooper\'s new apprentice has a brother in the Asaltos. The committee needs somewhere with two exits and a landlord who doesn\'t ask.',
      },
    ],
    choices: [
      {
        id: 'buy',
        label: 'Rent a proper safe floor',
        effect: { resources: { materiel: -6 }, setFlags: ['safehouse'] },
        outcome: [
          {
            text: 'A printer\'s widow lets you the floor above her shop off the plaza and asks no questions, having already answered them for herself in October of \'34. Two exits, a view of both corners, and the smell of ink as camouflage.',
          },
        ],
      },
      {
        id: 'borrow',
        label: 'Rotate through sympathizers\' parlors',
        effect: { resources: { sympathizers: -4 }, setFlags: ['safehouse'], moods: { moderates: -1 } },
        outcome: [
          {
            text: 'It costs nothing and it costs plenty: every parlor you borrow becomes a household that lies awake after you leave. Two families quietly stop attending the athenaeum. The geography works, for now.',
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
        text: 'A dissident Marxist circle — four theorists and a duplicating machine — publishes a pamphlet denouncing the alliance as reformists, adventurists, and (this stings) "provincial." Their footnotes are excellent.',
      },
    ],
    choices: [
      {
        id: 'rebut',
        label: 'Answer in print',
        effect: { resources: { legitimacy: 2, heat: 2 }, moods: { students: 3, labor: -2 } },
        outcome: [
          {
            text: 'Your reply is sharper than their attack and the university quarter keeps score. The UGT secretary reads both pamphlets and asks how many loaves of bread either one bakes.',
          },
        ],
      },
      {
        id: 'absorb',
        label: 'Invite them in — better inside than sniping',
        effect: { resources: { sympathizers: 4 }, moods: { students: 2, hardliners: -3, moderates: -2 } },
        outcome: [
          {
            text: 'Three of the four join, bringing the duplicating machine as dowry. They immediately open a debate on the alliance\'s theses. The faísta delegate proposes settling it in the yard. The debate adjourns.',
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
        text: 'The grain dockers send two men by night: they mean to stop the port over a drowned comrade and docked wages, with the alliance or without it. They are early — months early — and they know it, and they don\'t care. The port section was never famous for waiting.',
      },
    ],
    choices: [
      {
        id: 'support',
        label: 'Stand with them now',
        effect: { resources: { sympathizers: 5, heat: 8, materiel: -3 }, moods: { labor: 5, moderates: -3 } },
        outcome: [
          {
            text: 'Three days, the harbor still, the city eating its reserves. They win the wages and lose the ringleader, dismissed and blacklisted the length of the coast. The docks remember both halves of that sentence.',
          },
        ],
      },
      {
        id: 'patience',
        label: 'Counsel patience — the hour is wrong',
        effect: { moods: { labor: -4, moderates: 3, hardliners: -2 } },
        outcome: [
          {
            text: 'They strike anyway, smaller and angrier, and are broken in a day. The drowned man\'s widow returns your condolence letter unopened. The UGT secretary delivers it back to you personally, so you can see his face while you hold it.',
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
        text: 'A mill widow — three sons in the works, a husband in the ground since the boiler accident of \'29 — brings the committee her burial savings in a knotted cloth. "For the spring," she says. It is everything she has against her own funeral.',
      },
    ],
    choices: [
      {
        id: 'accept',
        label: 'Accept it — the cause needs it',
        effect: { resources: { materiel: 8 }, moods: { labor: 2, moderates: -2 } },
        outcome: [
          {
            text: 'You take the cloth. It weighs nothing and it weighs more than the strike fund. The UGT secretary enters it in the ledger under her full name, in his best hand, and dares anyone to spend it badly.',
          },
        ],
      },
      {
        id: 'refuse',
        label: 'Refuse — take her name, not her grave money',
        effect: { resources: { legitimacy: 3 }, moods: { labor: 3, hardliners: -2 } },
        outcome: [
          {
            text: 'You close her hands back over the knot. By Sunday the whole row knows the story — the alliance that wouldn\'t take a widow\'s last céntimo — and it recruits better than the coin ever could. The faísta delegate notes you cannot buy pistols with a parable.',
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
        text: 'Old Anselmo, who taught half the militants their letters, dies at his bench. The censor of the state of alarm strikes the obituary\'s last line — "he believed the world could be otherwise" — as tendentious. The family asks if the line can live somewhere.',
      },
    ],
    choices: [
      {
        id: 'smuggle',
        label: 'Print the line on every wall',
        effect: { resources: { legitimacy: 4, heat: 4 }, moods: { students: 3, labor: 2 } },
        outcome: [
          {
            text: 'HE BELIEVED THE WORLD COULD BE OTHERWISE appears in whitewash on forty walls, unsigned, unkillable. The censor has made a dead typesetter into literature. The Asaltos spend a week scrubbing philosophy.',
          },
        ],
      },
      {
        id: 'let-pass',
        label: 'A line is not worth the heat',
        effect: { moods: { hardliners: -3, students: -2 } },
        outcome: [
          {
            text: 'Anselmo is buried under the censored text. At the graveside, someone recites the missing line from memory anyway, because censors cannot edit a funeral. It would have cost so little to be the one who said it.',
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
        text: 'The JSU proposes a night school in the athenaeum loft: letters and arithmetic taught straight, no politics — "the politics," the section secretary says, "is that no one else will teach them." The UGT offers benches. It needs only money and nerve.',
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
            text: 'Forty pupils by the second month. Reading produces questions; questions produce the steadiest militants the alliance has ever recruited — people who came for the alphabet and stayed for the answer.',
          },
        ],
      },
      {
        id: 'agitation-first',
        label: 'Schools after the summer',
        effect: { moods: { students: -4, hardliners: 2 } },
        outcome: [
          {
            text: 'The JSU teaches anyway, unfunded, three pupils in a stairwell with one candle. The section stops mentioning it at meetings, which you eventually understand was the warning.',
          },
        ],
      },
    ],
  },
];
