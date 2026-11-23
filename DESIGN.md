# DOSA — Design (master source of truth)

Version 0.1 · 2026-11-23 · Applies to: web admin (Angular + Angular Material), staff mobile
(Flutter), customer mobile (Flutter).

This file is the single place a designer, developer or AI coding tool should read before producing
any DOSA interface. It states every rule and the real values. The detailed companion documents in
[`docs/`](docs/) expand each section; where they go deeper, they never contradict this file.

> **Machine-readable truth.** The values in this document are copied from the generated token
> outputs (`packages/design-tokens/dist/json/*.json`). If this file and the tokens ever disagree,
> **the tokens win** and this file has a bug. Full generated table:
> [`docs/reference/TOKEN_REFERENCE.md`](docs/reference/TOKEN_REFERENCE.md).

---

## 0. Ten rules to read before you write any UI

1. **Use tokens, never raw values.** No hex colour, pixel size, font size, duration or easing is
   typed in application code. Web: `var(--dosa-…)`; Flutter: `DosaTheme.of(context)` and the
   `Dosa*` constant classes. (The app lint fails on raw `#RRGGBB` in app source.)
2. **Use semantic tokens, not primitives.** Write `color.surface.primary`, not `color.ink.50` or
   `#FFFFFF`. Primitives exist so semantics can reference them.
3. **One brand, five themes.** Every theme exposes the same keys. Pick the theme for the context
   (§10); never fork a component per theme.
4. **Filled primary buttons are `violet.650 #6857D5`, not Royal Violet.** Royal Violet with white
   text is 4.43:1, below AA. Royal Violet is for focus rings, selection, icons, charts, gradients.
5. **Saffron, Coral and Mint fills take Midnight Ink text, never white.** Coloured *text* uses the
   700-step token (`color.status.*.fg`).
6. **Numbers that change or compare use tabular figures.** Use the `numeric.*` styles.
7. **Plus Jakarta Sans only at ≥ 17px** (display, h1–h4). Everything else, including all data,
   forms, tables and badges, is Inter.
8. **Glass is for floating chrome only** (bars, rails, hero panels, overlays on media). Data
   (tables, lists, forms, metric grids, toasts, dialog bodies) sits on solid surfaces.
9. **Motion explains change, never decorates.** ≤ 180ms for input feedback, nothing blocks input,
   `prefers-reduced-motion` collapses motion to instant state changes.
10. **Status is never colour alone.** Pair every status colour with an icon and a text label.

---

## 1. Brand essence

DOSA is an intelligent restaurant management and customer experience platform. Brand idea:
**"Warm intelligence"** — hospitality that is human and warm, operations that are precise and
calm. The interface should feel like a composed maître d': attentive, quietly premium, never loud.

| Pillar | In the interface |
|---|---|
| Clarity first | High contrast, generous spacing, legible type for heat-lamp kitchens and quick glances. |
| Hospitality warmth | Pearl canvases, Saffron and Coral accents, rounded geometry, food illustration. |
| Quiet intelligence | Royal Violet and the Intelligence gradient mark where DOSA "thinks": insights, forecasts, automation. |
| Depth with restraint | Frosted glass, 2–4% paper grain and soft ambient light, only on floating surfaces. |

Voice: plain, warm, specific. "Order #1042 is ready for table 6", not "Status updated
successfully!". Sentence case everywhere. No exclamation marks on operational screens.
Details: [docs/BRAND_GUIDELINES.md](docs/BRAND_GUIDELINES.md).

---

## 2. Colour

### 2.1 Brand colours (exact, non-negotiable)

| Name | Hex | Token | Role |
|---|---|---|---|
| Midnight Ink | `#202039` | `color.brand.midnight-ink` (= `ink.900`) | Primary text, dark surfaces, the wordmark |
| Royal Violet | `#7564E8` | `color.brand.royal-violet` (= `violet.600`) | Signature accent: focus, selection, intelligence |
| Saffron | `#E9A23B` | `color.brand.saffron` (= `saffron.400`) | Hospitality highlight, warmth, warnings |
| Warm Coral | `#E97861` | `color.brand.warm-coral` (= `coral.500`) | Appetite, urgency, critical (dark themes) |
| Mint | `#35B99A` | `color.brand.mint` (= `mint.400`) | Freshness, success, live |
| Pearl | `#F7F5F0` | `color.brand.pearl` | Warm canvas for light themes |
| Cloud | `#ECEBF1` | `color.brand.cloud` | Cool secondary surface, dividers |
| Slate | `#66677A` | `color.brand.slate` | Secondary text, icons, metadata |

