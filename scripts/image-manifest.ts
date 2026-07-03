/**
 * Curated list of public-domain historical images for the visual overhaul,
 * fetched by scripts/fetch-images.mjs on GitHub's runners (this session's
 * egress is policy-blocked from Wikimedia). Every entry names a Wikimedia
 * Commons file; the fetch script pulls each file's license metadata and
 * HARD-FAILS any entry whose license is not public-domain / CC0 / CC-BY
 * (LICENSE_ALLOW in the script). Rejected or unreachable entries simply
 * keep their SVG placeholder — never a regression.
 *
 * `commonsFile` is the exact "File:â€¦" title on commons.wikimedia.org.
 * `crop` is the output aspect the script fits to. Where a specific file is
 * uncertain, the script's license gate is the backstop, not this comment.
 */

export type Surface = 'portrait' | 'unit' | 'event' | 'hero';

export interface ManifestEntry {
  /** registry id: FactionId | UnitId | event card id | 'hero'. */
  id: string;
  surface: Surface;
  commonsFile: string;
  /** output aspect w:h. */
  crop: [number, number];
}

export const MANIFEST: ManifestEntry[] = [
  // ---- Faction figures (portraits) ----
  { id: 'moderates', surface: 'portrait', commonsFile: 'File:Indalecio Prieto 1936.jpg', crop: [4, 5] },
  { id: 'hardliners', surface: 'portrait', commonsFile: 'File:Buenaventura Durruti.jpg', crop: [4, 5] },
  { id: 'labor', surface: 'portrait', commonsFile: 'File:Francisco Largo Caballero 1936.jpg', crop: [4, 5] },
  { id: 'students', surface: 'portrait', commonsFile: 'File:Santiago Carrillo 1937.jpg', crop: [4, 5] },

  // ---- Security corps (units) ----
  { id: 'garrison', surface: 'unit', commonsFile: 'File:Soldados republicanos 1936.jpg', crop: [16, 11] },
  { id: 'police', surface: 'unit', commonsFile: 'File:Guardias de Asalto.jpg', crop: [16, 11] },
  { id: 'guard', surface: 'unit', commonsFile: 'File:Guardia Civil 1930s.jpg', crop: [16, 11] },

  // ---- Title hero ----
  { id: 'hero', surface: 'hero', commonsFile: 'File:Manifestación Frente Popular 1936.jpg', crop: [64, 26] },

  // ---- Scheduled timeline events (keyed by card id) ----
  { id: 'amnesty-jails', surface: 'event', commonsFile: 'File:Amnistía 1936.jpg', crop: [16, 9] },
  { id: 'may-day', surface: 'event', commonsFile: 'File:Primero de Mayo 1936 Madrid.jpg', crop: [16, 9] },
  { id: 'cortes-dead', surface: 'event', commonsFile: 'File:Cortes de la República 1936.jpg', crop: [16, 9] },
  { id: 'castillo-murdered', surface: 'event', commonsFile: 'File:José Castillo.jpg', crop: [16, 9] },
  { id: 'sotelo-killed', surface: 'event', commonsFile: 'File:José Calvo Sotelo.jpg', crop: [16, 9] },
  { id: 'construction-strike', surface: 'event', commonsFile: 'File:Huelga de la construcción Madrid 1936.jpg', crop: [16, 9] },
];
