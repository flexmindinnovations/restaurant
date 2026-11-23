#!/usr/bin/env node
// Assembles the static specimen into dist/: pages + web-ui bundle + brand and motion assets.
import { cpSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKGS = join(ROOT, '..');
const DIST = join(ROOT, 'dist');
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(ROOT, 'src'), DIST, { recursive: true });
cpSync(join(PKGS, 'web-ui', 'dist'), join(DIST, 'web-ui'), { recursive: true });
for (const d of ['brand', 'illustrations', 'icons']) {
  const src = join(PKGS, 'brand-assets', d);
  if (existsSync(src)) cpSync(src, join(DIST, 'assets', d), { recursive: true });
}
const motion = join(PKGS, 'motion-assets');
for (const d of ['lottie', 'css', 'fallbacks']) if (existsSync(join(motion, d))) cpSync(join(motion, d), join(DIST, 'motion', d), { recursive: true });
const lottie = join(motion, 'node_modules', 'lottie-web', 'build', 'player', 'lottie_light.min.js');
if (existsSync(lottie)) cpSync(lottie, join(DIST, 'motion', 'lottie_light.min.js'));
console.log('documentation/dist ready');
