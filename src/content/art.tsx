import type { ComponentType } from 'preact';

/**
 * Event illustrations: constructivist-poster reduction (PLAN.md §6).
 * Two inks only — `currentColor` (the ink) and `var(--accent)` (the
 * second ink, which re-inks per ideology via the CSS palette). Flat
 * shapes, hard diagonals, no gradients. Every scene is 240x110.
 */

const ACCENT = 'var(--accent)';

/** A row of abstract head-and-shoulder figures. */
function Crowd({ x, y, n, s = 1, fill = 'currentColor' }: { x: number; y: number; n: number; s?: number; fill?: string }) {
  const figures = [];
  for (let i = 0; i < n; i++) {
    const fx = x + i * 16 * s;
    figures.push(
      <g key={i} fill={fill}>
        <circle cx={fx} cy={y} r={5 * s} />
        <rect x={fx - 7 * s} y={y + 4 * s} width={14 * s} height={16 * s} rx={3 * s} />
      </g>,
    );
  }
  return <g>{figures}</g>;
}

/** Factory skyline with optional smoke. */
function Mills({ smoke }: { smoke: boolean }) {
  return (
    <g fill="currentColor">
      <path d="M0 70 h40 v-25 l14 10 v-10 l14 10 v15 h30 v-35 h10 v35 h22 v-20 h12 v20 h98 v40 H0 Z" />
      <rect x="52" y="20" width="8" height="28" />
      <rect x="150" y="25" width="8" height="25" />
      {smoke && (
        <g fill="currentColor" opacity="0.45">
          <circle cx="56" cy="14" r="6" />
          <circle cx="64" cy="8" r="4" />
          <circle cx="154" cy="18" r="6" />
          <circle cx="162" cy="12" r="4" />
        </g>
      )}
    </g>
  );
}

