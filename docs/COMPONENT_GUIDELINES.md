# DOSA — Component Guidelines

Framework-neutral specifications. Angular (Material-based) and Flutter implement each component
separately against these specs and the shared tokens. Token names are canonical paths
(`color.action.primary.bg` = CSS `--dosa-color-action-primary-bg` = Dart `t.actionPrimaryBg`).

---

## 0. Shared rules (apply to every component)

### 0.1 State model
| State | Visual rule | Tokens |
|---|---|---|
| Rest | as specified per component | — |
| Hover (pointer only) | add state layer over the fill; never change size | `color.state.hover-overlay` (5% ink / 6% white) or the component's `*-hover` token, `motion.duration.quick` |
| Focus-visible | 2px ring, 2px offset, outside the border; never removed; also shown on glass with `color.focus.ring-halo` 4px outer halo | `color.focus.ring`, `focus.ring.width`, `focus.ring.offset` |
| Active / pressed | press layer + scale 0.98 (buttons, cards) | `color.state.press-overlay`, `motion.duration.fast` |
| Selected | tonal fill + brand border/indicator | `color.state.selected-bg`, `color.border.brand` |
| Disabled | dedicated colours (not opacity) for fills and text; no hover/press; `aria-disabled`/`enabled: false`; still focusable only when it explains why (tooltip) | `color.state.disabled-bg/-fg/-border` |
| Loading | keep width; replace label with spinner (16px) + optional "Saving…" text; block repeat activation; `aria-busy="true"` | `.dosa-spinner` / `CircularProgressIndicator(strokeWidth: 2)` |
| Error | border + helper text in error colour + icon; message says how to fix | `color.status.error.fg`, `color.status.error.border` |

### 0.2 Density & platform sizing
| | Web admin | Staff mobile | Customer mobile |
|---|---|---|---|
| Default control height | 40 (`size.control.md`) | 48 (`lg`); primary actions 56 (`xl`) | 48 (`lg`); checkout CTA 56 |
| Dense control height | 32 (`sm`) in tables/toolbars | — (never dense) | — |
| Min hit target | 24×24 pointer (WCAG 2.5.8), 44 on touch devices | 48 | 44 |
| Body text | `body.md` 14/20 | `body.lg` 16/24 | `body.lg` 16/24 |
| Icon size | 20 | 24 | 24 |