Proportion on a typical light screen: ~70% Pearl/white/Cloud, ~20% Midnight Ink and Slate type,
~8% Royal Violet, ~2% Saffron/Coral/Mint status accents.

Extended ramps (OKLCH-generated, frozen in `packages/design-tokens/src/primitives/color.json`):
violet, saffron, coral, mint, rose, sky at 50–950 (plus 650), ink at 50–975 (plus 850). Each brand
hex sits exactly inside its ramp. Key derived steps: `violet.650 #6857D5`, `violet.700 #5C4AC3`,
`mint.700 #006C54`, `coral.700 #A14230`, `saffron.700 #8B5200`, `sky.650 #1D60A3`,
`ink.950 #14132A`, `ink.975 #0D0D20`.

### 2.2 Semantic colour (admin-light values; dark = admin-monitor)

| Token | Light | Dark | Use |
|---|---|---|---|
| `color.background.canvas` | `#F7F5F0` | `#0D0D20` | Page background |
| `color.background.subtle` | `#ECEBF1` | `#0D0D20` | Bands, sidebars on solid layouts |
| `color.surface.primary` | `#FFFFFF` | `#14132A` | Cards, tables, sheets |
| `color.surface.secondary` | `#ECEBF1` | `#202039` | Nested panels, toolbars |
| `color.surface.elevated` | `#FFFFFF` | `#2B2B45` | Menus, popovers, dialogs |
| `color.surface.sunken` | `#EBEBF3` | `#0D0D20` | Wells, input backgrounds when filled |
| `color.surface.brand` | `#F3F4FF` | violet.900 @ 50% | Intelligence / promo panels |
| `color.surface.scrim` | ink.950 @ 48% | black @ 64% | Modal scrim |
| `color.text.primary` | `#202039` | `#F6F6FD` | Body and headings |
| `color.text.secondary` | `#66677A` | `#BEBFCC` | Supporting text |
| `color.text.tertiary` | `#86879B` | `#A2A3B4` | Metadata, placeholders (large/short only) |
| `color.text.disabled` | `#A2A3B4` | `#696A80` | Disabled labels |
| `color.text.link` / `.brand` | `#5C4AC3` | `#BFBEFF` | Links, brand-coloured text |
| `color.text.on-primary` | `#FFFFFF` | `#FFFFFF` | On filled primary |
| `color.border.subtle` | ink.200 @ 70% | white @ 8% | Card edges, dividers |
| `color.border.default` | `#BEBFCC` | white @ 16% | Inputs, outlined buttons |
| `color.border.strong` | `#86879B` | `#86879B` | Emphasis, hover on inputs |
| `color.border.brand` | `#7564E8` | `#A6A2FF` | Selected, active indicators |
| `color.focus.ring` | `#7564E8` | `#BFBEFF` | 2px focus ring (≥ 3:1) |
| `color.focus.ring-halo` | violet @ 24% | violet.400 @ 30% | 4px halo on glass |

**Actions** (`color.action.<kind>.{bg, bg-hover, bg-active, fg}`):

| Kind | bg / hover / active | fg | Use |
|---|---|---|---|
| `primary` | `#6857D5` / `#5C4AC3` / `#4530A0` (all themes) | `#FFFFFF` | One main action per view |
| `secondary` | `#E9E9FF` / `#D6D6FF` / `#BFBEFF` (dark: violet.500 @ 18/26/34%) | `#4530A0` (dark `#D6D6FF`) | Tonal secondary action |
| `tertiary` | transparent + state layers | `color.text.brand` | Text buttons |
| `neutral` | surface + `border.default` | `color.text.primary` | Outlined / cancel |
| `destructive` | `#A14230` / `#802918` / `#600E00` | `#FFFFFF` | Delete, void, refund |
| `highlight` | `#E9A23B` / `#C9871E` / `#A96B00` | `#202039` | Customer "Add to order", promos |

**Status** (`color.status.<kind>.{fg, bg, border, solid, on-solid}`):

| Kind | fg (light / dark) | bg (light) | solid (light / dark) |
|---|---|---|---|
| success | `#006C54` / `#77D2B8` | `#E4FEF5` | `#00785F` / `#35B99A` |
| warning | `#8B5200` / `#F7BD73` | `#FFF4DD` | `#E9A23B` / `#E9A23B` |
| error | `#A14230` / `#FFB4A3` | `#FFEFE9` | `#A14230` / `#E97861` |
| info | `#1D60A3` / `#93C0F3` | `#E9F9FF` | `#1D60A3` / `#68A2E3` |
| neutral | Slate family | Cloud | ink.600 |

