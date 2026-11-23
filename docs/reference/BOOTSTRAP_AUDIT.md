# DOSA bootstrap audit

Stage 10 of the bootstrap, run 2026-11-23 on branch `bootstrap/design-system`. Each line was
checked against the files and command output named in it, not against intentions.

## 1. Acceptance criteria

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | Repository established | Met | `flexmindinnovations/restaurant`, pnpm workspace, root `package.json`, `.editorconfig`, `.gitattributes` |
| 2 | Three apps scaffolded | Met | `apps/admin-web` (Angular 22.3 + Material 22.3), `apps/staff-mobile`, `apps/customer-mobile` (Flutter 3.50.1). All build or analyze clean and pass tests |
| 3 | Brand identity documented | Met | `docs/BRAND_GUIDELINES.md`, `DESIGN.md` §1–2, §8 |
| 4 | Shared design tokens exist | Met | `packages/design-tokens/src` (DTCG JSON) → CSS, SCSS, TS, JSON, Dart; `pnpm tokens:check` confirms outputs are current |
| 5 | Typography configured and verified | Met | Variable TTF + woff2 subsets; web specimen screenshot script fails if fonts do not load; admin build loads Inter and Plus Jakarta Sans (checked in Chromium); Flutter tests render with the real fonts |
| 6 | Light and dark foundations | Met | 5 themes (3 light, 2 dark), 205 contrast checks, 0 failures |
| 7 | Reusable frosted glass | Met | `.dosa-glass--{subtle,standard,premium,dark}` with `@supports`, reduced-transparency and opt-out fallbacks; Flutter `DosaGlass` + `DosaGlassScope`; used in admin shell, staff and customer apps |
| 8 | Paper-noise asset in a sample | Met | `textures/paper-grain-*-256.{png,webp}` + SVG source; `.dosa-grain` in the admin shell, `DosaGrain` via `DosaMeshBackground` in both apps (visible in renders) |
| 9 | Ambient gradients | Met | 4 brand gradients as tokens on both platforms; `.dosa-mesh` / `DosaMeshBackground` |
| 10 | SVG library has real assets | Met | 59 SVGs (all 17 requested categories), `pnpm assets:validate` 0 problems, `ASSET_INDEX.md` |
| 11 | Working animations | Met | 10 Lottie × light/dark, each rendered frame by frame in lottie-web and parsed by Flutter `lottie`; static fallbacks; Rive deliberately deferred and documented |
| 12 | Component specifications | Met | `docs/COMPONENT_GUIDELINES.md`: all 32 requested components; shared state model, density per platform and accessibility baseline (§0) plus per-component anatomy, sizes, tokens and behaviour |
| 13 | DESIGN.md complete | Met | Real values for colour, type, spacing, radii, elevation, glass, grain, gradients, mesh, motion, themes, components, code samples |
| 14 | README explains running and maintenance | Met | `README.md`, `docs/PROJECT_SETUP.md` |
| 15 | No premature app screens | Met | Each app has a shell and one "foundations check" screen labelled as such; no product flows, auth, data or API calls |

## 2. Validation run

| Command | Result |
|---|---|
| `pnpm validate` | Pass: 205 contrast checks; 11 generated token files current; 59 SVGs, 0 problems; 20 Lottie renders; `dosa.css` with 490 tokens; admin ESLint + raw-colour check clean; admin production build; 5 Vitest tests |
| `pnpm flutter:check` | Pass: 100 asset copies in sync; no raw colours in app code; `flutter analyze` clean ×3; 16 + 4 + 4 tests including 3 goldens |
| Doc consistency (script, this audit) | Every backticked token path in `DESIGN.md` and `docs/*.md` resolves to a real token (after normalising shorthand `border.*` and `color.live/critical` references); 0 broken relative links across 24 Markdown files |

## 3. Design consistency findings

| Finding | Action |
|---|---|
| Flutter premium glass dropped its tint (BoxDecoration ignores `color` when a gradient is set) | Fixed: sheen moved to its own layer |
| Glass shadows showed through translucent panels on Flutter | Fixed: shadows painted outside the panel only, as CSS does |
| Tonal buttons used Saffron (web) or primary fill (Flutter) instead of the violet secondary action | Fixed on both platforms: Material secondary container → `color.action.secondary.*` |
| Order-status badge label was not announced by screen readers | Fixed: badge and labelled illustrations are their own semantics nodes; test added |
| Flutter grain read stronger than web | Opacity factor lowered from 1.6× to 1.25× of the token |
| Docs said fonts came from @fontsource and that email PNG exports exist | Corrected to what exists |
| Sidebar, top bar, bottom nav sizes were raw numbers | Added `size.layout.*` tokens |

## 4. Open items (not blocking the bootstrap)

Tracked in [ROADMAP.md](../ROADMAP.md): CI pipeline; Android adaptive icons and web manifest;
small-size symbol variant; Angular component wrappers and web Lottie player; responsive admin
shell; web visual regression; localisation. Flutter Android `applicationId` values
(`app.dosa.dosa_staff`, `app.dosa.dosa_customer`) and release signing are placeholders from
`flutter create` that must be set before any store release.
