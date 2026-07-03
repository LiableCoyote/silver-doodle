/**
 * Duotone treatment for photographic imagery (visual overhaul). Every
 * image is toned in the browser — collapsed to luminance, then mapped
 * 0 -> a shadow ink, 1 -> the paper highlight — so a single grayscale
 * asset re-inks per palette exactly like the two-ink SVG art. This is
 * what lets a wall of disparate historical photos read as one period
 * newsprint halftone.
 *
 * Filters are referenced by `filter: url(#duo-<name>)`. <DuotoneDefs/>
 * must be mounted once at the app root.
 */

/** Design tokens, mirrored from src/index.css :root — keep in sync. */
const PAPER = '#f4f1ea';
const SHADOWS: Record<string, string> = {
  ink: '#1c1a17', // neutral — corps, timeline, hero
  moderate: '#3b5b8c', // --accent-faction-moderate
  hardliner: '#8a1f1f', // --accent-faction-hardliner
  labor: '#b6862c', // --accent-faction-labor
  student: '#4f7c4a', // --accent-faction-student
};

function channels(hex: string): [number, number, number] {
  const n = hex.replace('#', '');
  return [
    parseInt(n.slice(0, 2), 16) / 255,
    parseInt(n.slice(2, 4), 16) / 255,
    parseInt(n.slice(4, 6), 16) / 255,
  ];
}

/**
 * A duotone filter: luminance, then per-channel tableValues mapping
 * dark->shadow, light->paper. Slightly lifted shadows (paper mixed in)
 * keep faces legible rather than crushed.
 */
function DuotoneFilter({ id, shadow }: { id: string; shadow: string }) {
  const [sr, sg, sb] = channels(shadow);
  const [pr, pg, pb] = channels(PAPER);
  const lift = 0.12;
  const lo = (s: number, p: number) => (s * (1 - lift) + p * lift).toFixed(3);
  return (
    <filter id={id} color-interpolation-filters="sRGB">
      <feColorMatrix
        type="matrix"
        values="0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0.33 0.33 0.33 0 0 0 0 0 1 0"
      />
      <feComponentTransfer>
        <feFuncR type="table" tableValues={`${lo(sr, pr)} ${pr.toFixed(3)}`} />
        <feFuncG type="table" tableValues={`${lo(sg, pg)} ${pg.toFixed(3)}`} />
        <feFuncB type="table" tableValues={`${lo(sb, pb)} ${pb.toFixed(3)}`} />
      </feComponentTransfer>
    </filter>
  );
}

export function DuotoneDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0 }}
    >
      <defs>
        {Object.entries(SHADOWS).map(([name, shadow]) => (
          <DuotoneFilter key={name} id={`duo-${name}`} shadow={shadow} />
        ))}
      </defs>
    </svg>
  );
}

export type DuotoneName = keyof typeof SHADOWS;
