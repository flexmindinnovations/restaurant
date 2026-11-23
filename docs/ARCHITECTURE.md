# DOSA — Architecture

Status: bootstrap phase (foundations only). Owner: platform team. Last reviewed: 2026-11-23.

This document explains how the DOSA monorepo is organised, why, and the rules that keep three
applications on two UI frameworks visually consistent without sharing incompatible code.

---

## 1. System overview

```
                     ┌──────────────────────────────────────────────┐
                     │  packages/design-tokens  (canonical JSON)    │
                     │  W3C DTCG format · one source of truth       │
                     └──────────────┬───────────────────────────────┘
                                    │  node scripts/build.mjs
          ┌─────────────────────────┼──────────────────────────────┐
          ▼                         ▼                              ▼
  dist/css/*.css            dist/ts/tokens.ts            packages/flutter-ui/lib/src/tokens/*.dart
  dist/scss/_tokens.scss    dist/json/*.json             (generated, committed)
          │                         │                              │
          ▼                         ▼                              ▼
  packages/web-ui  ───────► apps/admin-web            apps/staff-mobile   apps/customer-mobile
  (CSS surfaces: glass,     (Angular + Material)      (Flutter)           (Flutter)
   grain, gradients)                                         ▲                    ▲
                                                             └── packages/flutter-ui (dosa_ui) ──┘
  packages/brand-assets  ── SVG logo, illustrations, grain textures (consumed by all apps)
  packages/motion-assets ── Lottie JSON + CSS keyframes + static SVG fallbacks (all apps)
  backend/api            ── NestJS (later phase) · PostgreSQL (later) · WebSocket gateway (later)
```

**What is shared:** design decisions (tokens), brand and illustration assets, motion files, and
specifications. **What is not shared:** UI component code. Angular components and Flutter widgets are
implemented separately against the same tokens and the same written specification
(`docs/COMPONENT_GUIDELINES.md`).

## 2. Repository layout

```
dosa/
├── apps/
│   ├── admin-web/            Angular 22 + Angular Material 22 (pnpm workspace member)
│   ├── staff-mobile/         Flutter app, independent pubspec (not a pnpm member)
│   └── customer-mobile/      Flutter app, independent pubspec (not a pnpm member)
├── packages/
│   ├── design-tokens/        Canonical token JSON + zero-dependency generator + contrast validator
│   ├── brand-assets/         Original SVG brand symbol, wordmark, app icons, illustrations, textures
│   ├── motion-assets/        Lottie animations, CSS motion utilities, static SVG fallbacks
│   ├── web-ui/               Framework-agnostic CSS: theme layers, glass, grain, gradients, type
│   ├── flutter-ui/           Dart package `dosa_ui`: generated tokens + native glass/grain/theme
│   └── documentation/        Static visual specimen (proves tokens, glass, grain, motion render)
├── backend/
│   └── api/                  Placeholder + plan for NestJS (no business logic in this phase)
├── design/                   Design-source material: brand, foundations, components, references
├── docs/                     The written system (DESIGN.md is the master source of truth)
├── package.json              Root scripts (pnpm)
└── pnpm-workspace.yaml
```

## 3. Key decisions

Each decision lists the alternatives considered. Revisit with an ADR when the context changes.

### D1 — pnpm workspaces, no Nx/Turborepo (yet)
- **Chosen:** pnpm 10 workspaces with root scripts.
- **Why:** five small JS/TS packages and one Angular app do not need a task graph or remote cache.
  pnpm's strict `node_modules` catches undeclared dependencies, and `--filter` gives per-package runs.
- **Revisit when:** more than ~3 web apps, or CI time for JS exceeds ~10 minutes. Nx can be adopted
  incrementally on top of pnpm workspaces without moving folders.

### D2 — Flutter apps are independent projects
- **Chosen:** each Flutter app has its own `pubspec.yaml` and builds with plain `flutter` commands
  from its own folder. Shared Dart code lives in `packages/flutter-ui` and is consumed through a
  relative `path:` dependency.
- **Why:** keeps each app buildable in isolation (an explicit requirement), avoids Melos as a
  mandatory tool, and Dart pub workspaces can be introduced later without moving files.
- **Rejected:** Melos (useful at 5+ Dart packages; overhead today).