### 0.3 Accessibility baseline
- Text contrast ≥ 4.5:1, non-text UI ≥ 3:1 (validated for tokens; don't override colours).
- Every interactive element: keyboard reachable in visual order, visible focus, accessible name,
  role and state (`aria-pressed`, `aria-expanded`, `aria-selected`, `aria-invalid`, etc.).
- Never convey meaning by colour alone; pair status colour with icon and text.
- Support 200% zoom (web) and OS text scale to 1.3× minimum without clipping (mobile).
- Motion follows [MOTION_GUIDELINES.md](MOTION_GUIDELINES.md); reduced motion supported.

### 0.4 Where glass is allowed
Only: top bars, sidebars/nav rails (subtle), floating toolbars & filter bars (standard), hero /
intelligence modules (premium), overlays on video/photos and monitoring HUDs (dark), bottom
navigation on mobile (subtle), FAB backdrop on imagery. **Never** on tables, form fields, list
rows, dialogs' content area, toasts or metric cards in a grid.

---

## 1. Buttons

### 1.1 Shared button anatomy
| Property | Spec |
|---|---|
| Shape | radius `radius.sm` (8); pill (`radius.full`) only for chips and FAB |
| Height | sm 32 · md 40 · lg 48 · xl 56 |
| Padding (x) | sm 12 · md 16 · lg 20 · xl 24; icon-text gap 8 |
| Label | `label.md` (sm/md), `label.lg` (lg/xl); sentence case; max 3 words |
| Icon | 16 (sm), 20 (md), 24 (lg/xl); leading by default; trailing only for "next"/external |
| Min width | 64 (md); full-width on mobile for primary actions in forms and sheets |
| Motion | colour 160ms `standard`; press scale 0.98 120ms |

| Variant | Rest | Hover | Active | Text | Border | Use |
|---|---|---|---|---|---|---|
| **Primary** | `action.primary.bg` (violet.650) | `bg-hover` | `bg-active` | `action.primary.fg` | none | One per view region: the main commit action |
| **Secondary** (tonal) | `action.secondary.bg` | `bg-hover` | `bg-active` | `action.secondary.fg` | none | Supporting actions beside a primary |
| **Tertiary** (text) | transparent | `action.tertiary.bg-hover` | `bg-active` | `action.tertiary.fg` | none | Low-emphasis, inline, toolbars |
| **Neutral / outline** | `action.neutral.bg` | `bg-hover` | `bg-active` | `action.neutral.fg` | 1px `border.default` | Cancel, filters, secondary in dense UI |
| **Destructive** | `action.destructive.bg` | `bg-hover` | `bg-active` | `action.destructive.fg` | none | Irreversible actions; always confirm |
| **Highlight** (customer) | `action.highlight.bg` (Saffron) | `bg-hover` | `bg-active` | `action.highlight.fg` (ink) | none | "Add to order", checkout CTA in customer app only |

- **Focus:** shared ring. **Disabled:** `state.disabled-bg` / `disabled-fg`, no shadow.
- **Loading:** spinner replaces leading icon (or centred if no icon), label stays (screen readers
  hear "Saving, busy"). Width locked to rest width.
- **Responsive:** web keeps intrinsic width; mobile primary buttons stretch in sheets/forms, and the
  primary sits on the right (web dialogs) / bottom (mobile).
- **A11y:** `<button>`; destructive buttons name the object ("Delete table 12").

### 1.2 Icon button
Square 32/40/48, radius `sm` (or `full` in toolbars on glass). Icon 20 (web) / 24 (mobile),
colour `icon.secondary` → `icon.primary` on hover; selected/toggled: `state.selected-bg` +
`icon.brand`, `aria-pressed="true"`. Required tooltip (web) and accessible label. Hit target ≥ 44 on touch.

### 1.3 Floating action button (mobile)
56×56 circle (`radius.full`), `action.primary.bg`, icon 24 white, `shadow.brand` + `shadow.2`.
Extended FAB: height 56, padding 20, `label.lg`. Placement: 16 from the right and above the bottom
nav (+16). Hides on scroll down (200ms), returns on scroll up. Staff app: only for "New order".
Customer app: "View cart" extended FAB with item count (tabular). Never more than one FAB.

---

## 2. Inputs & selection

### 2.1 Text input
| Property | Spec |
|---|---|
| Container | height 40 (web) / 48 (mobile); radius `sm`; fill `surface.primary`; border 1px `border.default` |
| Padding | 12 horizontal (web) / 16 (mobile); 8 between icon and text |
| Label | above the field, `label.md`, `text.primary`; 6px gap; required marked with "(required)" text, not just `*` |
| Value | `body.md` (web) / `body.lg` (mobile); numeric inputs use `numeric.md` (tabular) and right-align in tables |
| Placeholder | `text.tertiary`; example values only, never instructions |
| Helper | `body.sm`, `text.secondary`, 4px below |
| Hover | border `border.strong` |
| Focus | border 1.5px `border.brand` + focus ring |
| Error | border `status.error.fg`; helper replaced by error message with `alert-circle` icon; `aria-invalid`, `aria-describedby` |
| Disabled | fill `state.disabled-bg`, text `state.disabled-fg`, border `state.disabled-border` |
| Read-only | no border, fill `surface.secondary`, selectable text |
| Loading | inline 16px spinner trailing (async validation) |
| Responsive | full width on mobile; web forms max 480px per field column |

### 2.2 Search field
Input variant with leading `search` icon, radius `sm` (web) or `full` (mobile, in app bars), fill
`surface.secondary` at rest → `surface.primary` on focus. Clear button (icon button 24) appears
when there is a value. Keyboard: `/` focuses global search on web; Escape clears then blurs.
Results update after 200ms debounce; show `.dosa-spinner` while fetching. Empty results use the
`empty-search` illustration (≥ 1 result → none).

### 2.3 Dropdown / select
Trigger looks like a text input with trailing `chevron-down` (rotates 180° on open, 200ms).
Menu: `surface.elevated`, radius `md`, `shadow.3`, 4px offset, max height 320 with scroll, items
40 (web) / 48 (mobile) high, padding 12, `body.md`; selected item shows `check` icon + `text.brand`.
Hover item: `state.hover-overlay`. Keyboard: arrows, Home/End, type-ahead, Enter/Space, Escape.
Mobile: options with > 6 items open in a bottom sheet instead. Use Angular `mat-select` and
Flutter `DropdownMenu` themed with tokens.

### 2.4 Selectors (chips)
Filter/choice chips: height 32, radius `full`, padding 12, `label.sm`. Rest: `action.neutral.bg`,
1px `border.default`. Selected: `state.selected-bg`, 1px `border.brand`, leading `check` 16.
Multi-select rows scroll horizontally on mobile with 16 edge padding.

### 2.5 Checkbox
18×18 box, radius `xs` (4), 1.5px `border.strong`. Checked/indeterminate: fill
`action.primary.bg`, white glyph (2px stroke), tick draw 80ms. Hit target 40 (web) / 48 (mobile).
Label `body.md`, 8 gap. Disabled uses disabled tokens. Error: border `status.error.fg`.

### 2.6 Radio button
20×20 circle, 1.5px `border.strong`; selected: 2px `border.brand` ring + 10px `action.primary.bg`
dot (scale-in 120ms). Group in `fieldset` with legend; arrow keys move selection.

### 2.7 Switch
Track 36×20 (web) / 52×32 (mobile), radius `full`. Off: track `surface.sunken`, 1px
`border.default`, thumb white with `shadow.1`. On: track `action.primary.bg`, thumb white with
`check` 12. Thumb travel 160ms `standard`. Use only for instant-apply settings; label states the
effect ("Accept online orders"). `role="switch"` + `aria-checked`.

---

## 3. Navigation

### 3.1 Tabs
Height 40 (web) / 48 (mobile). Label `label.md`, `text.secondary`; selected `text.primary` with a
2px `brand.primary` indicator (radius `full`) that slides 200ms. Hover: `state.hover-overlay`.
Scrollable when overflowing (mobile), never wrap. Count badges inline after the label (tabular).
`role=tablist/tab/tabpanel`, arrow-key navigation.

### 3.2 Segmented control
Container: `surface.sunken`, radius `sm`, padding 4. Segments: height 32 (web) / 40 (mobile),
`label.sm`/`label.md`. Selected: `surface.primary` + `shadow.1` thumb that slides 200ms. 2–5
segments, equal widths. On glass, container becomes Subtle Glass.

### 3.3 Top app bar / navigation bar
Web: height 64, Subtle Glass, sticky, contains breadcrumb/page title (`heading.h4`), global
search, notifications, profile. Mobile: height 56 (+ status bar), Subtle Glass over scrolling
content, title `heading.h4` centred (iOS) / start (Android). Bottom navigation (mobile): height
72, Subtle Glass, 3–5 destinations, icon 24 + `label.sm`; selected uses `brand.primary-subtle`
pill indicator 56×32 and bold-stroke icon.

### 3.4 Sidebar (web admin)
Width 264 expanded / 72 collapsed (≥ 1240 expanded by default, 905–1239 collapsed, < 905 becomes a
modal drawer). Surface: Subtle Glass over the mesh canvas (fallback `background.subtle`). Items:
height 40, radius `sm`, padding 12, icon 20 + `label.md`; active: `state.selected-bg`, `text.brand`,
3px `brand.primary` leading indicator. Section headers: `meta.overline`, `text.tertiary`.
Collapse animation 200ms `standard`; collapsed items show tooltips. Brand lock-up at top (symbol
only when collapsed).

### 3.5 Drawer
Side drawer (web filters/details): width 400 (max 90vw), `surface.elevated`, `shadow.4`, radius
`lg` on the inner edge, scrim `surface.scrim`. Enter 240ms `emphasized`, exit 200ms `accelerate`.
Header 64 with title `heading.h4` + close icon button. Focus trapped, Escape closes, focus
returns to the trigger. Mobile uses a bottom sheet (§5.3).

---

## 4. Content containers

### 4.1 Card
`surface.primary`, radius `md` (12), border 1px `border.subtle`, `shadow.1` (optional on canvas),
padding 16 (web) / 16 (mobile), 24 for spacious cards. Title `heading.h3` or `h5` (dense).
Interactive cards: hover `shadow.2` + translateY −2px (web only), press scale 0.98, focus ring
around the whole card; the whole card is one link/button. Never nest cards more than one level.

### 4.2 Glass panel
Use the four recipes (`.dosa-glass--subtle|standard|premium|dark`, Flutter `DosaGlass`) only on
floating surfaces per §0.4. Padding 16–32 by size, radius `md` (subtle) / `lg` (standard, dark) /
`xl` (premium). Content inside uses normal text tokens (contrast verified against the worst-case
composited tint). Requires something behind it (mesh, imagery, map, video) — glass on a flat
colour is just a grey card.

### 4.3 Metric card (KPI)
`surface.primary`, radius `md`, padding 20, min width 220, height ≥ 128.
Anatomy: `meta.overline` label → value `numeric.lg` (`numeric.hero` for the single hero KPI) →
delta chip (`label.sm`, tabular, arrow icon, `status.success`/`error` fg on matching bg) +
comparison text `meta.caption` → optional sparkline (40 high, `chart.categorical.1`, 2px).
Loading: skeleton blocks for label (40%), value (60%), delta (30%). Value updates use
`dosa-value-updated`. Intelligence variant (forecast/AI): Premium Glass + small spark icon.

### 4.4 Food item card (customer)
Image 4:3 (or 1:1 in grids), radius `lg` (18) on the card with the image clipped at the top;
`surface.primary`, `shadow.1`. Body padding 12–16: name `heading.h4` (2 lines max), description
`body.sm` `text.secondary` (2 lines), price `numeric.md` semibold, dietary tags (veg/non-veg dot
icon + label, spice level), "Add" button (Highlight, 40) → stepper (−, qty tabular, +) after adding
(crossfade 160ms). Sold-out: image desaturated 100% at 60% opacity, "Sold out" badge, Add disabled.
Image loading: skeleton with grain; error: `cloud` fill + utensils icon. Hit target: whole card
opens details; Add button stops propagation.

---

## 5. Overlays & feedback

### 5.1 Tooltip
`surface.inverse`, `text.inverse`, `body.sm`, radius `sm`, padding 6×8, max width 240, 8px offset,
arrow optional. Delay 400ms in, 0 out; fade 120ms. Never contain interactive content; never the
only place for essential info. Shows on focus too. Touch: long-press only.

### 5.2 Toast / snackbar
Bottom-centre (mobile, above bottom nav) / bottom-left (web), width 344–480, `surface.inverse`,
`text.inverse` `body.md`, radius `md`, padding 12×16, `shadow.3`. Optional status icon (success
mint, error coral, info sky) and one text action (`action.tertiary` with `violet.300`). Auto-dismiss
5s (info/success); errors persist until dismissed. Max one visible; queue others. `role="status"`
(polite) / `role="alert"` for errors. Rise-in 240ms.

### 5.3 Dialog / bottom sheet
Dialog (web): width 400 / 560 / 720 (sm/md/lg), `surface.elevated`, radius `lg`, `shadow.4`,
padding 24, title `heading.h3`, body `body.md`, actions right-aligned (tertiary/neutral then
primary). Scrim `surface.scrim`. Destructive confirmations name the object and use the destructive
button. Focus trap, initial focus on the least destructive action, Escape closes (unless data
would be lost — then confirm). Mobile: bottom sheet, radius `lg` top corners, drag handle, max 90%
height, actions stacked full width.

### 5.4 Status badge
Height 22 (web) / 24 (mobile), radius `full`, padding 0 8, `label.sm`, leading 6px dot or 12px
icon. Tones: success, warning, error, info, neutral → `status.<tone>.bg` + `status.<tone>.fg`;
solid variant for counts/alerts: `status.<tone>.solid` + `on-solid`. Counts are tabular; "99+".
Not interactive (use chips for filters).

### 5.5 Order status indicator
Shared across all apps; one hue per state (`color.order.*`), always icon + label:

| State | Colour | Lucide icon | Label |
|---|---|---|---|
| received | `order.received` (sky) | `inbox` | Received |
| accepted | `order.accepted` (violet) | `circle-check` | Accepted |
| preparing | `order.preparing` (saffron) | `chef-hat` | Preparing |
| ready | `order.ready` (mint) | `bell-ring` | Ready |
| served / completed | `order.served` (ink) | `utensils` | Served |
| cancelled | `order.cancelled` (coral) | `circle-x` | Cancelled |
| delayed (modifier) | `order.delayed` | `timer` | +Delayed n min |

Forms: **badge** (lists, tables); **stepper** (customer tracker: 4 nodes 24px connected by 4px
track, completed segments in the state colour, current node pulses once on change, timestamps
`meta.caption` tabular); **kitchen ticket header** (staff: full-width 6px top bar in state colour +
timer `numeric.timer`, turning `order.delayed` when over SLA). Status change animation per
MOTION_GUIDELINES §5. Screen readers announce changes via a polite live region.

### 5.6 Progress indicators
Linear: 4px track `surface.sunken`, fill `brand.primary`, radius `full`; determinate shows `%`
(tabular) when > 2s. Circular: 16/20/40 px, 2–4px stroke. Indeterminate only when duration is
unknown. Step progress (onboarding): dots 8px, active pill 24×8.

### 5.7 Loading skeleton
Blocks in `surface.sunken` with `.dosa-skeleton` shimmer 1.2s; radius matches the content (`xs`
text lines, `md` cards, `full` avatars); text-line heights 12/14/16 matching type; widths vary
(100/80/60%). Show after 300ms delay to avoid flashes; max 3s before showing progress text.
`aria-busy` on the container; skeletons are `aria-hidden`.

### 5.8 Empty state
Centered block, max width 360: illustration (`empty-*`, 160–240 wide; animated variant optional) →
`heading.h4` title → `body.md` `text.secondary` one-sentence explanation → primary or secondary
action. 48 vertical padding. Variants: first-use (invite to create), no results (offer to clear
filters), all-done (positive), error (retry). Never blame the user.

---

## 6. Data display

### 6.1 Data table (web admin)
Container: `surface.primary`, radius `md`, 1px `border.subtle` (no glass). Header row: height 40,
`surface.secondary`, `label.sm` `text.secondary`, sticky (`z.raised`), sortable headers show
`arrow-up-down` → `arrow-up`/`arrow-down` 16 and `aria-sort`. Rows: 48 (comfortable) / 40 (dense),
`body.sm`/`body.md`, 1px `border.subtle` dividers, hover `state.hover-overlay`, selected
`state.selected-bg` + checkbox. Numeric columns right-aligned with `numeric.md` (tabular); IDs use
`font.feature.disambiguate`. Status columns use badges. Row actions: trailing icon buttons (32)
visible on hover/focus, always visible on touch. Pagination or virtual scroll ≥ 100 rows; footer
44 with counts. Loading: 5 skeleton rows; empty: empty state inside the table body. Responsive:
< 905px collapse to stacked cards (key fields + status) — never horizontal-scroll primary data;
secondary columns may hide by priority.

### 6.2 Charts
Library-agnostic rules (implement with ECharts/Chart.js on web, `fl_chart` on Flutter):
- Colours: `chart.categorical.1–8` in order; sequential `chart.sequential.1–5`; diverging
  negative/neutral/positive. Max 6 series before grouping into "Other".
- Grid `chart.grid` (dashed 1px), axes `chart.axis`, labels `numeric.sm`. No 3D, no pie > 5 slices
  (use bars), donuts allowed with centre total.
- Lines 2px (3px for the primary series) with round joins; area fill = series colour at 12%.
- Bars radius `xs` top corners, 60% band width. Tooltip uses the Tooltip component with tabular
  values. Legends top-left, interactive (toggle series).
- Animate only on first load (600ms `standard`). Respect reduced motion.
- Accessibility: provide a data table toggle or summary text; don't rely on colour — use direct
  labels or patterns for adjacent similar hues.

---

## 7. Implementation map

| Component | Angular | Flutter |
|---|---|---|
| Buttons | `mat-flat-button` / `mat-stroked-button` / `mat-button` themed via `--mat-sys-*` → DOSA vars; destructive & highlight as directives | `FilledButton`/`OutlinedButton`/`TextButton` themed in `buildDosaTheme` |
| Inputs, select | `mat-form-field` (outline) themed; custom label placement | `TextField`, `DropdownMenu` with `InputDecorationTheme` |
| Checkbox/radio/switch | Material components themed | Material components themed |
| Tabs, segmented | `mat-tab-group`, `mat-button-toggle-group` | `TabBar`, `SegmentedButton` |
| Sidebar, drawer, dialog | `mat-sidenav`, `mat-dialog`, CDK overlay | `NavigationRail`/`Drawer`, `showModalBottomSheet`, `Dialog` |
| Glass, grain, mesh | `@dosa/web-ui` classes | `DosaGlass`, `DosaGrain`, `DosaMeshBackground` |
| Order status, metric card, food card, empty state | Custom standalone components (next phase) | Custom widgets (next phase) |
| Animations | `lottie-web` (`lottie_light`) + fallback `<img>` | `DosaAnimatedIllustration` |

Building these components is the next phase; this document is the contract they are reviewed against.
