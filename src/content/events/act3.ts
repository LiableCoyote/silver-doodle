import type { EventCard } from '../../engine/events';

/**
 * Act III — June into July: the conspiracy is no longer deniable and the
 * city cannot win by fighting; these cards are about the barracks, the
 * over-reach of the state of alarm, and the plotters' grip loosening one
 * refusal at a time. Several plant flags the rising will settle.
 */
export const ACT3_EVENTS: EventCard[] = [
  {
    id: 'conscript-leaflets',
    trigger: { flags: ['garrison-contacts'], resource: { legitimacy: { gte: 50 } }, notFlags: ['garrison-outreach', 'crackdown'] },
    weight: 25,
    art: 'barracks-letter',
    prose: [
      {
        text: 'The comedor women propose the next step themselves: a letter written not to soldiers but to sons — in the voice of the streets they come from, signed by names they grew up under. "Not politics," the chairwoman says. "Just the truth about what they\'d be ordered to fire at."',
      },
    ],
    choices: [
      {
        id: 'send-leaflets',
        label: 'Write it with them, send it into the Cuartel',
        effect: {
          resources: { materiel: -6, heat: 6 },
          setFlags: ['garrison-outreach'],
          moods: { labor: 3, hardliners: 3 },
        },
        outcome: [
          {
            text: 'WHEN THEY ORDER YOU OUT, LOOK AT THE CROWD FIRST — folded into food parcels, copied in the barrack latrines, recited, by reliable account, as a toast in the second company. The officers confiscate hundreds and understand, correctly, that confiscation is not the problem.',
          },
        ],
      },
      {
        id: 'too-soon',
        label: 'Hold — one letter too early burns the bridge',
        effect: { moods: { hardliners: -3, labor: -1 } },
        outcome: [
          {
            text: 'The parcels keep going in, innocent as bread. The bridge holds, uncrossed. Somewhere in the Cuartel, men who might have read your letter are left alone with their officers\' explanation of things.',
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
        text: 'A letter arrives by three intermediaries, unsigned but unmistakably a serving officer\'s hand — UMRA, the republican officers\' league, has men even here: "There are more of us in this garrison than you suppose who did not take a commission to make war on bread queues. If matters reach extremity, certain companies will look to their conscience. Conscience would be assisted by knowing the committee\'s intentions toward the army as an institution."',
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
            text: 'You write what can be written: the movement\'s quarrel is with the conspiracy, not the uniform; no reprisals against soldiers who stand aside; the Republic\'s army will need its professionals. The reply that comes back is one line — "That can be worked with" — and the knowledge that you now hold correspondence that could stand a man you have never met against a wall.',
          },
        ],
      },
      {
        id: 'burn-letter',
        label: 'Burn it — provocation until proven otherwise',
        effect: { moods: { hardliners: 2, moderates: -2 } },
        outcome: [
          {
            text: 'It has every mark of a Brigada Social lure, and you have buried men who answered similar letters. It burns. If it was genuine — and you will never know — somewhere in the Cuartel an officer concludes the committee does not answer, and conscience, unassisted, goes back to taking orders.',
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
        text: 'The civil governor tightens the state of alarm: streets clear by ten, gatherings of more than five persons forbidden, the Asalto patrols doubled. The city, which works until eleven and queues before dawn, reads the decree as what it is — an admission that the street is no longer his.',
      },
    ],
    choices: [
      {
        id: 'defy-curfew',
        label: 'Fill the streets at one minute past ten',
        effect: {
          resources: { legitimacy: 7, heat: 9, sympathizers: 5, grievance: 3 },
          moods: { students: 4, hardliners: 3, moderates: -4 },
        },
        outcome: [
          {
            text: 'At ten the church bells; at one minute past, the paseo — families, in Sunday clothes, strolling nowhere in particular by the tens of thousands. The patrols cannot detain a city for taking the air. The decree dies of embarrassment within the fortnight, and everyone saw it die.',
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
            text: 'The streets empty on the stroke, theatrical in their obedience, and the city seethes indoors. The grievance compounds nightly at no cost to you — and at no credit either. Resentment without a banner finds its own, eventually, and you have left the matter to "eventually."',
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
        text: 'The Brigada Social stops aiming: four hundred detentions in one night under the state of alarm, swept by district rather than by evidence — choristers, pharmacists, a beekeepers\' cooperative whose minutes were in Catalan (the inspector could not read Catalan). The cells overflow with people who went to sleep neutral.',
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
            text: 'EL DESPERTAR runs all four hundred names with occupations and the charge — the same charge, four hundred times. The list reads like a census, which is the point: the city finds itself in it. The beekeepers, released, donate honey. Their treasurer asks about membership.',
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
            text: 'Rent covered, parcels delivered, the prietistas\' lawyers found — namelessly, which the four hundred households decline to keep secret. The state jailed neutrals; someone fed their children. The arithmetic of July does itself.',
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
        text: 'From a rail-junction town up the line: ordered to clear a grain depot occupied by hungry railwaymen, the local section of Asaltos grounded arms and stood aside. The official note calls it a "redeployment." Three eyewitness letters call it what it was.',
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
            text: 'THE GUARDIAS OF LA JUNQUERA STOOD ASIDE runs in every issue you can print. The government transfers the section quietly and thereby confirms it loudly. In every barracks in the province, the question is now thinkable, because somewhere it was already answered.',
          },
        ],
      },
      {
        id: 'verify-first',
        label: 'Verify before you stake the alliance\'s name on it',
        effect: { resources: { legitimacy: 2 }, setFlags: ['first-refusal'], moods: { moderates: 2, hardliners: -2 } },
        outcome: [
          {
            text: 'Two weeks to confirm: true, mostly — a sergeant\'s refusal more than a section\'s, embroidered in the telling. You print the sober version. It travels slower than the legend would have, and arrives more durable. Both versions end the same way: it can be done.',
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
        text: 'The money is leaving Spain by the trainload — the Paris exchange marks the peseta down again, the banks\' gold goes north "for safekeeping," and half the patronal\'s directors are suddenly wintering in Biarritz in June. Within a week two mills announce short time "pending clarity," and the men on short time have plenty of time to think about clarity.',
      },
    ],
    choices: [
      {
        id: 'explain-it',
        label: 'Explain the flight in every canteen',
        effect: {
          resources: { grievance: 7, legitimacy: 4 },
          moods: { labor: 3, students: 2 },
        },
        outcome: [
          {
            text: 'Your leaflet does the bankers\' arithmetic in shop-floor language: the owners are moving the country\'s money out ahead of a summer they evidently know something about. Short-time men read it on full break. Some truths only need delivering.',
          },
        ],
      },
      {
        id: 'court-arsenals',
        label: 'Send organizers to the short-time mills',
        effect: {
          resources: { cadre: -1, sympathizers: 8, heat: 5 },
          moods: { labor: 4, hardliners: 2 },
        },
        outcome: [
          {
            text: 'The short-time rows were the patronal\'s steadiest — loyal, paid, proud. Half-pay has dissolved two of the three loyalties. Your organizers find the meetings already happening and simply bring an agenda. One organizer is recognized and detained at the gate; the men who watched it happen come to the next meeting angrier.',
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
        text: 'It comes on the Gobierno Civil\'s letterhead, through the prietistas, in the governor\'s own hand: the spring\'s prosecutions reviewed, the alliance\'s papers legalized, places on the municipal boards — in exchange for "the cessation of agitation during a period of national tension." The Republic is offering to buy the movement with the movement\'s own demands, minus the one that matters in July.',
      },
    ],
    choices: [
      {
        id: 'entertain-talks',
        label: 'Enter talks — test what the Republic will concede',
        effect: {
          setFlags: ['amnesty-offer'],
          moods: { moderates: 8, hardliners: -8, students: -4 },
        },
        outcome: [
          {
            text: 'The prietistas negotiate like the lawyers they are: concede nothing, document everything, schedule another session. Each round the governor offers more, which tells the city the state is weakening — and tells the faístas the committee is shopping for an exit. Both readings are now loose in the world.',
          },
        ],
      },
      {
        id: 'refuse-overture',
        label: 'Refuse: no quiet while the garrison plots',
        effect: {
          resources: { legitimacy: 4, heat: 5 },
          moods: { hardliners: 6, students: 3, moderates: -6 },
        },
        outcome: [
          {
            text: 'The reply is one sentence and the city memorizes it by Thursday: "Disarm the conspiracy and the streets will quiet themselves." The governor\'s second letter is not sent. Whatever happens now will not be negotiated, which thrills exactly the people it should worry.',
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
        text: 'An inspector of the Brigada Social — twenty years of service, a face like a closed ledger — arrives at the safe floor with a valise of files and a sentence he has clearly rehearsed: "I have spent my career watching who they actually fear, and I have decided to be on file with the winners."',
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
            text: 'The valise holds the watch rosters, the informant ledger, and the schedule of the next sweep. Three names in the informant ledger attend your meetings; one of them sits on a syndicate committee. The inspector asks for nothing but a cot and, eventually, "useful work." Everyone is very polite to him. No one sleeps near him.',
          },
        ],
      },
      {
        id: 'turn-away',
        label: 'A man who defects once defects twice',
        effect: { resources: { heat: 3 }, moods: { hardliners: 2, moderates: -2 } },
        outcome: [
          {
            text: 'You copy what he\'ll show and send him toward the border. Prudent, probably. The files he kept — out of a policeman\'s habit of insurance — surface a year later in a memoir published in Toulouse, including an unflattering and accurate chapter on the evening you turned him away.',
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
        text: 'The railwaymen\'s federation — cautious through every season of the spring, the aristocrats of the timetable — send a delegation at last. They control what moves: grain, coal, troops. "If there is to be an hour," their elder says, "we would rather choose it with the alliance than have it chosen for us by a stationmaster in Pamplona."',
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
            text: 'Maps come out: the junction, the signal boxes, the two bridges that matter. Nothing is scheduled; everything is understood. The alliance now holds, jointly, the power to strand every troop train in the province — a power useful precisely so long as it is never quite used.',
          },
        ],
      },
      {
        id: 'keep-distance',
        label: 'Coordination is conspiracy — keep it loose',
        effect: { moods: { labor: -3, moderates: 2 } },
        outcome: [
          {
            text: 'You exchange courtesies and a channel for messages, nothing more. The federation withdraws into its caution. When the hour comes, the railways will decide alone, on the day, by temperament — which is what you chose for them today.',
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
        text: 'You find it by accident, left in a drill-book at the quarry: a list in the defense committee\'s orderly hand. The comandante of the Guardia Civil, the Brigada Social\'s inspectors, the magistrate who signs the state-of-alarm warrants, the depot master from the grain affair. No heading, no dates. A list like that needs neither — everyone knows what it is for, including the day after the rising fails.',
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
            text: 'You burn it in front of the delegate. He watches it go: "You think the day after will be administered by forgiveness?" Perhaps not — but it will not be administered by that list. He rewrites less than he remembers; no one rewrites what they remember.',
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
            text: 'You close the drill-book and say nothing, and your silence is filed with the list. It costs nothing today. It is the kind of debt that compounds precisely until the day it can be collected — and it is in the defense committee\'s handwriting, but it has become your signature. In the barracks, when word of such lists travels, and it travels, men who might have wavered remember their pensions.',
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
        text: 'After the bread ration shortens again, a market crowd empties the Renovación Española circle\'s street window and burns its portrait of the exiled king in the plaza — laughing, which the Asaltos\' report will struggle to convey. No one organized it. That is precisely what should interest you.',
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
            text: 'Your broadsheet of the burning — the laughing faces lovingly rendered — sells out three printings. The right cannot punish a mood. When the monarchist circle\'s name now comes up in the queues, someone smiles, and the smile is yours. A cause can survive being feared; it cannot survive being found funny.',
          },
          {
            text: 'You print the scene and the right prints its answer: sacrilege, mob rule, and the alliance\'s masthead beside both words. The respectable city, which dislikes the old king but fears the crowd more, edges back a step. The laughter was free; claiming it was not.',
          },
        ],
      },
      {
        id: 'distance',
        label: 'Stay clear of portrait-burning',
        effect: { moods: { moderates: 2, students: -3 } },
        outcome: [
          {
            text: 'The alliance\'s papers do not mention the plaza. The mood finds other outlets and other authors. You kept your dignity; the street kept the joke; the monarchists kept nothing — but none of it accrued to you either.',
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
        text: 'The garrison chaplain — who has buried the conscripts\' accidents and written their mothers\' letters for thirty years, and who watched the officers\' casino from the outside all that time — sends word through the comedores: he preaches Sunday on the commandment against killing, and would not object to a full church. He is asking, in the only grammar available to him, whose side the pulpit should face.',
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
            text: 'Standing room only: comedor women, locked-out men, and — in the rear pews, in civilian jackets that fool no one — soldiers. The sermon never mentions the conspiracy. It mentions Cain, at length, and asks who gave him the order. The Cuartel talks of nothing else for a week, and the colonels cannot court-martial scripture.',
          },
        ],
      },
      {
        id: 'keep-clear-church',
        label: 'The pulpit is not the alliance\'s to enlist',
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
        text: 'The correspondence bears fruit of a heavier kind: an intermediary of the Guardia Civil comandante himself, met in a tailor\'s back room, asking the only question that matters to men with an institution and necks: "If the corps stands aside when the hour comes — stands aside, no more — what becomes of the Guardia Civil afterward? The barracks, the pensions, the corps itself?"',
      },
    ],
    choices: [
      {
        id: 'give-guarantees',
        label: 'Guarantees: the corps survives its neutrality',
        effect: {
          setFlags: ['guarantees-given'],
          moods: { moderates: 4, hardliners: -4 },
        },
        outcome: [
          {
            text: 'You commit it to paper: guardias who refuse the conspiracy\'s orders answer to no committee for the refusal; the corps that stands with the Republic keeps its barracks and its rolls. The intermediary reads it twice and keeps it. You have just promised away a piece of every morning after — and bought, perhaps, the only thing in Spain worth that price.',
          },
        ],
      },
      {
        id: 'no-guarantees',
        label: 'No paper for the tricorns',
        effect: {
          resources: { legitimacy: 2 },
          moods: { hardliners: 5, moderates: -3 },
        },
        outcome: [
          {
            text: '"Neutrality that invoices in advance is commerce," you tell him, and the faístas quote it for years. The intermediary leaves with nothing in writing. The casa-cuartel\'s calculation remains exactly as cold as you left it, and cold calculations, on the day, tend to side with the stronger battalion.',
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
        text: 'Within days of the refusal, the governor\'s last offer arrives — no secretary this time, just a colonel of carabineros with tired eyes and full powers: the spring\'s prosecutions annulled, the refusing unit shielded from courts-martial, the alliance\'s status regularized — if the committee will call for order now. He does not pretend it is strength. "You can have this city in ruins by August," he says, "or most of what you asked for by Friday."',
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
            text: 'You signal for calm, and the city — astonishingly, painfully — obeys you, which proves the colonel\'s point about who governs now. The talks convene. Every hour at that table, the street\'s certainty cools a degree, and the faísta delegate attends no sessions and keeps no appointments and waits.',
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
            text: 'The colonel nods like a man who has lost a wager with himself and leaves his card — "for the day after, whichever of us is left to use it." The offer becomes a leaflet by morning: THEY ARE BARGAINING. EVEN THEY KNOW. The state has confessed its weakness to its own garrisons, in writing.',
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
        text: 'What remains committed to the conspiracy concentrates: officers who cannot be forgiven, Falangists with nowhere to defect to, the men whose names lead every list. They hold the streets around the officers\' casino and the arsenal bridge, and their commander has let one statement travel: he would "rather leave a lesson than a city." The neutral blocks between you and them are emptying of children.',
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
            text: 'You publish the route and the terms — arms stacked at the bridge, safe passage to the port, no names taken. A third of them go the first night, which is a third fewer pistols behind the lesson their commander wanted to leave. The faístas call it mercy for pistoleros. The prietistas call it the cheapest victory anyone ever bought. The children come back to the neutral blocks.',
          },
        ],
      },
      {
        id: 'tighten-ring',
        label: 'Starve the casino quarter — no terms',
        effect: {
          resources: { heat: 8, grievance: 4 },
          moods: { hardliners: 6, moderates: -6, labor: -2 },
        },
        outcome: [
          {
            text: 'The ring closes. Nothing enters the casino quarter but rumors of what happens to holdouts. It will work — sieges of the irreconcilable always work — but the neutral blocks watch you practice the state\'s arithmetic with better bookkeeping, and somewhere in the quarry drill-books, a certain list grows a second page.',
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
        text: 'The city has stopped pretending: the tram crews ignore the inspectors, the evening Asalto patrol walks two streets short of its route, and the Cuartel has not issued ball cartridge in three weeks because no one in the chain of command wants to sign for it. Everyone is waiting. Waiting is now the only thing holding the old order up — and the only thing holding you back.',
      },
    ],
    choices: [
      {
        id: 'flood-streets',
        label: 'Call everyone out — force the question early',
        effect: {
          resources: { sympathizers: 5, legitimacy: 4, heat: 8 },
          moods: { hardliners: 4, students: 4, moderates: -3 },
        },
        outcome: [
          {
            text: 'The syndicates empty every district at once and the city simply changes hands underfoot — not seized, vacated. Somewhere in the Cuartel a colonel is ordered to restore order and discovers what every colonel in Spain is about to discover: an order is a question whose answer has been assumed.',
          },
        ],
      },
      {
        id: 'let-regime-move-first',
        label: 'Hold — let the conspiracy break the stillness',
        effect: {
          resources: { heat: -5, grievance: 3 },
          moods: { moderates: 3, hardliners: -3 },
        },
        outcome: [
          {
            text: 'You hold the syndicates in. The state, abhorring a silence it no longer owns, fills it — new detentions, a panicked decree, cavalry on the avenida for no occasion at all. Every move it makes recruits for you. Patience, this late, is a weapon with a single edge: it cuts only if you are still standing on the 19th.',
          },
        ],
      },
    ],
  },
];
