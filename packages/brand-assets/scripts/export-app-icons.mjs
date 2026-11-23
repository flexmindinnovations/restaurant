#!/usr/bin/env node
// Renders the 1024px app-icon SVG masters into the platform launcher icons of the Flutter apps.
//   Android: mipmap-*/ic_launcher.png (rounded-square master, transparent corners)
//   iOS:     AppIcon.appiconset/*.png (full-bleed square, no alpha; iOS applies its own mask)
// Uses the preinstalled Playwright Chromium. Usage: node export-app-icons.mjs [--check]
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '../../..');
const targets = [
  { master: 'staff-mobile', app: 'apps/staff-mobile' },
  { master: 'customer-mobile', app: 'apps/customer-mobile' },
];
const android = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };

const browser = await chromium.launch();
const page = await browser.newPage();
async function render(svg, size, out, opaque) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  await page.screenshot({ path: out, omitBackground: !opaque, clip: { x: 0, y: 0, width: size, height: size } });
}

let count = 0;
for (const { master, app } of targets) {
  const src = readFileSync(join(repo, 'packages/brand-assets/icons/app', `${master}.svg`), 'utf8');
  const fullBleed = src.replaceAll(/ rx="\d+"/g, '');
  for (const [density, size] of Object.entries(android)) {
    const out = join(repo, app, 'android/app/src/main/res', `mipmap-${density}`, 'ic_launcher.png');
    await render(src, size, out, false); count++;
  }
  const iosDir = join(repo, app, 'ios/Runner/Assets.xcassets/AppIcon.appiconset');
  if (existsSync(iosDir)) {
    for (const file of readdirSync(iosDir).filter((f) => f.endsWith('.png'))) {
      const m = /Icon-App-([\d.]+)x[\d.]+@(\d)x\.png/.exec(file);
      if (!m) continue;
      await render(fullBleed, Math.round(Number(m[1]) * Number(m[2])), join(iosDir, file), true); count++;
    }
  }
}
await browser.close();
console.log(`Rendered ${count} launcher icons from the SVG masters.`);
