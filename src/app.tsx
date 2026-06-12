import { useEffect, useMemo, useState } from 'preact/hooks';
import { ACTIONS, type ActionType } from './engine/actions';
import { matches, resolveEvent, selectProse } from './engine/events';
import { presentFactions } from './engine/factions';
import { cohesion, MOOD_EFFECTS } from './engine/formulas';
import { createRng } from './engine/rng';
import { step } from './engine/reducer';
import { createInitialState, type GameState, type Resources } from './engine/state';
import { DECK } from './content/events';
import { createIdeologyFactions, createIdeologyResources, IDEOLOGIES, type IdeologyId } from './content/ideologies';
import { reactionLine, voiceLine, VOICES } from './content/factions';
import { APPARATUS, finaleBeats, intelligenceLine } from './content/apparatus';
import { generateEpilogue } from './content/epilogue';
import { composeDispatch } from './content/dispatch';

const SAVE_KEY = 'revolution-save-v1';

const RESOURCE_TOOLTIPS: Record<keyof Resources, string> = {
  legitimacy: 'Narrative capital. Gates recruitment and feeds defection odds — it can compound for acts and crash overnight.',
  cadre: 'The disciplined core. Quality over quantity, spent on operations and lost to raids.',
  sympathizers: 'Mass support. Large and unreliable — it decays without attention and converts to cadre slowly.',
  materiel: 'Money, presses, safehouses. The boring layer that actually wins; most failed runs die here.',
  heat: 'The regime\'s attention. Past 70, raids come.',
  grievance: 'The open window. When it closes, the revolution is over whether you noticed or not.',
};

const RESOURCE_LABELS: Record<keyof Resources, string> = {
  legitimacy: 'Legitimacy',
  cadre: 'Cadre',
  sympathizers: 'Sympathizers',
  materiel: 'Materiel',
  heat: 'Heat',
  grievance: 'Grievance',
};

const STATUS_TEXT: Record<GameState['status'], string> = {
  active: '',
  decapitated: 'Decapitated — the regime broke the cadre. The movement is finished.',
  irrelevant: 'Irrelevant — the window closed. Material conditions stabilized without you.',
  split: 'Split — what remains is no longer a coalition. It is a grudge with a mailing list.',
  cascade: 'Cascade — the garrisons are refusing orders. The regime is falling.',
};

const ACTION_LABELS: Record<ActionType, string> = {
  organize: 'Organize',
  agitate: 'Agitate',
  fundraise: 'Fundraise',
  lay_low: 'Lay low',
  outreach: 'Outreach',
};

/**
 * Dev tooling: ?scenario=<id> jumps straight to a state worth reviewing —
 * lets writers see conditional prose without replaying three acts.
 */
function scenarioState(): GameState | undefined {
  const scenario = new URLSearchParams(window.location.search).get('scenario');
  if (!scenario) return undefined;
  const base = createInitialState(
    createIdeologyResources('populist'),
    createIdeologyFactions('populist'),
  );
  switch (scenario) {
    case 'epilogue':
      // The densest epilogue: a cascade win with every debt flag set, the
      // hardliners in open opposition, and the students gone.
      return {
        ...base,
        turn: 40,
        status: 'cascade',
        flags: ['guarantees-given', 'reprisal-lists', 'armed-wing', 'negotiation-channel'],
        factions: base.factions.map((f) =>
          f.id === 'hardliners'
            ? { ...f, mood: 20 }
            : f.id === 'students'
              ? { ...f, present: false }
              : f,
        ),
        units: base.units.map((u) =>
          u.id === 'garrison' || u.id === 'police' ? { ...u, refused: true, loyalty: 10 } : u,
        ),
      };
    case 'massacre-low':
      return {
        ...base,
        turn: 18,
        resources: { ...base.resources, legitimacy: 25, heat: 60 },
        flags: ['strike-called'],
        pendingEventId: 'picket-massacre',
      };
    case 'massacre-high':
      return {
        ...base,
        turn: 18,
        resources: { ...base.resources, legitimacy: 75, heat: 60 },
        flags: ['strike-called'],
        pendingEventId: 'picket-massacre',
      };
    case 'eve':
      // The endgame, without the 40-turn replay: standing earned, units
      // eroded, the cascade a few deployments away.
      return {
        ...base,
        turn: 36,
        resources: {
          ...base.resources,
          legitimacy: 85,
          heat: 62,
          cadre: 18,
          materiel: 30,
          sympathizers: 70,
          grievance: 40,
        },
        flags: ['mutual-aid', 'garrison-contacts', 'garrison-outreach', 'officers-letter'],
        units: base.units.map((u) =>
          u.id === 'garrison'
            ? { ...u, loyalty: 22 }
            : u.id === 'police'
              ? { ...u, loyalty: 45 }
              : u,
        ),
      };
    default:
      return undefined;
  }
}

