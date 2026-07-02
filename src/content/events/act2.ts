import type { EventCard } from '../../engine/events';

/**
 * Act II — going loud, April into June. The local general strike, the
 * streets, the tendencies' ultimatums. The picket massacre is the
 * flagship dial card: the same dead read as martyrs or as disorder
 * depending on accumulated standing. Casas Viejas is in every memory
 * on both sides of the question.
 */
export const ACT2_EVENTS: EventCard[] = [
  {
    id: 'call-general-strike',
    trigger: {
      turn: { gte: 12 },
      resource: { sympathizers: { gte: 40 } },
      notFlags: ['strike-called', 'crackdown'],
    },
    weight: 30,
    art: 'strike-call',
    prose: [
      {
        when: { resource: { legitimacy: { gte: 55 } } },
        text: 'The mills are ready. The comedores are stocked. When the syndicates canvass the shop floors the question has changed from whether to when — they are waiting on one word, and the word is the committee\'s.',
      },
      {
        text: 'The UGT secretary lays the shop-floor counts on the table. The numbers are there, barely. The conviction is thinner. A general strike called now would be obeyed — once. There will not be a second once before July.',
      },
    ],
    choices: [
      {
        id: 'call-it',
        label: 'Call the general strike',
        effect: {
          resources: { sympathizers: 8, legitimacy: 6, heat: 15 },
          setFlags: ['strike-called'],
          moods: { labor: 4, students: 3, moderates: -4 },
        },
        outcome: [
          {
            text: 'At six in the morning the mill whistles blow over empty yards. By noon the trams stop mid-route and the silence has a texture, like held breath. The Gobierno Civil\'s first response is to pretend not to notice. Its second will not be.',
          },
        ],
      },
      {
        id: 'not-yet',
        label: 'Not yet — the reserve is too thin',
        effect: { moods: { hardliners: -4, labor: -3, moderates: 3 } },
        outcome: [
          {
            text: 'You send the syndicates back with instructions to wait. Most understand. The foundry delegation leaves without shaking hands, and the faísta delegate watches them go like a man memorizing a lesson.',
          },
        ],
      },
    ],
  },
  {
    id: 'picket-massacre',
    trigger: { flags: ['strike-called'], resource: { heat: { gte: 55 } }, notFlags: ['crackdown'] },
    weight: 100,
    art: 'picket-line',
    prose: [
      {
        when: { resource: { legitimacy: { gte: 60 } } },
        text: 'The Guardia Civil fires on the picket at the Fábrica del Norte: eleven dead, among them a boy who carried water and a weaver still holding her sign. They died as the city watched — and the city knows them, because for months the alliance has made sure it does. Every balcony on the avenida already wears black cloth. Casas Viejas is in every mouth. The story is waiting to be told; it is only waiting for the committee to decide who tells it.',
      },
      {
        when: { resource: { legitimacy: { lte: 30 } } },
        text: 'The Guardia Civil fires on the picket at the Fábrica del Norte: eleven dead. By evening the right\'s papers have the only version that travels — agitators, foreign gold, a mob that charged the tricorns. You hear the alliance\'s name in the account of a crowd you never raised. The dead belong to whoever explains them, and right now no one is listening to you.',
      },
      {
        text: 'The Guardia Civil fires on the picket at the Fábrica del Norte: eleven dead. The papers call it a riot; the Arrabal calls it murder; most of the city has not decided what to call it. Eleven names are about to mean something — the question is whether the alliance has the standing to say what.',
      },
    ],
    choices: [
      {
        id: 'escalate',
        label: 'Publicize the massacre — make martyrs',
        effect: {
          martyrConversion: true,
          resources: { cadre: -2, heat: 10 },
          setFlags: ['martyrs-made'],
          moods: { hardliners: 5, students: 3, moderates: -4 },
        },
        outcome: [
          {
            when: { resource: { legitimacy: { gte: 60 } } },
            text: 'Eleven names, eleven portraits, eleven funerals that fill eleven streets. The comandante of the Guardia Civil is burned in effigy by a crowd that includes two off-duty soldiers of the Regimiento. It cost you organizers to run those funerals in daylight — the Brigada Social photographed everyone — but the city has chosen its dead, and they are yours.',
          },
          {
            text: 'You print the names and the crowd does not come. Without standing, the accusation reads as opportunism — a committee waving corpses for advantage, exactly as the right\'s papers predicted it would. They answer with your record, such as it is, and win the exchange. The organizers you exposed to run the campaign are picked up one by one under the state of alarm.',
          },
        ],
      },
      {
        id: 'go-quiet',
        label: 'Go quiet — preserve what remains',
        effect: {
          resources: { legitimacy: -6, sympathizers: -6, heat: -5 },
          moods: { hardliners: -6, moderates: 3 },
        },
        outcome: [
          {
            text: 'You bury the dead in private and pull the syndicates underground. The strike gutters out. What remains of the alliance is intact and ashamed, which is a kind of survival. The faísta delegate reads the eleven names at the next meeting, uninvited, and sits down without comment.',
          },
        ],
      },
    ],
  },
  {
    id: 'strike-kitchens-empty',
    trigger: { flags: ['strike-called'], notFlags: ['strike-won', 'strike-ended', 'crackdown'] },
    weight: 25,
    prose: [
      {
        when: { flags: ['mutual-aid'] },
        text: 'Third week of the strike. The comedores are the only thing standing between the mill rows and capitulation — and the kettles are scraping bottom. The network knows every hungry family by name; the names are getting longer than the soup.',
      },
      {
        text: 'Third week of the strike, and there was never a relief network worth the name. Families are pawning tools to eat — a striker who pawns his tools is telling you how this ends. The syndicates ask for an answer they can bring back to the rows.',
      },
    ],
    choices: [
      {
        id: 'spend',
        label: 'Empty the reserve into the comedores',
        effect: { resources: { materiel: -10 }, moods: { labor: 5, moderates: -2 } },
        outcome: [
          {
            text: 'Everything goes to flour and coal. The rows hold. A committee of strikers\' wives takes over the distribution and runs it better than your syndicates did — remember that, later, when someone asks who organized whom.',
          },
        ],
      },
      {
        id: 'end-strike',
        label: 'End the strike on the best terms left',
        effect: {
          resources: { heat: -8, legitimacy: -4 },
          setFlags: ['strike-ended'],
          moods: { labor: -5, moderates: 4, hardliners: -3 },
        },
        outcome: [
          {
            text: 'The men go back through the gates under the foremen\'s smiles. You saved the organization and spent its faith. In the canteens they are already arguing about whose nerve failed — and "the committee\'s" is winning.',
          },
        ],
      },
    ],
  },
  {
    id: 'ilya-armory-demand',
    trigger: { factionMood: { hardliners: { lte: 45 } }, turn: { gte: 14 }, notFlags: ['armed-wing', 'crackdown'] },
    weight: 20,
    art: 'armory',
    prose: [
      {
        text: 'The faístas put it formally, which is how you know it is an ultimatum: defense groups, armed, under their own committee — or they stop vouching for their people\'s patience. Their delegate reads Durruti\'s own words from the confederation\'s press: "The people, armed, is the only guarantee the people has ever had." Then, his own: "I am not asking to attack anyone. I am asking to stop attending funerals empty-handed."',
      },
    ],
    choices: [
      {
        id: 'arm',
        label: 'Authorize the defense groups',
        effect: {
          resources: { materiel: -8, heat: 5 },
          setFlags: ['armed-wing'],
          moods: { hardliners: 8, moderates: -6, labor: -1 },
        },
        outcome: [
          {
            text: 'Crates move at night; a quarry becomes a range. The pickets stop being beaten, which everyone notices, and the alliance now contains an armed force the size of a rumor, which everyone will eventually notice. The prietistas\' man begins his next three sentences with "When Madrid hears of this—".',
          },
        ],
      },
      {
        id: 'refuse',
        label: 'Refuse — pistols now means Casas Viejas later',
        effect: { moods: { hardliners: -6, moderates: 4 } },
        outcome: [
          {
            text: 'The delegate hears you out, nods once, and leaves. The faístas stop raising it, which is not the same as accepting it. Their people drill with staves now, in a barn in the vega you are not supposed to know about.',
          },
        ],
      },
      {
        id: 'defer',
        label: 'Promise it — when the moment demands',
        effect: { setFlags: ['armory-promise'], moods: { hardliners: -2, moderates: -1 } },
        outcome: [
          {
            text: '"When." The delegate repeats the word like a coin he suspects is shaved. He accepts — and somewhere a ledger of the committee\'s promises gains a line, in handwriting you will meet again in July.',
          },
        ],
      },
    ],
  },
  {
    id: 'vera-negotiation-channel',
    trigger: { turn: { gte: 14 }, resource: { legitimacy: { gte: 40 } }, notFlags: ['negotiation-channel', 'crackdown'] },
    weight: 15,
    prose: [
      {
        text: 'The civil governor\'s secretary approaches the prietistas at a christening, of all places: his principal would welcome "an informal understanding with the responsible elements of the workers\' movement." The prietistas\' man reports it verbatim, hands flat on the table, advocating nothing.',
      },
    ],
    choices: [
      {
        id: 'open-channel',
        label: 'Open the channel — quietly',
        effect: {
          setFlags: ['negotiation-channel'],
          moods: { moderates: 6, hardliners: -5, students: -2 },
        },
        outcome: [
          {
            text: 'The prietistas meet the secretary monthly over chess neither of them finishes. Nothing is conceded; much is learned — including, eventually, which officers the governor no longer trusts. The risk is not the talks. It is the day the talks become known, and they always become known.',
          },
        ],
      },
      {
        id: 'refuse-publicly',
        label: 'Refuse, and publish the offer',
        effect: {
          resources: { legitimacy: 5, heat: 4 },
          moods: { hardliners: 5, students: 2, moderates: -6 },
        },
        outcome: [
          {
            text: 'THE WORKERS DO NOT BARGAIN IN PANTRIES runs above a facsimile of the secretary\'s card. The Gobierno Civil is embarrassed; the secretary is reassigned somewhere with worse weather. The prietistas\' man says only: "That door does not open twice."',
          },
        ],
      },
    ],
  },
  {
    id: 'funeral-march',
    trigger: { flags: ['martyrs-made'], notFlags: ['crackdown'] },
    weight: 25,
    art: 'funeral',
    prose: [
      {
        text: 'The month\'s mind for the dead of the Fábrica del Norte falls on a market Sunday. The families want a procession from the mill gate to the cemetery — three kilometers through the heart of Vallarga. The Gobierno Civil has denied the permit under the state of alarm. The families are walking anyway.',
      },
    ],
    choices: [
      {
        id: 'march-with-them',
        label: 'March at the front',
        effect: {
          resources: { legitimacy: 6, sympathizers: 6, heat: 8 },
          moods: { labor: 3, students: 3, moderates: -2 },
        },
        outcome: [
          {
            text: 'Forty thousand walk in a silence that swallows the squadron of Asaltos shadowing the route — no one gives the guardias so much as a glance, which unnerves them more than stones would. At the graves, no speeches. The silence was the speech.',
          },
        ],
      },
      {
        id: 'stay-away',
        label: 'Keep the organization clear of it',
        effect: { resources: { legitimacy: -3 }, moods: { hardliners: -4, labor: -3, moderates: 2 } },
        outcome: [
          {
            text: 'The families walk alone and the city walks with them — without you. The day belongs to the dead and to whoever stood with them, and the rows take note of who didn\'t.',
          },
        ],
      },
    ],
  },
  {
    id: 'underground-newspaper',
    trigger: { flags: ['press'], turn: { gte: 12 }, notFlags: ['newspaper', 'crackdown'] },
    weight: 15,
    prose: [
      {
        text: 'The JSU wants to graduate from leaflets to a weekly paper — masthead, serial, prices column, the works. "Leaflets are shouting," the section secretary says. "A newspaper is a voice that comes back every week. People set their clocks by a voice."',
      },
    ],
    choices: [
      {
        id: 'launch',
        label: 'Launch the weekly',
        effect: {
          resources: { materiel: -6, legitimacy: 5, heat: 5 },
          setFlags: ['newspaper'],
          moods: { students: 5, labor: 1 },
        },
        outcome: [
          {
            text: 'EL DESPERTAR, four pages, price ten céntimos or one good rumor. By the third issue, dockers read it aloud at the noon break and the Brigada Social pays a full peseta for confiscated copies — making it, the JSU notes, the only profitable press in the city.',
          },
        ],
      },
      {
        id: 'pamphlets-suffice',
        label: 'A weekly is a weekly target',
        effect: { moods: { students: -4 } },
        outcome: [
          {
            text: 'The JSU accepts the arithmetic of risk without agreeing with it. The press goes on jobbing leaflets — louder, safer, forgettable. Somewhere in the city, people fail to set their clocks.',
          },
        ],
      },
    ],
  },
  {
    id: 'women-bread-lines',
    trigger: { flags: ['mutual-aid'], turn: { gte: 10 }, notFlags: ['crackdown'] },
    weight: 12,
    prose: [
      {
        text: 'The washerwomen of the bread queues have organized themselves — rotas, dues, a list of merchants who shave the weights — and present themselves at the comedores not as guests but as an organization proposing terms of alliance. Their chairwoman is twenty-three and has clearly read the alliance\'s manifesto critically.',
      },
    ],
    choices: [
      {
        id: 'alliance',
        label: 'Alliance, as equals',
        effect: {
          resources: { sympathizers: 8 },
          moods: { labor: 3, students: 3, hardliners: -2 },
        },
        outcome: [
          {
            text: 'They bring three streets the syndicates could never enter and a discipline the syndicates should envy. Within a month the chairwoman is correcting your weight-fraud figures from the floor. The JSU secretary looks like someone who has met the future and is taking notes.',
          },
        ],
      },
      {
        id: 'absorb-them',
        label: 'Welcome them — under the syndicates',
        effect: { resources: { sympathizers: 3 }, moods: { hardliners: 1, labor: -2 } },
        outcome: [
          {
            text: 'They join, and the rotas keep working — for a season. Then dues fall off, the chairwoman stops attending, and the three streets quietly revert to being streets. You annexed an organization and harvested its absence.',
          },
        ],
      },
    ],
  },
  {
    id: 'student-occupation',
    trigger: { turn: { gte: 12 }, factionPresent: ['students'], notFlags: ['crackdown'] },
    weight: 12,
    prose: [
      {
        text: 'Without asking anyone, the JSU section occupies the university rectorate over the expulsion of two scholarship students — banners from the windows, a JSU picket on the stair, and the alliance\'s name already chalked on the facade whether you claim it or not.',
      },
    ],
    choices: [
      {
        id: 'back-them',
        label: 'Back the occupation',
        effect: {
          resources: { legitimacy: 3, heat: 9 },
          moods: { students: 6, moderates: -4 },
        },
        outcome: [
          {
            text: 'Food goes in by basket and rope; lectures on political economy come out the same way. The rector negotiates after nine days rather than explain Asaltos in the library to the claustro. The section returns with the expulsions reversed and a new estimate of what asking permission is for.',
          },
        ],
      },
      {
        id: 'order-out',
        label: 'Order them out — wrong fight, wrong month',
        effect: { moods: { students: -6, moderates: 3, hardliners: -1 } },
        outcome: [
          {
            text: 'They file out on the third day, eyes forward. The expulsions stand. At the next committee the JSU sit together, very straight, and vote together, and that is new.',
          },
        ],
      },
    ],
  },
  {
    id: 'factory-lockout',
    trigger: { turn: { gte: 14 }, factionMood: { labor: { gte: 40 } }, notFlags: ['crackdown'] },
    weight: 12,
    prose: [
      {
        text: 'The owners answer organization with arithmetic of their own: the Brenner textile works locks out eight hundred hands "pending removal of agitational elements" — a list of forty names, most of them yours. The patronal has been reading the spring the same way you have, and it also intends to be ready.',
      },
    ],
    choices: [
      {
        id: 'relief',
        label: 'Organize relief for the locked-out',
        effect: {
          resources: { materiel: -8, sympathizers: 5 },
          moods: { labor: 5, hardliners: -1 },
        },
        outcome: [
          {
            text: 'Soup, rent money, and a roster so no family falls through. The lockout holds six weeks and breaks when the owners\' order book empties. The forty names go back through the gates — all forty, or nobody works. That sentence cost you a treasury, and it was the cheapest thing you ever bought.',
          },
        ],
      },
      {
        id: 'let-anger-build',
        label: 'Let the lockout radicalize the rows',
        effect: {
          resources: { grievance: 6 },
          moods: { labor: -4, hardliners: 3, moderates: -2 },
        },
        outcome: [
          {
            text: 'Hunger does the agitating. Anger climbs — and so does the pawnshop ledger, and the rows learn that the alliance watches its own go hungry when the lesson is convenient. Some lessons teach the teacher\'s price.',
          },
        ],
      },
    ],
  },
  {
    id: 'telegraph-clerks',
    trigger: { turn: { gte: 16 }, notFlags: ['telegraph-taps', 'crackdown'] },
    weight: 10,
    prose: [
      {
        text: 'Two telegraph clerks, brothers, offer to pass copies of the Gobierno Civil\'s wire traffic — search orders travel by wire a day before they travel by wagon. Their price is membership, not money. They want to belong to something.',
      },
    ],
    choices: [
      {
        id: 'accept-clerks',
        label: 'Swear them in',
        effect: { resources: { heat: -7, cadre: 1 }, setFlags: ['telegraph-taps'], moods: { hardliners: 2 } },
        outcome: [
          {
            text: 'The wire copies arrive folded inside racing forms. Twice in a season the committee is elsewhere when the wagons arrive. The brothers sit in the back row at meetings, radiant, belonging.',
          },
        ],
      },
      {
        id: 'too-exposed',
        label: 'Too exposed — refuse gently',
        effect: { moods: { moderates: 1, hardliners: -2 } },
        outcome: [
          {
            text: 'You explain the arithmetic of their risk; they hear the arithmetic of your caution. Come July, every warning will be a day slower than it needed to be, and you will not be able to prove that mattered, and it will.',
          },
        ],
      },
    ],
  },
  {
    id: 'rival-bomb',
    trigger: { turn: { gte: 16 }, notFlags: ['crackdown'] },
    weight: 12,
    prose: [
      {
        text: 'A grouplet the alliance expelled last winter bombs the commercial court — a night watchman loses a hand; the marble loses a staircase. The morning papers print the alliance\'s name in the first sentence. Theirs appears in the fourth.',
      },
    ],
    choices: [
      {
        id: 'condemn',
        label: 'Condemn it, by name, in print',
        effect: {
          resources: { legitimacy: 5 },
          moods: { moderates: 5, hardliners: -5 },
        },
        outcome: [
          {
            text: 'The statement names the grouplet, names the watchman, and pledges toward his surgeon\'s bill. The respectable papers reprint it with surprise they don\'t bother hiding. In the athenaeum cellars, some of the faístas mutter about washing hands in public.',
          },
        ],
      },
      {
        id: 'silence',
        label: 'Say nothing — never feed the story',
        effect: {
          resources: { legitimacy: -6, heat: 7 },
          moods: { hardliners: 2, moderates: -3 },
        },
        outcome: [
          {
            text: 'The story feeds itself. By week\'s end the bomb is yours in every parlor in the city, and the Brigada Social\'s requisition warrants agree. Silence, it turns out, is a confession in a louder font.',
          },
        ],
      },
    ],
  },
  {
    id: 'foreign-journalist',
    trigger: { turn: { gte: 14 }, resource: { legitimacy: { gte: 35 } }, notFlags: ['foreign-press', 'crackdown'] },
    weight: 10,
    prose: [
      {
        text: 'A correspondent for a London weekly — rumpled, fluent, suspiciously well-informed about your printing arrangements — requests an interview with "the committee everyone in this city denies exists." Spain is becoming the story of the European summer, and he intends to file early.',
      },
    ],
    choices: [
      {
        id: 'grant',
        label: 'Grant the interview, shuttered room and all',
        effect: {
          resources: { legitimacy: 6, heat: 5 },
          setFlags: ['foreign-press'],
          moods: { moderates: 2, students: 2 },
        },
        outcome: [
          {
            text: 'The piece runs under THE PATIENT REVOLUTION OF VALLARGA and is reprinted in three capitals. The Gobierno Civil denies the committee\'s existence again, at length, in an official communiqué — thereby confirming it in four languages.',
          },
        ],
      },
      {
        id: 'decline-interview',
        label: 'Decline — vanity printed abroad',
        effect: { moods: { hardliners: 1, students: -2 } },
        outcome: [
          {
            text: 'He writes the piece anyway from rumor and the Gobierno Civil\'s handouts, titled THE INVISIBLE CONSPIRACY. It is worse than anything you would have said, and twice as long.',
          },
        ],
      },
    ],
  },
  {
    id: 'soldiers-sisters',
    trigger: { flags: ['mutual-aid'], turn: { gte: 14 }, notFlags: ['garrison-contacts', 'crackdown'] },
    weight: 14,
    art: 'garrison-kitchen',
    prose: [
      {
        text: 'The UGT secretary mentions it almost in passing: a third of the women in the Arrabal comedores have brothers or sons doing their service in the Cuartel — conscripts from the same streets the alliance feeds. The comedores, it turns out, have been corresponding with the barracks for months. About soup, mostly. So far.',
      },
    ],
    choices: [
      {
        id: 'cultivate',
        label: 'Cultivate the family lines into the barracks',
        effect: {
          resources: { materiel: -4 },
          setFlags: ['garrison-contacts'],
          moods: { labor: 2, hardliners: 2 },
        },
        outcome: [
          {
            text: 'Nothing seditious travels — parcels, letters, news of home. What travels is the knowledge, settling over both ends of the line, that the people the Regimiento might someday be ordered against are the people who write to it. Some ammunition is bread.',
          },
        ],
      },
      {
        id: 'keep-clear',
        label: 'Keep the comedores clear of the barracks',
        effect: { moods: { moderates: 2, hardliners: -3 } },
        outcome: [
          {
            text: 'Safer, certainly — a comedor that writes to soldiers is a comedor the military prosecutors can name. The letters dwindle to saints\' days. The Cuartel stays a wall, and walls take orders.',
          },
        ],
      },
    ],
  },
  {
    id: 'price-decree',
    trigger: { resource: { grievance: { lte: 55 } }, turn: { gte: 12 }, notFlags: ['crackdown'] },
    weight: 14,
    prose: [
      {
        text: 'The Gobierno Civil moves to close your window: a decree fixes the bread price and subsidizes the difference. The queues shorten. In the comedores, a woman says "perhaps the Republic has learned," and is not laughed at. This is what losing slowly sounds like.',
      },
    ],
    choices: [
      {
        id: 'expose-hoarding',
        label: 'Expose what the decree hides',
        effect: {
          resources: { grievance: 5, legitimacy: 3, heat: 5 },
          moods: { students: 2 },
        },
        outcome: [
          {
            text: 'Your people trace the subsidized grain: a third of it sold out the depot\'s back doors at the old price, with the depot master\'s brother-in-law on the weighbridge. EL DESPERTAR prints the manifests. The decree\'s authors learn that mercy administered by thieves compounds the grievance it was meant to bury.',
          },
        ],
      },
      {
        id: 'claim-credit',
        label: 'Claim the decree as the movement\'s victory',
        effect: {
          resources: { legitimacy: 4 },
          moods: { labor: 2, moderates: 2, hardliners: -3 },
        },
        outcome: [
          {
            text: '"They did not lower the price out of kindness" runs on every wall by Sunday — and it is even true. Cheaper bread becomes your trophy instead of the governor\'s pardon. The faísta delegate points out, correctly, that you have just taught the city the state responds to pressure, which cuts both ways.',
          },
        ],
      },
    ],
  },
  {
    id: 'vera-ultimatum',
    trigger: { flags: ['armed-wing'], factionMood: { moderates: { lte: 40 } }, notFlags: ['crackdown'] },
    weight: 25,
    prose: [
      {
        text: 'The prietistas request a formal session and bring a prepared text, which from them is a thunderclap: the defense groups disband, or the socialist minority — the lawyers, the councillors, the quiet magistrates — withdraws from the alliance. "I will not notarize a militia," their man says, reading Prieto\'s own wire. Across the table, the faísta delegate almost smiles.',
      },
    ],
    choices: [
      {
        id: 'disarm',
        label: 'Disband the defense groups',
        effect: {
          clearFlags: ['armed-wing'],
          moods: { moderates: 7, hardliners: -8 },
        },
        outcome: [
          {
            text: 'The crates leave the quarry the way they came. The prietistas withdraw the text as gracefully as they produced it. The faísta delegate says nothing at all in the session, which his people understand as instruction to begin remembering this.',
          },
        ],
      },
      {
        id: 'keep-arms',
        label: 'The defense groups stay',
        effect: { moods: { moderates: -7, hardliners: 4 } },
        outcome: [
          {
            text: 'The prietistas\' man folds the text once and puts it away — a document now in reserve rather than in force. Two of their committees stop meeting "for the season." The alliance keeps its pistols and begins paying for them in lawyers.',
          },
        ],
      },
    ],
  },
  {
    id: 'strike-victory',
    trigger: { flags: ['strike-called'], resource: { legitimacy: { gte: 55 } }, notFlags: ['strike-won', 'strike-ended', 'crackdown'] },
    weight: 30,
    prose: [
      {
        text: 'The patronal blinks: a nine-percent rise, the foremen\'s fines abolished, no reprisals against the syndicates — provided work resumes Monday. It is less than the demands and more than anyone has won in living memory. The rows will take it if the committee tells them to. That is precisely the danger.',
      },
    ],
    choices: [
      {
        id: 'declare-victory',
        label: 'Take the terms — bank the victory',
        effect: {
          resources: { legitimacy: 6, sympathizers: 6, heat: -10 },
          setFlags: ['strike-won'],
          moods: { labor: 6, moderates: 4, hardliners: -3 },
        },
        outcome: [
          {
            text: 'Monday the whistles call the men back through the gates as victors, which changes how a man walks through a gate. Nine percent is nine percent; the precedent is everything. The next demand will be drafted by people who have won something.',
          },
        ],
      },
      {
        id: 'press-on',
        label: 'Press on — they are weakening',
        effect: {
          resources: { heat: 8, grievance: -3 },
          moods: { labor: -3, hardliners: 3, moderates: -3 },
        },
        outcome: [
          {
            text: 'You hold out for the full demands. The patronal, having offered settlement once, settles instead into siege. The strike becomes a test of larders — and the Gobierno Civil, watching its tax receipts, begins to take a professional interest in ending it for them.',
          },
        ],
      },
    ],
  },
  {
    id: 'pamphlet-war',
    trigger: { turn: { gte: 14 }, resource: { legitimacy: { gte: 30 } }, notFlags: ['crackdown'] },
    weight: 10,
    prose: [
      {
        text: 'The right discovers publicity: a flood of penny sheets paints the alliance as incendiaries in Moscow\'s pay, complete with a forged circular bearing a signature almost like the committee\'s. The forgery is competent. The prose, the JSU notes professionally, is not.',
      },
    ],
    choices: [
      {
        id: 'counter',
        label: 'Answer sheet for sheet',
        effect: {
          resources: { materiel: -5, legitimacy: 4 },
          moods: { students: 3 },
        },
        outcome: [
          {
            text: 'EL DESPERTAR reprints their forgery beside the committee\'s actual hand and a list of the errors, under the title THEY CANNOT EVEN LIE CAREFULLY. The city, which knows good mockery when it reads it, chooses its side of the laugh.',
          },
        ],
      },
      {
        id: 'dignified-silence',
        label: 'Mud dries; ignore it',
        effect: { resources: { legitimacy: -4 }, moods: { moderates: 2, students: -2 } },
        outcome: [
          {
            text: 'Some of the mud dries. Some of it sets. A season later you still meet people who mention the Moscow gold with the confidence of those who read it somewhere, and "somewhere" has become its own citation.',
          },
        ],
      },
    ],
  },
  {
    id: 'dock-arson',
    trigger: { turn: { gte: 18 }, notFlags: ['crackdown'] },
    weight: 10,
    prose: [
      {
        text: 'The customs warehouse burns in the night — spectacularly, insured, and empty, which is its own kind of suspicious. By dawn the Gobierno Civil\'s version is settled: revolutionary arson. By noon two of your dockers are detained under the state of alarm on the strength of having been asleep nearby.',
      },
    ],
    choices: [
      {
        id: 'investigate',
        label: 'Investigate it yourselves, publicly',
        effect: {
          resources: { legitimacy: 5, heat: 3, materiel: -3 },
          moods: { labor: 3 },
        },
        outcome: [
          {
            text: 'Your committee of inquiry — a retired fire assessor, a notary, the chairwoman of the washerwomen — publishes within the week: the fire began in a locked office, behind the only door with a new lock. The insurance question asks itself. The dockers walk free; the warehouse owner travels to Biarritz for his health.',
          },
        ],
      },
      {
        id: 'let-burn',
        label: 'Not your fire, not your fight',
        effect: { resources: { legitimacy: -4 }, moods: { labor: -4, hardliners: 1 } },
        outcome: [
          {
            text: 'The dockers are convicted on the testimony of a night watchman who was demonstrably at a baptism. The rows conclude the alliance defends principles, not people. It is the kind of distinction that empties meeting halls.',
          },
        ],
      },
    ],
  },
  {
    id: 'mira-printer-arrest',
    trigger: { flags: ['press'], turn: { gte: 16 }, notFlags: ['crackdown'] },
    weight: 12,
    prose: [
      {
        text: 'They take the press\'s operator — old Pau, ink to the elbows — in the street, mid-errand, on a charge improvised under the state of alarm while he stood there. The JSU secretary arrives breathless: the type cases are hidden but Pau knows where, and Pau is seventy, and the Brigada Social\'s interrogators know what seventy means.',
      },
    ],
    choices: [
      {
        id: 'rescue',
        label: 'Take him back tonight',
        effect: {
          resources: { cadre: -1, heat: 9 },
          moods: { hardliners: 4, students: 4, moderates: -4 },
        },
        outcome: [
          {
            text: 'A transfer wagon, two bribed minutes, a crowbar. Pau is over the French border by Thursday, complaining about foreign typefaces. The operation cost you an organizer detained in the confusion — a younger man, who knows less, which was the arithmetic, and everyone can do the arithmetic.',
          },
        ],
      },
      {
        id: 'lawyer',
        label: 'The prietistas\' lawyers, loudly',
        effect: {
          resources: { materiel: -6, legitimacy: 3 },
          moods: { moderates: 4, students: 1, hardliners: -2 },
        },
        outcome: [
          {
            text: 'The improvised charge meets an actual jurist and dissolves on contact; the prosecutor\'s invention becomes a small scandal in the law gazette. Pau is out in nine days, having taught his cellmates to read. The press moves anyway. Twice.',
          },
        ],
      },
      {
        id: 'cut-losses',
        label: 'Move the type and write him off',
        effect: {
          resources: { heat: -4, legitimacy: -4 },
          moods: { students: -7, hardliners: -3, moderates: 1 },
        },
        outcome: [
          {
            text: 'The type cases move the same night; the operation survives intact. Pau draws four years. The JSU secretary sets the next issue herself, badly, the columns crooked — and above the masthead, in perfect type, a single line: FOUNDED BY P. The crooked columns are the editorial.',
          },
        ],
      },
    ],
  },
  {
    id: 'amnesty-rumor',
    trigger: { flags: ['negotiation-channel'], turn: { gte: 20 }, notFlags: ['crackdown'] },
    weight: 12,
    prose: [
      {
        text: 'Through the prietistas\' channel: the governor is drafting a request to Madrid — the state-of-alarm detainees of the spring released, certain prosecutions dropped, timed for the feast of the city\'s patron. He wants quiet streets in exchange. The channel asks, delicately, whether quiet can be arranged.',
      },
    ],
    choices: [
      {
        id: 'arrange-quiet',
        label: 'Arrange the quiet — bring them home',
        effect: {
          resources: { cadre: 2, heat: -6 },
          moods: { moderates: 5, hardliners: -5 },
        },
        outcome: [
          {
            text: 'The feast passes in suspicious tranquility; the cells open on schedule. Among the released: three organizers you had written off and a man who taught the faísta delegate his letters. The price was a quiet you can never prove you sold, paid to people who will never admit they bought it.',
          },
        ],
      },
      {
        id: 'no-deals',
        label: 'No bargains over prisoners',
        effect: {
          resources: { legitimacy: 3 },
          moods: { hardliners: 4, moderates: -4 },
        },
        outcome: [
          {
            text: 'The request shrinks in Madrid to a handful of debtors and one elderly forger. The streets stay loud. The prisoners stay prisoners — principled ones now, in your telling, though no one has asked them which they\'d rather be.',
          },
        ],
      },
    ],
  },
];
