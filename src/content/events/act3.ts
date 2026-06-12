import type { EventCard } from '../../engine/events';

/**
 * Act III — the cascade approaches. You cannot win militarily and the
 * game never lets you: these cards are about loyalty, over-repression,
 * and the regime's grip loosening one refusal at a time. Several plant
 * flags milestone 4's loyalty system will pay off.
 */
export const ACT3_EVENTS: EventCard[] = [
  {
    id: 'conscript-leaflets',
    trigger: { flags: ['garrison-contacts'], resource: { legitimacy: { gte: 50 } }, notFlags: ['garrison-outreach', 'crackdown'] },
    weight: 25,
    art: 'barracks-letter',
    prose: [
      {
        text: 'The kitchen women propose the next step themselves: a leaflet written not to soldiers but to sons — in the voice of the streets they come from, signed by names they grew up under. "Not politics," the chairwoman says. "Just the truth about what they’d be shooting at."',
      },
    ],
    choices: [
      {
        id: 'send-leaflets',
        label: 'Write it with them, send it in',
        effect: {
          resources: { materiel: -6, heat: 6 },
          setFlags: ['garrison-outreach'],
          moods: { labor: 3, hardliners: 3 },
        },
        outcome: [
          {
            text: 'WHEN THEY ORDER YOU OUT, LOOK AT THE CROWD FIRST — folded into food parcels, copied in barrack latrines, recited, by reliable account, as a drinking toast in the third company. The colonels confiscate hundreds and understand, correctly, that confiscation is not the problem.',
          },
        ],
      },
      {
        id: 'too-soon',
        label: 'Hold — one leaflet too early burns the bridge',
        effect: { moods: { hardliners: -3, labor: -1 } },
        outcome: [
          {
            text: 'The parcels keep going in, innocent as bread. The bridge holds, uncrossed. Somewhere in the barracks, men who might have read your letter are left alone with the official explanation of things.',
          },
        ],
      },
    ],
  },
  {
    id: 'officers-letter',
    trigger: { resource: { legitimacy: { gte: 60 } }, turn: { gte: 26 }, notFlags: ['officers-letter', 'crackdown'] },
    weight: 18,
    prose: [
      {
        text: 'A letter arrives by three intermediaries, unsigned but unmistakably an officer’s hand: "There are more of us than you suppose who did not take a commission to make war on bread queues. If matters reach extremity, certain companies will look to their conscience. Conscience would be assisted by knowing your intentions toward the army as an institution."',
      },
    ],
    choices: [
      {
        id: 'answer-letter',
        label: 'Answer it — carefully, in writing',
        effect: {
          setFlags: ['officers-letter'],
          resources: { heat: 4 },
          moods: { moderates: 3, hardliners: -2 },
        },
        outcome: [
          {
            text: 'You write what can be written: the movement’s quarrel is with orders, not uniforms; no reprisals against soldiers who stand aside; the army of a free country will need its professionals. The reply that comes back is one line — "That can be worked with" — and the knowledge that you now hold correspondence that could hang a man you’ve never met.',
          },
        ],
      },
      {
        id: 'burn-letter',
        label: 'Burn it — provocation until proven otherwise',
        effect: { moods: { hardliners: 2, moderates: -2 } },
        outcome: [
          {
            text: 'It has every mark of a police lure, and you have buried men who answered similar letters. It burns. If it was genuine — and you will never know — somewhere an officer concludes the movement does not answer, and conscience, unassisted, goes back to taking orders.',
          },
        ],
      },
    ],
  },
  {
    id: 'curfew-decree',
    trigger: { resource: { heat: { gte: 40 }, legitimacy: { gte: 50 } }, turn: { gte: 24 }, notFlags: ['crackdown'] },
    weight: 16,
    art: 'curfew',
    prose: [
      {
        text: 'The governor-general decrees a curfew: streets clear by nine, gatherings of more than five persons forbidden, the mounted patrols doubled. The city, which works until ten and queues before dawn, reads the decree as what it is — an occupation announcing itself.',
      },
    ],
    choices: [
      {
        id: 'defy-curfew',
        label: 'Fill the streets at one minute past nine',
        effect: {
          resources: { legitimacy: 7, heat: 9, sympathizers: 5, grievance: 3 },
          moods: { students: 4, hardliners: 3, moderates: -4 },
        },
        outcome: [
          {
            text: 'At nine the bells; at one minute past, the promenade — families, in Sunday clothes, walking nowhere in particular by the tens of thousands. The patrols cannot arrest a city for strolling. The decree dies of embarrassment within the fortnight, and everyone saw it die.',
          },
        ],
      },
      {
        id: 'comply-visibly',
        label: 'Comply, ostentatiously — let the decree do the agitating',
        effect: {
          resources: { legitimacy: -3, grievance: 4, heat: -4 },
          moods: { moderates: 3, students: -3 },
        },
        outcome: [
          {
            text: 'The streets empty on the stroke, theatrical in their obedience, and the city seethes indoors. The grievance compounds nightly at no cost to you — and at no credit either. Resentment without a flag finds its own, eventually, and you have left the matter to "eventually."',
          },
        ],
      },
    ],
  },
  {
    id: 'mass-arrests',
    trigger: { resource: { heat: { gte: 45 } }, turn: { gte: 26 }, notFlags: ['crackdown'] },
    weight: 16,
    prose: [
      {
        text: 'The regime stops aiming: four hundred arrests in one night, swept by district rather than by evidence — choristers, pharmacists, a beekeepers’ society whose minutes were in cipher (it was a honey recipe). The cells overflow with people who went to sleep neutral.',
      },
    ],
    choices: [
      {
        id: 'publish-lists',
        label: 'Publish every name, every charge',
        effect: {
          resources: { legitimacy: 6, heat: 4 },
          moods: { students: 3, moderates: 2 },
        },
        outcome: [
          {
            text: 'THE WHISTLE runs all four hundred names with occupations and the charge — the same charge, four hundred times. The list reads like a census, which is the point: the city finds itself in it. The beekeepers, released, donate honey. Their treasurer asks about membership.',
          },
        ],
      },
      {
        id: 'aid-families',
        label: 'Quiet aid to four hundred households',
        effect: {
          resources: { materiel: -6, sympathizers: 7 },
          moods: { labor: 3, moderates: 2 },
        },
        outcome: [
          {
            text: 'Rent covered, parcels delivered, lawyers found — namelessly, which the four hundred households decline to keep secret. The regime jailed neutrals; someone fed their children. The arithmetic of loyalty does itself.',
          },
        ],
      },
    ],
  },
  {
    id: 'garrison-refusal-rumor',
    trigger: { resource: { legitimacy: { gte: 60 } }, turn: { gte: 28 }, notFlags: ['first-refusal', 'crackdown'] },
    weight: 18,
    art: 'garrison-gate',
    prose: [
      {
        text: 'From a rail-junction town in the provinces: ordered to clear a grain depot occupied by hungry railwaymen, the local half-company grounded arms and stood aside. The official gazette calls it a "redeployment." Three eyewitness letters call it what it was.',
      },
    ],
    choices: [
      {
        id: 'amplify',
        label: 'Print the eyewitness letters everywhere',
        effect: {
          resources: { legitimacy: 5, heat: 5 },
          setFlags: ['first-refusal'],
          moods: { hardliners: 3, students: 3 },
        },
        outcome: [
          {
            text: 'THE SOLDIERS OF KRESTOVKA STOOD ASIDE runs in every issue you can print. The regime court-martials quietly and thereby confirms loudly. In every barracks in the country, the question is now thinkable, because somewhere it was already answered.',
          },
        ],
      },
      {
        id: 'verify-first',
        label: 'Verify before you stake your name on it',
        effect: { resources: { legitimacy: 2 }, setFlags: ['first-refusal'], moods: { moderates: 2, hardliners: -2 } },
        outcome: [
          {
            text: 'Two weeks to confirm: true, mostly — a sergeant’s refusal more than a company’s, embroidered in the telling. You print the sober version. It travels slower than the legend would have, and arrives more durable. Both versions end the same way: it can be done.',
          },
        ],
      },
    ],
  },
  {
    id: 'foreign-loan-collapse',
    trigger: { turn: { gte: 28 }, notFlags: ['crackdown'] },
    weight: 12,
    prose: [
      {
        text: 'The Paris banks decline to roll over the sovereign loan — politely, catastrophically. Within days the treasury suspends contractor payments; within a week, half-pay in the arsenals "as a temporary measure." The regime has begun economizing on the people who hold its guns.',
      },
    ],
    choices: [
      {
        id: 'explain-it',
        label: 'Explain the default in every canteen',
        effect: {
          resources: { grievance: 7, legitimacy: 4 },
          moods: { labor: 3, students: 2 },
        },
        outcome: [
          {
            text: 'Your pamphlet does the bankers’ arithmetic in shop-floor language: the empire borrows abroad to pay the men who police its hunger at home, and now cannot do even that. Arsenal workers on half-pay read it on full break. Some truths only need delivering.',
          },
        ],
      },
      {
        id: 'court-arsenals',
        label: 'Send organizers into the arsenal districts',
        effect: {
          resources: { cadre: -1, sympathizers: 8, heat: 5 },
          moods: { labor: 4, hardliners: 2 },
        },
        outcome: [
          {
            text: 'The arsenal rows were the regime’s aristocracy of labor — loyal, paid, proud. Half-pay has dissolved two of the three. Your organizers find the meetings already happening and simply bring an agenda. One organizer is recognized and taken at the gate; the men who watched it happen come to the next meeting angrier.',
          },
        ],
      },
    ],
  },
  {
    id: 'palace-overture',
    trigger: { resource: { legitimacy: { gte: 65 } }, turn: { gte: 30 }, notFlags: ['crackdown'] },
    weight: 16,
    prose: [
      {
        text: 'It comes on crested paper, through a chamberlain, to Vera: amnesty, a consultative assembly, press relaxation — in exchange for "the cessation of agitation during a period of national recovery." The regime is offering to buy the movement with the movement’s own demands, minus the one that matters.',
      },
    ],
    choices: [
      {
        id: 'entertain-talks',
        label: 'Enter talks — test what they’ll concede',
        effect: {
          setFlags: ['amnesty-offer'],
          moods: { moderates: 8, hardliners: -8, students: -4 },
        },
        outcome: [
          {
            text: 'Vera negotiates like the lawyer she is: concede nothing, document everything, schedule another session. Each round the palace offers more, which tells the city the palace is weakening — and tells your hardliners the leadership is shopping for an exit. Both readings are now loose in the world.',
          },
        ],
      },
      {
        id: 'refuse-overture',
        label: 'Refuse: no recovery without removal',
        effect: {
          resources: { legitimacy: 4, heat: 5 },
          moods: { hardliners: 6, students: 3, moderates: -6 },
        },
        outcome: [
          {
            text: 'Your reply is one sentence and the city memorizes it by Thursday: "We did not come this far to redecorate the cell." The chamberlain’s second letter is not sent. Whatever happens now will not be negotiated, which thrills exactly the people it should worry.',
          },
        ],
      },
    ],
  },
  {
    id: 'police-defector',
    trigger: { resource: { legitimacy: { gte: 55 } }, turn: { gte: 28 }, notFlags: ['crackdown'] },
    weight: 14,
    prose: [
      {
        text: 'A precinct captain — twenty years of service, a face like a closed ledger — arrives at a safehouse with a valise of files and a sentence he has clearly rehearsed: "I have spent my career watching who they actually fear, and I have decided to be on file with the winners."',
      },
    ],
    choices: [
      {
        id: 'shelter-him',
        label: 'Take him in, files and all',
        effect: {
          resources: { heat: -10, materiel: -4 },
          moods: { hardliners: -2, moderates: 2 },
        },
        outcome: [
          {
            text: 'The valise holds the watch rosters, the informant ledger, and the schedule of the next sweep. Three names in the informant ledger attend your meetings; one of them sits on a committee. The captain asks for nothing but a cot and, eventually, "useful work." Everyone is very polite to him. No one sleeps near him.',
          },
        ],
      },
      {
        id: 'turn-away',
        label: 'A man who defects once defects twice',
        effect: { resources: { heat: 3 }, moods: { hardliners: 2, moderates: -2 } },
        outcome: [
          {
            text: 'You copy what he’ll show and send him on to the border. Prudent, probably. The files he kept — out of a clerk’s habit of insurance — surface a year later in a memoir published abroad, including an unflattering and accurate chapter on the evening you turned him away.',
          },
        ],
      },
    ],
  },
  {
    id: 'railway-junction',
    trigger: { flags: ['strike-won'], turn: { gte: 26 }, notFlags: ['crackdown'] },
    weight: 14,
    prose: [
      {
        text: 'The railwaymen’s brotherhood — cautious through every season of your movement, the aristocrats of steam — send a delegation at last. They control what moves: grain, coal, troops. "If there is to be a moment," their elder says, "we would rather choose it with you than have it chosen for us."',
      },
    ],
    choices: [
      {
        id: 'coordinate',
        label: 'Bring them into the planning',
        effect: {
          resources: { sympathizers: 6, heat: 7 },
          setFlags: ['railway-pact'],
          moods: { labor: 5, hardliners: 2, moderates: -2 },
        },
        outcome: [
          {
            text: 'Maps come out: junctions, signal boxes, the four bridges that matter. Nothing is scheduled; everything is understood. The movement now holds, jointly, the power to stop the country — a power useful precisely so long as it is never quite used.',
          },
        ],
      },
      {
        id: 'keep-distance',
        label: 'Coordination is conspiracy — keep it loose',
        effect: { moods: { labor: -3, moderates: 2 } },
        outcome: [
          {
            text: 'You exchange courtesies and a channel for messages, nothing more. The brotherhood withdraws into its caution. When the moment comes, the railways will decide alone, on the day, by temperament — which is what you chose for them today.',
          },
        ],
      },
    ],
  },
  {
    id: 'reprisal-lists',
    trigger: { resource: { legitimacy: { gte: 60 } }, factionMood: { hardliners: { gte: 45 } }, turn: { gte: 30 }, notFlags: ['crackdown'] },
    weight: 14,
    prose: [
      {
        text: 'You find it by accident, left in a drill-book: a list in Ilya’s orderly hand. Police captains, informers, the magistrate who sentences strikers, the depot master from the grain affair. No heading, no dates. A list like that needs neither — everyone knows what it is for, including the day after victory.',
      },
    ],
    choices: [
      {
        id: 'forbid-lists',
        label: 'Forbid it — no ledgers of revenge',
        effect: {
          resources: { legitimacy: 3 },
          moods: { hardliners: -6, moderates: 5 },
        },
        outcome: [
          {
            text: 'You burn it in front of him. Ilya watches it go: "You think the day after will be administered by forgiveness?" Perhaps not — but it will not be administered by that list. He rewrites less than he remembers; no one rewrites what they remember.',
          },
        ],
      },
      {
        id: 'allow-quietly',
        label: 'Look away — discipline has its uses',
        effect: {
          setFlags: ['reprisal-lists'],
          moods: { hardliners: 5, moderates: -4 },
        },
        outcome: [
          {
            text: 'You close the drill-book and say nothing, and your silence is filed with the list. It costs nothing today. It is the kind of debt that compounds precisely until the day it can be collected — and it is in his handwriting, but it has become your signature.',
          },
        ],
      },
    ],
  },
  {
    id: 'empress-portrait',
    trigger: { resource: { legitimacy: { gte: 55 }, heat: { gte: 35 } }, turn: { gte: 28 }, notFlags: ['crackdown'] },
    weight: 12,
    prose: [
      {
        text: 'After the bread ration shrinks again, a market crowd takes the sovereign’s portrait down from the exchange facade and burns it in the square — laughing, which the gendarme report will struggle to convey. No one organized it. That is precisely what should interest you.',
      },
    ],
    choices: [
      {
        id: 'celebrate-it',
        label: 'Claim the laughter — print the scene',
        effect: {
          resources: { legitimacy: 4, heat: 6 },
          moods: { students: 4, moderates: -3 },
        },
        outcome: [
          {
            when: { resource: { legitimacy: { gte: 70 } } },
            text: 'Your broadsheet of the burning — the laughing faces lovingly rendered — sells out three printings. The regime cannot punish a mood. When the sovereign’s name now comes up in queues, someone smiles, and the smile is yours. Authority can survive being feared; it cannot survive being found funny.',
          },
          {
            text: 'You print the scene and the regime prints its answer: sacrilege, mob rule, and your masthead beside both words. The respectable city, which dislikes the sovereign but fears the mob more, edges back a step. The laughter was free; claiming it was not.',
          },
        ],
      },
      {
        id: 'distance',
        label: 'Stay clear of portrait-burning',
        effect: { moods: { moderates: 2, students: -3 } },
        outcome: [
          {
            text: 'The movement’s papers do not mention the square. The mood finds other outlets and other authors. You kept your dignity; the street kept the joke; the regime kept nothing — but none of it accrued to you either.',
          },
        ],
      },
    ],
  },
  {
    id: 'barracks-chaplain',
    trigger: { flags: ['garrison-outreach'], turn: { gte: 30 }, notFlags: ['crackdown'] },
    weight: 14,
    prose: [
      {
        text: 'The garrison chaplain — who has buried the conscripts’ accidents and written their mothers’ letters for thirty years — sends word through the kitchens: he preaches Sunday on the commandment against killing, and would not object to a full church. He is asking, in the only grammar available to him, whose side the pulpit should face.',
      },
    ],
    choices: [
      {
        id: 'fill-the-church',
        label: 'Fill his church — quietly, completely',
        effect: {
          resources: { materiel: -3 },
          setFlags: ['chaplain-sermon'],
          moods: { labor: 2, moderates: 3 },
        },
        outcome: [
          {
            text: 'Standing room only: kitchen women, locked-out men, and — in the rear pews, in civilian coats that fool no one — soldiers. The sermon never mentions the regime. It mentions Cain, at length, and asks who gave him the order. The garrison talks of nothing else for a week, and the colonels cannot court-martial scripture.',
          },
        ],
      },
      {
        id: 'keep-clear-church',
        label: 'The pulpit is not yours to enlist',
        effect: { moods: { hardliners: -2, students: -1 } },
        outcome: [
          {
            text: 'He preaches to his usual fifty. The sermon is reported, secondhand and shrunken, as eccentricity. A man offered you his one Sunday of courage and you left the pews empty to keep your doctrine tidy.',
          },
        ],
      },
    ],
  },
  {
    id: 'generals-adjutant',
    trigger: { flags: ['officers-letter'], resource: { legitimacy: { gte: 70 } }, notFlags: ['crackdown'] },
    weight: 16,
    prose: [
      {
        text: 'The correspondence bears fruit of a heavier kind: an adjutant to the garrison commander himself, met in a tailor’s back room, asking the only question that matters to men with careers and necks: "If the garrison stands aside — stands aside, no more — what becomes of its officers afterward?"',
      },
    ],
    choices: [
      {
        id: 'give-guarantees',
        label: 'Guarantees: no tribunals for neutrality',
        effect: {
          setFlags: ['guarantees-given'],
          moods: { moderates: 4, hardliners: -4 },
        },
        outcome: [
          {
            text: 'You commit it to paper: officers who refuse orders against the people answer to no revolutionary tribunal for the refusal. The adjutant reads it twice and keeps it. You have just promised away a piece of the morning after — and bought, perhaps, the only thing worth buying with it.',
          },
        ],
      },
      {
        id: 'no-guarantees',
        label: 'No paper for butchers’ clerks',
        effect: {
          resources: { legitimacy: 2 },
          moods: { hardliners: 5, moderates: -3 },
        },
        outcome: [
          {
            text: '"Conscience that invoices in advance is commerce," you tell him, and Ilya quotes it for years. The adjutant leaves with nothing in writing. The garrison’s calculation remains exactly as cold as you left it, and cold calculations, on the day, tend to obey.',
          },
        ],
      },
    ],
  },
  {
    id: 'order-for-amnesty',
    trigger: { flags: ['unit-refused'], notFlags: ['crackdown'] },
    weight: 30,
    prose: [
      {
        text: 'Within days of the refusal, the palace’s last offer arrives — no chamberlain this time, just a colonel with tired eyes and full powers: general amnesty, a constitution within the year, and the refusing unit pardoned to the last man, if the movement will call for order now. He does not pretend it is strength. "You can have the city in ruins next month," he says, "or most of what you wanted by Friday."',
      },
    ],
    choices: [
      {
        id: 'take-friday',
        label: 'Take most of it, by Friday',
        effect: {
          resources: { legitimacy: -8, heat: -15 },
          setFlags: ['settlement-sought'],
          moods: { moderates: 8, hardliners: -9, students: -5, labor: -2 },
        },
        outcome: [
          {
            text: 'You signal for calm, and the city — astonishingly, painfully — obeys you, which proves the colonel’s point about who governs now. The talks convene. Every hour at that table, the street’s certainty cools a degree, and Ilya attends no sessions and keeps no appointments and waits.',
          },
        ],
      },
      {
        id: 'refuse-colonel',
        label: 'The time for Fridays has passed',
        effect: {
          resources: { legitimacy: 4, heat: 6 },
          moods: { hardliners: 6, students: 4, moderates: -6 },
        },
        outcome: [
          {
            text: 'The colonel nods like a man who has lost a wager with himself and leaves his card — "for the day after, whichever of us is left to use it." The offer becomes a pamphlet by morning: THEY ARE BARGAINING. EVEN THEY KNOW. The regime has confessed its weakness to its own garrisons, in writing.',
          },
        ],
      },
    ],
  },
  {
    id: 'loyalist-rump',
    trigger: { flags: ['unit-refused'], resource: { heat: { gte: 30 } }, notFlags: ['crackdown'] },
    weight: 22,
    prose: [
      {
        text: 'What remains loyal concentrates: officers who cannot be forgiven, officials with nowhere to defect to, the men whose names lead every list. They hold the ministry quarter and the arsenal bridge, and their commander has issued one statement: he would "rather leave a lesson than a city." The neutral districts between you and them are emptying of children.',
      },
    ],
    choices: [
      {
        id: 'open-corridor',
        label: 'Offer the rump a corridor out',
        effect: {
          resources: { legitimacy: 5, materiel: -4 },
          moods: { moderates: 6, hardliners: -7 },
        },
        outcome: [
          {
            text: 'You publish the route and the terms — arms stacked at the bridge, safe passage to the port, no names taken. A third of them go the first night, which is a third fewer rifles behind the lesson their commander wanted to leave. Ilya calls it mercy for arsonists. Vera calls it the cheapest victory anyone ever bought. The children come back to the neutral districts.',
          },
        ],
      },
      {
        id: 'tighten-ring',
        label: 'Starve the quarter — no terms',
        effect: {
          resources: { heat: 8, grievance: 4 },
          moods: { hardliners: 6, moderates: -6, labor: -2 },
        },
        outcome: [
          {
            text: 'The ring closes. Nothing enters the ministry quarter but rumors of what happens to holdouts. It will work — sieges of the irreconcilable always work — but the neutral districts watch you practice the regime’s arithmetic with better bookkeeping, and somewhere in the cellars, Ilya’s list grows a second page.',
          },
        ],
      },
    ],
  },
  {
    id: 'eve-of-cascade',
    trigger: { resource: { legitimacy: { gte: 75 }, heat: { gte: 30 } }, turn: { gte: 34 }, notFlags: ['crackdown'] },
    weight: 20,
    art: 'eve',
    prose: [
      {
        text: 'The city has stopped pretending: tram crews ignore the inspectors, the evening police patrol walks two streets short of its route, and the garrison has not been issued ball cartridge in three weeks because no one in the chain of command wants to sign for it. Everyone is waiting. Waiting is now the only thing holding the regime up — and the only thing holding you back.',
      },
    ],
    choices: [
      {
        id: 'flood-streets',
        label: 'Call everyone out — force the question',
        effect: {
          resources: { sympathizers: 5, legitimacy: 4, heat: 8 },
          moods: { hardliners: 4, students: 4, moderates: -3 },
        },
        outcome: [
          {
            text: 'The committees empty every district at once and the city simply changes hands underfoot — not seized, vacated. Somewhere a colonel is ordered to restore order and discovers what every colonel in history discovers at this exact hour: an order is a question whose answer has been assumed.',
          },
        ],
      },
      {
        id: 'let-regime-move-first',
        label: 'Hold — let the regime break the stillness',
        effect: {
          resources: { heat: -5, grievance: 3 },
          moods: { moderates: 3, hardliners: -3 },
        },
        outcome: [
          {
            text: 'You hold the committees in. The regime, abhorring a silence it no longer owns, fills it — new arrests, a panicked decree, cavalry on the boulevard for no occasion at all. Every move it makes recruits for you. Patience, this late, is a weapon with a single edge: it cuts only if the cascade comes before the winter does.',
          },
        ],
      },
    ],
  },
];
