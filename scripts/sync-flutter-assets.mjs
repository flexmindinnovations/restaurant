#!/usr/bin/env node
// Flutter packages can only bundle files inside their own folder, so dosa_ui carries copies of the
// canonical fonts, textures, brand marks, illustrations and motion files.
//   node scripts/sync-flutter-assets.mjs          copy canonical → packages/flutter-ui
//   node scripts/sync-flutter-assets.mjs --check  fail if any copy is missing or differs
import { readdirSync, statSync, readFileSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const P = (...s) => join(REPO, 'packages', ...s);
const FUI = P('flutter-ui');
const MAP = [
  [P('brand-assets', 'fonts', 'inter', 'InterVariable.ttf'), join(FUI, 'fonts', 'InterVariable.ttf')],
  [P('brand-assets', 'fonts', 'inter', 'OFL.txt'), join(FUI, 'fonts', 'Inter-OFL.txt')],
  [P('brand-assets', 'fonts', 'plus-jakarta-sans', 'PlusJakartaSansVariable.ttf'), join(FUI, 'fonts', 'PlusJakartaSansVariable.ttf')],
  [P('brand-assets', 'fonts', 'plus-jakarta-sans', 'OFL.txt'), join(FUI, 'fonts', 'PlusJakartaSans-OFL.txt')],
  [P('brand-assets', 'textures', 'paper-grain-ink-256.webp'), join(FUI, 'assets', 'textures', 'paper-grain-ink-256.webp')],
  [P('brand-assets', 'textures', 'paper-grain-pearl-256.webp'), join(FUI, 'assets', 'textures', 'paper-grain-pearl-256.webp')],
];
const dirs = [
  [P('brand-assets', 'brand'), join(FUI, 'assets', 'brand')],
  [P('brand-assets', 'illustrations', 'light'), join(FUI, 'assets', 'illustrations', 'light')],
  [P('brand-assets', 'illustrations', 'dark'), join(FUI, 'assets', 'illustrations', 'dark')],
  [P('motion-assets', 'lottie', 'light'), join(FUI, 'assets', 'motion', 'light')],
  [P('motion-assets', 'lottie', 'dark'), join(FUI, 'assets', 'motion', 'dark')],
  [P('motion-assets', 'fallbacks', 'light'), join(FUI, 'assets', 'motion', 'fallbacks', 'light')],
  [P('motion-assets', 'fallbacks', 'dark'), join(FUI, 'assets', 'motion', 'fallbacks', 'dark')],
];
for (const [src, dst] of dirs) for (const f of readdirSync(src)) if (statSync(join(src, f)).isFile()) MAP.push([join(src, f), join(dst, f)]);

const CHECK = process.argv.includes('--check');
let bad = 0;
if (!CHECK) for (const [, dst] of dirs) rmSync(dst, { recursive: true, force: true });
for (const [src, dst] of MAP) {
  if (CHECK) {
    if (!existsSync(dst) || !readFileSync(src).equals(readFileSync(dst))) { bad++; console.error(`✗ out of sync: ${relative(REPO, dst)}`); }
  } else { mkdirSync(dirname(dst), { recursive: true }); copyFileSync(src, dst); }
}
// Extra files in synced dirs (deleted upstream) are also drift.
if (CHECK) for (const [src, dst] of dirs) if (existsSync(dst)) for (const f of readdirSync(dst)) if (!existsSync(join(src, f))) { bad++; console.error(`✗ stale copy: ${relative(REPO, join(dst, f))}`); }
if (bad) { console.error(`${bad} Flutter asset(s) out of sync. Run: pnpm flutter:sync-assets`); process.exit(1); }
console.log(CHECK ? `${MAP.length} Flutter asset copies in sync.` : `${MAP.length} files synced into packages/flutter-ui.`);
