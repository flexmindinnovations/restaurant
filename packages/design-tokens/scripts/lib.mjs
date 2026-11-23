// DOSA token engine: loading, merging, reference resolution and colour maths.
// Zero dependencies. Node >= 22.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SRC = join(PKG_ROOT, 'src');
export const THEMES = ['admin-light', 'admin-monitor', 'staff-light', 'staff-kitchen', 'customer-warm'];
export const DEFAULT_THEME = 'admin-light';

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export function deepMerge(a, b) {
  if (!isObj(a) || !isObj(b)) return structuredClone(b);
  const out = structuredClone(a);
  for (const [k, v] of Object.entries(b)) {
    // A token node ($value present) replaces wholesale so stale $extensions do not leak.
    if (isObj(v) && '$value' in v) out[k] = { ...(isObj(out[k]) && out[k].$type ? { $type: out[k].$type } : {}), ...structuredClone(v) };
    else out[k] = k in out ? deepMerge(out[k], v) : structuredClone(v);
  }
  return out;
}

export function loadPrimitives() {
  const dir = join(SRC, 'primitives');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .reduce((acc, f) => deepMerge(acc, readJson(join(dir, f))), {});
}

export function loadSemantic(themeName) {
  const theme = readJson(join(SRC, 'themes', `${themeName}.json`));
  const base = theme.$extends;
  if (base !== 'light' && base !== 'dark') throw new Error(`${themeName}: $extends must be "light" or "dark"`);
  let sem = readJson(join(SRC, 'semantic', 'light.json'));
  if (base === 'dark') sem = deepMerge(sem, readJson(join(SRC, 'semantic', 'dark.json')));
  const { $extends, $description, ...overrides } = theme;
  return { scheme: base, description: $description ?? '', tree: deepMerge(sem, overrides) };
}

/** Flatten a DTCG tree into Map<path, token>. Inherits $type from ancestors. */
export function flatten(tree, origin) {
  const out = new Map();
  const walk = (node, path, type) => {
    if (!isObj(node)) return;
    const t = node.$type ?? type;
    if ('$value' in node) {
      out.set(path.join('.'), { path, type: t, value: node.$value, ext: node.$extensions ?? {}, description: node.$description ?? '', origin });
      return;
    }
    for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) walk(v, [...path, k], t);
  };
  walk(tree, [], undefined);
  return out;
}

// ---------- colour ----------
export function parseHex(hex) {
  const h = hex.replace('#', '');
  if (!/^([0-9a-f]{6}|[0-9a-f]{8})$/i.test(h)) throw new Error(`Invalid colour ${hex}`);
  const n = (i) => parseInt(h.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
}
const hx = (n) => Math.round(n).toString(16).padStart(2, '0').toUpperCase();
export const toHex = (c) => `#${hx(c.r)}${hx(c.g)}${hx(c.b)}${c.a < 1 ? hx(c.a * 255) : ''}`;
export const toCssColor = (c) => (c.a >= 1 ? toHex(c) : `rgb(${c.r} ${c.g} ${c.b} / ${+c.a.toFixed(3)})`);
export const toArgbInt = (c) => `0x${hx(c.a * 255)}${hx(c.r)}${hx(c.g)}${hx(c.b)}`;

const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
export const luminance = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
export function composite(fg, bg) {
  const a = fg.a;
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
}
export function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// ---------- resolution ----------
const REF = /^\{([^}]+)\}$/;

/** Resolve every token of a flattened map into typed, reference-free values. */
export function resolveAll(flat) {
  const cache = new Map();
  const resolving = new Set();

  const resolveValue = (v, ctx) => {
    if (typeof v === 'string') {
      const m = v.match(REF);
      if (m) return resolveToken(m[1], ctx).value;
      return v;
    }
    if (Array.isArray(v)) return v.map((x) => resolveValue(x, ctx));
    if (isObj(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolveValue(x, ctx)]));
    return v;
  };

  const resolveToken = (name, ctx) => {
    if (cache.has(name)) return cache.get(name);
    const tok = flat.get(name);
    if (!tok) throw new Error(`Unknown reference {${name}} (from ${ctx})`);
    if (resolving.has(name)) throw new Error(`Circular reference at ${name}`);
    resolving.add(name);
    let value = resolveValue(tok.value, name);
    if (tok.type === 'color') {
      value = typeof value === 'string' ? parseHex(value) : { ...value };
      const alpha = tok.ext['dosa.alpha'];
      if (alpha !== undefined) value = { ...value, a: alpha };
    }
    const directRef = typeof tok.value === 'string' && REF.test(tok.value) && tok.ext['dosa.alpha'] === undefined
      ? tok.value.match(REF)[1] : null;
    const res = { ...tok, value, directRef };
    resolving.delete(name);
    cache.set(name, res);
    return res;
  };

  for (const name of flat.keys()) resolveToken(name, 'root');
  return cache;
}

/** Build every theme: returns { primitives: Map, themes: {name: {scheme, description, tokens: Map}} } */
export function buildModel() {
  const primTree = loadPrimitives();
  const primFlat = flatten(primTree, 'primitive');
  const primitives = resolveAll(primFlat);
  const themes = {};
  for (const name of THEMES) {
    const { scheme, description, tree } = loadSemantic(name);
    const semFlat = flatten(tree, 'semantic');
    for (const k of semFlat.keys()) if (primFlat.has(k)) throw new Error(`${name}: semantic token ${k} shadows a primitive`);
    const all = resolveAll(new Map([...primFlat, ...semFlat]));
    const tokens = new Map([...all].filter(([, t]) => t.origin === 'semantic'));
    themes[name] = { scheme, description, tokens };
  }
  // Every theme must expose exactly the same semantic keys.
  const ref = [...themes[DEFAULT_THEME].tokens.keys()].sort().join('|');
  for (const [n, t] of Object.entries(themes)) {
    if ([...t.tokens.keys()].sort().join('|') !== ref) throw new Error(`Theme ${n} does not expose the same semantic keys as ${DEFAULT_THEME}`);
  }
  return { primitives, themes };
}
