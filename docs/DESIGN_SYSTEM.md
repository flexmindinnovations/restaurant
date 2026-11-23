# DOSA — Design System

How the DOSA design system is organised, how it reaches each app, how it is kept correct, and how
to change it. The *what* (colours, type, surfaces, components) is in [DESIGN.md](../DESIGN.md); this
document is the *how*.

## 1. Layers

```
                ┌──────────────────────────────────────────────┐
   Foundations  │ design-tokens: primitives → semantic → themes │  one JSON source
                └──────────────┬───────────────────────────────┘
                               │ generated (pnpm tokens:build)
          ┌────────────────────┼───────────────────────────┐
          ▼                    ▼                           ▼
   CSS / SCSS / TS        JSON (per theme)            Dart (dosa_tokens.g.dart)
          │                    │                           │
   Assets │  brand-assets (logo, icons, illustrations, grain, fonts)
          │  motion-assets (Lottie, SVG fallbacks, dosa-motion.css)
          ▼                                                ▼
   web-ui (dosa.css: base, type,                    flutter-ui / dosa_ui (ThemeData,
   glass, grain, gradients, motion)                 DosaGlass, DosaGrain, DosaMotion…)
          │                                                │
   Components   Angular Material + DOSA mapping     Material/Cupertino widgets + DOSA theme
          │                                                │
   Apps         apps/admin-web                      apps/staff-mobile, apps/customer-mobile
```

| Layer | Owned by | Lives in | Changes through |
|---|---|---|---|
| Primitives (raw palette, scales) | Design system | `packages/design-tokens/src/primitives` | PR + contrast report |
| Semantics (roles: surface, text, action, status, order…) | Design system | `src/semantic/{light,dark}.json` | PR + contrast report |
| Themes (5 contexts) | Design system | `src/themes/*.json` (`$extends` a semantic base) | PR + contrast report |
| Assets | Design system | `packages/brand-assets`, `packages/motion-assets` | Generator scripts only |
| Platform foundations | Web / Flutter leads | `packages/web-ui`, `packages/flutter-ui` | PR; must consume tokens only |
| Components | App teams, to spec | Each app, against [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md) | PR; spec change first if needed |

Rule of direction: each layer may only reference the layer above it. Components never reference
primitives; apps never reference primitives or raw values.

## 2. Platform parity

The same token keys exist on every platform; implementations are native, not shared code.

| Concern | Web (Angular) | Flutter (staff, customer) |
|---|---|---|
| Theme switch | `data-dosa-theme` attribute, runtime, nestable | `buildDosaTheme(DosaThemeTokens.x)` + `ThemeMode` |
| Read a token | `var(--dosa-color-surface-primary)` / `$dosa-…` | `DosaTheme.of(context).surfacePrimary` |
| Constants | `--dosa-space-4`, `--dosa-radius-md` | `DosaSpace.s4`, `DosaRadius.md` |
| Type | `.dosa-h1`, `.dosa-numeric-lg` | `DosaTypeScale.headingH1`, `numericLg` |
| Glass | `.dosa-glass--{subtle,standard,premium,dark}` | `DosaGlass(variant: …)`, `DosaGlassScope` |
| Grain | `.dosa-grain` (`::after` layer) | `DosaGrain` (pre-tinted tile) |
| Mesh | `.dosa-mesh`, `.dosa-mesh--quiet` | `DosaMeshBackground(quiet: …)` |
| Gradients | `var(--dosa-gradient-*)`, `.dosa-gradient-*` | `t.gradientIntelligence` etc. (`LinearGradient`) |
| Motion | `dosa-motion.css` classes, `--dosa-motion-*` | `DosaDuration`, `DosaEasing`, `DosaMotion.duration()` |
| Lottie | lottie-web `lottie_light`, lazily loaded | `DosaAnimatedIllustration(DosaAnimation.x)` |
| Reduced motion | `prefers-reduced-motion` | `MediaQuery.disableAnimationsOf` |
| Reduced transparency | `prefers-reduced-transparency`, `data-dosa-glass="off"` | `DosaGlassScope(enabled: false)` |
| Fonts | woff2 Latin subsets via `@font-face` in `dosa.css` | Variable TTFs bundled in `dosa_ui` |

