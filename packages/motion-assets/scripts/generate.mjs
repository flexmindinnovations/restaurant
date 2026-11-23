#!/usr/bin/env node
// Writes lottie/{light,dark}/<name>.json from scripts/animations.mjs.
//   node scripts/generate.mjs           write
//   node scripts/generate.mjs --check   fail if committed JSON differs from the generator
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ANIMATIONS, MODES } from './animations.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
let stale = 0; const manifest = [];
for (const [mode, roles] of Object.entries(MODES)) {
  for (const a of ANIMATIONS) {
    const json = JSON.stringify(a.build(roles)) + '\n';
    const rel = `lottie/${mode}/${a.file}.json`;
    const p = join(ROOT, rel);
    if (CHECK) { if (!existsSync(p) || readFileSync(p, 'utf8') !== json) { stale++; console.error(`stale: ${rel}`); } }
    else { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, json); }
    if (mode === 'light') manifest.push({ name: a.file, title: a.title, usage: a.usage, loop: a.loop, poster: a.poster });
  }
}
const man = JSON.stringify({ animations: manifest }, null, 2) + '\n';
if (!CHECK) writeFileSync(join(ROOT, 'manifest.json'), man);
else if (readFileSync(join(ROOT, 'manifest.json'), 'utf8') !== man) { stale++; console.error('stale: manifest.json'); }
if (stale) { console.error(`${stale} file(s) out of date — run pnpm --filter @dosa/motion-assets generate`); process.exit(1); }
console.log(CHECK ? 'Lottie files up to date.' : `${manifest.length * 2} Lottie files written.`);