Plus `color.live` (Mint dot) and `color.critical` (Coral, used for CCTV and kitchen alarms).

**Order lifecycle** (`color.order.*`, same hue family in every theme, always with icon + label):

| State | Light | Dark | Icon (Lucide) |
|---|---|---|---|
| received | `#276BB1` | `#68A2E3` | `inbox` |
| accepted | `#6857D5` | `#A6A2FF` | `circle-check` |
| preparing | `#A96B00` | `#E9A23B` | `chef-hat` |
| ready | `#00785F` | `#35B99A` | `bell-ring` |
| served | `#696A80` | `#A2A3B4` | `utensils` |
| cancelled | `#A14230` | `#F89682` | `circle-x` |
| delayed (modifier) | `#C45C47` | `#E97861` | `timer` |

**State layers:** hover `ink @ 5%` (dark `white @ 6%`), press `ink @ 10%` (dark `white @ 12%`),
selected `#F3F4FF` (dark violet.500 @ 16%), disabled bg `#EBEBF3`, disabled fg `#A2A3B4`.

**Charts:** categorical 1–8 = Violet `#7564E8`, Saffron `#E9A23B`, Mint `#159F82`, Coral
`#E97861`, Sky `#3C83CE`, Rose `#E9789B`, Ink `#4F5068`, Lavender `#BFBEFF` (lighter steps on
dark). Sequential = violet 100→800. Diverging = coral `#C45C47` / neutral `#D7D8E2` / mint
`#00846A`. Grid lines `color.chart.grid`, axis text `color.chart.axis`.

### 2.3 Contrast guarantees

`pnpm tokens:check` measures 41 text/UI pairs in each of the 5 themes (205 checks) against
WCAG 2.2 and fails the build on regression: text ≥ 4.5:1, large text and UI ≥ 3:1. Notable
measured values: `#6857D5` + white 5.37:1; Saffron + Midnight Ink 7.31:1; success text `#006C54`
on white 6.42:1; Royal Violet focus ring on Pearl 4.06:1; Slate on Cloud 4.68:1.

---

## 3. Typography

| Role | Family | Files |
|---|---|---|
| Display & headings (≥ 17px) | **Plus Jakarta Sans** variable, wght 200–800 | `packages/brand-assets/fonts/plus-jakarta-sans/` |
| Body, UI, data | **Inter** variable, wght 100–900, opsz 14–32 | `packages/brand-assets/fonts/inter/` |

Both SIL OFL 1.1, self-hosted (no Google CDN); provenance in `fonts/SOURCE.md`.

| Token | Family | Wt | Size/Line | Tracking | Use |
|---|---|---:|---|---:|---|
| `display.xl` | Jakarta | 800 | 56/64 | −2.5% | Web hero only |
| `display.lg` | Jakarta | 700 | 44/52 | −2.2% | Web onboarding |
| `display.md` | Jakarta | 700 | 36/44 | −2.0% | Largest size on mobile |
| `heading.h1` | Jakarta | 700 | 30/36 | −1.8% | Page title |
| `heading.h2` | Jakarta | 700 | 24/32 | −1.4% | Section title |
| `heading.h3` | Jakarta | 600 | 20/28 | −1.0% | Card / panel title |
| `heading.h4` | Jakarta | 600 | 17/24 | −0.6% | Sub-section, mobile dialog title |
| `heading.h5` | Inter | 600 | 15/20 | −0.3% | Dense group header |
| `body.lg` | Inter | 400 | 16/24 | −0.6% | Mobile body |
| `body.md` | Inter | 400 | 14/20 | −0.4% | Admin body |
| `body.sm` | Inter | 400 | 13/18 | 0 | Dense tables, helper text |
| `label.lg` / `md` / `sm` | Inter | 600/600/500 | 15/20 · 14/20 · 12/16 | ≈0 | Buttons, tabs, chips |
| `meta.caption` | Inter | 400 | 12/16 | +0.4% | Timestamps |
| `meta.overline` | Inter | 600 | 11/16 | +8% | UPPERCASE eyebrow |
| `numeric.hero` | Inter tnum | 600 | 36/40 | −3% | KPI hero |
| `numeric.lg` | Inter tnum | 600 | 24/32 | −2% | Metric cards, totals |
| `numeric.md` | Inter tnum | 500 | 14/20 | 0 | Prices, quantities |
| `numeric.sm` | Inter tnum | 500 | 12/16 | +0.4% | Inline counts, axes |
| `numeric.timer` | Inter tnum | 700 | 28/32 | −2% | Kitchen timers |

