/**
 * Fetch + license-gate + duotone-prep the historical imagery. Runs ONLY on
 * GitHub's runners via the manual "fetch-images" workflow — this session's
 * egress is policy-blocked from Wikimedia, so nothing here runs locally or
 * in the deploy build.
 *
 * For each manifest entry: query the Commons API for the file's URL and
 * license; reject anything not public-domain / CC0 / CC-BY; download;
 * process with sharp (crop to aspect, resize, grayscale + normalise +
 * gentle contrast) into public/img/**; then write public/img/CREDITS.md,
 * public/img/CREDITS.json, and regenerate src/content/imagery.generated.ts.
 *
 * Requires: node >= 18 (global fetch), `sharp` (dev-dep). Usage: node scripts/fetch-images.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'silver-doodle-image-fetch/1.0 (educational game; PD imagery only)';

// License short-names we accept. The gate is substring-insensitive.
const LICENSE_ALLOW = ['public domain', 'pd-', 'cc0', 'cc-by', 'cc by'];

// Parse the manifest (TS) without a compiler: pull the MANIFEST array items.
function loadManifest() {
  const src = readFileSync(join(ROOT, 'scripts/image-manifest.ts'), 'utf8');
  const body = src.slice(src.indexOf('MANIFEST'));
  const entries = [];
  const re = /id:\s*'([^']+)',\s*surface:\s*'([^']+)',\s*commonsFile:\s*'([^']+)',\s*crop:\s*\[(\d+),\s*(\d+)\]/g;
  let m;
  while ((m = re.exec(body))) {
    entries.push({ id: m[1], surface: m[2], commonsFile: m[3], crop: [Number(m[4]), Number(m[5])] });
  }
  return entries;
}

const SIZES = {
  portrait: [320, 400],
  unit: [320, 220],
  event: [640, 360],
  hero: [1280, 520],
};
const DIRS = { portrait: 'portraits', unit: 'corps', event: 'events', hero: 'hero' };

async function imageInfo(file) {
  const url = `${API}?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&titles=${encodeURIComponent(file)}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  const info = page?.imageinfo?.[0];
  if (!info) throw new Error('no imageinfo (file missing?)');
  const md = info.extmetadata ?? {};
  const license = (md.LicenseShortName?.value ?? md.License?.value ?? '').toString();
  const author = (md.Artist?.value ?? '').toString().replace(/<[^>]+>/g, '').trim();
  return { fileUrl: info.url, descUrl: info.descriptionurl, license, author };
}

function licenseOk(license) {
  const l = license.toLowerCase();
  return LICENSE_ALLOW.some((a) => l.includes(a));
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
      const info = await imageInfo(entry.commonsFile);
      if (!licenseOk(info.license)) {
        console.warn(`SKIP ${entry.id}: license "${info.license}" not in allowlist`);
        continue;
      }
      const res = await fetch(info.fileUrl, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`download ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());

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

      credits.push({ id: entry.id, file: entry.commonsFile, source: info.descUrl, author: info.author || 'Unknown', license: info.license });
      console.log(`OK   ${entry.id} <- ${entry.commonsFile} [${info.license}]`);
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
    ...credits.map(
      (c) => `- **${c.id}** — [${c.file}](${c.source}) · ${c.author} · ${c.license}`,
    ),
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
