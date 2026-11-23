// DOSA SVG kit: palette roles and shared drawing primitives for the brand and illustration library.
// Every illustration is composed from these primitives so stroke weight, corner rounding, light
// direction and colour roles stay identical across the set.

/** Colour roles per surface mode. Values are DOSA palette primitives only. */
export const ROLES = {
  light: {
    ink: '#202039', // outlines, darkest detail (brand Midnight Ink)
    muted: '#66677A', // secondary lines (Slate)
    paper: '#FFFFFF', // object bodies
    cloud: '#ECEBF1', // secondary bodies (Cloud)
    halo: '#F3F4FF', // backdrop blob (violet.50)
    shadow: '#D7D8E2', // ground shadow (ink.200)
    violet: '#7564E8', violetSoft: '#D6D6FF',
    saffron: '#E9A23B', saffronSoft: '#FFE9C8',
    coral: '#E97861', coralSoft: '#FFE4DB',
    mint: '#35B99A', mintSoft: '#CFF5E9',
    sky: '#3C83CE', skySoft: '#D8EEFF',
    rose: '#E9789B',
  },
  dark: {
    ink: '#EBEBF3', // ink.100 — outlines flip to near-white on dark
    muted: '#A2A3B4', // ink.400
    paper: '#2B2B45', // ink.850
    cloud: '#373750', // ink.800
    halo: '#202039', // Midnight Ink
    shadow: '#0D0D20', // ink.975
    violet: '#A6A2FF', violetSoft: '#4530A0',
    saffron: '#E9A23B', saffronSoft: '#6E3A00',
    coral: '#F89682', coralSoft: '#802918',
    mint: '#35B99A', mintSoft: '#00543F',
    sky: '#68A2E3', skySoft: '#00417C',
    rose: '#E9789B',
  },
};

export const STROKE = 2; // at the 240 × 180 artboard; scales with the SVG
export const W = 240;
export const H = 180;

const n = (v) => +v.toFixed(2);
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => `${k}="${v}"`).join(' ');

