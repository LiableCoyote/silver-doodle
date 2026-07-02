# Revolution — Browser Game Development Plan

A single-player, browser-based strategy game about how movements rise, win, and devour
themselves — built from the *Revolution RTS design brief*. This plan prioritizes
**writing and mechanics** for the first playable, while laying architectural groundwork
so visuals can be layered in later without rewrites.

---

## 1. Vision & Scope

**One sentence:** You manage a revolutionary movement's commitment and visibility — not
buildings or armies — and win when the regime's security forces refuse to fire, a tipping
point you spend the whole game setting up.

**Scope decision (per the brief's own warning):** Ship the Act I–III seizure loop.
Act IV ("the morning after") is designed-for but not built — we leave hooks in the data
model (promises-as-debts, faction grudges persist to end-of-game scoring) so a sequel
or post-launch act can be added without a schema rewrite.

**Format:** Turn-based (weekly turns), text-forward, session length 45–90 minutes per
campaign. Turn-based rather than real-time because:
- It privileges writing — every turn can deliver prose, and players read at their own pace.
- It makes the simulation deterministic and testable.
- It works on phones in a browser tab, which is where text games live.

**Tone:** Clear-eyed, unromantic, darkly literate. The brief says the mechanics argue a
thesis whether we like it or not — so we choose one deliberately: *this is a game about
the price of every path to power*. Every mechanical gain has a written human cost; the
prose never lets the player forget that "spending cadre" means people.

---

## 2. Architecture — the seam between simulation and presentation

The single most important technical decision: **the simulation never touches the DOM.**

```
┌─────────────────────────────────────────────────────┐
│  /src/engine        pure TypeScript, zero deps      │
│   state.ts          GameState (plain serializable)  │
│   actions.ts        player commands (data, not fns) │
│   reducer.ts        (state, action, rng) → state    │
│   events/           event deck, triggers, weights   │
│   formulas.ts       cohesion, heat, cascade math    │
│   rng.ts            seeded PRNG (replayable games)  │
├─────────────────────────────────────────────────────┤
│  /src/content       writing lives here, as data     │
│   events/*.ts       event cards w/ conditional text │
│   factions.ts       voices, vocab, complaint lines  │
│   ideologies.ts     starting weights + flavor       │
│   strings.ts        UI copy, tooltips, codex        │
├─────────────────────────────────────────────────────┤
│  /src/ui            presentation (swappable)        │
│   views/            turn report, map, faction panel │
│   theme/            design tokens (groundwork, §6)  │
└─────────────────────────────────────────────────────┘
```

**Stack:** TypeScript + Vite + Preact (small, fast, no build exotica) + Vitest.
No backend — state saves to `localStorage`, shareable via seed + action log in URL.
The engine being a pure `(state, action) → state` reducer gives us for free:
- **Replays & debugging** — a bug report is a seed plus an action list.
- **Balance testing** — run 10,000 simulated campaigns headless in CI, chart outcomes.
- **The visual upgrade path** — any renderer (DOM, canvas, WebGL) just reads state.

---

## 3. Mechanics (the first-playable core)

### 3.1 Resources

| Resource | Behavior |
|---|---|
| **Legitimacy** | Narrative capital. Gates recruitment, feeds defection odds. Compounds slowly, can crash overnight on a misstep. |
| **Cadre** | Disciplined core. Quality. Spent by operations, lost to raids. |
| **Sympathizers** | Mass support. Quantity, unreliable, decays without attention. Converts to Cadre slowly and safely, or quickly and loudly. |
| **Materiel** | Money, presses, safehouses. The boring layer that actually wins; most failed runs die here. |
| **Heat** | Regime attention. Crossing thresholds unlocks regime escalations: surveillance → infiltration → raids → massacres. |
| **Cohesion** | Internal unity. The faction loop's fuel (3.2). Hitting zero = the split, not a regime loss. |
| **Grievance** *(world, not yours)* | Bread prices, war exhaustion. Sets the ceiling on everything. Decays as the regime stabilizes — this is the game's master clock. |

**The two-clock tension, mechanized:** every growth action raises Heat; every quiet turn
lets Grievance decay. There is no safe tempo — that's the game.

### 3.2 The faction loop (signature mechanic)

The movement is four tendencies — **Moderates, Hardliners, Labor, Students** — each with
a mood (0–100). Every major decision shifts moods asymmetrically.

**The formula that makes it work** (straight from the brief):

```
cohesion = mean(moods) − spreadPenalty × stddev(moods)
```

Polarization kills coalitions, not unhappiness. Two euphoric wings and two furious ones
is *worse* than four grumpy ones — so the degenerate strategy of "keep everyone at 51%"
never emerges, and the player learns to manage *the spread*, which is the real historical
skill.

At Cohesion 0: a faction **splits** — walks out with its share of resources, and rolls
to inform on you (a Heat spike scaled by how betrayed they felt). Splits are survivable
early and fatal late.

### 3.3 The repression dial

When the regime cracks down (triggered by Heat thresholds), the player chooses on each
incident:
- **Go quiet:** preserve Cadre, lose momentum, Sympathizers drift away, Hardliners furious.
- **Escalate publicly:** convert dead into martyrs — repression becomes Legitimacy *if and
  only if* current Legitimacy is high enough to frame the story. The conversion rate is a
  function of accumulated Legitimacy, so **the same massacre reads as tragedy or chaos
  depending on three acts of prior play.** This state-dependence is the brief's core insight
  and our most important writing target (§4).

### 3.4 Victory: the loyalty cascade

No health bar. Each security unit (conscript garrisons, police, elite guard) has a hidden
Loyalty value influenced by: Legitimacy, targeted officer outreach (spends Materiel + Cadre),
shared-origin ties (conscripts from textile towns), and — crucially — the regime's *own*
brutality, which the player can provoke. Each turn past a tension threshold, a cascade
check runs: one unit refusing to fire lowers every other unit's threshold. The finale is
a probabilistic avalanche the player has been shaping all game, presented as a written
sequence, not a battle.

**Loss conditions:** decapitation (Cadre → 0 under raids), irrelevance (Grievance decays
below floor — the window closes), or the split at the wrong moment.

### 3.5 Ideology = starting weights, not flavor

| Ideology | Start profile | Playstyle |
|---|---|---|
| Populist | High Sympathizers, low Cohesion | Fast, fragile, race the clock |
| Vanguard | High Cadre, low Sympathizers | Slow, durable, survive the raids |
| Religious | Repression→Legitimacy bonus, coalition ceiling | Martyr engine with a hard cap |

Same systems, different openings — three genuinely different campaigns from one content set.

---

## 4. Writing — the other half of the first playable

The game is text-forward, so the writing *is* the UI. Three systems:

### 4.1 The turn report
Each turn resolves into a written dispatch — not a stat readout. Numbers appear, but framed:
*"The study circles in the river district doubled again. Ilya thinks we're growing too fast
to vet anyone. He's right."* Built from composable fragments selected by state deltas.

### 4.2 Event cards with state-dependent prose
Events are the main content unit: a situation, 2–4 choices, written consequences. The key
authoring feature: **conditional text blocks keyed to game state.** The picket-line massacre
event has different prose (and different available choices) at Legitimacy 20 vs 70. Authors
write the variants; the engine selects. Target for first playable: **~60 events** (20 per
act), each with 2–3 state variants.

```ts
// content/events/picket-massacre.ts — shape of an event card
{
  id: 'picket-massacre',
  trigger: { heat: { gte: 60 }, flags: ['strike-called'] },
  prose: [
    { when: { legitimacy: { gte: 60 } }, text: '…they died as the city watched…' },
    { default: true,                     text: '…the papers call it a riot…' },
  ],
  choices: [ /* go-quiet | escalate, with faction mood deltas + costs */ ],
}
```

### 4.3 Faction voices
Each tendency is a *character*, not a meter: a named representative with a consistent voice
who reacts to your decisions in one or two lines per turn. Moods are *shown* through tone
before they're shown as numbers — the Moderate gets clipped and formal as her mood drops;
the Hardliner gets warm. This is the cheapest possible way to make a systems game feel
inhabited, and it's pure writing, no art needed.

**Content pipeline:** events are TypeScript data files (type-checked prose conditions, hot
reload via Vite). A `pnpm validate:content` script checks every event for unreachable
variants, missing faction reactions, and orphaned flags.

---

## 5. Campaign structure (Acts I–III)

Mirrors the brief's worked playthrough, generalized:

- **Act I — The Quiet Build.** Tutorialized through play: convert, organize, stay under the
  surveillance threshold while the Grievance clock visibly drains. Teaches the two-clock tension.
- **Act II — Going Loud.** The strike/demonstration decision space opens; first regime
  crackdown is scripted to fire the repression dial at least once. Teaches state-dependence.
- **Act III — The Cascade.** Military victory is mechanically impossible (no attack verbs
  exist); the loyalty system and officer-outreach actions become the whole game. Ends in
  the cascade sequence — win or watch it fizzle.
- **Epilogue (Act IV hook, not Act IV):** a written epilogue generated from your promise
  ledger and faction moods — *what the morning after will cost you* — scored but not played.
  This ships the brief's thematic ending without building the second game.

---

## 6. Groundwork for visuals (build now, draw later)

We deliberately don't make art yet — but we make these five commitments now so adding
visuals later is additive, not surgical:

1. **Renderer-agnostic state.** Already guaranteed by §2: any future canvas/WebGL city view
   is just another subscriber to `GameState`.
2. **Design tokens from day one.** All UI styling flows through CSS custom properties in
   `/src/ui/theme/tokens.css` — color roles (`--ink`, `--paper`, `--accent-faction-labor`),
   spacing scale, two type families (a workhorse text face + a display face for headlines).
   The first playable looks like a clean political pamphlet — typography-led, which is both
   the cheap option *and* on-theme.
3. **Named layout regions.** The shell is a fixed grid of slots: `#dispatch` (turn report),
   `#ledger` (resources), `#coalition` (faction panel), `#map-slot` (empty in v1, reserved).
   The city map renders later into a slot that already exists.
4. **Event illustration hooks.** Every event card has an optional `art?: string` key from
   the start. v1 renders nothing for it; v2 drops in woodcut-style images with zero schema change.
5. **A semantic animation layer.** UI changes route through named transitions
   (`reveal-dispatch`, `mood-shift`, `cascade-tick`) implemented as trivial CSS now —
   replaceable with real motion design later without touching view logic.

**Intended art direction (recorded now, executed later):** constructivist-poster reduction —
two-ink palette per ideology, woodcut event illustrations, a stylized city map of districts
rather than terrain. Chosen because it's achievable by one artist, scales down to favicon
size, and reads instantly as *about* politics.

---

## 7. Milestones

| # | Milestone | Contents | Exit criterion |
|---|---|---|---|
| 0 | **Skeleton** | Vite + Preact + engine reducer + seeded RNG + save/load | A turn advances; tests pass in CI |
| 1 | **The Economy** | All 7 resources, two-clock tension, headless balance sim | 10k-run sim shows no dominant degenerate strategy |
| 2 | **The Coalition** | Faction moods, cohesion formula, splits, faction voices | A split feels like a betrayal, not a number |
| 3 | **The Dial & the Deck** | Event system, ~60 cards, repression dial, conditional prose | Massacre event demonstrably reads differently at low/high Legitimacy |
| 4 | **The Cascade** | Loyalty system, outreach actions, finale sequence, loss states | A full Populist campaign is winnable and losable |
| 5 | **First Playable** | Three ideologies, epilogue generator, theme tokens, polish pass | A stranger finishes a campaign and can say what the game argues |

Each milestone is a vertical slice — playable end-to-end at whatever depth exists, so the
writing gets tested against real play from milestone 2 onward, not bolted on at the end.

## 8. Risks (carried over from the brief, plus ours)

- **Scope creep toward Act IV.** Mitigated structurally: the epilogue generator gives the
  theme its ending; anything more is post-launch by decree.
- **The thesis problem.** The systems will argue something regardless. Our explicit framing —
  *every path to power has a price, and the game makes you read the receipt* — should be
  enforced in content review: any event where a brutal choice is mechanically optimal must
  carry its cost in prose.
- **Writing volume.** ~60 events × variants is the long pole. Mitigation: the conditional-text
  schema is built in milestone 3 *before* mass authoring, and validated by tooling, so no
  prose is written against a moving format.
- **Balance opacity.** Emergent systems hide degenerate strategies. Mitigation: the headless
  simulator is a milestone-1 deliverable, not an afterthought.

---

## Reflavor: The Spanish Spring (post-first-playable)

The game was re-set into Spain, February–July 1936 — Vallarga, an invented composite
industrial port, from the Popular Front's victory to the military rising — with heavy
structural inspiration from *Red Autumn*: a real dated calendar (turn = half-week,
turn 0 = 19 Feb, turn 43 = 19 Jul), **scheduled history** (real national events fire
as cards on their real dates, with priority over the random deck), and a **fixed-date
climax** (the rising resolves at turn 43 through the loyalty system, with contagion in
the hour; `fallen` joins the loss states). Losing to history is the default (~75-80%
even for strong play). All internal ids, mechanics, and the promise-ledger epilogue
carry over; the debts now become what they historically became. Real organizations and
figures (CNT/PCE/UGT–PSOE; Prieto, Durruti, Largo Caballero, Carrillo) voiced per the
documented record; the war begins either way, and the epilogue keeps the receipt.
