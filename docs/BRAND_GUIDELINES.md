# DOSA — Brand Guidelines

Version 0.1 · 2026-11-23 · Companion to [DESIGN.md](../DESIGN.md) (master source of truth).

## 1. Who DOSA is

DOSA is an intelligent restaurant management and customer experience platform. It connects owners,
managers, kitchen staff, servers and guests through one technology ecosystem.

**Brand idea: "Warm intelligence."** Hospitality is human and warm; operations are precise and
calm. DOSA sits between the two: technology that feels like a good maître d' — composed, attentive,
never loud.

| We are | We are not |
|---|---|
| Calm, precise, quietly premium | Flashy, neon, "gamer" |
| Warm and inviting (food, people) | Cold enterprise grey |
| Confident with data | Cluttered dashboards |
| Purposeful in motion | Animated for its own sake |

### Brand pillars
1. **Clarity first.** Operational screens are read in a hurry, under heat lamps and on the move.
   Legibility beats decoration every time.
2. **Hospitality warmth.** Pearl canvases, Saffron and Coral accents, rounded generous geometry.
3. **Quiet intelligence.** Royal Violet and the Intelligence gradient mark the places where DOSA
   is "thinking" for you: forecasts, recommendations, automation.
4. **Depth with restraint.** Frosted glass, paper grain and ambient light give spatial depth, but
   only on surfaces that float. Data stays on solid ground.

## 2. Name and voice

- The product name is always **DOSA** in capitals in the wordmark and UI chrome. In running text,
  "DOSA" (all caps) is preferred; never "Dosa App" or "DOSA™".
- **Voice:** short, active, specific. "Table 12 is ready to order" not "A table may require
  attention". Numbers before adjectives: "3 orders waiting · 4 min" not "Several orders waiting".
- **Staff UI:** imperative and terse ("Accept", "Mark ready", "Fire course 2").
- **Customer UI:** warm, inviting, never cutesy ("Your dosa is on the griddle" is fine on an order
  tracker; jokes in error messages are not).
- **Errors:** say what happened and what to do next. No blame, no exclamation marks.

## 3. Logo

Full specification and files: [ASSET_GUIDELINES.md](ASSET_GUIDELINES.md) and
`packages/brand-assets/brand/`.

- **Symbol — "the fold".** A crescent formed by a folded dosa / plate rim wrapping a single spark.
  The crescent is hospitality (food, the table, the welcome); the spark is intelligence.
- **Wordmark.** "DOSA" set in custom-drawn geometric capitals derived from Plus Jakarta Sans
  ExtraBold, with opened apertures for small-size legibility.
- **Clear space:** the height of the spark on all sides (≈ 0.25 × symbol height).
- **Minimum sizes:** symbol 24px; below that use the dedicated favicon (16–32px), because the
  spark merges into the D. Lock-up 88px wide on screen.
- **Colour versions:** full colour on light (ink + violet spark + saffron fold), reversed on dark
  (pearl + violet-400 spark + saffron fold), single-colour `currentColor`.
- **Never:** rotate, add effects or glows, place on busy photography without a scrim, recolour the
  spark to anything other than violet, stretch, or outline.

## 4. Colour

### 4.1 The eight brand colours (exact, non-negotiable)

| Name | Hex | Role |
|---|---|---|
| Midnight Ink | `#202039` | Text, dark surfaces, wordmark. The anchor of the identity. |
| Royal Violet | `#7564E8` | Signature accent: focus, selection, intelligence, primary actions. |
| Saffron | `#E9A23B` | Hospitality highlight, warmth, warnings, customer CTA fill. |
| Warm Coral | `#E97861` | Appetite and urgency; critical alerts in dark themes. |
| Mint | `#35B99A` | Freshness, success, live indicators. |
| Pearl | `#F7F5F0` | Warm canvas for every light theme. |
| Cloud | `#ECEBF1` | Cool secondary surface; sidebars, table headers, nested panels. |
| Slate | `#66677A` | Secondary text, icons, metadata. |

### 4.2 Proportion
On a typical light screen: **Pearl/white 70% · Midnight Ink 15% (type) · Cloud/Slate 8% ·
Royal Violet 4% · Saffron, Coral, Mint together ≤ 3%.** Violet is an accent, not a background:
do not fill large areas with it except the Intelligence gradient on a single hero element.

### 4.3 Extended ramps
Each brand hue is expanded into an OKLCH-derived tonal ramp so we have accessible text and tint
variants without inventing new colours. The brand value sits *inside* its ramp (marked **bold**).
Rose and Sky are supporting hues: Rose is the end stop of the Intelligence gradient, Sky exists
only for *information* states and charts.

