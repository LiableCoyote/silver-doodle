import { useMemo, useState } from 'preact/hooks';
import { ACTIONS, type ActionType } from './engine/actions';
import { matches, resolveEvent, selectProse } from './engine/events';
import { presentFactions } from './engine/factions';
import { cohesion, MOOD_EFFECTS } from './engine/formulas';
import { createRng } from './engine/rng';
import { step } from './engine/reducer';
import { createInitialState, type GameState, type Resources } from './engine/state';
import { DECK } from './content/events';
import { createIdeologyFactions, createIdeologyResources } from './content/ideologies';
import { reactionLine, voiceLine, VOICES } from './content/factions';

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
    default:
      return undefined;
  }
}

function makeGame(seed: number) {
  return {
    state: scenarioState() ?? createInitialState(
      createIdeologyResources('populist'),
      createIdeologyFactions('populist'),
    ),
    rng: createRng(seed),
    lastAction: undefined as ActionType | undefined,
    lastOutcome: undefined as string | undefined,
  };
}

export function App() {
  const [game, setGame] = useState(() => makeGame(Date.now()));

  const act = (type: ActionType) => {
    setGame((current) => ({
      ...current,
      state: step(current.state, ACTIONS[type], current.rng, DECK),
      lastAction: type,
      lastOutcome: undefined,
    }));
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

  const restart = () => setGame(makeGame(Date.now()));

  const { state, lastAction, lastOutcome } = game;
  const isOver = state.status !== 'active';
  const pendingCard = state.pendingEventId
    ? DECK.find((c) => c.id === state.pendingEventId)
    : undefined;
  const present = presentFactions(state.factions);
  const currentCohesion = cohesion(state.factions);

  // Voice lines re-roll only when the turn changes, not on every render.
  const voiceRng = useMemo(() => createRng(state.turn * 7919 + 17), [state.turn]);
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
        {isOver && <p class="status-banner">{STATUS_TEXT[state.status]}</p>}
      </div>

      <div id="ledger">
        {(Object.keys(state.resources) as Array<keyof Resources>).map((key) => {
          const value = state.resources[key];
          const isPercent = key !== 'cadre' && key !== 'materiel';
          return (
            <div class="resource" key={key}>
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

      <div id="map-slot" />

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