Rules: tabular figures (`'tnum' 1` / `FontFeature.tabularFigures()`) on every changing number;
order codes and table IDs add slashed zero and disambiguated forms
(`font.feature.disambiguate`, CSS class `.dosa-code-id`); minimum UI text 12px (overline 11px);
customer body 16px; no italics, faux bold, condensed type or all-caps beyond overlines; respect
OS text scale (layouts tolerate 1.3×). Web classes: `.dosa-display-*`, `.dosa-h1`…`.dosa-h5`,
`.dosa-body-*`, `.dosa-label-*`, `.dosa-numeric-*`. Flutter: `DosaTypeScale.*` (already carries
`fontVariations` for the variable fonts) and the `TextTheme` from `buildDosaTheme`.

---

## 4. Layout and shape

**Spacing (4px base):** `space.0` 0 · `0-5` 2 · `1` 4 · `2` 8 · `3` 12 · `4` 16 · `5` 20 ·
`6` 24 · `8` 32 · `10` 40 · `12` 48 · `16` 64 · `20` 80 · `24` 96. Component inner padding uses
8–24; section rhythm 32–64. Never use odd values.

**Radius:** `radius.xs` 4 (tags, inline) · **`sm` 8 (controls, buttons, inputs)** ·
**`md` 12 (cards, menus)** · **`lg` 18 (feature panels, sheets, standard glass)** ·
**`xl` 24 (hero panels, premium glass, mobile bottom sheets)** · `full` (chips, avatars, FAB).
Nested radius = outer radius − padding (min 4).

**Breakpoints and grid:**

| Token | Min width | Columns | Gutter | Margin | Typical |
|---|---:|---:|---:|---:|---|
| `xs` | 0 | 4 | 16 | 16 | Phones |
| `sm` | 600 | 8 | 16 | 24 | Large phones, small tablets |
| `md` | 905 | 12 | 24 | 32 | Tablet landscape |
| `lg` | 1240 | 12 | 24 | 32 | Laptop, admin sidebar expanded |
| `xl` | 1440 | 12 | 32 | 40 | Desktop |
| `2xl` | 1920 | 12 | 32 | 40 | Monitoring walls |

Admin content max width `grid.max-content` 1600px. **Sizes:** controls 32/40/48/56; touch target
min 44 (staff 48); icons 12/16/20/24/32/48 with stroke 2/1.75/1.5. **Z-index:** base 0, raised 10,
sticky 100, nav 200, dropdown 1000, drawer 1100, modal 1200, popover 1300, toast 1400, tooltip 1500.

---

## 5. Elevation

Two-layer shadows (key + ambient). Light themes tint with Midnight Ink, dark themes use black and
rely more on lighter surfaces and borders.

| Token | Light value | Use |
|---|---|---|
| `shadow.0` | none | Flat, in-grid cards |
| `shadow.1` | `0 1px 2px ink/8%, 0 1px 3px ink/5%` | Cards at rest, subtle glass |
| `shadow.2` | `0 2px 6px -1px ink/8%, 0 6px 16px -4px ink/5%` | Hover cards, standard glass, menus |
| `shadow.3` | `0 4px 10px -2px ink/8%, 0 16px 32px -8px ink.950/14%` | Dialogs, premium & dark glass |
| `shadow.4` | `0 8px 16px -4px ink/8%, 0 28px 56px -12px ink.950/14%` | Drag, top-most floating |
| `shadow.brand` | `0 10px 28px -8px violet/22%` | Primary FAB, intelligence hero |

Dark themes: same geometry, `black/32%` key and `black/20–48%` ambient; elevation additionally
steps surfaces `ink.975 → ink.950 → ink.900 → ink.850`.

---

## 6. Surfaces: glass, grain, gradients, light

### 6.1 Glass (four variants, each with a fallback)

Recipe = translucent tint + `backdrop-filter: blur() saturate()` + 1px light edge + 1px inner top
highlight + shadow. **Fallback** (no backdrop-filter support, `prefers-reduced-transparency`,
`data-dosa-glass="off"`, or `DosaGlassScope(enabled: false)`) = near-opaque solid tint with the
same border and shadow, so the layout and contrast are identical.

