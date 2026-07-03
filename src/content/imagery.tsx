import type { ComponentChildren } from 'preact';
import type { FactionId } from '../engine/factions';
import type { UnitId } from '../engine/loyalty';
import type { DuotoneName } from './duotone';
import {
  EVENT_PATHS,
  HERO_PATH,
  PORTRAIT_PATHS,
  UNIT_PATHS,
} from './imagery.generated';

/** Base-path-correct URL for a committed asset (site serves under /silver-doodle/). */
export function assetUrl(rel: string): string {
  return `${import.meta.env.BASE_URL}${rel}`;
}

export interface ImageRef {
  src: string;
  alt: string;
  duotone: DuotoneName;
  width: number;
  height: number;
}

/** The faction each figure's portrait tones to (matches the coalition border). */
const PORTRAIT_DUOTONE: Record<FactionId, DuotoneName> = {
  moderates: 'moderate',
  hardliners: 'hardliner',
  labor: 'labor',
  students: 'student',
};

const PORTRAIT_ALT: Record<FactionId, string> = {
  moderates: 'Indalecio Prieto',
  hardliners: 'Buenaventura Durruti',
  labor: 'Francisco Largo Caballero',
  students: 'Santiago Carrillo',
};

const UNIT_ALT: Record<UnitId, string> = {
  garrison: 'Conscript infantry of the line',
  police: 'Guardia de Asalto',
  guard: 'Guardia Civil',
};

export function portraitRef(id: FactionId): ImageRef | null {
  const src = PORTRAIT_PATHS[id];
  if (!src) return null;
  return { src: assetUrl(src), alt: PORTRAIT_ALT[id], duotone: PORTRAIT_DUOTONE[id], width: 320, height: 400 };
}

export function unitRef(id: UnitId): ImageRef | null {
  const src = UNIT_PATHS[id];
  if (!src) return null;
  return { src: assetUrl(src), alt: UNIT_ALT[id], duotone: 'ink', width: 320, height: 220 };
}

export function eventRef(cardId: string): ImageRef | null {
  const src = EVENT_PATHS[cardId];
  if (!src) return null;
  return { src: assetUrl(src), alt: '', duotone: 'ink', width: 640, height: 360 };
}

export function heroRef(): ImageRef | null {
  if (!HERO_PATH) return null;
  return {
    src: assetUrl(HERO_PATH),
    alt: 'A Popular Front demonstration, spring 1936',
    duotone: 'ink',
    width: 1280,
    height: 520,
  };
}

/**
 * Renders a duotoned photo when one has been fetched, and the on-brand
 * SVG fallback otherwise. This seam is why placeholders, missing images,
 * and load failures never break the UI or the deploy.
 */
export function Figure({
  imageRef,
  fallback,
  className,
  duotoneOverride,
}: {
  imageRef: ImageRef | null;
  fallback: ComponentChildren;
  className?: string;
  /** Force a tone regardless of the ref (e.g. a refused corps → accent). */
  duotoneOverride?: DuotoneName;
}) {
  if (!imageRef) return <div class={className}>{fallback}</div>;
  const tone = duotoneOverride ?? imageRef.duotone;
  return (
    <div class={className}>
      <img
        src={imageRef.src}
        alt={imageRef.alt}
        width={imageRef.width}
        height={imageRef.height}
        loading="lazy"
        decoding="async"
        style={{ filter: `url(#duo-${tone})` }}
      />
    </div>
  );
}
