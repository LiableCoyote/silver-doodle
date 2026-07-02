import type { ComponentChildren } from 'preact';
import type { GameState } from '../engine/state';
import type { UnitId } from '../engine/loyalty';

/**
 * The district map (PLAN.md §6): a stylized city, not terrain. It renders
 * state the player already knows — support shades the movement's
 * districts, heat puts patrols on the boulevard, the apparatus stands at
 * its buildings, and the campaign leaves landmarks. Same two-ink rule as
 * the event art: currentColor + var(--accent). No numbers, no new facts.
 */

const ACCENT = 'var(--accent)';

const DISTRICTS: Array<{
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Movement-rooted districts shade with sympathizers. */
  movement: boolean;
}> = [
  { id: 'university', label: 'LA UNIVERSIDAD', x: 4, y: 6, w: 82, h: 50, movement: true },
  { id: 'ministries', label: 'GOBIERNO CIVIL', x: 94, y: 6, w: 86, h: 40, movement: false },
  { id: 'palace', label: 'CASA-CUARTEL', x: 188, y: 4, w: 84, h: 38, movement: false },
  { id: 'barracks', label: 'EL CUARTEL', x: 280, y: 6, w: 76, h: 50, movement: false },
  { id: 'market', label: 'EL MERCADO', x: 94, y: 54, w: 106, h: 38, movement: false },
  { id: 'mills', label: 'LAS FÁBRICAS', x: 4, y: 130, w: 146, h: 64, movement: true },
  { id: 'river', label: 'EL ARRABAL', x: 158, y: 130, w: 102, h: 64, movement: true },
  { id: 'docks', label: 'EL PUERTO', x: 268, y: 130, w: 88, h: 64, movement: true },
];

function UnitBuilding({
  unit,
  refused,
  children,
}: {
  unit: UnitId;
  refused: boolean;
  children: ComponentChildren;
}) {
  return (
    <g
      fill={refused ? ACCENT : 'none'}
      stroke={refused ? ACCENT : 'currentColor'}
      stroke-width="2"
      data-unit={unit}
    >
      {children}
    </g>
  );
}

export function CityMap({ state }: { state: GameState }) {
  const { sympathizers, heat } = state.resources;
  const flags = state.flags;
  const supportOpacity = 0.05 + (sympathizers / 100) * 0.3;
  const patrols = Math.min(6, Math.floor(heat / 15));
  const striking =
    flags.includes('strike-called') &&
    !flags.includes('strike-ended') &&
    !flags.includes('strike-won');
  const refused = (id: UnitId) => state.units.find((u) => u.id === id)?.refused ?? false;

  return (
    <svg viewBox="0 0 360 200" role="img" aria-label="Vallarga" id="city-map">
      {/* Districts */}
      {DISTRICTS.map((d) => (
        <g key={d.id}>
          <rect
            x={d.x}
            y={d.y}
            width={d.w}
            height={d.h}
            fill="currentColor"
            opacity={d.movement ? supportOpacity : 0.07}
          />
          <text
            x={d.x + 5}
            y={d.y + d.h - 5}
            font-size="8"
            fill="currentColor"
            opacity="0.55"
            letter-spacing="0.08em"
          >
            {d.label}
          </text>
        </g>
      ))}

      {/* El Turbio and its bridges */}
      <polygon points="0,98 360,78 360,106 0,126" fill="currentColor" opacity="0.16" />
      <path d="M20 114 q20 -5 40 -3 M250 90 q20 -5 40 -3" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.3" />
      <rect x="78" y="86" width="12" height="36" fill="var(--paper)" stroke="currentColor" stroke-width="1.5" />
      <rect x="236" y="78" width="12" height="36" fill="var(--paper)" stroke="currentColor" stroke-width="1.5" />
      {/* After the first refusal, the bridges grow barricades. */}
      {state.units.some((u) => u.refused) && (
        <polyline
          points="74,106 84,100 94,106 104,100"
          stroke={ACCENT}
          stroke-width="3"
          fill="none"
        />
      )}

      {/* Heat: patrols on the north-bank boulevard. */}
      {Array.from({ length: patrols }, (_, i) => (
        <rect
          key={i}
          x={28 + i * 52}
          y={70}
          width="7"
          height="7"
          transform={`rotate(45 ${31.5 + i * 52} 73.5)`}
          fill="currentColor"
        />
      ))}

      {/* The apparatus, at home. Refused units fly the second ink. */}
      <UnitBuilding unit="garrison" refused={refused('garrison')}>
        <path d="M298 36 v-14 h6 v4 h6 v-4 h6 v4 h6 v-4 h6 v4 h6 v-4 h6 v14 Z" />
      </UnitBuilding>
      <UnitBuilding unit="police" refused={refused('police')}>
        <rect x="142" y="64" width="24" height="16" />
        <rect x="151" y="71" width="6" height="9" fill="var(--paper)" />
      </UnitBuilding>
      <UnitBuilding unit="guard" refused={refused('guard')}>
        {/* La casa-cuartel: a fortified house and its walled yard. */}
        <rect x="206" y="12" width="26" height="18" />
        <rect x="232" y="22" width="18" height="8" />
        <line x1="212" y1="12" x2="212" y2="2" />
        <polygon points="212,2 224,5 212,8" fill={refused('guard') ? ACCENT : 'none'} />
      </UnitBuilding>

      {/* The mills: chimneys, smoking unless the strike holds. */}
      <g fill="currentColor">
        <rect x="20" y="142" width="6" height="16" />
        <rect x="34" y="138" width="6" height="20" />
        <rect x="14" y="158" width="34" height="12" />
      </g>
      {!striking && (
        <g fill="currentColor" opacity="0.4">
          <circle cx="24" cy="136" r="3.5" />
          <circle cx="38" cy="131" r="3.5" />
          <circle cx="30" cy="128" r="2.5" />
        </g>
      )}

      {/* Landmarks the campaign leaves behind: the comedor's kettle,
          the CNT print shop, the October 1934 memorial. */}
      {flags.includes('mutual-aid') && (
        <path d="M196 162 h18 a9 9 0 0 1 -18 0 Z" fill={ACCENT} />
      )}
      {flags.includes('press') && (
        <g transform="rotate(-10 234 154)">
          <rect x="228" y="148" width="13" height="9" fill={ACCENT} />
        </g>
      )}
      {flags.includes('martyrs-made') && (
        <g fill={ACCENT}>
          <rect x="76" y="140" width="5" height="20" />
          <rect x="70" y="160" width="17" height="4" />
        </g>
      )}
    </svg>
  );
}