| Step | violet | saffron | coral | mint | rose | sky | ink |
|---|---|---|---|---|---|---|---|
| 50 | `#F3F4FF` | `#FFF4DD` | `#FFEFE9` | `#E4FEF5` | `#FFEEF5` | `#E9F9FF` | `#F6F6FD` |
| 100 | `#E9E9FF` | `#FFE9C8` | `#FFE4DB` | `#CFF5E9` | `#FFDEE9` | `#D8EEFF` | `#EBEBF3` |
| 200 | `#D6D6FF` | `#FFD6A3` | `#FFCFC2` | `#A9E6D3` | `#FFC2D3` | `#B9D9FE` | `#D7D8E2` |
| 300 | `#BFBEFF` | `#F7BD73` | `#FFB4A3` | `#77D2B8` | `#FB9EB8` | `#93C0F3` | `#BEBFCC` |
| 400 | `#A6A2FF` | **`#E9A23B`** | `#F89682` | **`#35B99A`** | **`#E9789B`** | `#68A2E3` | `#A2A3B4` |
| 500 | `#8D84F8` | `#C9871E` | **`#E97861`** | `#159F82` | `#CB6283` | `#3C83CE` | `#86879B` |
| 600 | **`#7564E8`** | `#A96B00` | `#C45C47` | `#00846A` | `#AC4A6B` | `#276BB1` | `#696A80` |
| 650 | `#6857D5` | `#9A5E00` | `#B24F3B` | `#00785F` | | `#1D60A3` | |
| 700 | `#5C4AC3` | `#8B5200` | `#A14230` | `#006C54` | `#903554` | `#125696` | `#4F5068` |
| 800 | `#4530A0` | `#6E3A00` | `#802918` | `#00543F` | `#741F3F` | `#00417C` | `#373750` |
| 850 | | | | | | | `#2B2B45` |
| 900 | `#30147D` | `#522300` | `#600E00` | `#003D2B` | `#59072B` | `#002D63` | **`#202039`** |
| 950 | `#1F0060` | `#3A0E00` | `#450000` | `#002A1A` | `#42001A` | `#001B4D` | `#14132A` |
| 975 | | | | | | | `#0D0D20` |

Ramps are generated once with OKLCH lightness targets and chroma taper, then frozen into
`packages/design-tokens/src/primitives/color.json`. Edit that file, never the generated outputs.

### 4.4 Accessibility decisions you must know
These came out of measured WCAG 2.2 contrast checks (`pnpm --filter @dosa/design-tokens report`):

- **Royal Violet with white text is 4.43:1**, just under AA for normal text. Filled primary buttons
  therefore use **violet-650 `#6857D5` (5.37:1)**. Royal Violet itself is used for focus rings
  (4.06:1 on Pearl, above the 3:1 non-text minimum), icons, selection, charts and gradients.
- **Saffron, Coral and Mint are too light for white text.** On Saffron use Midnight Ink text
  (7.31:1). Coloured *text* uses the 700 step (e.g. success text `#006C54`, 6.42:1 on white).
- **Slate on Cloud is 4.68:1.** Fine for secondary text, but do not go lighter than Slate on Cloud.
- Status is never communicated by colour alone: always pair with an icon and/or label.

## 5. Typography

| Role | Family | Why |
|---|---|---|
| Display & headings | **Plus Jakarta Sans** (variable, wght 200–800) | Geometric warmth, distinctive at large sizes, pairs naturally with Inter. |
| Body, UI, data | **Inter** (variable, opsz 14–32, wght 100–900) | Engineered for screens, superb at 11–14px, true tabular figures. |

Both are SIL Open Font License 1.1 and self-hosted (`packages/brand-assets/fonts/SOURCE.md`).

Rules:
1. **Plus Jakarta Sans never appears below 17px** and never in tables, forms, inputs, badges or
   numeric data. h5 (15px) and smaller use Inter.
2. **Every number that can change or be compared uses tabular figures** (`font-feature-settings:
   'tnum' 1` / `FontFeature.tabularFigures()`): prices, revenue, order numbers, timers,
   quantities, percentages, chart labels. The `numeric.*` styles already include it.
3. Order codes and table IDs additionally use `font.feature.disambiguate` (slashed zero, tailed l).
4. Headings use negative tracking (−0.6% to −2.5%), body is near zero, overlines are +8% and
   UPPERCASE.
5. Line-heights land on the 4px grid (e.g. 14/20, 16/24, 30/36).
6. Minimum text size: 12px for UI text, 11px only for overlines. Customer-facing body is 16px.
7. No italics, no faux bold, no condensed or stretched type, no text on unblurred busy imagery.

Full scale with sizes, weights, line heights and tracking: [DESIGN_TOKENS.md §Typography](DESIGN_TOKENS.md#typography).

## 6. Imagery

- **Food photography (customer app):** natural light, warm white balance, top-down or 45°,
  shallow depth, real textures. Background colours that live inside the Pearl/Saffron/Coral family.
  No neon backgrounds, no heavy vignettes. Rounded corners per radius tokens.
- **Illustration:** see [ILLUSTRATION_GUIDELINES.md](ILLUSTRATION_GUIDELINES.md). Original,
  flat-with-depth, 2px strokes in Midnight Ink, brand fills, one spark of violet.
- **Icons:** Lucide geometry, 1.75px stroke at 16–24px. See [ASSET_GUIDELINES.md](ASSET_GUIDELINES.md).
