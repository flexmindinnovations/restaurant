#!/usr/bin/env node
// Validates the DOSA brand asset library.
//   node scripts/validate.mjs               check everything
//   node scripts/validate.mjs --sync-fonts  copy canonical font files into packages/flutter-ui/fonts first
import { readFileSync, readdirSync, statSync, copyFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKGS = join(ROOT, '..');
let errors = 0;
const fail = (m) => { errors++; console.error(`✗ ${m}`); };

// ---------- fonts: canonical copies vs Flutter copies ----------
const FONT_PAIRS = [
  ['fonts/inter/InterVariable.ttf', 'flutter-ui/fonts/InterVariable.ttf'],
  ['fonts/inter/OFL.txt', 'flutter-ui/fonts/Inter-OFL.txt'],
  ['fonts/plus-jakarta-sans/PlusJakartaSansVariable.ttf', 'flutter-ui/fonts/PlusJakartaSansVariable.ttf'],
  ['fonts/plus-jakarta-sans/OFL.txt', 'flutter-ui/fonts/PlusJakartaSans-OFL.txt'],
  ['textures/paper-grain-ink-256.webp', 'flutter-ui/assets/textures/paper-grain-ink-256.webp'],
  ['textures/paper-grain-pearl-256.webp', 'flutter-ui/assets/textures/paper-grain-pearl-256.webp'],
];
const sha = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');
for (const [src, dst] of FONT_PAIRS) {
  const a = join(ROOT, src); const b = join(PKGS, dst);
  if (process.argv.includes('--sync-fonts')) copyFileSync(a, b);
  if (!existsSync(b) || sha(a) !== sha(b)) fail(`${dst} differs from brand-assets/${src} (run: pnpm --filter @dosa/brand-assets fonts:sync)`);
}

// ---------- SVG checks ----------
const palette = new Set(
  Object.values(JSON.parse(readFileSync(join(PKGS, 'design-tokens', 'dist', 'json', 'primitives.json'), 'utf8')))
    .filter((v) => typeof v === 'string' && /^#[0-9A-F]{6}$/i.test(v)).map((v) => v.toUpperCase()),
);
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const svgs = ['brand', 'icons', 'illustrations', 'textures'].flatMap((d) => walk(join(ROOT, d))).filter((p) => p.endsWith('.svg'));

/** Minimal XML well-formedness: balanced tags, quoted attributes, single root. */
function wellFormed(xml) {
  const stack = []; let roots = 0;
  const re = /<(\/?)([a-zA-Z][\w:-]*)((?:\s+[\w:-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|<!--[\s\S]*?-->|<\?[\s\S]*?\?>/g;
  let m; let last = 0;
  while ((m = re.exec(xml))) {
    const between = xml.slice(last, m.index);
    if (/[<>]/.test(between)) return `stray markup near: ${between.trim().slice(0, 40)}`;
    last = re.lastIndex;
    if (!m[2]) continue;
    const [, close, name, , self] = m;
    if (close) { if (stack.pop() !== name) return `mismatched </${name}>`; }
    else if (!self) { if (!stack.length) roots++; stack.push(name); }
    else if (!stack.length) roots++;
  }
  if (/[<>]/.test(xml.slice(last))) return 'trailing markup';
  if (stack.length) return `unclosed <${stack.at(-1)}>`;
  return roots === 1 ? null : `${roots} root elements`;
}

for (const p of svgs) {
  const rel = relative(ROOT, p);
  const xml = readFileSync(p, 'utf8');
  const wf = wellFormed(xml);
  if (wf) fail(`${rel}: not well-formed (${wf})`);
  if (!/^<svg [^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(xml)) fail(`${rel}: missing xmlns on root <svg>`);
  if (!/viewBox="[\d.\s-]+"/.test(xml)) fail(`${rel}: missing viewBox`);
  if (!/(<title|aria-label=|aria-hidden="true")/.test(xml)) fail(`${rel}: no accessible name (<title>, aria-label, or aria-hidden for decorative)`);
  if (/<image|data:image|xlink:href="(?!#)/.test(xml)) fail(`${rel}: embedded raster or external reference`);
  if (/<script|on[a-z]+=/.test(xml)) fail(`${rel}: script or event handler`);
  if (rel.startsWith('illustrations') && /<filter/.test(xml)) fail(`${rel}: illustrations must not use filters`);
  const ids = [...xml.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  if (new Set(ids).size !== ids.length) fail(`${rel}: duplicate ids`);
  for (const [, hex] of xml.matchAll(/(?:fill|stroke|stop-color)="(#[0-9A-Fa-f]{6})"/g)) {
    if (!palette.has(hex.toUpperCase())) fail(`${rel}: colour ${hex} is not in the DOSA palette`);
  }
  const kb = Buffer.byteLength(xml) / 1024;
  const budget = rel.startsWith('illustrations') ? 8 : rel.startsWith('brand') ? 12 : 6;
  if (kb > budget) fail(`${rel}: ${kb.toFixed(1)} KB exceeds ${budget} KB budget`);
}

// ---------- index completeness ----------
const index = JSON.parse(readFileSync(join(ROOT, 'asset-index.json'), 'utf8'));
const indexed = new Set(index.assets.map((a) => a.file));
for (const p of svgs) { const rel = relative(ROOT, p).split('\\').join('/'); if (!rel.startsWith('textures') && !indexed.has(rel)) fail(`${rel}: missing from asset-index.json`); }
const light = readdirSync(join(ROOT, 'illustrations', 'light')).sort().join();
const dark = readdirSync(join(ROOT, 'illustrations', 'dark')).sort().join();
if (light !== dark) fail('illustrations/light and illustrations/dark contain different files');

console.log(`${svgs.length} SVGs, ${FONT_PAIRS.length} synced files checked; ${errors} problem(s).`);
process.exit(errors ? 1 : 0);
