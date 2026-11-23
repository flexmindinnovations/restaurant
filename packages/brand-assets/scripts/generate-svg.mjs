#!/usr/bin/env node
// Generates the DOSA brand marks, app icons and illustration library as static SVG files.
//   node packages/brand-assets/scripts/generate-svg.mjs
// Output is committed; edit this script or illustrations.mjs, never the SVGs by hand.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { kit, doc, ROLES } from './svg-kit.mjs';
import { SCENES } from './illustrations.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const index = [];
const write = (rel, svg, meta) => {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, svg);
  index.push({ file: rel, bytes: Buffer.byteLength(svg), ...meta });
};

// ---------------------------------------------------------------- symbol
// "The fold": a D whose stem is Midnight Ink and whose bowl is a Saffron crescent (a folded
// dosa / a plate rim), holding the violet spark of intelligence. 64-unit grid, optical centre.
const SYMBOL = {
  stem: 'M26 10H19a4 4 0 0 0-4 4v36a4 4 0 0 0 4 4h7Z',
  bowl: 'M26 10a22 22 0 0 1 0 44V43a11 11 0 0 0 0-22Z',
  spark: 'M31.5 26.4Q32.6 30.9 37.1 32Q32.6 33.1 31.5 37.6Q30.4 33.1 25.9 32Q30.4 30.9 31.5 26.4Z',
};
const symbolGroup = ({ stem, bowl, spark }) =>
  `<path d="${SYMBOL.stem}" fill="${stem}"/><path d="${SYMBOL.bowl}" fill="${bowl}"/><path d="${SYMBOL.spark}" fill="${spark}"/>`;
const VARIANTS = {
  color: { stem: '#202039', bowl: '#E9A23B', spark: '#7564E8' },
  reversed: { stem: '#F7F5F0', bowl: '#E9A23B', spark: '#A6A2FF' },
  mono: { stem: 'currentColor', bowl: 'currentColor', spark: 'currentColor' },
};
const svgOpen = (vb, w, h, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}" role="img" aria-label="${title}">`;

write('brand/dosa-symbol.svg', `${svgOpen('0 0 64 64', 64, 64, 'DOSA')}${symbolGroup(VARIANTS.color)}</svg>\n`, { kind: 'brand', usage: 'Symbol, full colour, light backgrounds. Favicon source.', size: '64×64 grid, D occupies 33×44', colour: 'Fixed brand colours' });
write('brand/dosa-symbol-reversed.svg', `${svgOpen('0 0 64 64', 64, 64, 'DOSA')}${symbolGroup(VARIANTS.reversed)}</svg>\n`, { kind: 'brand', usage: 'Symbol on Midnight Ink / dark surfaces.', size: '64×64', colour: 'Fixed (pearl stem, violet-400 spark)' });
// Mono: the spark is knocked out of the bowl's counter so a single colour still reads.
write('brand/dosa-symbol-mono.svg', `${svgOpen('0 0 64 64', 64, 64, 'DOSA')}<path d="${SYMBOL.stem}" fill="currentColor"/><path d="${SYMBOL.bowl}" fill="currentColor"/><path d="${SYMBOL.spark}" fill="currentColor" opacity="0.72"/></svg>\n`, { kind: 'brand', usage: 'Single-colour symbol: inherits CSS color / Flutter colorFilter.', size: '64×64', colour: 'currentColor' });

// ---------------------------------------------------------------- wordmark
const wm = JSON.parse(readFileSync(join(HERE, 'wordmark-path.json'), 'utf8'));
const [bx0, by0, bx1, by1] = wm.box;
const wmW = bx1 - bx0; const wmH = by1 - by0;
const wordmark = (fill) => wm.glyphs.map((g) => `<path d="${g.d}" fill="${fill}"/>`).join('');
const wmVB = `${bx0} ${by0} ${wmW} ${wmH}`;
const wmHeight = 32; const wmWidth = +(wmHeight * wmW / wmH).toFixed(1);
write('brand/dosa-wordmark.svg', `${svgOpen(wmVB, wmWidth, wmHeight, 'DOSA')}${wordmark('#202039')}</svg>\n`, { kind: 'brand', usage: 'Wordmark on light backgrounds.', size: `${wmWidth}×${wmHeight} (scalable)`, colour: 'Midnight Ink' });
write('brand/dosa-wordmark-reversed.svg', `${svgOpen(wmVB, wmWidth, wmHeight, 'DOSA')}${wordmark('#F7F5F0')}</svg>\n`, { kind: 'brand', usage: 'Wordmark on dark backgrounds.', size: `${wmWidth}×${wmHeight}`, colour: 'Pearl' });
write('brand/dosa-wordmark-mono.svg', `${svgOpen(wmVB, wmWidth, wmHeight, 'DOSA')}${wordmark('currentColor')}</svg>\n`, { kind: 'brand', usage: 'Single-colour wordmark.', size: `${wmWidth}×${wmHeight}`, colour: 'currentColor' });

