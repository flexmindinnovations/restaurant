// Minimal, dependency-free Bodymovin/Lottie (schema 5.x) builder used to author DOSA animations as
// code. Only features supported by lottie-web (svg renderer) and Flutter `lottie` are used:
// shape layers, groups, ellipse/rect/path, fill, stroke, trim paths, transform keyframes.

export const FPS = 60;
export const W = 240;
export const H = 180;

const hex = (h, a = 1) => {
  const n = h.replace('#', '');
  return [parseInt(n.slice(0, 2), 16) / 255, parseInt(n.slice(2, 4), 16) / 255, parseInt(n.slice(4, 6), 16) / 255, a];
};

/** Easing presets mirroring motion tokens (cubic-bezier control points). */
export const EASE = {
  standard: [0.2, 0, 0, 1],
  decelerate: [0, 0, 0, 1],
  accelerate: [0.3, 0, 1, 1],
  emphasized: [0.05, 0.7, 0.1, 1],
  linear: [0, 0, 1, 1],
  inOut: [0.45, 0, 0.55, 1],
};
export const ms = (v) => Math.round((v / 1000) * FPS);

const isArr = Array.isArray;
/** Animated property. kfs: [[frame, value, ease?], ...]; ease (bezier or 'hold') applies from that key to the next. */
export function anim(...kfs) {
  const dims = isArr(kfs[0][1]) ? kfs[0][1].length : 1;
  const k = kfs.map(([t, val, ease = EASE.standard], i) => {
    const s = isArr(val) ? val : [val];
    const key = { t, s };
    if (ease === 'hold') { if (i < kfs.length - 1) key.h = 1; return key; }
    if (i < kfs.length - 1) {
      const [x1, y1, x2, y2] = ease;
      key.o = { x: Array(dims).fill(x1), y: Array(dims).fill(y1) };
      key.i = { x: Array(dims).fill(x2), y: Array(dims).fill(y2) };
    }
    return key;
  });
  return { a: 1, k };
}
const P = (v) => (v && v.a !== undefined ? v : { a: 0, k: v });

export const shape = {
  ellipse: (w, h, at = [0, 0]) => ({ ty: 'el', d: 1, p: P(at), s: P(isArr(w) || w.a !== undefined ? w : [w, h]) }),
  rect: (w, h, r = 0, at = [0, 0]) => ({ ty: 'rc', d: 1, p: P(at), s: P([w, h]), r: P(r) }),
  /** Path from vertices [[x,y],...] with optional in/out tangents (relative). */
  path: (v, { closed = false, i, o } = {}) => ({
    ty: 'sh',
    ks: P({ c: closed, v, i: i ?? v.map(() => [0, 0]), o: o ?? v.map(() => [0, 0]) }),
  }),
  fill: (color, opacity = 100) => ({ ty: 'fl', c: P(hex(color)), o: P(opacity), r: 1 }),
  stroke: (color, width = 2, opacity = 100) => ({ ty: 'st', c: P(hex(color)), o: P(opacity), w: P(width), lc: 2, lj: 2, ml: 4 }),
  trim: (start = 0, end = 100, offset = 0) => ({ ty: 'tm', s: P(start), e: P(end), o: P(offset), m: 1 }),
  group: (items, tr = {}, nm = 'group') => ({ ty: 'gr', nm, it: [...items, transform(tr, 'tr')] }),
};

/** Concave 4-point DOSA spark path centred at 0,0 with radius r (quadratic curves → cubic tangents). */
export function sparkPath(r) {
  const w = r * 0.2;
  // Approximate each quadratic edge with tangents pointing at the waist control point.
  const pts = [[0, -r], [r, 0], [0, r], [-r, 0]];
  const ctrl = [[w, -w], [w, w], [-w, w], [-w, -w]];
  const i = []; const o = [];
  pts.forEach((p, idx) => {
    const next = pts[(idx + 1) % 4]; const c = ctrl[idx];
    o[idx] = [(2 / 3) * (c[0] - p[0]), (2 / 3) * (c[1] - p[1])];
    i[(idx + 1) % 4] = [(2 / 3) * (c[0] - next[0]), (2 / 3) * (c[1] - next[1])];
  });
  return shape.path(pts, { closed: true, i, o });
}

function transform(tr, ty) {
  const base = {
    a: P(tr.anchor ?? [0, 0]),
    p: P(tr.position ?? [0, 0]),
    s: P(tr.scale ?? [100, 100]),
    r: P(tr.rotation ?? 0),
    o: P(tr.opacity ?? 100),
  };
  if (ty === 'tr') return { ty: 'tr', ...base, sk: P(0), sa: P(0) };
  // Layer transforms carry 3-component vectors (z = 0 for anchor/position, 100 for scale).
  const pad = (prop, z) => {
    const fix = (v) => (v.length === 2 ? [...v, z] : v);
    if (prop.a === 1) return { a: 1, k: prop.k.map((kf) => ({ ...kf, s: fix(kf.s), ...(kf.o ? { o: { x: [...kf.o.x, kf.o.x[0]].slice(0, 3), y: [...kf.o.y, kf.o.y[0]].slice(0, 3) }, i: { x: [...kf.i.x, kf.i.x[0]].slice(0, 3), y: [...kf.i.y, kf.i.y[0]].slice(0, 3) } } : {}) })) };
    return { a: 0, k: fix(prop.k) };
  };
  return { a: pad(base.a, 0), p: pad(base.p, 0), s: pad(base.s, 100), r: base.r, o: base.o };
}

let layerIndex = 0;
/** Shape layer positioned at `position` (layer space origin = 0,0 of its shapes). */
export function layer(nm, shapes, tr = {}, { ip = 0, op } = {}) {
  layerIndex += 1;
  return { ddd: 0, ind: layerIndex, ty: 4, nm, sr: 1, ks: transform(tr, 'layer'), ao: 0, shapes, ip, op, st: 0, bm: 0 };
}

/** Compose a complete animation document. Layers listed top-most first (Lottie order). */
export function composition({ name, frames, layers, markers = [] }) {
  layerIndex = 0;
  return {
    v: '5.12.2', fr: FPS, ip: 0, op: frames, w: W, h: H, nm: name, ddd: 0, assets: [],
    layers: layers.map((l, i) => ({ ...l, ind: i + 1, op: l.op ?? frames })),
    markers,
    meta: { g: 'DOSA motion-assets generator', a: 'DOSA', d: name },
  };
}
