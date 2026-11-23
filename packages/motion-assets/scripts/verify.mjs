#!/usr/bin/env node
// Renders every Lottie file with lottie-web (SVG renderer) in headless Chromium:
//  - fails on load errors, wrong dimensions/frame counts, or blank frames
//  - writes contact strips (5 frames each) to .artifacts/ for visual review
//  - exports the poster frame as a static SVG fallback (fallbacks/<mode>/<name>.svg) with --export
// Requires Playwright with Chromium (preinstalled in CI images; `npx playwright install chromium` locally).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXPORT = process.argv.includes('--export');
const lottieSrc = readFileSync(require.resolve('lottie-web/build/player/lottie_light.min.js'), 'utf8');
const { animations } = JSON.parse(readFileSync(join(ROOT, 'manifest.json'), 'utf8'));
const OUT = join(ROOT, '.artifacts');
// lottie-web truncates channel values (e.g. 117 → 116); snap exported colours back to the palette.
const PALETTE = Object.values(JSON.parse(readFileSync(join(ROOT, '..', 'design-tokens', 'dist', 'json', 'primitives.json'), 'utf8')))
  .filter((v) => typeof v === 'string' && /^#[0-9A-F]{6}$/i.test(v)).map((h) => [h.toUpperCase(), [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))]);
const snap = (rgb) => {
  let best = null; let d = Infinity;
  for (const [hex, p] of PALETTE) { const dd = Math.max(...p.map((v, i) => Math.abs(v - rgb[i]))); if (dd < d) { d = dd; best = hex; } }
  return d <= 2 ? best : '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
};
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1240, height: 200 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.setContent(`<html><body style="margin:0;display:flex;gap:8px;padding:10px;background:#888">${Array.from({ length: 5 }, (_, i) => `<div id="f${i}" style="width:240px;height:180px;background:#fff"></div>`).join('')}</body></html>`);
await page.addScriptTag({ content: lottieSrc });

let failures = 0;
for (const mode of ['light', 'dark']) {
  await page.evaluate((bg) => document.querySelectorAll('[id^=f]').forEach((d) => { d.style.background = bg; }), mode === 'dark' ? '#14132A' : '#F7F5F0');
  for (const a of animations) {
    const data = JSON.parse(readFileSync(join(ROOT, 'lottie', mode, `${a.name}.json`), 'utf8'));
    const result = await page.evaluate(async ({ data, poster }) => {
      const out = { frames: [], svg: null };
      const total = data.op - data.ip;
      const picks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.min(total - 1, Math.round(t * (total - 1))));
      for (let i = 0; i < 5; i++) {
        const el = document.getElementById(`f${i}`); el.innerHTML = '';
        const anim = lottie.loadAnimation({ container: el, renderer: 'svg', loop: false, autoplay: false, animationData: structuredClone(data), rendererSettings: { preserveAspectRatio: 'xMidYMid meet' } });
        await new Promise((r) => (anim.isLoaded ? r() : anim.addEventListener('DOMLoaded', r)));
        anim.goToAndStop(picks[i], true);
        out.totalFrames = anim.totalFrames;
        out.frames.push(el.querySelectorAll('path').length);
        if (i === 4) {
          const pf = poster === 'start' ? 0 : poster === 'mid' ? Math.round(total / 2) : total - 1;
          anim.goToAndStop(pf, true);
          const svg = el.querySelector('svg').cloneNode(true);
          svg.removeAttribute('style'); svg.removeAttribute('preserveAspectRatio');
          svg.setAttribute('width', '240'); svg.setAttribute('height', '180');
          svg.querySelectorAll('[style]').forEach((n) => { if (/display:\s*none/.test(n.getAttribute('style'))) n.remove(); else n.removeAttribute('style'); });
          svg.querySelectorAll('[opacity="0"], [fill-opacity="0"][stroke-opacity="0"]').forEach((n) => n.remove());
          out.svg = new XMLSerializer().serializeToString(svg);
          anim.goToAndStop(picks[i], true);
        }
      }
      return out;
    }, { data, poster: a.poster });
    const expected = data.op - data.ip;
    const raw = readFileSync(join(ROOT, 'lottie', mode, `${a.name}.json`), 'utf8');
    if (Buffer.byteLength(raw) > 15 * 1024) { failures++; console.error(`✗ ${mode}/${a.name}: over 15 KB`); }
    if (data.layers.length > 12) { failures++; console.error(`✗ ${mode}/${a.name}: ${data.layers.length} layers (> 12)`); }
    if (data.assets.length || /"hasMask":true|"tt":|"x":"[^"]*\$|"ty":2/.test(raw)) { failures++; console.error(`✗ ${mode}/${a.name}: uses images, mattes, masks or expressions`); }
    if (data.w !== 240 || data.h !== 180) { failures++; console.error(`✗ ${mode}/${a.name}: size ${data.w}×${data.h}`); }
    if (result.totalFrames !== expected) { failures++; console.error(`✗ ${mode}/${a.name}: totalFrames ${result.totalFrames} ≠ ${expected}`); }
    if (result.frames.some((n) => n === 0)) { failures++; console.error(`✗ ${mode}/${a.name}: blank frame`); }
    await page.screenshot({ path: join(OUT, `${mode}-${a.name}.png`) });
    if (EXPORT) {
      const title = `<title>${a.title}</title>`;
      // Deterministic, compact output: stable ids, hex colours, 2-decimal coordinates.
      const ids = new Map();
      const svg = result.svg
        .replace(/__lottie_element_\d+/g, (id) => { if (!ids.has(id)) ids.set(id, `dosa-${a.name}-${ids.size + 1}`); return ids.get(id); })
        .replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g, (m, r, g, b) => snap([+r, +g, +b]))
        .replace(/-?\d+\.\d{3,}/g, (n) => String(+(+n).toFixed(2)))
        .replace(/ xmlns:xlink="[^"]*"/, '')
        .replace(/^<svg([^>]*)>/, (m, attrs) => `<svg${attrs} role="img" aria-label="${a.title}">${title}`);
      mkdirSync(join(ROOT, 'fallbacks', mode), { recursive: true });
      writeFileSync(join(ROOT, 'fallbacks', mode, `${a.name}.svg`), svg + '\n');
    }
    console.log(`✓ ${mode}/${a.name}: ${expected} frames @ ${data.fr} fps (${(expected / data.fr).toFixed(2)} s)${a.loop ? ' loop' : ''}`);
  }
}
await browser.close();
if (errors.length) { failures += errors.length; console.error(errors.join('\n')); }
if (failures) { console.error(`${failures} problem(s)`); process.exit(1); }
console.log(`All ${animations.length * 2} animations rendered. Strips in .artifacts/.`);
