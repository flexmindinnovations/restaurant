# DOSA — Asset Guidelines

All brand assets live in `packages/brand-assets`. The complete, generated file list with sizes,
colour behaviour and usage is in [`packages/brand-assets/ASSET_INDEX.md`](../packages/brand-assets/ASSET_INDEX.md).

```
packages/brand-assets/
├── brand/            symbol, wordmark, lock-up (colour, reversed, mono)
├── icons/            favicon.svg, app/ (1024 masters for admin, staff, customer)
├── illustrations/    light/ and dark/ — 23 scenes each, 240×180
├── textures/         paper grain (PNG master, WebP delivery, SVG source)
├── fonts/            Inter + Plus Jakarta Sans variable TTF, web subsets, OFL licences
├── scripts/          generators and validator (the only way assets change)
├── asset-index.json  machine-readable index (consumed by docs and tooling)
└── ASSET_INDEX.md    human-readable index
```

## 1. Source of truth and workflow

SVGs are **generated** from code (`scripts/generate-svg.mjs`, `scripts/illustrations.mjs`,
`scripts/svg-kit.mjs`) so every asset shares the same primitives, stroke and palette. To change an
asset: edit the script → `node packages/brand-assets/scripts/generate-svg.mjs` →
`pnpm assets:validate` → commit script and output together. Never hand-edit an output SVG.

`pnpm assets:validate` fails on: malformed XML, missing `xmlns`/`viewBox`/accessible name,
embedded rasters or external references, scripts or event handlers, filters inside illustrations,
duplicate ids, **any colour that is not in the DOSA palette**, files over budget (illustrations
8 KB, brand 12 KB), index gaps, light/dark set mismatch, and font/texture copies in
`flutter-ui` drifting from the canonical files.

## 2. Logo

| Asset | Use | Minimum size |
|---|---|---|
| `brand/dosa-lockup.svg` | Primary: headers, login, splash, documents | 88px wide |
| `brand/dosa-lockup-reversed.svg` | Same, on Midnight Ink / dark / Technology gradient | 88px wide |
| `brand/dosa-symbol.svg` | Square contexts: avatars, nav rail, loading | 24px (spark legible); 16px allowed (spark merges) |
| `brand/dosa-symbol-reversed.svg` | Square, on dark | 24px |
| `brand/dosa-symbol-mono.svg`, `dosa-wordmark-mono.svg` | One-colour print, watermarks, recolouring via `currentColor` | 24px / 64px |
| `brand/dosa-wordmark*.svg` | Where the symbol already appears nearby | 64px wide |

**Construction (64-unit grid):** stem 11×44 (Midnight Ink, 4u outer corners); bowl = 22u outer /
11u inner semicircle (Saffron); spark = concave 4-point star r 5.6u centred in the counter (Royal
Violet). The wordmark is Plus Jakarta Sans ExtraBold (800) outlines with +4% tracking (OFL permits
logo use). In the lock-up the symbol's D is 1.3× the cap height, with a 10px gap at 48px height.

**Clear space:** ≥ the bowl's band width (¼ of symbol height) on every side.

**Don't:** recolour parts outside the provided variants, add shadows/glows/glass to the logo, place it
on photography without a Dark Glass or scrim backing, rotate, stretch, outline, or re-typeset the
wordmark in a live font.

## 3. App icons

| File | App | Treatment |
|---|---|---|
| `icons/app/admin-web.svg` | Web admin (PWA, large favicon) | Technology gradient, pearl stem, saffron bowl, violet-300 spark |
| `icons/app/staff-mobile.svg` | Staff | Midnight Ink, pearl stem, **mint** bowl (operations/live), violet-400 spark |
| `icons/app/customer-mobile.svg` | Customer | Hospitality gradient, ink stem, pearl bowl, violet spark |
| `icons/favicon.svg` | Browser tab | Symbol on a Pearl rounded square |

Masters are 1024×1024 with a 228px corner radius and a soft top-left light. The symbol sits inside
the central 66% so Android adaptive-icon masks (circle, squircle) never crop it. Platform PNG sets
(iOS `AppIcon.appiconset`, Android mipmaps/adaptive foreground) are produced from these masters at
app-build time — see [PROJECT_SETUP.md](PROJECT_SETUP.md#app-icons).

## 4. Interface icons

Use the **Lucide** family for all standard UI icons (MIT/ISC licence, consistent 24-grid geometry).
Web: `lucide-angular` or `lucide-static`. Flutter: `lucide_icons_flutter`. Do not mix in Material
Symbols, Font Awesome or one-off downloads.

| Size token | px | Stroke (`size.icon-stroke.*`) | Where |
|---|---:|---:|---|
| `size.icon.xs` | 12 | 2 (bold) | inline status, badges |
| `size.icon.sm` | 16 | 1.75 | dense tables, inputs |
| `size.icon.md` | 20 | 1.75 | web buttons and menus (default web) |
| `size.icon.lg` | 24 | 1.75 | mobile, navigation (default mobile) |
| `size.icon.xl` | 32 | 1.5 | feature tiles |
| `size.icon.2xl` | 48 | 1.5 | empty-state spot icons |

Rules: icons inherit `currentColor`; interactive icon colour is `color.icon.primary` /
`secondary`; active navigation icons use the `bold` stroke, never a filled variant. Icon-only buttons
need an accessible label and a 44px (staff: 48px) hit target. When a needed icon does not exist in
Lucide, draw it on Lucide's 24px grid with round caps/joins and 2px stroke, and add it to
`packages/brand-assets/icons/ui/` with the same validation.

## 5. Textures

See [DESIGN.md §6.2](../DESIGN.md#62-paper-grain). Use `paper-grain-256.webp` on web canvases with the
`.dosa-grain` layer; Flutter uses the pre-tinted `-ink`/`-pearl` tiles through `DosaGrain`.

## 6. Using SVGs per platform

- **Angular:** reference from `assets/` with `<img>` (static) or inline via `HttpClient` + sanitizer
  only when `currentColor` recolouring is needed. Always pass `alt` (or `alt=""` for decorative).
- **Flutter:** `flutter_svg` (`SvgPicture.asset`). The illustration SVGs use only presentation
  attributes (no `<style>`, no CSS variables, no filters), which `flutter_svg` renders fully.
  Choose `light/` or `dark/` from `DosaTheme.of(context).isDark`.
- **Email / PDF:** use the PNG exports generated at build time, never inline SVG.