Flutter cannot read files outside its package, so `pnpm flutter:sync-assets` copies fonts,
textures, SVGs and Lottie files into `packages/flutter-ui/assets/`. `pnpm flutter:check-assets`
fails if those copies drift from the canonical files.

## 3. Quality gates

Everything below runs locally through `pnpm validate` and `pnpm flutter:check`. A change is not done until they pass.

| Gate | Command | Fails on |
|---|---|---|
| Token integrity | `pnpm tokens:check` | Broken references, type errors, theme key mismatch, shadowed keys, brand hex drift, generated output out of date |
| Contrast | `pnpm tokens:check` (205 checks) | Any text pair < 4.5:1 or UI pair < 3:1 in any theme |
| SVG assets | `pnpm assets:validate` | Malformed XML, missing `viewBox`/accessible name, rasters, scripts, filters in illustrations, duplicate ids, off-palette colours, size budget, index gaps, light/dark mismatch |
| Motion | `pnpm motion:validate` | Generator output stale, render errors in lottie-web, > 15 KB, > 12 layers, masks/mattes/images, fallback missing |
| Web foundations | `pnpm web-ui:build` | Unknown `--dosa-*` references in the CSS layers |
| Flutter (package and apps) | `pnpm flutter:check` | Asset copies drifting, raw colours in app code, analyzer issues, failing widget or golden tests |
| Admin web | `pnpm admin:lint`, `admin:build`, `admin:test` | ESLint (incl. template accessibility), raw colours in `src/`, build or unit test failures |

Visual review: `pnpm docs:build` produces the specimen site (`packages/documentation/dist`), with
foundations, illustrations and motion pages in every theme. Its screenshot script fails on missing
files, console errors or fonts that did not load.

## 4. Changing the system

1. **Is it a new value or a new role?** Prefer reusing a semantic token. Add a semantic token when
   a role is genuinely new (e.g. a new order state); add a primitive only when no ramp step works.
2. **Edit the source JSON**, never generated files (they carry `DO NOT EDIT` headers).
3. Run `pnpm tokens:build`, then `pnpm --filter @dosa/design-tokens report` to see contrast.
4. If an asset uses the colour, regenerate (`pnpm assets:generate`, `pnpm motion:generate`) and
   validate.
5. Run `pnpm flutter:sync-assets` if assets changed, then `pnpm validate` and the Flutter checks.
6. Update the relevant guideline and DESIGN.md in the same PR. A token PR without a doc change
   is incomplete if it changes meaning.

**Naming:** `category.role.variant.state`, kebab-case, e.g. `color.action.primary.bg-hover`.
CSS: `--dosa-color-action-primary-bg-hover`; Dart: `actionPrimaryBgHover`. Full rules:
[DESIGN_TOKENS.md](DESIGN_TOKENS.md).

**Deprecation:** keep the old token as an alias of the new one for one minor version, note it in
the PR description, then remove it.

## 5. Versioning

All packages are private workspace packages at `0.1.0`, consumed with `workspace:*` (web) or a
path dependency (Flutter), so apps always build against the current system. Semantic versioning
applies once a package is published outside the monorepo: removing or renaming a token is major,
adding one is minor, changing a value within its role is a patch.

## 6. Status of this phase

| Part | State |
|---|---|
| Tokens, 5 themes, generators, contrast validation | Built and validated |
| Fonts, typography styles | Built; web specimen verified in Chromium; Flutter styles covered by tests |
| Glass, grain, gradients, mesh (web and Flutter) | Built; web verified visually; Flutter covered by widget tests |
| Logo, app icon masters, favicon, 23 illustrations × 2 modes | Built and validated |
| 10 Lottie animations × 2 modes + static fallbacks | Built; rendered in lottie-web and parsed by Flutter `lottie` |
| Component specifications | Written ([COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md)) |
| Components in code | Angular Material and Flutter Material themed through tokens; shared Flutter widgets `DosaOrderStatusBadge`, `DosaLogo`; Angular wrappers not yet built |
| App scaffolds | Admin web, staff and customer apps build and pass their tests; foundations check screens only |
| Launcher icons | Android legacy and iOS PNGs rendered from the masters; adaptive Android icons not yet |
| Flutter goldens | 3 goldens (staff light, staff kitchen, customer warm); headless renderer does not apply blur |
| Rive | Not used (see [ROADMAP.md](ROADMAP.md)) |
