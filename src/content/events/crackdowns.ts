import type { EventCard } from '../../engine/events';

/**
 * The repression dial, 1936: the state of alarm gives the Gobierno Civil
 * its searches and sweeps, and every one of them is the same question —
 * go quiet and preserve, or escalate and convert the outrage into
 * standing, if you have the standing to convert it with. Casas Viejas
 * taught both sides what a massacre does to whoever explains it worst.
 * Each card has exactly one martyrConversion choice; all repeatable.
 */
export const CRACKDOWN_EVENTS: EventCard[] = [
  {
    id: 'street-raid',
    trigger: { flags: ['crackdown'] },
    weight: 10,
    once: false,
    art: 'raid',
    prose: [
      {
        when: { resource: { legitimacy: { gte: 60 } } },
        text: 'They came at four in the morning, the hour of confessions — the Asaltos at the doors, the Brigada Social at the ledgers, three organizers taken in their nightshirts under the state of alarm. By breakfast the whole quarter knows, because the quarter counts your people among its own now. The detentions read less like law than like abduction, and the city is already saying so without you.',
      },
      {
        text: 'They came at four in the morning — doors, ledgers, three organizers taken under the state of alarm. The neighbors watched from behind shutters. In the morning the official note calls it the disruption of an illegal combine, and most of the street, knowing nothing better, has no reason to doubt it.',
      },
    ],
    choices: [
      {
        id: 'go-quiet',
        label: 'Go to ground — protect what\'s left',
        effect: {
          resources: { legitimacy: -4, sympathizers: -4, heat: -4 },
          moods: { hardliners: -4, moderates: 3 },
        },
        outcome: [
          {
            text: 'Meetings suspend; the syndicates scatter to the parlors. The taken men face the examining magistrate alone, which they understood was possible and which you will not pretend was nothing. The organization survives, smaller and quieter, the way pruned things do.',
          },
        ],
      },
      {
        id: 'escalate',
        label: 'Name the taken — make the search the story',
        effect: {
          martyrConversion: true,
          resources: { cadre: -1, heat: 8 },
          moods: { hardliners: 4, students: 2, moderates: -4 },
        },
        outcome: [
          {
            when: { resource: { legitimacy: { gte: 60 } } },
            text: 'Three names, three portraits, three families interviewed at length in EL DESPERTAR. The search becomes the Republic\'s police prosecuting the Republic\'s own voters in public. Donations arrive at the comedores unsigned. It cost another organizer to run the campaign in daylight — the Brigada Social was waiting for exactly that — and the quarter knows her name now too, which is the terrible economy of it.',
          },
          {
            text: 'You print the names of men the city has never heard of, vouched for by a committee it does not yet trust. The campaign reads as special pleading. The Brigada Social, handed a public list of who matters to you, works straight down it.',
          },
        ],
      },
    ],
  },
  {
    id: 'press-seizure',
    trigger: { flags: ['crackdown', 'press'] },
    weight: 20,
    once: false,
    art: 'broken-press',
    prose: [
      {
        when: { resource: { legitimacy: { gte: 60 } } },
        text: 'They found the press. Hammers to the frame, type shoveled into sacks, the printer\'s widow who let you the floor taken for questioning in front of her street — which watched, and did not approve, and will remember. Breaking a machine in public looks less like order than like fear of sentences.',
      },
      {
        text: 'They found the press. By the official account, a den of clandestine printing — which, under the state of alarm, it was; by the neighbors\' account, a great deal of noise and a respectable widow in an Asalto wagon. The street is undecided. The type is in sacks either way.',
      },
    ],
    choices: [
      {
        id: 'go-quiet',
        label: 'Absorb the loss — print nothing for a season',
        effect: {
          resources: { legitimacy: -5, heat: -4, materiel: -3 },
          moods: { students: -4, moderates: 2 },
        },
        outcome: [
          {
            text: 'A movement that suddenly stops speaking confirms whatever was last said about it. The JSU hand-copies what matters most, twenty copies a night, and does not complain, which is how you know how bad it is.',
          },
        ],
      },
      {
        id: 'escalate',
        label: 'Make the broken press the front page',
        effect: {
          martyrConversion: true,
          resources: { cadre: -1, heat: 8 },
          moods: { students: 4, hardliners: 3, moderates: -3 },
        },
        outcome: [
          {
            when: { resource: { legitimacy: { gte: 60 } } },
            text: 'A borrowed jobbing press runs one image under one line: the hammered flatbed, and THEY ARE AFRAID OF A MACHINE. The widow returns from questioning to find her rent paid for a year and her street decided. Two commercial printers offer their shops on alternate nights — at cost, they insist, though everyone understands what they are actually charging: admission.',
          },
          {
            text: 'The broadsheet of the broken press circulates among people who never read what it printed. Sympathy for a machine is thin currency. The borrowed press that ran the image is itself found within the month — the informer evidently included in the loan.',
          },
        ],
      },
    ],
  },
  {
    id: 'leader-arrested',
    trigger: { flags: ['crackdown'], turn: { gte: 12 } },
    weight: 15,
    once: false,
    prose: [
      {
        when: { resource: { legitimacy: { gte: 60 } } },
        text: 'They took one of the founding committee — at the market, in daylight, deliberately public. The detention is meant as a beheading and performs as one more proof that the state fears you. The crowd at the market did not disperse when ordered. That detail is in the Asaltos\' report, underlined by someone.',
      },
      {
        text: 'They took one of the founding committee at the market, in daylight, under the state of alarm. The crowd dispersed when ordered. The evening paper gives it a paragraph: an agitator removed. The committee meets that night around the shape of an empty chair.',
      },
    ],
    choices: [
      {
        id: 'go-quiet',
        label: 'No campaign — don\'t raise the stakes of the case',
        effect: {
          resources: { legitimacy: -4, sympathizers: -3, heat: -5 },
          moods: { hardliners: -5, moderates: 3 },
        },
        outcome: [
          {
            text: 'The prietistas\' lawyers work the quiet channels; the charge settles at banishment to a village in the sierra rather than the penal colony. A life preserved, a banner folded away unused. The faísta delegate attends the sentencing and stands when the prisoner is led out, alone in the gallery, conspicuous as a verdict of his own.',
          },
        ],
      },
      {
        id: 'escalate',
        label: 'Make the trial a tribunal of the state of alarm',
        effect: {
          martyrConversion: true,
          resources: { cadre: -2, heat: 9 },
          moods: { hardliners: 5, students: 3, moderates: -4 },
        },
        outcome: [
          {
            when: { resource: { legitimacy: { gte: 60 } } },
            text: 'The defense calls no witnesses for the accused — only witnesses against the bread price, the lockouts, the eleven of the Fábrica del Norte. Verbatim transcripts sell on street corners faster than they can be set. The verdict, when it comes, convicts a man and acquits a movement; the crowd outside the court needs no instructions. Two of the transcript sellers are taken in his place, which is the tithe this strategy always collects.',
          },
          {
            text: 'You stake the trial on a city that has not yet decided you matter, and the prosecutor, gratefully, tries the movement instead of the man. The sentence lands at the penal colony, maximum term, and the lesson lands on every syndicate: visibility without standing is a list of addresses.',
          },
        ],
      },
    ],
  },
  {
    id: 'safehouse-burned',
    trigger: { flags: ['crackdown', 'safehouse'] },
    weight: 20,
    once: false,
    prose: [
      {
        text: 'The safe floor above the printer\'s shop burns at two in the morning — after the search, after the seals went on the door, after the patrol walked away. The bomberos arrive in time to save the buildings either side, with a precision that is its own signature. The widow stands in the street in her good coat, watching her livelihood make somebody\'s point. Nobody claims the fire. Under the state of alarm, nobody has to.',
      },
    ],
    choices: [
      {
        id: 'go-quiet',
        label: 'Settle her losses; say nothing',
        effect: {
          resources: { materiel: -5, legitimacy: -3, heat: -4 },
          moods: { moderates: 2, hardliners: -3 },
        },
        outcome: [
          {
            text: 'Money for the widow, a new room across el Turbio, silence. Arson without an author meets loss without a complaint; the ledger closes. The street draws its own conclusions, in private, where conclusions change nothing.',
          },
        ],
      },
      {
        id: 'escalate',
        label: 'Publish the timeline — search, seals, fire',
        effect: {
          martyrConversion: true,
          resources: { cadre: -1, heat: 7 },
          moods: { students: 3, hardliners: 3, moderates: -3 },
        },
        outcome: [
          {
            when: { resource: { legitimacy: { gte: 60 } } },
            text: 'Search at nine, seals at ten, fire at two, bomberos at a stroll: the timeline runs as a table, no adjectives, and the city — which can read a clock — reads it. Respectable opinion crosses a line it cannot recross: they burn things now. The widow is photographed in her good coat for the front page and acquires, overnight, the standing of a saint with an insurance claim.',
          },
          {
            text: 'The timeline is damning and unsigned, like everything else in the city. Absent your name meaning anything, it files itself under misfortune. The assessor rules the cause indeterminate, the widow uncompensated, and the lesson available to anyone else considering renting you a floor.',
          },
        ],
      },
    ],
  },
  {
    id: 'infiltrator-unmasked',
    trigger: { flags: ['crackdown', 'informant-loose'] },
    weight: 25,
    once: false,
    prose: [
      {
        text: 'The search was too precise — the right door, the right hour, the false ledger ignored for the true one. It is the bookkeeper, of course. It was always the bookkeeper, reporting to the Brigada Social since March. The faístas have him in a cellar within the day, along with the question that comes with cellars.',
      },
    ],
    choices: [
      {
        id: 'go-quiet',
        label: 'Put him over the border — no body, no spectacle',
        effect: {
          resources: { legitimacy: -2, heat: -5 },
          clearFlags: ['informant-loose'],
          moods: { hardliners: -5, moderates: 4 },
        },
        outcome: [
          {
            text: 'He is walked to the night train with his coat and his life and instructions never to return. The faísta delegate calls it bookkeeping of a different kind: an account left open. The prietistas call it the only choice that lets the alliance keep calling itself one. They are both right, which is the usual price.',
          },
        ],
      },
      {
        id: 'escalate',
        label: 'Try him before the movement, publish everything',
        effect: {
          martyrConversion: true,
          resources: { cadre: -1, heat: 6 },
          clearFlags: ['informant-loose'],
          moods: { hardliners: 5, moderates: -5 },
        },
        outcome: [
          {
            when: { resource: { legitimacy: { gte: 60 } } },
            text: 'The proceeding is scrupulous — evidence read aloud, a defense offered, the sentence expulsion and exposure rather than the cellar floor, and all of it printed. The effect is double: the Brigada Social loses an asset, and the city learns the alliance runs fairer hearings than the Tribunal de Urgencia. Three informers in other organizations, reading the transcript, retire from the profession by morning.',
          },
          {
            text: 'A clandestine committee announcing it has tried a traitor reads, to the uncommitted city, as pistoleros formalizing a grudge. The right\'s papers print the word "tribunal" in quotation marks that do their work. The bookkeeper, expelled, gives interviews.',
          },
        ],
      },
    ],
  },
  {
    id: 'show-trial',
    trigger: { flags: ['crackdown'], turn: { gte: 20 } },
    weight: 15,
    once: false,
    prose: [
      {
        when: { resource: { legitimacy: { gte: 60 } } },
        text: 'The state stages it properly this time: the Tribunal de Urgencia convened in the audiencia, charges read for two hours, the gallery packed with selected respectability. Eight of yours in the dock for "conspiracy against public order." But the city outside the courtroom has already held its own proceedings, and acquitted them, and the prosecution is now performing to a house that has seen the better play.',
      },
      {
        text: 'The Tribunal de Urgencia, eight of yours in the dock, charges read for two hours. The gallery is packed with selected respectability and the verdict was drafted before the indictment. The city follows it in the papers, at the prosecution\'s dictation, because no other account is loud enough to compete.',
      },
    ],
    choices: [
      {
        id: 'go-quiet',
        label: 'Defend narrowly — save the eight',
        effect: {
          resources: { legitimacy: -4, materiel: -5, heat: -4 },
          moods: { moderates: 4, hardliners: -4 },
        },
        outcome: [
          {
            text: 'The prietistas\' lawyers contest evidence, not the order of the world. Five of eight draw short terms; two walk; one breaks in preventive detention and is carried out feet first, a sentence no one pronounced and everyone heard. The movement kept its head down and its people, mostly, alive.',
          },
        ],
      },
      {
        id: 'escalate',
        label: 'Let the dock make speeches',
        effect: {
          martyrConversion: true,
          resources: { cadre: -2, heat: 8 },
          moods: { hardliners: 5, students: 4, moderates: -4 },
        },
        outcome: [
          {
            when: { resource: { legitimacy: { gte: 60 } } },
            text: 'The eight refuse counsel and speak in turn — about wages, the quinta, the eleven of the Fábrica del Norte — and the selected gallery cannot be selected enough. The bench cuts them off and proves their point; sentences them hard and mints them whole. Within a month "the speech of the weaver Dionisia" exists in four leaflet editions, two of them pirated, which the JSU considers the highest compliment printing offers.',
          },
          {
            text: 'The speeches are brave and land in silence — the transcripts suppressed, the papers running the prosecutor\'s summary, the city lacking any reason to seek a better version. Maximum sentences, served in full obscurity. Courage spent where no one could see it buys what unseen courage always buys.',
          },
        ],
      },
    ],
  },
  {
    id: 'garrison-sweep',
    trigger: { flags: ['crackdown'], turn: { gte: 28 } },
    weight: 15,
    once: false,
    prose: [
      {
        text: 'This time it is not the police. Troops cordon the Arrabal at dawn — your district, the comedores\' district — and search it house by house with bayonets fixed, conscripts avoiding the eyes of women who might know their mothers. The governor has run short of guardias he trusts and is now spending the Regimiento\'s obedience like a man burning furniture for heat.',
      },
    ],
    choices: [
      {
        id: 'go-quiet',
        label: 'Total passivity — let them search emptiness',
        effect: {
          resources: { legitimacy: -3, heat: -6 },
          moods: { hardliners: -4, moderates: 3 },
        },
        outcome: [
          {
            text: 'Nothing is found because nothing was there to find; the warnings ran ahead of the cordon. The troops file out past silent doorways, ashamed without knowing of what. The Arrabal absorbed it the way water absorbs a fist — but it absorbed it alone, and remembers that, too.',
          },
        ],
      },
      {
        id: 'escalate',
        label: 'The women meet the cordon — bread for bayonets',
        effect: {
          martyrConversion: true,
          resources: { cadre: -1, heat: 7 },
          moods: { labor: 3, hardliners: 3, moderates: -3 },
        },
        outcome: [
          {
            when: { resource: { legitimacy: { gte: 60 } } },
            text: 'The comedor women come out to the cordon with bread and coffee and the names of the conscripts\' home villages, and the cordon — ordered to search a district that is feeding it breakfast — begins to come apart at the level of the individual stomach. A lieutenant orders the bread refused. He is obeyed the way late orders are. The sweep is not repeated; some instruments, used once against their own edge, do not cut twice.',
          },
          {
            text: 'The women walk out with bread and meet soldiers who know nothing of them — wrong quarter, wrong reemplazo, conscripts rotated in from other provinces precisely so they would know no one. The bread is refused by men following orders comfortably. Two organizers among the women are identified and taken, the gesture having conveniently assembled them.',
          },
        ],
      },
    ],
  },
  {
    id: 'night-of-broken-presses',
    trigger: { flags: ['crackdown'], turn: { gte: 16 } },
    weight: 10,
    once: false,
    prose: [
      {
        text: 'Not a search — a message. In one night, every print shop in the city that ever jobbed for the alliance, might have jobbed for it, or merely declined to inform: windows broken, type scattered, a card left on each counter bearing nothing but the yoke and arrows. The pistol squads the courts dissolved in March have found their spring work.',
      },
    ],
    choices: [
      {
        id: 'go-quiet',
        label: 'Compensate the printers quietly',
        effect: {
          resources: { materiel: -6, legitimacy: -3, heat: -4 },
          moods: { moderates: 2, students: -3 },
        },
        outcome: [
          {
            text: 'Envelopes under doors, glaziers paid in advance, no questions invited. Half the printers take the money and the hint together: they are out of your trade. The other half take the money as a retainer, which you did not intend and do not correct.',
          },
        ],
      },
      {
        id: 'escalate',
        label: 'Print their calling card on your own front page',
        effect: {
          martyrConversion: true,
          resources: { cadre: -1, heat: 7 },
          moods: { students: 4, hardliners: 3, moderates: -3 },
        },
        outcome: [
          {
            when: { resource: { legitimacy: { gte: 60 } } },
            text: 'EL DESPERTAR reprints the card at triple size over a single question: WHO PAYS FOR THE GLASS? The printers\' guild — conservative men, fond of property, suddenly possessed of broken property — meets in extraordinary session and votes, for the first time in its history, to read your answer. Terror that fails to terrify is recruitment, conducted at the terrorist\'s expense.',
          },
          {
            text: 'The question lands in a city that half suspects you broke the windows yourselves for the sympathy — the right\'s papers suggest exactly that by noon. The printers, offered a choice between a pistol squad with patrons and a committee with a broadsheet, re-glaze their windows and their neutrality together.',
          },
        ],
      },
    ],
  },
];
