# DOSA — Design Tokens

The canonical, technology-neutral token source lives in `packages/design-tokens/src` as
[W3C Design Tokens (DTCG)](https://www.designtokens.org/) JSON. Everything else is generated.
Full generated value tables: [reference/TOKEN_REFERENCE.md](reference/TOKEN_REFERENCE.md).

## 1. Layers

```
src/primitives/*.json   Raw palette, type scale, spacing, radius, motion, sizes, z-index …
        │                (the only place a hex value or px size may be written)
        ▼
src/semantic/light.json  Meaning: color.text.primary, color.action.primary.bg, shadow.2, glass.blur.*
src/semantic/dark.json   Dark overrides of the same keys
        │
        ▼
src/themes/<theme>.json  "$extends": "light" | "dark" + a few overrides per environment
```

| Layer | May reference | Used by app code? |
|---|---|---|
| Primitive (`color.violet.600`, `space.4`, `typography.body.md`) | nothing | Foundations yes (space, radius, type, motion). Colours **no**. |
| Semantic (`color.surface.primary`, `shadow.2`, `gradient.intelligence`) | primitives | **Yes — always for colour.** |
| Theme (`staff-kitchen`) | primitives | Selected at runtime, never referenced by name in components. |

**Rules enforced by the build** (`scripts/lib.mjs`, `scripts/validate.mjs`):
1. Every `{reference}` must resolve; cycles fail.
2. A semantic token may not shadow a primitive path.
3. Every theme exposes exactly the same semantic keys as `admin-light`.
4. The eight brand colours must equal the values in the brief.
5. 41 contrast pairs × 5 themes must meet their WCAG 2.2 minimum (205 checks).
6. Generated files must match the source (`--check`).

## 2. Naming

`<category>.<role>.<variant>[.<state>]`, kebab-case segments.

- `color.text.secondary`, `color.action.primary.bg-hover`, `color.status.error.fg`
- `color.order.preparing` — domain tokens are allowed when the meaning is shared across apps.
- Platforms derive names mechanically:

| Canonical | CSS | SCSS | TypeScript | Dart |
|---|---|---|---|---|
| `color.text.primary` | `--dosa-color-text-primary` | `$dosa-color-text-primary` | `themes['admin-light']['color.text.primary']` / `cssVar('color.text.primary')` | `tokens.textPrimary` |
| `space.4` | `--dosa-space-4` | `$dosa-space-4` | `primitives['space.4']` | `DosaSpace.s4`* |
| `typography.heading.h1` | `--dosa-typography-heading-h1` (+ `-font-size` …) | same | `primitives['typography.heading.h1']` | `DosaTypeScale.headingH1` |
| `motion.duration.quick` | `--dosa-motion-duration-quick` | same | `primitives['motion.duration.quick']` | `DosaDuration.quick` |

\* Dart identifiers cannot start with a digit, so numeric keys get a group prefix: `space.4` → `DosaSpace.s4`, `space.0-5` → `DosaSpace.s0Half`, `breakpoint.2xl` → `DosaBreakpoint.bp2xl`. Semantic colours drop the leading `color.` (`color.text.primary` → `textPrimary`); other semantic groups keep it (`shadow.2` → `shadow2`, `gradient.intelligence` → `gradientIntelligence`).

## 3. Alpha without raw colours

Translucent colours reference a palette colour and add an alpha extension:

```json
"subtle-tint": { "$value": "{color.white}", "$extensions": { "dosa.alpha": 0.56 } }
```

This keeps glass, scrims and shadows inside the palette and makes their alpha auditable.

## 4. Outputs

| File | Consumer | Notes |
|---|---|---|
| `dist/css/tokens.css` | Web (Angular, docs, any HTML) | `:root` = primitives + `admin-light`; `[data-dosa-theme="…"]` blocks for others. Sets `color-scheme`. |
| `dist/scss/_tokens.scss` | Angular SCSS | Variables point to CSS custom properties (runtime theming); `$dosa-palette` and `$dosa-breakpoints` maps are literal. |
| `dist/ts/tokens.ts` | TypeScript (charts, canvas, tests) | `primitives`, `themes`, typed names, `cssVar()`. |
| `dist/json/<theme>.json` | Design tools, docs, other platforms | Flat, fully resolved. |
| `packages/flutter-ui/lib/src/tokens/dosa_tokens.g.dart` | Flutter | `DosaPalette`, `DosaSpace`, `DosaRadius`, `DosaSize`, `DosaDuration`, `DosaEasing`, `DosaTypeScale`, `DosaThemeTokens.{adminLight, …}`. |
| `docs/reference/TOKEN_REFERENCE.md` | Humans | All values per theme. |

All outputs are committed so Flutter builds without Node. CI runs `pnpm tokens:check`.

## 5. Workflow: changing or adding a token

1. Edit JSON in `packages/design-tokens/src` (primitive for a new raw value, semantic for meaning).
2. If you add a semantic key, add it in `semantic/light.json` (and `dark.json` if it differs).
3. `pnpm tokens:build` — validates, then regenerates every output.
4. Commit source + generated files together.
5. If you add a contrast-relevant pairing, add it to `PAIRS` in `scripts/validate.mjs`.

## 6. Foundations summary

- **Spacing:** 4px base — 0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.
- **Radius:** xs 4 · **sm 8 (controls)** · **md 12 (cards)** · **lg 18 (feature panels)** · **xl 24 (hero)** · full.
- **Elevation:** `shadow.0–4` + `shadow.brand`, ink-tinted on light, black on dark. Two layers
  each (key + ambient) for realistic depth.
- **Motion:** durations 80 / 120 / 160 / 200 / 240 / 280 / 400 / 600 / 1200 ms; easings
  standard, decelerate, accelerate, emphasized, linear. See [MOTION_GUIDELINES.md](MOTION_GUIDELINES.md).
- **Breakpoints:** 0 / 600 / 905 / 1240 / 1440 / 1920 with 4 / 8 / 12 columns.
- **Z-index:** base 0 · raised 10 · sticky 100 · nav 200 · dropdown 1000 · drawer 1100 · modal 1200 · popover 1300 · toast 1400 · tooltip 1500.
- **Sizes:** controls 32 / 40 / 48 / 56; touch min 44 (staff 48); icons 12–48.

## Typography

| Token | Family | Weight | Size | Line height | Tracking | Use |
|---|---|---:|---:|---:|---:|---|
| `typography.display.xl` | Plus Jakarta Sans | 800 | 56px | 64px | −0.025em | Hero titles (web only) |
| `typography.display.lg` | Plus Jakarta Sans | 700 | 44px | 52px | −0.022em | Onboarding, large heroes |
| `typography.display.md` | Plus Jakarta Sans | 700 | 36px | 44px | −0.02em | Largest size on mobile |
| `typography.heading.h1` | Plus Jakarta Sans | 700 | 30px | 36px | −0.018em | Page title |
| `typography.heading.h2` | Plus Jakarta Sans | 700 | 24px | 32px | −0.014em | Section title |
| `typography.heading.h3` | Plus Jakarta Sans | 600 | 20px | 28px | −0.01em | Card/panel title |
| `typography.heading.h4` | Plus Jakarta Sans | 600 | 17px | 24px | −0.006em | Sub-section, mobile dialog title |
| `typography.heading.h5` | Inter | 600 | 15px | 20px | −0.003em | Dense group headers |
| `typography.body.lg` | Inter | 400 | 16px | 24px | −0.006em | Mobile body, long form |
| `typography.body.md` | Inter | 400 | 14px | 20px | −0.004em | Admin body |
| `typography.body.sm` | Inter | 400 | 13px | 18px | 0 | Dense tables, helper text |
| `typography.label.lg` | Inter | 600 | 15px | 20px | −0.004em | Large buttons |
| `typography.label.md` | Inter | 600 | 14px | 20px | −0.002em | Buttons, tabs, labels |
| `typography.label.sm` | Inter | 500 | 12px | 16px | 0.004em | Badges, chips |
| `typography.meta.caption` | Inter | 400 | 12px | 16px | 0.004em | Timestamps, footnotes |
| `typography.meta.overline` | Inter | 600 | 11px | 16px | 0.08em | UPPERCASE eyebrow |
| `typography.numeric.hero` | Inter | 600 | 36px | 40px | −0.03em | KPI hero (tnum) |
| `typography.numeric.lg` | Inter | 600 | 24px | 32px | −0.02em | Metric cards, totals (tnum) |
| `typography.numeric.md` | Inter | 500 | 14px | 20px | 0 | Prices, quantities (tnum) |
| `typography.numeric.sm` | Inter | 500 | 12px | 16px | 0.004em | Inline counts, axes (tnum) |
| `typography.numeric.timer` | Inter | 700 | 28px | 32px | −0.02em | Kitchen timers (tnum) |

**Mobile adaptation:** Flutter uses the same logical-pixel sizes. On phones, never use
`display.xl`/`display.lg`; `display.md` is the largest. Respect the OS text scale (do not clamp
below 1.0; cap layouts, not fonts, at 1.3× for dense staff screens).