| Variant | Tint (light) | Tint (dark themes) | Blur | Saturate | Radius | Shadow | Use |
|---|---|---|---:|---:|---:|---|---|
| **Subtle** | white @ 56% | ink.900 @ 50% | 12px | 1.4 | 12 | `shadow.1` | Top bars, sidebars, nav rails, mobile bottom nav |
| **Standard** | white @ 66% | ink.900 @ 58% | 20px | 1.6 | 18 | `shadow.2` | Floating toolbars, filter bars, popovers on media |
| **Premium** | Pearl @ 60% + 160° white sheen (soft-light, 42%→0) | ink.850 @ 52% | 32px | 1.8 | 24 | `shadow.3` | Hero, intelligence modules, onboarding |
| **Dark** | ink.900 @ 62% | ink.975 @ 66% | 24px | 1.3 | 18 | `shadow.3` | CCTV overlays, camera controls, overlays on photos (any theme) |

Edges: light `white @ 62%` border, `white @ 80%` top highlight; dark `white @ 10%` border,
`white @ 8%` highlight. Fallback fills: light `white @ 94%`, dark `ink.900 @ 96%`.

Rules: glass needs something behind it (mesh, imagery, video) or it reads as grey; text on glass
uses `text.primary` (light) or Pearl (dark) and must keep ≥ 4.5:1 against the fallback; maximum
two stacked glass layers; never animate `backdrop-filter`; on low-end Android disable blur with
`DosaGlassScope(enabled: false)` before removing anything else.

Web: `<div class="dosa-glass dosa-glass--premium">`. Flutter:
`DosaGlass(variant: DosaGlassVariant.premium, child: …)`.

### 6.2 Paper grain

A separate, non-interactive texture layer behind content giving a tactile, premium paper feel.

| | Light themes | Dark themes |
|---|---|---|
| Opacity (`grain.opacity`) | **3.5%** | **4%** |
| Blend (`grain.blend`) | `multiply` | `soft-light` |

Asset: seamless 256×256 tile, `packages/brand-assets/textures/paper-grain-256.webp` (PNG master;
pre-tinted `-ink` / `-pearl` tiles for Flutter, which lacks CSS blend modes on images). Apply on
page canvases and large panels only (`.dosa-grain`, `.dosa-grain--fixed`, Flutter `DosaGrain`);
never on text, inputs, tables or small components; never above 4%; it must not be noticeable
unless you look for it. An SVG `feTurbulence` source exists for print and design tools.

### 6.3 Gradients

| Name | Stops | Angle | Use |
|---|---|---:|---|
| **Intelligence** | `#7564E8` → `#A18AEF` (50%) → `#E9789B` | 135° | AI insights, forecasts, premium highlights, display-size gradient text |
| **Hospitality** | `#E9A23B` → `#E97861` | 135° | Customer promos, hospitality moments, customer app icon |
| **Technology** | `#202039` → `#373C68` (55%) → `#7564E8` | 145° | Admin hero headers, admin app icon, dark marketing panels |
| **Success** | `#35B99A` → `#65C9A4` | 135° | Completion moments, payment success, positive KPIs (accent only) |

Rules: one gradient per view; never behind body text or tables; gradient text only at ≥ 36px on
light canvases; white text on Technology only; Midnight Ink text on Hospitality and Success.
Web: `var(--dosa-gradient-intelligence)` / `.dosa-gradient-*`; Flutter: `t.gradientIntelligence`
(a `LinearGradient`).

### 6.4 Ambient light (mesh)

`.dosa-mesh` paints four soft radial blobs from the theme's `color.mesh.a–d` over the canvas
(light: lavender 42%, saffron-light 50%, rose-light 38%, mint-light 32%; dark: deep violet and
indigo with faint rose and mint). Static, never animated. `.dosa-mesh--quiet` (two blobs, half
strength) is the default on operational admin screens; full mesh for onboarding, login and
customer hero areas. Flutter: `DosaMeshBackground`.

---

## 7. Iconography

**Lucide** for every UI icon (`lucide-angular` / `lucide_icons_flutter`), 24px grid, round caps
and joins. Sizes: 12 (stroke 2) inline status, 16 (1.75) dense tables, **20 (1.75) default web**,
**24 (1.75) default mobile**, 32 (1.5) feature tiles, 48 (1.5) empty-state spots. Icons inherit
`currentColor`; active navigation uses the 2px stroke, never a filled variant; icon-only buttons
need an accessible label and 44px (staff 48px) hit target. Missing icons are drawn on Lucide's
grid and added to `packages/brand-assets/icons/ui/`. Details:
[docs/ASSET_GUIDELINES.md](docs/ASSET_GUIDELINES.md).