### D3 — Canonical tokens in W3C Design Tokens (DTCG) JSON, own generator
- **Chosen:** `$value` / `$type` JSON (DTCG 2025 format), with `{reference}` aliases, split into
  primitives → semantic → theme overrides. A ~400-line dependency-free Node script generates
  CSS, SCSS, TypeScript, flat JSON and Dart.
- **Why not Style Dictionary:** it would work, but its Flutter output does not produce the typed
  `ThemeExtension`-friendly classes we need, so we would write custom formats anyway. A small owned
  script is easier to audit, has no dependency churn, and runs anywhere Node runs.
  Migration to Style Dictionary stays cheap because the source JSON is standard DTCG.
- **Generated output is committed.** Flutter projects can then build without Node installed, and
  `pnpm tokens:check` fails CI if anyone edits generated files by hand or forgets to rebuild.

### D4 — Themes are semantic overrides, not separate palettes
Five themes share one semantic vocabulary (`color.surface.*`, `color.text.*`, …):

| Theme id         | Used by                         | Base   |
|------------------|---------------------------------|--------|
| `admin-light`    | Web admin default               | light  |
| `admin-monitor`  | Web admin CCTV / monitoring     | dark   |
| `staff-light`    | Staff mobile default            | light  |
| `staff-kitchen`  | Staff mobile kitchen/dark mode  | dark   |
| `customer-warm`  | Customer mobile                 | light  |

A theme file may only override semantic tokens; it may never introduce a new raw colour that is not
in the primitive palette. This keeps the five environments recognisably one product.

### D5 — Glass, grain and gradients are platform-native recipes over shared tokens
- Web: CSS `backdrop-filter` with `@supports` fallbacks (`packages/web-ui`).
- Flutter: `BackdropFilter` + `ImageFilter.blur`, clipped, with an opaque fallback when blur is
  disabled for performance (`packages/flutter-ui`).
- The *numbers* (blur radius, tint alpha, border alpha, highlight alpha) are tokens, so both
  platforms render the same recipe.

### D6 — Animation: Lottie for illustrative motion, CSS/implicit animations for UI feedback
- Lottie JSON (Bodymovin schema) is renderable by `lottie-web` on Angular and the `lottie` package
  on Flutter. Files are authored as data, validated, and render-tested headlessly.
- Rive is **not used in this phase**: `.riv` is a binary format produced by the Rive editor and
  cannot be authored or verified reliably from code. Candidate use: interactive onboarding mascot
  (see `docs/ROADMAP.md`).
- Every Lottie file has a static SVG fallback for reduced motion and failed loads.

### D7 — Backend later, contracts first
NestJS (TypeScript) and PostgreSQL are introduced in a later phase. In this phase `backend/api`
contains only its README with the module plan. Realtime is designed as a NestJS WebSocket gateway
(socket.io or native `ws`) publishing order-status events; the UI motion system already defines the
visual states those events will drive (`order.received → accepted → preparing → ready`).

### D8 — Fonts are self-hosted from @fontsource (OFL-1.1)
Inter and Plus Jakarta Sans are both licensed under the SIL Open Font License 1.1, which allows
bundling in commercial apps. Web uses the `@fontsource-variable/*` npm packages; Flutter bundles
the same variable `.ttf`/`woff2`-derived files as assets (see `docs/PROJECT_SETUP.md`). No runtime
dependency on Google's CDN, which also avoids a third-party request on every page load.

## 4. Dependency rules

1. Applications may depend on packages; packages never depend on applications.
2. `design-tokens` depends on nothing. Everything visual depends on it.
3. No application code contains raw hex colours, raw font sizes or raw durations. Use tokens.
   (A lint step greps for `#[0-9a-f]{6}` in app source — see `PROJECT_SETUP.md`.)
4. Angular code never imports from Flutter packages and vice versa.
5. Generated files carry a `DO NOT EDIT` header and are only changed by `pnpm tokens:build`.

## 5. Future multi-branch support

The platform starts with one restaurant. Anything the UI keys off a location uses a `branchId`
concept from day one in API contracts (later phase) so multi-branch is additive. Themes are not
per-branch: a branch may later supply an accent image, never a new palette.

## 6. Out of scope for this phase

Application screens, order workflows, authentication, payments integration, backend business logic,
database schema, infrastructure-as-code.
