import { useState } from 'preact/hooks';
import { ACTIONS, type ActionType } from './engine/actions';
import { createRng } from './engine/rng';
import { step } from './engine/reducer';
import { createInitialState, type GameState, type Resources } from './engine/state';
import { createIdeologyResources } from './content/ideologies';

const RESOURCE_LABELS: Record<keyof Resources, string> = {
  legitimacy: 'Legitimacy',
  cadre: 'Cadre',
  sympathizers: 'Sympathizers',
  materiel: 'Materiel',
  heat: 'Heat',
  cohesion: 'Cohesion',
  grievance: 'Grievance',
};

const STATUS_TEXT: Record<GameState['status'], string> = {
  active: '',
  decapitated: 'Decapitated — the regime broke the cadre. The movement is finished.',
  irrelevant: 'Irrelevant — the window closed. Material conditions stabilized without you.',
  split: 'Split — cohesion collapsed. Half the movement walks, or worse, informs.',
  cascade: 'Cascade — the garrisons are refusing orders. The regime is falling.',
};

const ACTION_LABELS: Record<ActionType, string> = {
  organize: 'Organize',
  agitate: 'Agitate',
  fundraise: 'Fundraise',
  lay_low: 'Lay low',
};

function makeGame(seed: number) {
  return {
    state: createInitialState(createIdeologyResources('populist')),
    rng: createRng(seed),
  };
}

export function App() {
  const [game, setGame] = useState(() => makeGame(Date.now()));

  const act = (type: ActionType) => {
    setGame((current) => ({
      ...current,
      state: step(current.state, ACTIONS[type], current.rng),
    }));
  };

  const restart = () => setGame(makeGame(Date.now()));

  const { state } = game;
  const isOver = state.status !== 'active';

  return (
    <>
      <div id="dispatch">
        <h1>Revolution</h1>
        <p>Turn {state.turn}</p>
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
      </div>

      <div id="map-slot" />

      <div id="actions">
        {(Object.keys(ACTIONS) as ActionType[]).map((type) => (
          <button key={type} onClick={() => act(type)} disabled={isOver}>
            {ACTION_LABELS[type]}
          </button>
        ))}
        {isOver && <button onClick={restart}>Start over</button>}
      </div>

      <div id="log">
        {state.log
          .slice(-6)
          .reverse()
          .map((line, i) => (
            <p key={i}>{line}</p>
          ))}
      </div>
    </>
  );
}