## 8. Logo and illustration

**Logo "the fold":** a geometric D. Its Midnight Ink stem and Saffron crescent bowl read as a
folded dosa and a plate rim; a single Royal Violet four-point spark (intelligence) sits in the
counter. Variants: colour (ink + saffron + violet spark), reversed (Pearl + saffron + violet.400
spark) and mono (`currentColor`), for the symbol, the wordmark (outlined from Plus Jakarta Sans
ExtraBold) and the horizontal lock-up. Clear space = spark height (≈ 0.25 × symbol height).
Minimum: lock-up 88px wide; symbol 24px, and the dedicated favicon below that (the spark merges
into the D at smaller sizes). Never rotate, add glows, stretch, outline, or recolour the spark.
App icons: admin = Technology gradient, staff = Midnight Ink with a Mint bowl, customer =
Hospitality gradient.

**Illustration style:** flat shapes with a single 2px Midnight Ink outline (round caps and joins),
soft brand tints from a fixed role palette, a calm halo blob behind, a soft ground shadow below,
light from the top-left, and **exactly one Royal Violet spark** per scene. No gradients, filters,
blur or rasters inside illustrations; no people in this phase; ≤ 8 KB per file. Artboard 240×180
(4:3), light and dark sets, 23 scenes: 11 feature scenes (restaurant, kitchen workflow, food
preparation, dining table, order processing, online ordering, payment checkout, delivery/pickup,
analytics, inventory, reservations), 6 empty states (orders, reservations, search, notifications,
menu, offline), 3 success and 3 error/warning/not-found scenes. One per view, never in table rows,
never below 96px, always paired with a text message; decorative instances are hidden from
assistive tech. Index: [`packages/brand-assets/ASSET_INDEX.md`](packages/brand-assets/ASSET_INDEX.md).
Details: [docs/ILLUSTRATION_GUIDELINES.md](docs/ILLUSTRATION_GUIDELINES.md).

---

## 9. Motion

| Duration token | ms | Use |
|---|---:|---|
| `instant` | 80 | Checkbox tick, ripple start |
| `fast` | 120 | Press, exit of small elements |
| `quick` | 160 | Hover, icon swap |
| `moderate` | 200 | Tabs, dropdowns, navigation, tooltips |
| `base` | 240 | Dialogs/drawers entering, page transitions |
| `slow` | 280 | Bottom sheets, large surfaces |
| `deliberate` | 400 | Order status emphasis |
| `chart` | 600 | Chart first draw (once) |
| `ambient` | 1200 | Skeleton shimmer, live pulse |

Easing: `standard cubic-bezier(0.2,0,0,1)` (between states), `decelerate (0,0,0,1)` (enter),
`accelerate (0.3,0,1,1)` (exit at ~70% of enter time), `emphasized (0.05,0.7,0.1,1)` (status,
success, sheets), `linear` (progress, shimmer, rotation only).

Patterns: button press scale 0.98 / 120ms; card hover −2px + `shadow.2` / 160ms; menu fade + 4px
rise 200ms; dialog scrim 200ms + panel 0.96→1 240ms emphasized; bottom sheet 280ms; toast rise 8px 240ms,
auto-dismiss 5s (errors persist); order status change = highlight sweep 2×400ms + badge colour
cross-fade 200ms; metric update tick-in 200ms, never count-ups on operational screens; charts
draw once.

**Lottie library** (`packages/motion-assets/lottie/{light,dark}`, 2.5–12 KB each, 60fps, static
SVG fallbacks exported from the real render): `order-received`, `order-accepted`,
`food-preparation` (loop), `order-ready`, `payment-success`, `empty-orders` (idle loop),
`empty-reservations` (idle loop), `loading-processing` (loop), `sync-success`,
`restaurant-onboarding`. One Lottie per viewport region, never in list rows, never blocking.
Rive is intentionally not used yet (binary editor format; see ROADMAP).

**Reduced motion:** web `prefers-reduced-motion` → `dosa-motion.css` collapses to 1ms fades and
static live rings; Flutter `DosaMotion.reduced(context)` → `DosaAnimatedIllustration` shows the
SVG fallback and `DosaMotion.duration()` returns zero. Busy-button spinners remain (slowed).
Details: [docs/MOTION_GUIDELINES.md](docs/MOTION_GUIDELINES.md).

---

## 10. Themes

