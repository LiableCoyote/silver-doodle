/**
 * Fetch + license-gate + duotone-prep the historical imagery. Runs ONLY on
 * GitHub's runners via the manual "fetch-images" workflow — this session's
 * egress is policy-blocked from Wikimedia, so nothing here runs locally or
 * in the deploy build.
 *
 * For each manifest entry it resolves a usable file by trying the candidate
 * File: titles in order, then a Commons File-namespace search — taking the
 * first result whose license is public-domain / CC0 / CC-BY. Anything else
 * is rejected (never committed). The chosen image is processed with sharp
 * (crop to aspect, resize, grayscale + normalise + gentle contrast) into
 * public/img/**, then it writes public/img/CREDITS.{md,json} and
 * regenerates src/content/imagery.generated.ts.
 *
 * Requires: node >= 18 (global fetch), `sharp` (installed by the workflow).
 * Usage: node scripts/fetch-images.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'silver-doodle-image-fetch/1.0 (educational game; PD imagery only)';

// License short-names we accept (case-insensitive substring match).
const LICENSE_ALLOW = ['public domain', 'pd-', 'cc0', 'cc-by', 'cc by'];
const RASTER = /\.(jpe?g|png|tiff?)$/i;
const MAX_BYTES = 25 * 1024 * 1024;

function loadManifest() {
  return JSON.parse(readFileSync(join(ROOT, 'scripts/image-manifest.json'), 'utf8')).entries;
}

const SIZES = {
  portrait: [320, 400],
  unit: [320, 220],
  event: [640, 360],
  hero: [1280, 520],
};
const DIRS = { portrait: 'portraits', unit: 'corps', event: 'events', hero: 'hero' };

function licenseOk(license) {
  const l = (license || '').toLowerCase();
  return LICENSE_ALLOW.some((a) => l.includes(a));
}

function parseInfo(info) {
  const md = info?.extmetadata ?? {};
  const license = (md.LicenseShortName?.value ?? md.License?.value ?? '').toString();
  const author = (md.Artist?.value ?? '').toString().replace(/<[^>]+>/g, '').trim();
  return { fileUrl: info.url, descUrl: info.descriptionurl, license, author };
}

async function apiJson(params) {
  const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

/** A candidate File: title → resolved {fileUrl,license,...} or null. */
async function tryTitle(title) {
  const data = await apiJson(
    `action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|mime&titles=${encodeURIComponent(title)}`,
  );
  const page = Object.values(data?.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.url || !RASTER.test(info.url)) return null;
  const parsed = parseInfo(info);
  return licenseOk(parsed.license) ? { title: page.title ?? title, ...parsed } : null;
}

/** Commons File-namespace search → first PD raster, or null. */
async function trySearch(term) {
  const data = await apiJson(
    `action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch=${encodeURIComponent(term)}&prop=imageinfo&iiprop=url|extmetadata|mime`,
  );
  const pages = Object.values(data?.query?.pages ?? {});
  for (const page of pages) {
    const info = page?.imageinfo?.[0];
    if (!info?.url || !RASTER.test(info.url)) continue;
    const parsed = parseInfo(info);
    if (licenseOk(parsed.license)) return { title: page.title, ...parsed };
  }
  return null;
}

async function resolve(entry) {
  for (const title of entry.candidates ?? []) {
    try {
      const hit = await tryTitle(title);
      if (hit) return { ...hit, route: `candidate:${title}` };
    } catch (e) {
      /* try next */
    }
  }
  if (entry.search) {
    try {
      const hit = await trySearch(entry.search);
      if (hit) return { ...hit, route: `search:${entry.search}` };
    } catch (e) {
      /* fall through */
    }
  }
  return null;
}

async function main() {
  const manifest = loadManifest();
  const credits = [];
  const generated = {
    portraits: { moderates: null, hardliners: null, labor: null, students: null },
    units: { garrison: null, police: null, guard: null },
    events: {},
    hero: null,
  };

  for (const entry of manifest) {
    try {
      const hit = await resolve(entry);
      if (!hit) {
        console.warn(`SKIP ${entry.id}: no PD candidate or search result`);
        continue;
      }
      const res = await fetch(hit.fileUrl, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`download ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.byteLength > MAX_BYTES) throw new Error(`too large (${buf.byteLength})`);

      const [w, h] = SIZES[entry.surface];
      const rel = `img/${DIRS[entry.surface]}/${entry.id}.webp`;
      const out = join(ROOT, 'public', rel);
      mkdirSync(dirname(out), { recursive: true });
      await sharp(buf)
        .rotate()
        .resize(w, h, { fit: 'cover', position: 'attention' })
        .grayscale()
        .normalise()
        .linear(1.08, -8)
        .webp({ quality: 82 })
        .toFile(out);

      if (entry.surface === 'portrait') generated.portraits[entry.id] = rel;
      else if (entry.surface === 'unit') generated.units[entry.id] = rel;
      else if (entry.surface === 'event') generated.events[entry.id] = rel;
      else if (entry.surface === 'hero') generated.hero = rel;

      credits.push({
        id: entry.id,
        file: hit.title,
        source: hit.descUrl,
        author: hit.author || 'Unknown',
        license: hit.license,
      });
      console.log(`OK   ${entry.id} <- ${hit.title} [${hit.license}] (${hit.route})`);
    } catch (err) {
      console.warn(`SKIP ${entry.id}: ${err.message}`);
    }
  }

  // CREDITS
  mkdirSync(join(ROOT, 'public/img'), { recursive: true });
  writeFileSync(join(ROOT, 'public/img/CREDITS.json'), JSON.stringify(credits, null, 2) + '\n');
  const md = [
    '# Image credits',
    '',
    'All images below are used under public-domain, CC0, or CC-BY terms, sourced from',
    'Wikimedia Commons and processed (cropped, grayscaled, duotone-prepped) for this game.',
    '',
    ...credits.map((c) => `- **${c.id}** — [${c.file}](${c.source}) · ${c.author} · ${c.license}`),
    '',
  ].join('\n');
  writeFileSync(join(ROOT, 'public/img/CREDITS.md'), md);

  // Regenerate the registry
  const gen = `/**
 * Photographic asset registry — GENERATED by scripts/fetch-images.mjs.
 * Do not edit by hand.
 */
import type { FactionId } from '../engine/factions';
import type { UnitId } from '../engine/loyalty';

export const PORTRAIT_PATHS: Record<FactionId, string | null> = ${JSON.stringify(generated.portraits, null, 2)};

export const UNIT_PATHS: Record<UnitId, string | null> = ${JSON.stringify(generated.units, null, 2)};

export const EVENT_PATHS: Record<string, string | null> = ${JSON.stringify(generated.events, null, 2)};

export const HERO_PATH: string | null = ${JSON.stringify(generated.hero)};
`;
  writeFileSync(join(ROOT, 'src/content/imagery.generated.ts'), gen);

  console.log(`\nDone. ${credits.length}/${manifest.length} images cleared and processed.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
