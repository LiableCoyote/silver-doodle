import type { EventCard } from '../../engine/events';

/**
 * The scheduled timeline: history arrives on its real dates whether
 * Vallarga is ready or not. Turn 0 = 19 February 1936; the rising
 * resolves at turn 43 (19 July) in the engine. National events reach
 * the city by wire and by train; the prose keeps the documentary tone.
 * One card per scheduledTurn (validator-enforced).
 */
export const TIMELINE_EVENTS: EventCard[] = [
  {
    id: 'amnesty-jails',
    scheduledTurn: 1,
    trigger: {},
    weight: 1,
    art: 'garrison-gate',
    prose: [
      {
        text: 'The amnesty decree is signed in Madrid on the 21st, but Vallarga does not wait for the gazette: by evening there are four thousand people outside the provincial prison with the text of the decree read aloud through a funnel of rolled newspaper. Inside are men of October 1934. The warden has the decree, the crowd, and no instructions.',
      },
    ],
    choices: [
      {
        id: 'open-tonight',
        label: 'Open the gates tonight — the crowd is the instruction',
        effect: {
          resources: { sympathizers: 6, legitimacy: 4, heat: 8 },
          moods: { hardliners: 5, students: 4, moderates: -4 },
        },
        outcome: [
          {
            text: 'The warden, reading the arithmetic of four thousand to forty, opens the gates at midnight and the prisoners come out into torchlight, thin and blinking, carried the last hundred meters. It is the best night the movement has had in two years. In the Gobierno Civil, someone files a report about who exactly organized the torches.',
          },
        ],
      },
      {
        id: 'wait-decree',
        label: 'Keep the vigil peaceful — let the decree do it',
        effect: {
          resources: { legitimacy: 5 },
          moods: { moderates: 4, hardliners: -4 },
        },
        outcome: [
          {
            text: 'The crowd holds all night, singing, disciplined to the point of eeriness, and the gates open at nine in the morning by proper order. Prieto\'s papers call it proof the working class can govern itself. The faístas call it proof the working class will queue for anything.',
          },
        ],
      },
    ],
  },
  {
    id: 'asturias-returned',
    scheduledTurn: 3,
    trigger: {},
    weight: 1,
    prose: [
      {
        text: 'The trains from the north bring back Vallarga\'s share of October 1934: eleven men and one woman, older by more than the sixteen months they served. They know things the movement\'s pamphlets do not — how a commune is fed, how a barricade fails, which promises the state keeps. They report to the committee like soldiers reporting from a war the rest of the city has only read about.',
      },
    ],
    choices: [
      {
        id: 'into-the-cadre',
        label: 'Put them at the center of the organization',
        effect: {
          resources: { cadre: 3 },
          moods: { hardliners: 4, labor: 2, moderates: -2 },
        },
        outcome: [
          {
            text: 'They take over training, comms, the quiet work. Everything tightens by a turn of the screw. The woman — a schoolteacher, before — rebuilds the courier net in nine days and asks why it was ever otherwise. October sits in the room now at every meeting, and it votes.',
          },
        ],
      },
      {
        id: 'rest-first',
        label: 'Give them their lives back first',
        effect: {
          resources: { sympathizers: 4, legitimacy: 2 },
          moods: { moderates: 2, hardliners: -3 },
        },
        outcome: [
          {
            text: 'Jobs are found, rents paid, families reassembled. Some drift back to the committee on their own; some do not, and no one blames them. Durruti\'s people mutter that the state returns prisoners the way it returns confiscated tools — blunted.',
          },
        ],
      },
    ],
  },
  {
    id: 'falange-banned',
    scheduledTurn: 6,
    trigger: {},
    weight: 1,
    prose: [
      {
        text: 'After the shooting of Professor Jiménez de Asúa in Madrid — the law student who fired was a Falangist; the escort who died was a policeman — the government outlaws the Falange and arrests its leadership. In Vallarga the pistol squads do not dissolve; they go indoors. Two of your newspaper sellers have already been beaten this month. The question on the committee table is what to do about the men who did it, now that the state claims the matter is handled.',
      },
    ],
    choices: [
      {
        id: 'defense-squads',
        label: 'Escort our own — organized defense, no reprisals',
        effect: {
          resources: { cadre: -1, heat: 4 },
          moods: { hardliners: 3, moderates: 1, students: 2 },
        },
        outcome: [
          {
            text: 'Sellers go out in threes now, with escorts who know the alleys. The beatings stop, mostly, and where they don\'t, they cost the other side something. It is the narrowest possible reading of self-defense, and even Prieto\'s people cannot argue with it out loud.',
          },
        ],
      },
      {
        id: 'name-them',
        label: 'Publish the squads\' names and let the law choke on them',
        effect: {
          resources: { legitimacy: 4, heat: 3 },
          moods: { moderates: 3, hardliners: -3 },
        },
        outcome: [
          {
            text: 'The list runs with addresses and employers: the notary\'s son, the estate agent, the two brothers from the garage. Half the city already knew; the other half now cannot claim not to. Three of the named leave for their families\' villages. The courts open one file and lose it twice.',
          },
        ],
      },
      {
        id: 'answer-in-kind',
        label: 'Let the Juventudes answer in kind',
        effect: {
          resources: { heat: 9, legitimacy: -4 },
          moods: { students: 4, hardliners: 3, moderates: -6 },
        },
        outcome: [
          {
            text: 'For three weeks it is pistols answering pistols in the dark, and the city stops distinguishing who started which night. Two of theirs in the hospital; one of yours in the cemetery. The arithmetic of reprisal never balances — it only compounds, and somewhere in a garrison mess, officers read the crime pages and nod to each other.',
          },
        ],
      },
    ],
  },
  {
    id: 'yunteros-news',
    scheduledTurn: 10,
    trigger: {},
    weight: 1,
    prose: [
      {
        text: '25 March: in Extremadura, sixty thousand yunteros walk onto the great estates at dawn with their plough teams and simply begin the spring ploughing — the land reform the Cortes debated for five years, performed in one morning. The news reaches Vallarga\'s day-laborers in the vega by noon, and by evening the question in every venta outside the walls is why here should be different.',
      },
    ],
    choices: [
      {
        id: 'organize-vega',
        label: 'Send organizers to the vega — the countryside is asking',
        effect: {
          resources: { sympathizers: 8, cadre: -1, heat: 5, grievance: 4 },
          moods: { labor: 3, hardliners: 3, moderates: -3 },
        },
        outcome: [
          {
            text: 'Two organizers on bicycles, then six, then a federation of field syndicates that did not exist last month. The estates around Vallarga start selling cattle they cannot guard. The city\'s movement grows a hinterland — and a longer border with the Guardia Civil, whose casa-cuartels were built precisely for this.',
          },
        ],
      },
      {
        id: 'city-first',
        label: 'The city is the fight — do not stretch the cadre',
        effect: {
          resources: { grievance: 3 },
          moods: { labor: -2, moderates: 2 },
        },
        outcome: [
          {
            text: 'The vega organizes itself anyway, rawer and angrier for the lack of you. Its delegations come to the Casa del Pueblo asking for the alliance\'s name to use, and take the answer they get back down dusty roads. Some doors close politely and permanently.',
          },
        ],
      },
    ],
  },
  {
    id: 'jsu-rally',
    scheduledTurn: 13,
    trigger: {},
    weight: 1,
    prose: [
      {
        text: 'The unified youth — socialist and communist young people under one card now, the JSU — fill the Teatro Goya past the fire regulations to hear Santiago Carrillo, twenty-one years old and speaking like a man who has already read tomorrow\'s minutes. The unification is three months old and already the best-organized thing in the city. The question is whose discipline it answers to.',
      },
    ],
    choices: [
      {
        id: 'embrace-jsu',
        label: 'Give the JSU real work and real seats',
        effect: {
          resources: { cadre: 2, sympathizers: 3 },
          moods: { students: 6, hardliners: -2, moderates: -1 },
        },
        outcome: [
          {
            text: 'They take the courier net, the sports clubs, the neighborhood pickets, and run them with a competence that embarrasses their elders. Carrillo wires his congratulations. Durruti\'s people note, accurately, that the youth now march in step — and ask, less politely, to whose drum.',
          },
        ],
      },
      {
        id: 'keep-distance-jsu',
        label: 'Cooperation, not incorporation',
        effect: {
          moods: { students: -4, hardliners: 2 },
        },
        outcome: [
          {
            text: 'The JSU takes the courtesy and builds its own parallel everything. Within a month it is the second-largest organization in the city and attends your meetings as a guest. The young do not wait — it is the one thing they can be relied on for.',
          },
        ],
      },
    ],
  },
  {
    id: 'alcala-deposed',
    scheduledTurn: 14,
    trigger: {},
    weight: 1,
    prose: [
      {
        text: '7 April: the Cortes deposes the President of the Republic himself — Alcalá-Zamora, the conservative Catholic who called the elections and lost by them, removed by the winners on a lawyer\'s technicality. The right calls it a coup by parliament. The left calls it housekeeping. In the officers\' casinos they call it proof that no institution is furniture anymore, and order another round.',
      },
    ],
    choices: [
      {
        id: 'celebrate-deposition',
        label: 'Mark it publicly — the old obstacles are falling',
        effect: {
          resources: { legitimacy: 3, heat: 4 },
          moods: { students: 3, hardliners: 2, moderates: -3 },
        },
        outcome: [
          {
            text: 'A torchlight column to the Gobierno Civil, festive and enormous. It reads as strength in the Arrabal and as appetite in the officers\' mess — the same photograph, two captions. Prieto\'s telegram is one line: "Do not dance on institutions we may shortly need."',
          },
        ],
      },
      {
        id: 'sober-silence',
        label: 'Say nothing — institutions are not the enemy this month',
        effect: {
          moods: { moderates: 3, hardliners: -3 },
        },
        outcome: [
          {
            text: 'The committee\'s statement is four sentences of constitutional propriety, drafted by a man Prieto would hire. It reassures nobody who matters and irritates everybody who doesn\'t. But it is on the record, and records are what the morning after is made of.',
          },
        ],
      },
    ],
  },
  {
    id: 'april-funerals',
    scheduledTurn: 16,
    trigger: {},
    weight: 1,
    art: 'funeral',
    prose: [
      {
        text: 'Madrid, mid-April: a bomb at the Republic\'s anniversary parade, a Guardia Civil officer dead, and at his funeral the cortège turns into a battle — Falangists firing, Asaltos charging, more dead, among them a young lieutenant of the Guardia Civil shot in confusion no inquest will ever unwind. The wire brings it to Vallarga in fragments. Every barracks in Spain reads the same fragments, and reads them as: it has begun.',
      },
    ],
    choices: [
      {
        id: 'condemn-all',
        label: 'Condemn the violence, all of it, by name',
        effect: {
          resources: { legitimacy: 5 },
          moods: { moderates: 4, hardliners: -4 },
        },
        outcome: [
          {
            text: 'The statement names the bomb and the pistols with the same sentence, mourns the lieutenant with the parade\'s dead. It costs you nothing and buys you the thing hardest to buy: readers who do not already agree. In the cellars, the faístas ask when mourning policemen became the movement\'s work.',
          },
        ],
      },
      {
        id: 'read-the-lesson',
        label: 'Read the lesson aloud: the street is being contested',
        effect: {
          resources: { heat: 4 },
          moods: { hardliners: 4, students: 2, moderates: -3 },
        },
        outcome: [
          {
            text: 'The committee\'s circular is blunt: what happened at that funeral is a rehearsal, and rehearsals mean a performance is scheduled. Drills tighten. Watch rotas double. It is the correct reading and it sounds, to the men doing the watching from the casa-cuartel, exactly like preparation.',
          },
        ],
      },
    ],
  },
  {
    id: 'may-day',
    scheduledTurn: 20,
    trigger: {},
    weight: 1,
    art: 'strike-call',
    prose: [
      {
        when: { resource: { sympathizers: { gte: 55 } } },
        text: 'The First of May, and Vallarga empties into the streets: the mills dark, the port still, the vega walking in by the eastern road with their plough teams garlanded. The columns take ninety minutes to pass the Gobierno Civil. Nobody alive has seen the city do this. The question the committee must answer by nightfall is what the demonstration is FOR — a festival of what exists, or a promise of what is coming.',
      },
      {
        text: 'The First of May. The columns are respectable — the mills mostly out, the port half — but the city has seen bigger, and says so. What the day lacks in numbers it must find in discipline or in daring; the committee chooses which.',
      },
    ],
    choices: [
      {
        id: 'festival-strength',
        label: 'A festival of discipline — count everyone, break nothing',
        effect: {
          resources: { legitimacy: 6, sympathizers: 4, heat: 4 },
          moods: { moderates: 3, labor: 3, hardliners: -3 },
        },
        outcome: [
          {
            text: 'Not a window broken, not a slogan off-script, stewards with armbands at every corner — a demonstration that demonstrates, above all, that this movement can already administer a city. The conscripts watching from the Cuartel roof see a hundred thousand people being calm on purpose. That lands harder than any chant.',
          },
        ],
      },
      {
        id: 'promise-coming',
        label: 'A promise of what is coming — let it thunder',
        effect: {
          resources: { legitimacy: 3, sympathizers: 6, heat: 9, grievance: 3 },
          moods: { hardliners: 5, students: 4, moderates: -5 },
        },
        outcome: [
          {
            text: 'The chants name the generals, the banners name the estates, and the closing speeches promise the land and the mills to the people who work them, on a schedule not specified. The city is electric for a week. The Gobierno Civil\'s evening report to Madrid uses the word "pre-revolutionary," and for once the report is accurate.',
          },
        ],
      },
    ],
  },
  {
    id: 'azana-president',
    scheduledTurn: 23,
    trigger: {},
    weight: 1,
    prose: [
      {
        text: '10 May: Azaña ascends to the Presidency of the Republic, and the government passes to Casares Quiroga — Azaña\'s man, thin, tubercular, certain. The prime minister the Republic gets for the summer of the conspiracy is one who declares himself "belligerent" against the right and then governs as if declaring it were the work. Prieto, who might have had the government himself, is kept from it by his own party\'s left. The committee reads the appointments the way sailors read a sky.',
      },
    ],
    choices: [
      {
        id: 'press-the-government',
        label: 'Press Casares now — arms, purges of the officer corps, in writing',
        effect: {
          resources: { legitimacy: 2, heat: 4 },
          moods: { hardliners: 4, moderates: -2 },
        },
        outcome: [
          {
            text: 'The committee\'s memorandum goes to the civil governor for forwarding: the garrison\'s plotters named, the request for workers\' defense formalized. The reply, weeks later, is a acknowledgment of receipt. Casares is belligerent the way a locked door is belligerent. But the memorandum exists now, dated, and dates will matter.',
          },
        ],
      },
      {
        id: 'work-around-it',
        label: 'Stop asking the state — prepare as if no one is coming',
        effect: {
          resources: { materiel: -3, cadre: 1 },
          moods: { hardliners: 3, students: 2, moderates: -4 },
        },
        outcome: [
          {
            text: 'Quietly, the committee reallocates: watch rotas, courier drills, an inventory of what the movement could put its hands on in an hour if the telephone exchange went silent. Prieto\'s people call it defeatism about the Republic. The people doing it call it arithmetic about the Republic.',
          },
        ],
      },
    ],
  },
  {
    id: 'mola-circulars',
    scheduledTurn: 28,
    trigger: {},
    weight: 1,
    art: 'barracks-letter',
    prose: [
      {
        text: 'From a friendly lieutenant — UMRA, one of the officers who stayed republican when the casinos turned — comes a carbon copy of a carbon copy: instructions circulating among garrison commanders, unsigned but written in the dry staff prose of the general in Pamplona. Timing, objectives, the treatment of resistance. It reads like a mobilization order because it is one. The lieutenant\'s covering note says only: "It is further along than they believe in Madrid."',
      },
    ],
    choices: [
      {
        id: 'publish-circular',
        label: 'Publish it — burn the conspiracy with daylight',
        effect: {
          resources: { legitimacy: 4, heat: 6 },
          moods: { hardliners: 3, moderates: 2 },
        },
        outcome: [
          {
            text: 'The text runs in the movement\'s press under DOCUMENTS OF THE CONSPIRACY. Madrid\'s papers pick it up for a day; the government calls it exaggerated; the general in Pamplona changes his couriers. What publication buys is not prevention — it is that afterward, no one will be able to say the city wasn\'t told.',
          },
        ],
      },
      {
        id: 'quiet-preparation',
        label: 'Keep it close — protect the lieutenant, prepare in the dark',
        effect: {
          resources: { cadre: 1, heat: -3 },
          moods: { hardliners: 2, moderates: 1 },
        },
        outcome: [
          {
            text: 'The circular goes into the committee\'s safest drawer and its contents into planning: which bridges, which hours, which units move first. The lieutenant keeps his commission and his usefulness. The city keeps its ignorance, which is also a kind of ammunition — for someone.',
          },
        ],
      },
    ],
  },
  {
    id: 'construction-strike',
    scheduledTurn: 30,
    trigger: {},
    weight: 1,
    art: 'picket-line',
    prose: [
      {
        text: '1 June: in Madrid, seventy thousand building workers walk out — CNT and UGT together, for once, at the start. By mid-month the UGT wants to take the arbitration award and go back; the CNT wants to stay out until the whole demand is met, and the two unions\' pickets face each other outside the same sites. The quarrel arrives in Vallarga wearing local clothes: your own building trades ask the alliance which union\'s line the city follows.',
      },
    ],
    choices: [
      {
        id: 'back-arbitration',
        label: 'Take the award — bank it, back to work together',
        effect: {
          resources: { legitimacy: 3, heat: -3 },
          moods: { labor: 5, moderates: 3, hardliners: -6, students: -2 },
        },
        outcome: [
          {
            text: 'The award is real money — the forty-hour week, the wage floor — and Largo Caballero\'s wire is triumphant about it. The building trades bank it. The faístas do not forgive it: to them the arbitration board is the cage demonstrating that the cage works. The alliance holds, with a new crack under the paint.',
          },
        ],
      },
      {
        id: 'stay-out',
        label: 'Stay out with the CNT line — all of it or none',
        effect: {
          resources: { heat: 5, materiel: -4, grievance: 3 },
          moods: { hardliners: 5, labor: -5, moderates: -3 },
        },
        outcome: [
          {
            text: 'The sites stay dead through June. Solidarity levies drain the strike fund; the UGT locals pay them with a coldness you can feel through the envelope. What the line buys is the CNT\'s trust and the summer\'s momentum. What it costs is written in the Casa del Pueblo\'s ledger, in Largo\'s own hand.',
          },
        ],
      },
    ],
  },
  {
    id: 'cortes-dead',
    scheduledTurn: 34,
    trigger: {},
    weight: 1,
    prose: [
      {
        text: '16 June, the Cortes: Gil-Robles reads into the record his catalogue of the spring — the churches burned, the strikes, the dead of both sides counted like debts — and Calvo Sotelo goes further, offering himself for whatever comes: "Better a bloody Spain than a broken Spain," say the papers that love him. La Pasionaria answers for the left. The session is a duel with the country as the pistol. In Vallarga the committee must decide what the city\'s answer to the catalogue is.',
      },
    ],
    choices: [
      {
        id: 'answer-with-order',
        label: 'Answer with order: a week without incidents, on purpose',
        effect: {
          resources: { legitimacy: 5, heat: -4 },
          moods: { moderates: 4, hardliners: -4 },
        },
        outcome: [
          {
            text: 'The word goes out through every syndicate and athenaeum: nothing this week — no pickets that can become photographs, no night work of any kind. The catalogue\'s local chapter comes up empty. It is the most eloquent thing the movement has ever not done, and the hardest to ask twice.',
          },
        ],
      },
      {
        id: 'answer-with-numbers',
        label: 'Answer with numbers: the syndicates publish their rolls',
        effect: {
          resources: { legitimacy: 3, sympathizers: 4, heat: 4 },
          moods: { labor: 3, students: 2 },
        },
        outcome: [
          {
            text: 'Against the catalogue of the dead, the movement publishes a census of the living: membership rolls, comedor meals served, apprentices taught their letters. "This is what they call the collapse of Spain." It persuades the persuadable. The other kind were never reading for persuasion.',
          },
        ],
      },
    ],
  },
  {
    id: 'castillo-murdered',
    scheduledTurn: 41,
    trigger: {},
    weight: 1,
    prose: [
      {
        text: '12 July, Madrid: Lieutenant José Castillo of the Guardia de Asalto — a leftist officer, an instructor of the socialist youth, already once a survivor — is shot dead at his door on his way to evening duty. Four pistols, no arrests. In every Asalto barracks in Spain, his comrades stand watch over the wire reports in a silence that is not grief alone. Something is being decided in that silence, and it is not being decided calmly.',
      },
    ],
    choices: [
      {
        id: 'mourn-castillo',
        label: 'The movement mourns him as its own',
        effect: {
          resources: { legitimacy: 3, heat: 3 },
          moods: { moderates: 2, students: 3 },
        },
        outcome: [
          {
            text: 'Black crepe on the Casa del Pueblo, a delegation to the Asaltos\' prefecture with a wreath and no speeches. The gesture is noted — by the men it honors, and by the men counting which uniforms the movement mourns. Both notations will matter inside a week.',
          },
        ],
      },
      {
        id: 'brace',
        label: 'Mourn briefly and brace — this is the fuse, not the charge',
        effect: {
          resources: { cadre: 1, heat: 2 },
          moods: { hardliners: 3, moderates: -2 },
        },
        outcome: [
          {
            text: 'The committee\'s reading is cold and correct: a murdered police lieutenant will be answered, the answer will be answered in turn, and the spiral has perhaps six days of slack in it. Watch rotas go to war footing. Sleep is reorganized. Nobody says the word that everyone is preparing for.',
          },
        ],
      },
    ],
  },
  {
    id: 'sotelo-killed',
    scheduledTurn: 42,
    trigger: {},
    weight: 1,
    prose: [
      {
        text: 'Before dawn on the 13th, men in Asalto uniform take José Calvo Sotelo from his flat in an official car; his body is found that morning at the Almudena cemetery gate, shot twice. The monarchist leader of the parliamentary right, killed by comrades of the murdered Castillo, in the state\'s own livery. There is no version of this the Republic survives intact. His funeral becomes a review of the counter-revolution; in the officers\' messes the last hesitaters stop hesitating. Whatever date the conspiracy carried, it is now.',
      },
    ],
    choices: [
      {
        id: 'condemn-fully',
        label: 'Condemn the murder without reservation',
        effect: {
          setFlags: ['sotelo'],
          resources: { legitimacy: 3 },
          moods: { moderates: 3, hardliners: -3 },
        },
        outcome: [
          {
            text: 'The committee\'s statement calls the killing what it is — an assassination in uniform, an injury to the Republic deeper than its intended victim. It is honest, it is right, and it changes nothing in the barracks arithmetic: the officers closed ranks the moment the body was identified. You have perhaps five days.',
          },
        ],
      },
      {
        id: 'no-tears',
        label: 'No tears for Calvo Sotelo — prepare for what his friends do next',
        effect: {
          setFlags: ['sotelo'],
          resources: { heat: 3 },
          moods: { hardliners: 3, students: 2, moderates: -4 },
        },
        outcome: [
          {
            text: 'The movement\'s papers print the news without mourning and the analysis without illusion: the man proposed himself for a rising, and the rising will now be held in his name. The committee moves to a footing it does not announce. In the casa-cuartel, the tricorns are very quiet, which the old hands say is the worst sign there is.',
          },
        ],
      },
    ],
  },
];