| Theme id | Context | Scheme | Character |
|---|---|---|---|
| `admin-light` | Web admin default | light | Pearl canvas, white surfaces, Ink type, Violet actions, Saffron highlights |
| `admin-monitor` | Admin CCTV / live monitoring | dark | `#0D0D20` canvas, charcoal panels, Mint live dots, Coral critical, dark glass HUDs |
| `staff-light` | Staff mobile default | light | Admin palette with darker secondary text (`ink.700`) and firmer borders |
| `staff-kitchen` | Staff kitchen / night mode | dark | `#14132A` canvas, reduced glare, brighter secondary text, saturated order statuses |
| `customer-warm` | Customer mobile | light | Pearl + Saffron-50 surfaces, warm mesh, Coral-tinted brand panels, Saffron CTA |

Switching: web `data-dosa-theme="…"` on any element (nestable, e.g. a monitoring panel inside
the light admin); Flutter `buildDosaTheme(DosaThemeTokens.staffLight)` /
`DosaThemeTokens.staffKitchen` with `themeMode`. What may vary: surface tones, border strength,
secondary text tone, glass tint, mesh, grain, shadow colour. What never varies: brand colour
roles, order-status hues, typography, spacing, radii, motion, iconography. Dark themes never use
pure black. Customer app ignores system dark mode in this phase.
Details: [docs/THEME_GUIDELINES.md](docs/THEME_GUIDELINES.md).

---

## 11. Components (summary)

Full specifications (anatomy, sizes, states, tokens, accessibility, motion, Angular and Flutter
mapping): [docs/COMPONENT_GUIDELINES.md](docs/COMPONENT_GUIDELINES.md).

| Component | Essentials |
|---|---|
| Primary / secondary / tertiary / destructive buttons | Radius 8; heights 32/40/48/56; one primary per view; loading keeps width |
| Icon button, FAB | Square, accessible label, 44/48 hit target; FAB 56 circle, `shadow.brand`, mobile only, one per screen |
| Text input, search | 40 (web) / 48 (mobile); label above, helper/error below; never glass |
| Dropdown, chips, checkbox, radio, switch | Selected = tonal violet + brand border; switch track 36×20 (web) / 52×32 (mobile) |
| Tabs, segmented control | Indicator 2px (tabs) or sliding pill (segmented), 200ms |
| Top bar, sidebar, drawer, bottom nav | Subtle glass over mesh; sidebar 264 expanded / 72 collapsed; bottom nav 72 + safe area |
| Card, glass panel, metric card, food card | Card radius 12 `shadow.1`; metric = overline + `numeric.lg` + delta chip, min 220×128; food card radius 18, 4:3 photo, Highlight "Add" |
| Tooltip, toast, dialog, bottom sheet | Tooltip and toast on `surface.inverse`; dialog 400/560/720, radius 18, `shadow.4`; sheet radius 18 top, max 90% height |
| Status badge, order status indicator | Badge 22/24 high pill; order state = icon + label + `color.order.*` as badge, stepper or kitchen ticket bar |
| Progress, skeleton, empty state | Skeleton shimmer 1.2s after a 300ms delay; empty state = illustration + h4 + one sentence + one action |
| Data table, charts | Solid surface, rows 48 (40 dense), tabular numerals, `aria-sort`; chart palette from tokens, draw once |

---

## 12. Implementation

**Packages**

| Package | Provides |
|---|---|
| `packages/design-tokens` | Canonical DTCG JSON (`src/`) → CSS, SCSS, TS, JSON, Dart, token reference |
| `packages/brand-assets` | Logo, app icons, 23×2 illustrations, grain, fonts, generators, validator |
| `packages/motion-assets` | 10×2 Lottie files, SVG fallbacks, `dosa-motion.css`, generator, render verifier |
| `packages/web-ui` | `dist/dosa.css`: tokens + fonts + base + type + surfaces + gradients + motion in `@layer`s |
| `packages/flutter-ui` (`dosa_ui`) | `DosaThemeTokens`, `buildDosaTheme`, `DosaGlass`, `DosaGrain`, `DosaMeshBackground`, `DosaMotion`, `DosaAnimatedIllustration`, `DosaOrderStatusBadge`, `DosaLogo`, bundled assets |
| `packages/documentation` | Static specimen site (foundations, illustrations, motion) |

**Web (Angular)**