const SCENES: Record<string, ComponentType> = {
  'study-circle': () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="A lamp over a study circle">
      <polygon points="120,4 70,88 170,88" fill={ACCENT} opacity="0.35" />
      <circle cx="120" cy="10" r="7" fill={ACCENT} />
      <rect x="70" y="86" width="100" height="6" fill="currentColor" />
      <Crowd x={84} y={70} n={5} s={0.9} />
      <rect x="106" y="78" width="28" height="4" fill={ACCENT} />
    </svg>
  ),

  'bread-line': () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="A bread queue">
      <rect x="0" y="92" width="240" height="6" fill="currentColor" />
      <rect x="186" y="28" width="54" height="64" fill="currentColor" />
      <rect x="196" y="44" width="34" height="18" fill={ACCENT} />
      <Crowd x={18} y={66} n={9} s={0.95} />
      <polygon points="186,28 240,28 240,20 196,20" fill="currentColor" />
    </svg>
  ),

  press: () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="A printing press">
      <rect x="60" y="58" width="120" height="34" fill="currentColor" />
      <rect x="76" y="34" width="88" height="24" fill="currentColor" />
      <circle cx="120" cy="46" r="16" fill="currentColor" />
      <rect x="64" y="92" width="14" height="10" fill="currentColor" />
      <rect x="162" y="92" width="14" height="10" fill="currentColor" />
      <g transform="rotate(-12 190 40)">
        <rect x="170" y="22" width="44" height="30" fill={ACCENT} />
        <rect x="176" y="30" width="32" height="3" fill="currentColor" opacity="0.6" />
        <rect x="176" y="37" width="32" height="3" fill="currentColor" opacity="0.6" />
      </g>
    </svg>
  ),

  informant: () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="A listener among the listeners">
      <Crowd x={36} y={48} n={6} s={1.1} />
      <g fill={ACCENT}>
        {/* One figure apart, head turned the other way. */}
        <circle cx="166" cy="48" r="5.5" />
        <rect x="158" y="52" width="15.4" height="17.6" rx="3.3" />
      </g>
      <rect x="0" y="74" width="240" height="5" fill="currentColor" />
    </svg>
  ),

  kitchen: () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="A soup kettle">
      <path d="M86 50 h68 a34 34 0 0 1 -68 0 Z" fill="currentColor" />
      <rect x="80" y="44" width="80" height="8" fill="currentColor" />
      <path d="M104 36 q6 -10 0 -20 M120 36 q-6 -10 0 -20 M136 36 q6 -10 0 -20" stroke={ACCENT} stroke-width="5" fill="none" stroke-linecap="round" />
      <rect x="30" y="92" width="180" height="5" fill="currentColor" />
      <g fill="currentColor">
        <path d="M34 92 h22 a11 11 0 0 1 -22 0 Z" />
        <path d="M184 92 h22 a11 11 0 0 1 -22 0 Z" />
      </g>
    </svg>
  ),

  clerk: () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="A clerk passing a page">
      <g fill="currentColor">
        <rect x="28" y="14" width="58" height="84" />
        <rect x="34" y="22" width="46" height="10" fill="var(--paper)" opacity="0.7" />
        <rect x="34" y="38" width="46" height="10" fill="var(--paper)" opacity="0.7" />
        <rect x="34" y="54" width="46" height="10" fill="var(--paper)" opacity="0.7" />
        <rect x="34" y="70" width="46" height="10" fill="var(--paper)" opacity="0.7" />
      </g>
      <circle cx="150" cy="46" r="9" fill="currentColor" />
      <rect x="138" y="54" width="24" height="38" rx="5" fill="currentColor" />
      <g transform="rotate(14 116 64)">
        <rect x="102" y="58" width="26" height="18" fill={ACCENT} />
      </g>
      <rect x="0" y="96" width="240" height="5" fill="currentColor" />
    </svg>
  ),

  conscription: () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="A levy notice and bayonets">
      <g stroke="currentColor" stroke-width="5">
        <line x1="150" y1="100" x2="190" y2="18" />
        <line x1="174" y1="100" x2="214" y2="18" />
        <line x1="198" y1="100" x2="238" y2="18" />
      </g>
      <g fill="currentColor">
        <polygon points="190,18 186,4 196,12" />
        <polygon points="214,18 210,4 220,12" />
        <polygon points="238,18 234,4 240,8 240,14" />
      </g>
      <rect x="22" y="18" width="92" height="70" fill={ACCENT} />
      <g fill="var(--paper)">
        <rect x="32" y="30" width="72" height="8" />
        <rect x="32" y="46" width="72" height="5" />
        <rect x="32" y="57" width="72" height="5" />
        <rect x="32" y="68" width="48" height="5" />
      </g>
    </svg>
  ),

  'strike-call': () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="Smokeless chimneys and a rising sun">
      <circle cx="120" cy="44" r="26" fill={ACCENT} />
      <g stroke={ACCENT} stroke-width="5" stroke-linecap="round">
        <line x1="120" y1="6" x2="120" y2="14" />
        <line x1="88" y1="16" x2="94" y2="23" />
        <line x1="152" y1="16" x2="146" y2="23" />
      </g>
      <Mills smoke={false} />
    </svg>
  ),

  'picket-line': () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="A picket line under bayonets">
      <Crowd x={30} y={52} n={6} s={1} />
      <rect x="18" y="40" width="110" height="7" fill={ACCENT} />
      <g stroke="currentColor" stroke-width="5">
        <line x1="176" y1="96" x2="216" y2="16" />
        <line x1="198" y1="96" x2="238" y2="16" />
      </g>
      <g fill="currentColor">
        <polygon points="216,16 212,2 222,10" />
        <polygon points="238,16 234,2 240,6 240,12" />
      </g>
      <rect x="0" y="92" width="240" height="6" fill="currentColor" />
      <ellipse cx="78" cy="98" rx="34" ry="4" fill={ACCENT} opacity="0.7" />
    </svg>
  ),

  armory: () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="Stacked rifles and an open crate">
      <g stroke="currentColor" stroke-width="5" stroke-linecap="round">
        <line x1="96" y1="92" x2="120" y2="22" />
        <line x1="144" y1="92" x2="120" y2="22" />
        <line x1="120" y1="92" x2="120" y2="30" />
      </g>
      <circle cx="120" cy="20" r="5" fill="currentColor" />
      <g>
        <rect x="168" y="62" width="52" height="30" fill={ACCENT} />
        <rect x="164" y="54" width="60" height="8" fill="currentColor" />
        <g transform="rotate(-24 168 54)">
          <rect x="166" y="46" width="58" height="7" fill={ACCENT} />
        </g>
      </g>
      <rect x="20" y="92" width="200" height="5" fill="currentColor" />
    </svg>
  ),

  funeral: () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="A funeral procession">
      <rect x="58" y="38" width="124" height="12" fill="currentColor" />
      <rect x="98" y="30" width="44" height="8" fill={ACCENT} />
      <Crowd x={48} y={62} n={9} s={1} />
      <rect x="0" y="94" width="240" height="5" fill="currentColor" />
    </svg>
  ),

  'garrison-kitchen': () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="A grounded rifle beside a bowl">
      <rect x="0" y="86" width="240" height="6" fill="currentColor" />
      <g transform="rotate(8 168 86)">
        <rect x="164" y="26" width="7" height="60" fill="currentColor" />
      </g>
      <rect x="140" y="80" width="60" height="6" fill="currentColor" opacity="0.5" />
      <path d="M52 64 h64 a32 32 0 0 1 -64 0 Z" fill={ACCENT} />
      <path d="M68 56 q5 -8 0 -16 M84 56 q-5 -8 0 -16" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" />
    </svg>
  ),

  raid: () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="A door off its hinges, lantern beams">
      <rect x="36" y="14" width="64" height="84" fill="currentColor" />
      <g transform="rotate(16 100 98)">
        <rect x="52" y="22" width="48" height="80" fill="var(--paper)" stroke="currentColor" stroke-width="5" />
      </g>
      <g fill={ACCENT} opacity="0.55">
        <polygon points="240,8 240,34 116,72 110,58" />
        <polygon points="240,52 240,78 128,86 124,72" />
      </g>
    </svg>
  ),

  'broken-press': () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="A press overturned, type scattered">
      <g transform="rotate(-18 110 80)">
        <rect x="56" y="60" width="110" height="30" fill="currentColor" />
        <circle cx="110" cy="52" r="14" fill="currentColor" />
      </g>
      <g fill={ACCENT}>
        <rect x="170" y="84" width="9" height="9" />
        <rect x="188" y="74" width="9" height="9" transform="rotate(20 192 78)" />
        <rect x="202" y="90" width="9" height="9" transform="rotate(-15 206 94)" />
        <rect x="156" y="96" width="9" height="9" transform="rotate(32 160 100)" />
        <rect x="222" y="80" width="9" height="9" transform="rotate(12 226 84)" />
      </g>
      <rect x="0" y="102" width="240" height="5" fill="currentColor" />
    </svg>
  ),

  'barracks-letter': () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="A letter under a barracks wall">
      <g fill="currentColor">
        <rect x="120" y="20" width="120" height="70" />
        <rect x="120" y="10" width="14" height="12" />
        <rect x="146" y="10" width="14" height="12" />
        <rect x="172" y="10" width="14" height="12" />
        <rect x="198" y="10" width="14" height="12" />
        <rect x="224" y="10" width="14" height="12" />
      </g>
      <g transform="rotate(-8 96 84)">
        <rect x="64" y="72" width="50" height="32" fill={ACCENT} />
        <polygon points="64,72 89,92 114,72" fill="var(--paper)" opacity="0.6" />
      </g>
      <rect x="0" y="98" width="240" height="5" fill="currentColor" />
    </svg>
  ),

  curfew: () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="An empty street at curfew">
      <circle cx="186" cy="28" r="18" fill={ACCENT} />
      <g fill="currentColor">
        <rect x="0" y="34" width="74" height="64" />
        <rect x="166" y="52" width="74" height="46" />
        <rect x="98" y="14" width="22" height="84" />
        <circle cx="109" cy="30" r="9" fill="var(--paper)" />
        <path d="M109 30 v-6 M109 30 l4 3" stroke="currentColor" stroke-width="2.5" fill="none" />
      </g>
      <rect x="0" y="96" width="240" height="6" fill="currentColor" />
    </svg>
  ),

  'garrison-gate': () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="An open gate, rifles grounded">
      <g fill="currentColor">
        <rect x="44" y="10" width="18" height="88" />
        <rect x="178" y="10" width="18" height="88" />
        <rect x="44" y="10" width="152" height="12" />
      </g>
      <rect x="62" y="22" width="116" height="76" fill={ACCENT} opacity="0.3" />
      <g stroke="currentColor" stroke-width="4" stroke-linecap="round">
        <line x1="80" y1="98" x2="88" y2="46" />
        <line x1="104" y1="98" x2="112" y2="46" />
        <line x1="128" y1="98" x2="136" y2="46" />
        <line x1="152" y1="98" x2="160" y2="46" />
      </g>
      <rect x="20" y="96" width="200" height="6" fill="currentColor" />
    </svg>
  ),

  eve: () => (
    <svg viewBox="0 0 240 110" role="img" aria-label="The city, waiting">
      <circle cx="120" cy="58" r="34" fill={ACCENT} />
      <g fill="currentColor">
        <rect x="0" y="62" width="34" height="36" />
        <rect x="34" y="48" width="22" height="50" />
        <rect x="56" y="70" width="30" height="28" />
        <rect x="86" y="54" width="18" height="44" />
        <rect x="138" y="58" width="24" height="40" />
        <rect x="162" y="44" width="20" height="54" />
        <rect x="182" y="66" width="32" height="32" />
        <rect x="214" y="52" width="26" height="46" />
      </g>
      <Crowd x={14} y={100} n={14} s={0.55} />
    </svg>
  ),
};

export const EVENT_ART: Record<string, ComponentType> = SCENES;
export const ART_KEYS = Object.keys(SCENES);