interface SavedGame {
  state: GameState;
  ideology: IdeologyId;
}

function loadSave(): SavedGame | undefined {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.state || !parsed.ideology) return undefined;
    return parsed as SavedGame;
  } catch {
    return undefined;
  }
}

function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore — storage may be unavailable
  }
}

function makeGame(seed: number, ideology: IdeologyId) {
  return {
    state: scenarioState() ?? createInitialState(
      createIdeologyResources(ideology),
      createIdeologyFactions(ideology),
    ),
    ideology,
    rng: createRng(seed),
    lastAction: undefined as ActionType | undefined,
    lastOutcome: undefined as string | undefined,
    lastDispatch: undefined as string | undefined,
  };
}

const IDEOLOGY_HINTS: Record<IdeologyId, string> = {
  populist: 'Sympathizers 60 · Cadre 6 · Cohesion polarized',
  vanguard: 'Sympathizers 20 · Cadre 18 · Cohesion tight',
  religious: 'Sympathizers 35 · Cadre 10 · Legitimacy 40, no students',
};

export function App() {
  const isScenario = !!new URLSearchParams(window.location.search).get('scenario');
  const [screen, setScreen] = useState<'title' | 'game'>(() => (isScenario ? 'game' : 'title'));
  const [game, setGame] = useState(() => makeGame(Date.now(), 'populist'));
  const [hasSave, setHasSave] = useState(() => !isScenario && !!loadSave());

  const act = (type: ActionType) => {
    setGame((current) => {
      const nextState = step(current.state, ACTIONS[type], current.rng, DECK);
      return {
        ...current,
        state: nextState,
        lastAction: type,
        lastOutcome: undefined,
        lastDispatch: composeDispatch(current.state, nextState),
      };
    });
  };

  const choose = (choiceId: string) => {
    setGame((current) => {
      const card = DECK.find((c) => c.id === current.state.pendingEventId);
      if (!card) return current;
      const choice = card.choices.find((c) => c.id === choiceId)!;
      // Outcome prose is selected against the state the choice was made in.
      const outcome = selectProse(choice.outcome, current.state);
      return {
        ...current,
        state: resolveEvent(current.state, card, choiceId, current.rng),
        lastOutcome: outcome,
      };
    });
  };

  const begin = (ideology: IdeologyId) => {
    clearSave();
    setHasSave(false);
    setGame(makeGame(Date.now(), ideology));
    setScreen('game');
  };

  const continueGame = () => {
    const saved = loadSave();
    if (!saved) return;
    setGame({
      state: saved.state,
      ideology: saved.ideology,
      rng: createRng(Date.now()),
      lastAction: undefined,
      lastOutcome: undefined,
      lastDispatch: undefined,
    });
    setScreen('game');
  };

  const restart = () => {
    clearSave();
    setHasSave(false);
    setScreen('title');
  };

  // Persist on every state change, once the game is underway — terminal
  // states are saved too, so the epilogue survives a refresh. Scenario
  // states (?scenario=) are dev-only and never persisted.
  useEffect(() => {
    if (screen !== 'game' || isScenario) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ state: game.state, ideology: game.ideology }));
      setHasSave(true);
    } catch {
      // ignore — storage may be unavailable
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.state, screen]);

  const { state, ideology, lastAction, lastOutcome, lastDispatch } = game;

  // Per-ideology accent palette (see index.css) — set on the mount element,
  // since App renders as a fragment inside #app.
  useEffect(() => {
    const root = document.getElementById('app');
    if (!root) return;
    root.setAttribute('data-ideology', screen === 'title' ? 'populist' : ideology);
  }, [screen, ideology]);

  // Voice lines re-roll only when the turn changes, not on every render.
  // Computed unconditionally (hooks can't follow the title-screen branch).
  const voiceRng = useMemo(() => createRng(state.turn * 7919 + 17), [state.turn]);

  if (screen === 'title') {
    return (
      <div id="title">
        <h1>Revolution</h1>
        <p>
          You manage a revolutionary movement's commitment and visibility — not its
          buildings or its armies. Every turn spends people: organizing, agitating,
          raising money, going quiet, or reaching the officers who might one day refuse
          an order. You win when the garrisons stand aside, a tipping point you spend the
          whole game setting up. Every path there has a price, and the morning after
          keeps the receipt.
        </p>
        <div class="ideology-cards">
          {(Object.keys(IDEOLOGIES) as IdeologyId[]).map((id) => {
            const def = IDEOLOGIES[id];
            return (
              <div class="faction ideology-card" key={id}>
                <div class="faction-name">{def.name}</div>
                <p class="faction-line">{def.blurb}</p>
                <p class="ideology-hint">{IDEOLOGY_HINTS[id]}</p>
                <button onClick={() => begin(id)}>Begin</button>
              </div>
            );
          })}
        </div>
        {hasSave && <button onClick={continueGame}>Continue</button>}
      </div>
    );
  }
  const isOver = state.status !== 'active';
  const pendingCard = state.pendingEventId
    ? DECK.find((c) => c.id === state.pendingEventId)
    : undefined;
  const present = presentFactions(state.factions);
  const currentCohesion = cohesion(state.factions);
  const voices = present.map((f) => ({ faction: f, line: voiceLine(f, voiceRng) }));

  const reaction = lastAction
    ? reactionLine(lastAction, MOOD_EFFECTS[lastAction], state.factions)
    : undefined;

  const departures = state.log.filter(
    (e) => e.kind === 'split' && e.turn === state.turn && e.detail.includes('walked'),
  );
  const betrayals = state.log.filter(
    (e) => e.kind === 'split' && e.turn === state.turn && e.detail.includes('informed'),
  );

  return (
    <>
      <div id="dispatch">
        <h1>Revolution</h1>
        <p>Turn {state.turn}</p>
        {lastDispatch && !isOver && <p class="dispatch-line">{lastDispatch}</p>}
        {departures.map((e) => (
          <p class="departure" key={e.detail}>
            {VOICES[e.factionId!].departure}
          </p>
        ))}
        {betrayals.map((e) => (
          <p class="departure" key={e.detail}>
            {VOICES[e.factionId!].betrayal}
          </p>
        ))}
        {reaction && !isOver && !pendingCard && <p class="reaction">{reaction}</p>}
        {lastOutcome && !isOver && <p class="event-outcome">{lastOutcome}</p>}
        {pendingCard && !isOver && (
          <div class="event-card" data-art={pendingCard.art}>
            <p class="event-prose">{selectProse(pendingCard.prose, state)}</p>
            <div class="event-choices">
              {pendingCard.choices.map((choice) => {
                const available = matches(choice.requires, state);
                return (
                  <button
                    key={choice.id}
                    onClick={() => choose(choice.id)}
                    disabled={!available}
                    title={available ? undefined : 'Not within the movement’s means'}
                  >
                    {choice.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {state.status === 'cascade' &&
          finaleBeats(state.units).map((beat, i) => (
            <p class="departure" key={i}>
              {beat}
            </p>
          ))}
        {isOver && <p class="status-banner">{STATUS_TEXT[state.status]}</p>}
        {isOver && (
          <div class="epilogue">
            <h2>The Morning After</h2>
            {generateEpilogue(state).beats.map((beat, i) => (
              <p class="departure" key={i}>
                {beat}
              </p>
            ))}
          </div>
        )}
      </div>

      <div id="ledger">
        {(Object.keys(state.resources) as Array<keyof Resources>).map((key) => {
          const value = state.resources[key];
          const isPercent = key !== 'cadre' && key !== 'materiel';
          return (
            <div class="resource" key={key} title={RESOURCE_TOOLTIPS[key]}>
              <div class="label">{RESOURCE_LABELS[key]}</div>
              <div class="value">{Math.round(value)}</div>
              {isPercent && (
                <div class="bar">
                  <span style={{ width: `${Math.min(100, value)}%` }} />
                </div>
              )}
            </div>
          );
        })}
        <div class="resource" title="Mean of faction moods, minus a penalty for the spread. Polarization kills coalitions, not unhappiness.">
          <div class="label">Cohesion</div>
          <div class="value">{Math.round(currentCohesion)}</div>
          <div class="bar">
            <span style={{ width: `${Math.max(0, Math.min(100, currentCohesion))}%` }} />
          </div>
        </div>
      </div>

      <div id="coalition">
        {voices.map(({ faction, line }) => (
          <div class={`faction faction-${faction.id}`} key={faction.id}>
            <div class="faction-name">
              {VOICES[faction.id].name} · {VOICES[faction.id].title}
            </div>
            <div class="faction-line">{line}</div>
            <div class="bar mood-bar">
              <span style={{ width: `${faction.mood}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div id="map-slot">
        <div id="apparatus">
          {state.units.map((unit) => (
            <div class={`unit ${unit.refused ? 'unit-refused' : ''}`} key={unit.id}>
              <div class="unit-name">{APPARATUS[unit.id].name}</div>
              <div class="unit-line">{intelligenceLine(unit)}</div>
            </div>
          ))}
        </div>
      </div>

      <div id="actions">
        {(Object.keys(ACTIONS) as ActionType[]).map((type) => (
          <button key={type} onClick={() => act(type)} disabled={isOver || !!pendingCard}>
            {ACTION_LABELS[type]}
          </button>
        ))}
        {isOver && <button onClick={restart}>Start over</button>}
      </div>

      <div id="log">
        {state.log
          .slice(-6)
          .reverse()
          .map((e, i) => (
            <p key={i}>
              Turn {e.turn}: {e.detail}
            </p>
          ))}
      </div>
    </>
  );
}