```html
<html data-dosa-theme="admin-light">
<body class="dosa-mesh dosa-mesh--quiet dosa-grain dosa-grain--fixed">
  <header class="dosa-glass dosa-glass--subtle">…</header>
  <section class="dosa-surface dosa-elevation-1">
    <h2 class="dosa-h2">Today</h2>
    <p class="dosa-numeric-lg">₹ 48,920</p>
  </section>
</body>
```

```scss
@use '@dosa/design-tokens/scss' as dosa;   // SCSS variables mirror the CSS custom properties
.order-row { padding: var(--dosa-space-3) var(--dosa-space-4); border-radius: var(--dosa-radius-sm); }
```

Angular Material's `--mat-sys-*` system variables are mapped onto `--dosa-*` variables in
`apps/admin-web/src/styles/_material-dosa.scss`, so Material components inherit DOSA colour,
type, shape and elevation and re-theme at runtime with `data-dosa-theme`.

**Flutter**

```dart
MaterialApp(
  theme: buildDosaTheme(DosaThemeTokens.staffLight),
  darkTheme: buildDosaTheme(DosaThemeTokens.staffKitchen),
);

final t = DosaTheme.of(context);
DosaGlass(
  variant: DosaGlassVariant.subtle,
  child: Padding(
    padding: const EdgeInsets.all(DosaSpace.s4),
    child: Text('Table 6', style: DosaTypeScale.headingH4.copyWith(color: t.textPrimary)),
  ),
);
const DosaAnimatedIllustration(DosaAnimation.orderReady, semanticLabel: 'Order ready');
```

**Changing the system:** edit `packages/design-tokens/src/**` → `pnpm tokens:build` →
`pnpm validate`. Generated files carry a `DO NOT EDIT` header. Assets change only through their
generator scripts. See [docs/DESIGN_TOKENS.md](docs/DESIGN_TOKENS.md) and
[docs/PROJECT_SETUP.md](docs/PROJECT_SETUP.md).

---

## 13. Accessibility checklist

- Text ≥ 4.5:1, large text and UI ≥ 3:1 (token-validated; do not override colours).
- Visible 2px focus ring with 2px offset on every interactive element; logical tab order.
- Hit targets ≥ 24×24 pointer, 44 touch, 48 staff.
- Every control has an accessible name, role and state.
- Status never by colour alone; illustrations and Lottie paired with text.
- 200% zoom on web, 1.3× text scale on mobile without clipping.
- Honour reduced motion and reduced transparency.

## 14. Do and don't

| Do | Don't |
|---|---|
| Put data on solid `surface.primary` | Put tables, forms or toasts on glass |
| Use `#6857D5` for filled primary buttons | Put white text on Royal Violet, Saffron, Mint or Coral |
| Use one gradient per view, as an accent | Put gradients behind body text |
| Use Plus Jakarta Sans for headings ≥ 17px | Use Jakarta in tables, inputs or badges |
| Use tabular numerals for prices, totals, timers | Animate counting numbers on operational screens |
| Keep grain at 3.5–4% on canvases | Apply grain to text or small components |
| Pair status colour with icon and label | Rely on colour alone |
| Choose a theme by context | Hard-code dark colours in a component |

## 15. Document map

| Document | Covers |
|---|---|
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | How the system is organised, governed and consumed |
| [docs/BRAND_GUIDELINES.md](docs/BRAND_GUIDELINES.md) | Brand idea, voice, logo, colour, type, imagery |
| [docs/DESIGN_TOKENS.md](docs/DESIGN_TOKENS.md) | Token layers, naming, outputs, workflow |
| [docs/COMPONENT_GUIDELINES.md](docs/COMPONENT_GUIDELINES.md) | Component specifications |
| [docs/ASSET_GUIDELINES.md](docs/ASSET_GUIDELINES.md) | Logo, icons, textures, file usage per platform |
| [docs/ILLUSTRATION_GUIDELINES.md](docs/ILLUSTRATION_GUIDELINES.md) | Illustration style and scenes |
| [docs/MOTION_GUIDELINES.md](docs/MOTION_GUIDELINES.md) | Motion principles, tokens, Lottie rules |
| [docs/THEME_GUIDELINES.md](docs/THEME_GUIDELINES.md) | Five themes and when to use them |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Monorepo, decisions, dependency rules |
| [docs/PROJECT_SETUP.md](docs/PROJECT_SETUP.md) | Install, build, validate, run |
| [docs/ROADMAP.md](docs/ROADMAP.md) | What comes next and known gaps |
| [docs/reference/TOKEN_REFERENCE.md](docs/reference/TOKEN_REFERENCE.md) | Every token value in every theme (generated) |
