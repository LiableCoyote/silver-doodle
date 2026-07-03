import type { ComponentType } from 'preact';
import type { FactionId } from '../engine/factions';
import type { UnitId } from '../engine/loyalty';
import type { IdeologyId } from './ideologies';

/**
 * On-brand SVG placeholders and permanent fallbacks for the photographic
 * surfaces: figure busts, security-corps silhouettes, organization
 * emblems, and the title hero. Two-ink (currentColor + var(--accent)),
 * flat, in the register of art.tsx. Real public-domain photos replace the
 * busts/corps/hero on fetch; the emblems stay SVG for good.
 */

const ACCENT = 'var(--accent)';

/** Head + shoulders scaffold shared by every figure bust (portrait 4:5). */
function Bust({ children }: { children?: preact.ComponentChildren }) {
  return (
    <svg viewBox="0 0 80 100" role="img" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="80" height="100" fill={ACCENT} opacity="0.10" />
      {/* shoulders */}
      <path d="M8 100 V84 a32 32 0 0 1 64 0 V100 Z" fill="currentColor" />
      {/* neck + head */}
      <rect x="34" y="52" width="12" height="16" fill="currentColor" />
      <circle cx="40" cy="38" r="20" fill="currentColor" />
      {children}
    </svg>
  );
}

const FIGURE_BUSTS: Record<FactionId, ComponentType> = {
  // Prieto — heavyset, round spectacles.
  moderates: () => (
    <Bust>
      <g fill="var(--paper)">
        <circle cx="32" cy="37" r="4.5" />
        <circle cx="48" cy="37" r="4.5" />
      </g>
      <rect x="36" y="36" width="8" height="2.5" fill="var(--paper)" />
    </Bust>
  ),
  // Durruti — flat workers' cap.
  hardliners: () => (
    <Bust>
      <path d="M18 30 h44 v-3 a22 22 0 0 0 -44 0 Z" fill={ACCENT} />
      <rect x="16" y="29" width="48" height="4" fill="currentColor" />
    </Bust>
  ),
  // Largo Caballero — older, high forehead, mustache.
  labor: () => (
    <Bust>
      <path d="M22 26 a18 10 0 0 1 36 0 Z" fill="var(--paper)" opacity="0.35" />
      <rect x="33" y="46" width="14" height="3" rx="1.5" fill="var(--paper)" />
    </Bust>
  ),
  // Carrillo — young, side-parted hair.
  students: () => (
    <Bust>
      <path d="M22 34 a18 18 0 0 1 36 0 q-10 -8 -22 -5 q-8 2 -14 5 Z" fill={ACCENT} opacity="0.8" />
    </Bust>
  ),
};

/** Corps silhouettes (landscape ~16:11), distinguished by headgear. */
function Corps({ children }: { children?: preact.ComponentChildren }) {
  return (
    <svg viewBox="0 0 80 55" role="img" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="80" height="55" fill="currentColor" opacity="0.08" />
      <path d="M20 55 V44 a20 20 0 0 1 40 0 V55 Z" fill="currentColor" />
      <circle cx="40" cy="30" r="13" fill="currentColor" />
      {children}
    </svg>
  );
}

const CORPS_SILHOUETTES: Record<UnitId, ComponentType> = {
  // Conscript — soft side-cap (gorrillo).
  garrison: () => (
    <Corps>
      <path d="M27 24 q13 -12 26 0 Z" fill={ACCENT} />
    </Corps>
  ),
  // Asalto — rounded helmet.
  police: () => (
    <Corps>
      <path d="M27 26 a13 13 0 0 1 26 0 Z" fill={ACCENT} />
      <rect x="26" y="25" width="28" height="3" fill={ACCENT} />
    </Corps>
  ),
  // Guardia Civil — the tricorn: flat crown, upturned back.
  guard: () => (
    <Corps>
      <path d="M24 24 h32 l-4 -6 h-24 Z" fill={ACCENT} />
      <path d="M24 24 q16 6 32 0 l-2 3 q-14 5 -28 0 Z" fill="currentColor" />
    </Corps>
  ),
};

/** Organization emblems (square) — graphic marks, permanent SVG. */
const ORG_EMBLEMS: Record<IdeologyId, ComponentType> = {
  // CNT — the red-and-black diagonal.
  populist: () => (
    <svg viewBox="0 0 48 48" role="img" aria-label="CNT">
      <polygon points="0,0 48,0 0,48" fill={ACCENT} />
      <polygon points="48,0 48,48 0,48" fill="currentColor" />
    </svg>
  ),
  // PCE — hammer and sickle.
  vanguard: () => (
    <svg viewBox="0 0 48 48" role="img" aria-label="PCE">
      <rect x="2" y="2" width="44" height="44" fill={ACCENT} opacity="0.15" />
      <path d="M14 34 L30 18" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
      <rect x="28" y="12" width="10" height="5" rx="1" transform="rotate(45 33 14)" fill="currentColor" />
      <path d="M16 34 a12 12 0 0 0 12 -12" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
    </svg>
  ),
  // UGT — red banner with a rising sun.
  religious: () => (
    <svg viewBox="0 0 48 48" role="img" aria-label="UGT">
      <rect x="6" y="8" width="36" height="26" fill={ACCENT} />
      <circle cx="24" cy="30" r="8" fill="var(--paper)" />
      <g stroke="var(--paper)" stroke-width="2">
        <line x1="24" y1="18" x2="24" y2="22" />
        <line x1="14" y1="22" x2="17" y2="25" />
        <line x1="34" y1="22" x2="31" y2="25" />
      </g>
      <rect x="6" y="8" width="3" height="34" fill="currentColor" />
    </svg>
  ),
};

/** Title hero: a crowd under banners (landscape). Placeholder for the fetched photo. */
export function HeroScene() {
  const figures = [];
  for (let i = 0; i < 26; i++) {
    const x = 6 + i * 12;
    figures.push(
      <g key={i} fill="currentColor">
        <circle cx={x} cy={104} r={4} />
        <rect x={x - 5} y={107} width={10} height={18} rx={2} />
      </g>,
    );
  }
  return (
    <svg viewBox="0 0 320 130" role="img" aria-label="A demonstration in the streets of Vallarga" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="320" height="130" fill={ACCENT} opacity="0.08" />
      {/* skyline */}
      <g fill="currentColor" opacity="0.25">
        <rect x="0" y="40" width="46" height="60" />
        <rect x="60" y="24" width="30" height="76" />
        <rect x="150" y="34" width="40" height="66" />
        <rect x="240" y="20" width="34" height="80" />
        <rect x="286" y="46" width="34" height="54" />
      </g>
      {/* banners */}
      <g>
        <rect x="70" y="30" width="3" height="70" fill="currentColor" />
        <rect x="73" y="30" width="34" height="18" fill={ACCENT} />
        <rect x="210" y="24" width="3" height="76" fill="currentColor" />
        <rect x="213" y="24" width="30" height="16" fill={ACCENT} />
      </g>
      {figures}
    </svg>
  );
}

export const FigurePlaceholder = ({ id }: { id: FactionId }) => {
  const C = FIGURE_BUSTS[id];
  return <C />;
};
export const CorpsPlaceholder = ({ id }: { id: UnitId }) => {
  const C = CORPS_SILHOUETTES[id];
  return <C />;
};
export const OrgEmblem = ({ id }: { id: IdeologyId }) => {
  const C = ORG_EMBLEMS[id];
  return <C />;
};