// ---------------------------------------------------------------- lock-up
// Symbol D height (44u) = 1.3 × cap height. Gap = spark width (~11u at symbol scale).
{
  const H = 48; const symScale = H / 64; // symbol drawn at 48px box
  const capPx = (44 * symScale) / 1.3; const wmScale = capPx / 745; // 745 = cap height in font units
  const gap = 10;
  const symRight = 48 * symScale; // bowl outer edge at x=48 in symbol units
  const wmX = symRight + gap - bx0 * wmScale;
  const wmY = 32 * symScale + (745 / 2) * wmScale; // centre caps on symbol centre
  const totalW = +(wmX + bx1 * wmScale + 4).toFixed(1);
  const lock = (variant, fill) => `${svgOpen(`0 0 ${totalW} ${H}`, totalW, H, 'DOSA')}<g transform="scale(${symScale})">${symbolGroup(variant)}</g><g transform="translate(${wmX.toFixed(2)} ${wmY.toFixed(2)}) scale(${wmScale.toFixed(5)})">${wordmark(fill)}</g></svg>\n`;
  write('brand/dosa-lockup.svg', lock(VARIANTS.color, '#202039'), { kind: 'brand', usage: 'Primary horizontal lock-up, light backgrounds.', size: `${totalW}×${H}`, colour: 'Fixed brand colours' });
  write('brand/dosa-lockup-reversed.svg', lock(VARIANTS.reversed, '#F7F5F0'), { kind: 'brand', usage: 'Horizontal lock-up on dark backgrounds.', size: `${totalW}×${H}`, colour: 'Fixed (reversed)' });
}

// ---------------------------------------------------------------- app icons
// 1024 master with Apple-style continuous-corner approximation (rx 228). Platforms mask their own
// shape; the artwork keeps the symbol inside the 66% safe zone for Android adaptive icons.
const APP_ICONS = [
  { file: 'icons/app/admin-web.svg', name: 'DOSA Admin', bg: ['#202039', '#373C68', '#7564E8'], sym: { stem: '#F7F5F0', bowl: '#E9A23B', spark: '#BFBEFF' }, usage: 'Web admin PWA / favicon-large. Technology gradient.' },
  { file: 'icons/app/staff-mobile.svg', name: 'DOSA Staff', bg: ['#202039', '#202039'], sym: { stem: '#F7F5F0', bowl: '#35B99A', spark: '#A6A2FF' }, usage: 'Staff app launcher. Midnight Ink with a Mint bowl (operations, live).' },
  { file: 'icons/app/customer-mobile.svg', name: 'DOSA', bg: ['#E9A23B', '#E97861'], sym: { stem: '#202039', bowl: '#F7F5F0', spark: '#7564E8' }, usage: 'Customer app launcher. Hospitality gradient.' },
];
for (const icon of APP_ICONS) {
  const stops = icon.bg.map((col, i) => `<stop offset="${icon.bg.length === 1 ? 0 : i / (icon.bg.length - 1)}" stop-color="${col}"/>`).join('');
  const id = icon.file.split('/').pop().replace('.svg', '');
  const svg = `${svgOpen('0 0 1024 1024', 1024, 1024, icon.name)}<defs><linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient>` +
    `<radialGradient id="${id}-glow" cx="0.28" cy="0.2" r="0.7"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.22"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient></defs>` +
    `<rect width="1024" height="1024" rx="228" fill="url(#${id}-bg)"/><rect width="1024" height="1024" rx="228" fill="url(#${id}-glow)"/>` +
    `<g transform="translate(512 512) scale(9.5) translate(-31.5 -32)">${symbolGroup(icon.sym)}</g></svg>\n`;
  write(icon.file, svg, { kind: 'app-icon', usage: icon.usage, size: '1024×1024 master', colour: 'Fixed' });
}
// Favicon: symbol on pearl rounded square for legibility on any tab colour.
write('icons/favicon.svg', `${svgOpen('0 0 64 64', 32, 32, 'DOSA')}<rect width="64" height="64" rx="14" fill="#F7F5F0"/><g transform="translate(32 32) scale(1.12) translate(-31.5 -32)">${symbolGroup(VARIANTS.color)}</g></svg>\n`, { kind: 'app-icon', usage: 'Browser favicon (SVG).', size: '32×32 (64 grid)', colour: 'Fixed' });

// ---------------------------------------------------------------- illustrations
for (const mode of ['light', 'dark']) {
  const k = kit(mode);
  for (const s of SCENES) {
    const body = s.draw(k).join('');
    write(`illustrations/${mode}/${s.file}.svg`, doc(s.title, s.desc, body), { kind: `illustration-${s.group}`, mode, usage: s.desc, size: '240×180 (4:3), scalable', colour: `Fixed ${mode} palette` });
  }
}

// ---------------------------------------------------------------- index
writeFileSync(join(ROOT, 'asset-index.json'), JSON.stringify({ generatedBy: 'packages/brand-assets/scripts/generate-svg.mjs', roles: ROLES, assets: index }, null, 2) + '\n');
const md = ['<!-- Generated by scripts/generate-svg.mjs. Do not edit. -->', '', '# DOSA asset index', '', `${index.length} SVG assets. Rendering rules: [docs/ASSET_GUIDELINES.md](../../docs/ASSET_GUIDELINES.md).`, '', '| File | Kind | Mode | Size | Colour behaviour | Intended usage | Bytes |', '|---|---|---|---|---|---|---:|'];
for (const a of index) md.push(`| \`${a.file}\` | ${a.kind} | ${a.mode ?? '—'} | ${a.size} | ${a.colour} | ${a.usage} | ${a.bytes} |`);
md.push('', '## Textures', '', '| File | Usage |', '|---|---|',
  '| `textures/paper-grain-256.webp` / `.png` | Web grain layer (grey, used with mix-blend-mode multiply / soft-light). |',
  '| `textures/paper-grain-ink-256.webp` / `.png` | Pre-tinted ink specks for light surfaces (Flutter, or web without blend modes). |',
  '| `textures/paper-grain-pearl-256.webp` / `.png` | Pre-tinted pearl specks for dark surfaces. |',
  '| `textures/paper-grain.svg` | Vector feTurbulence source; avoid for full-screen use. |', '');
writeFileSync(join(ROOT, 'ASSET_INDEX.md'), md.join('\n'));
console.log(`${index.length} SVG assets written.`);