/** Factory bound to a colour mode. Returns drawing helpers producing SVG strings. */
export function kit(mode) {
  const c = ROLES[mode];
  const line = (extra = {}) => ({ stroke: c.ink, 'stroke-width': STROKE, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra });
  const el = (tag, a) => `<${tag} ${attrs(a)}/>`;
  const k = {
    c,
    el,
    g: (children, a = {}) => `<g ${attrs(a)}>${children.join('')}</g>`,
    path: (d, fill = 'none', a = {}) => el('path', { d, fill, ...line(), ...a }),
    rect: (x, y, w, h, r, fill, a = {}) => el('rect', { x, y, width: w, height: h, rx: r, fill, ...line(), ...a }),
    circle: (cx, cy, r, fill, a = {}) => el('circle', { cx, cy, r, fill, ...line(), ...a }),
    ellipse: (cx, cy, rx, ry, fill, a = {}) => el('ellipse', { cx, cy, rx, ry, fill, ...line(), ...a }),
    lineSeg: (x1, y1, x2, y2, a = {}) => el('line', { x1, y1, x2, y2, ...line(), ...a }),
    /** Soft organic backdrop blob (no stroke). Slightly asymmetric so it reads hand-made. */
    halo: (cx = 120, cy = 92, rx = 92, ry = 70, fill = c.halo) => el('path', {
      d: `M${n(cx - rx)} ${n(cy + ry * 0.08)}C${n(cx - rx)} ${n(cy - ry * 0.7)} ${n(cx - rx * 0.45)} ${n(cy - ry)} ${n(cx + rx * 0.05)} ${n(cy - ry)}C${n(cx + rx * 0.62)} ${n(cy - ry)} ${n(cx + rx)} ${n(cy - ry * 0.55)} ${n(cx + rx)} ${n(cy + ry * 0.02)}C${n(cx + rx)} ${n(cy + ry * 0.62)} ${n(cx + rx * 0.5)} ${n(cy + ry)} ${n(cx - rx * 0.04)} ${n(cy + ry)}C${n(cx - rx * 0.6)} ${n(cy + ry)} ${n(cx - rx)} ${n(cy + ry * 0.7)} ${n(cx - rx)} ${n(cy + ry * 0.08)}Z`,
      fill,
      // Tinted halos are toned down on dark surfaces so they glow rather than shout.
      opacity: mode === 'dark' && fill !== c.halo ? 0.5 : undefined,
    }),
    ground: (cx = 120, cy = 158, rx = 70, ry = 6) => el('ellipse', { cx, cy, rx, ry, fill: c.shadow, opacity: mode === 'light' ? 0.7 : 0.9 }),
    /** The DOSA spark: concave 4-point star. Signature accent — one per illustration. */
    spark: (cx, cy, r, fill = c.violet) => {
      const w = r * 0.2;
      return el('path', { d: `M${n(cx)} ${n(cy - r)}Q${n(cx + w)} ${n(cy - w)} ${n(cx + r)} ${n(cy)}Q${n(cx + w)} ${n(cy + w)} ${n(cx)} ${n(cy + r)}Q${n(cx - w)} ${n(cy + w)} ${n(cx - r)} ${n(cy)}Q${n(cx - w)} ${n(cy - w)} ${n(cx)} ${n(cy - r)}Z`, fill });
    },
    dot: (cx, cy, r, fill) => el('circle', { cx, cy, r, fill }),
    /** Rising steam: three soft S-curves. */
    steam: (x, y, h = 18, gap = 8) => [0, 1, 2].map((i) => {
      const xx = x + (i - 1) * gap; const hh = h - Math.abs(i - 1) * 4;
      return el('path', { d: `M${n(xx)} ${n(y)}c-3 ${n(-hh * 0.25)} 3 ${n(-hh * 0.5)} 0 ${n(-hh * 0.75)}s3 ${n(-hh * 0.4)} 0 ${n(-hh)}`, fill: 'none', ...line({ stroke: c.muted, 'stroke-width': 1.75 }) });
    }).join(''),
    /** Check mark inside a circle. */
    check: (cx, cy, r, fill = c.mint, tick = c.paper) => [
      el('circle', { cx, cy, r, fill, ...line() }),
      el('path', { d: `M${n(cx - r * 0.42)} ${n(cy + r * 0.02)}l${n(r * 0.3)} ${n(r * 0.3)} ${n(r * 0.55)} ${n(-r * 0.6)}`, fill: 'none', ...line({ stroke: tick, 'stroke-width': Math.max(2.5, r * 0.16) }) }),
    ].join(''),
    /** Plate seen at 3/4 view. */
    plate: (cx, cy, rx, ry) => [
      el('ellipse', { cx, cy, rx, ry, fill: c.paper, ...line() }),
      el('ellipse', { cx, cy: cy - ry * 0.06, rx: rx * 0.72, ry: ry * 0.66, fill: c.cloud, ...line({ 'stroke-width': 1.5, stroke: c.muted }) }),
    ].join(''),
    /** Rolled dosa: long golden crepe with crisp ridges. */
    dosaRoll: (x, y, len, thick = 16) => [
      el('path', { d: `M${n(x)} ${n(y)}h${n(len - thick / 2)}a${n(thick / 2)} ${n(thick / 2)} 0 0 1 0 ${n(thick)}h${n(-(len - thick / 2))}a${n(thick * 0.28)} ${n(thick / 2)} 0 0 1 0 ${n(-thick)}Z`, fill: c.saffron, ...line() }),
      ...[0.28, 0.5, 0.72].map((t) => el('path', { d: `M${n(x + len * t)} ${n(y + 3)}q3 ${n(thick / 2 - 3)} 0 ${n(thick - 6)}`, fill: 'none', ...line({ stroke: mode === 'light' ? '#A96B00' : '#6E3A00', 'stroke-width': 1.5 }) })),
    ].join(''),
    /** Small chutney bowl. */
    bowl: (cx, cy, r, fill) => [
      el('path', { d: `M${n(cx - r)} ${n(cy)}a${r} ${n(r * 0.8)} 0 0 0 ${2 * r} 0Z`, fill: c.paper, ...line() }),
      el('ellipse', { cx, cy, rx: r, ry: r * 0.28, fill, ...line() }),
    ].join(''),
    /** Order docket with zig-zag tear-off bottom and text lines. */
    ticket: (x, y, w, h, accent = c.violet, lines = 3) => {
      const teeth = Math.max(4, Math.round(w / 8)); const tw = w / teeth;
      let zz = ''; for (let i = 0; i < teeth; i++) zz += `L${n(x + w - tw * (i + 0.5))} ${n(y + h + 4)}L${n(x + w - tw * (i + 1))} ${n(y + h)}`;
      return [
        el('path', { d: `M${n(x + 4)} ${y}H${n(x + w - 4)}A4 4 0 0 1 ${n(x + w)} ${n(y + 4)}V${n(y + h)}${zz}V${n(y + 4)}A4 4 0 0 1 ${n(x + 4)} ${y}Z`, fill: c.paper, ...line() }),
        el('rect', { x: x + 8, y: y + 8, width: w * 0.45, height: 5, rx: 2.5, fill: accent }),
        ...Array.from({ length: lines }, (_, i) => el('line', { x1: x + 8, y1: y + 22 + i * 9, x2: x + w - 8 - (i % 2) * w * 0.25, y2: y + 22 + i * 9, ...line({ stroke: c.muted, 'stroke-width': 1.5 }) })),
      ].join('');
    },
    /** Phone in portrait. Returns frame; caller fills screen at (x+6, y+14, w-12, h-26). */
    phone: (x, y, w, h, screen = c.cloud) => [
      el('rect', { x, y, width: w, height: h, rx: 12, fill: c.paper, ...line() }),
      el('rect', { x: x + 6, y: y + 12, width: w - 12, height: h - 22, rx: 6, fill: screen, ...line({ 'stroke-width': 1.5 }) }),
      el('line', { x1: x + w / 2 - 6, y1: y + 6.5, x2: x + w / 2 + 6, y2: y + 6.5, ...line({ 'stroke-width': 1.75 }) }),
    ].join(''),
    /** Map pin. */
    pin: (cx, cy, r, fill = c.coral) => [
      el('path', { d: `M${cx} ${n(cy + r * 1.6)}C${n(cx - r * 0.5)} ${n(cy + r)} ${n(cx - r)} ${n(cy + r * 0.55)} ${n(cx - r)} ${cy}a${r} ${r} 0 0 1 ${2 * r} 0c0 ${n(r * 0.55)} ${n(-r * 0.5)} ${n(r)} ${-r} ${n(r * 1.6)}Z`, fill, ...line() }),
      el('circle', { cx, cy, r: r * 0.38, fill: c.paper, ...line({ 'stroke-width': 1.5 }) }),
    ].join(''),
    /** Lucide-style chevrons / arrows in muted stroke. */
    arrow: (x1, y1, x2, y2) => {
      const a = Math.atan2(y2 - y1, x2 - x1); const s = 5;
      return [
        el('line', { x1, y1, x2, y2, ...line({ stroke: c.muted, 'stroke-width': 1.75, 'stroke-dasharray': '1 5' }) }),
        el('path', { d: `M${n(x2 - s * Math.cos(a - 0.6))} ${n(y2 - s * Math.sin(a - 0.6))}L${x2} ${y2}L${n(x2 - s * Math.cos(a + 0.6))} ${n(y2 - s * Math.sin(a + 0.6))}`, fill: 'none', ...line({ stroke: c.muted, 'stroke-width': 1.75 }) }),
      ].join('');
    },
  };
  return k;
}

/** Wrap content in a standard illustration document. */
export function doc(title, desc, body, { w = W, h = H } = {}) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="${id}-t ${id}-d" fill="none">` +
    `<title id="${id}-t">${title}</title><desc id="${id}-d">${desc}</desc>${body}</svg>\n`;
}
