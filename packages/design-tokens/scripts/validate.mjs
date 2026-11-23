#!/usr/bin/env node
// Validates the token model: references resolve, themes share keys (both enforced by buildModel),
// brand colours are exact, and WCAG 2.2 contrast holds for every semantic pairing that ships.
import { buildModel, THEMES, composite, contrast, parseHex, toHex } from './lib.mjs';

const { primitives, themes } = buildModel();
let failures = 0;
const fail = (msg) => { failures++; console.error(`✗ ${msg}`); };

// 1. Exact brand colours (the brief fixes these values).
const BRAND = {
  'midnight-ink': '#202039', 'royal-violet': '#7564E8', saffron: '#E9A23B', 'warm-coral': '#E97861',
  mint: '#35B99A', pearl: '#F7F5F0', cloud: '#ECEBF1', slate: '#66677A',
};
for (const [k, hex] of Object.entries(BRAND)) {
  const t = primitives.get(`color.brand.${k}`);
  if (!t || toHex(t.value) !== hex) fail(`brand colour ${k} must be ${hex}`);
}

// 2. Contrast pairs. [foreground, background, minimum ratio, note]
const TEXT = 4.5, LARGE = 3, UI = 3;
const PAIRS = [
  ['color.text.primary', 'color.background.canvas', 7, 'body text on canvas (AAA target)'],
  ['color.text.primary', 'color.surface.primary', 7],
  ['color.text.primary', 'color.surface.secondary', TEXT],
  ['color.text.secondary', 'color.background.canvas', TEXT],
  ['color.text.secondary', 'color.surface.primary', TEXT],
  ['color.text.secondary', 'color.surface.secondary', TEXT],
  ['color.text.tertiary', 'color.surface.primary', LARGE, 'tertiary is limited to ≥16px non-essential text'],
  ['color.text.link', 'color.surface.primary', TEXT],
  ['color.text.brand', 'color.background.canvas', TEXT],
  ['color.text.inverse', 'color.surface.inverse', TEXT],
  ['color.action.primary.fg', 'color.action.primary.bg', TEXT],
  ['color.action.primary.fg', 'color.action.primary.bg-hover', TEXT],
  ['color.action.secondary.fg', 'color.action.secondary.bg', TEXT, 'over surface.primary'],
  ['color.action.tertiary.fg', 'color.surface.primary', TEXT],
  ['color.action.neutral.fg', 'color.action.neutral.bg', TEXT],
  ['color.action.destructive.fg', 'color.action.destructive.bg', TEXT],
  ['color.action.highlight.fg', 'color.action.highlight.bg', TEXT],
  ['color.status.success.fg', 'color.status.success.bg', TEXT],
  ['color.status.warning.fg', 'color.status.warning.bg', TEXT],
  ['color.status.error.fg', 'color.status.error.bg', TEXT],
  ['color.status.info.fg', 'color.status.info.bg', TEXT],
  ['color.status.neutral.fg', 'color.status.neutral.bg', TEXT],
  ['color.status.success.fg', 'color.surface.primary', TEXT],
  ['color.status.error.fg', 'color.surface.primary', TEXT],
  ['color.status.warning.fg', 'color.surface.primary', TEXT],
  ['color.status.success.on-solid', 'color.status.success.solid', TEXT],
  ['color.status.warning.on-solid', 'color.status.warning.solid', TEXT],
  ['color.status.error.on-solid', 'color.status.error.solid', TEXT],
  ['color.status.info.on-solid', 'color.status.info.solid', TEXT],
  ['color.focus.ring', 'color.background.canvas', UI, 'focus indicator'],
  ['color.focus.ring', 'color.surface.primary', UI],
  ['color.border.strong', 'color.surface.primary', UI, 'input boundary on hover'],
  ['color.status.live', 'color.surface.primary', UI, 'live dot (non-text)'],
  ['color.status.critical', 'color.surface.primary', UI],
  ['color.order.received', 'color.surface.primary', UI, 'order status indicators (non-text, always with label)'],
  ['color.order.accepted', 'color.surface.primary', UI],
  ['color.order.preparing', 'color.surface.primary', UI],
  ['color.order.ready', 'color.surface.primary', UI],
  ['color.order.cancelled', 'color.surface.primary', UI],
  ['color.text.primary', 'color.glass.standard-tint', TEXT, 'text on glass, composited over canvas (worst case without blur)'],
  ['color.text.secondary', 'color.glass.subtle-tint', TEXT, 'text on glass, composited over canvas'],
];

const rows = [];
for (const name of THEMES) {
  const tok = themes[name].tokens;
  const canvas = tok.get('color.background.canvas').value;
  const surface = tok.get('color.surface.primary').value;
  const solid = (key, base) => { const c = tok.get(key).value; return c.a < 1 ? composite(c, base) : c; };
  for (const [fg, bg, min, note] of PAIRS) {
    const bgBase = bg === 'color.action.secondary.bg' ? surface : canvas;
    const b = solid(bg, bgBase);
    const f = solid(fg, b);
    const ratio = contrast(f, b);
    const ok = ratio + 1e-9 >= min;
    rows.push({ theme: name, fg, bg, ratio: ratio.toFixed(2), min, ok });
    if (!ok) fail(`${name}: ${fg} on ${bg} = ${ratio.toFixed(2)} < ${min}${note ? ` (${note})` : ''}`);
  }
}

if (process.argv.includes('--report')) {
  const out = ['| Theme | Foreground | Background | Ratio | Min | |', '|---|---|---|---:|---:|---|'];
  for (const r of rows) out.push(`| ${r.theme} | \`${r.fg}\` | \`${r.bg}\` | ${r.ratio} | ${r.min} | ${r.ok ? '✓' : '✗'} |`);
  console.log(out.join('\n'));
}
console.log(`${rows.length} contrast checks across ${THEMES.length} themes, ${failures} failure(s).`);
process.exit(failures ? 1 : 0);
