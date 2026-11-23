# DOSA

Intelligent restaurant management and customer experience platform: one technology ecosystem for
owners, managers, kitchen staff, servers and guests.

This repository is the DOSA monorepo. It currently contains the **design system, brand and motion
assets, and the scaffolds of the three apps**. Product screens, order workflows and the backend are
the next phase ([ROADMAP](docs/ROADMAP.md)).

> **Start with [DESIGN.md](DESIGN.md)**, the master source of truth for every DOSA interface.

## What is inside

```
apps/
  admin-web/          Angular 22 + Angular Material web admin (shell + foundations check)
  staff-mobile/       Flutter staff app (shell + foundations check, light / kitchen themes)
  customer-mobile/    Flutter customer app (shell + foundations check, warm theme)
packages/
  design-tokens/      Canonical W3C token JSON → CSS, SCSS, TS, JSON, Dart (generated)
  brand-assets/       Logo, app icons, 23 illustrations × light/dark, grain, fonts, generators
  motion-assets/      10 Lottie animations × light/dark, static fallbacks, dosa-motion.css
  web-ui/             dosa.css: tokens, fonts, base, type, glass, grain, gradients, motion
  flutter-ui/         dosa_ui: ThemeData, DosaGlass, DosaGrain, DosaMesh, motion, badges, logo
  documentation/      Static specimen site for foundations, illustrations and motion
backend/api/          NestJS + PostgreSQL plan (not implemented yet)
design/               Design-tool guidance, briefs and rendered references
docs/                 Guidelines (see below)
scripts/              Workspace scripts (Flutter asset sync, Flutter raw-colour lint)
```

## Quick start

Requirements: Node ≥ 22.12, pnpm 10 (`corepack enable`), Flutter ≥ 3.47 for the mobile apps.
Full details: [docs/PROJECT_SETUP.md](docs/PROJECT_SETUP.md).

```bash
pnpm install
pnpm web-ui:build
pnpm admin:start                     # http://localhost:4200
cd apps/staff-mobile && flutter run  # or apps/customer-mobile

pnpm validate                        # tokens, contrast, assets, motion, admin lint/build/test
pnpm flutter:check                   # Flutter assets, lint, analyze, tests and goldens
```

## Brand at a glance

| Midnight Ink | Royal Violet | Saffron | Warm Coral | Mint | Pearl | Cloud | Slate |
|---|---|---|---|---|---|---|---|
| `#202039` | `#7564E8` | `#E9A23B` | `#E97861` | `#35B99A` | `#F7F5F0` | `#ECEBF1` | `#66677A` |

Plus Jakarta Sans for display, Inter for everything else (tabular numerals for numbers). Five
themes: `admin-light`, `admin-monitor`, `staff-light`, `staff-kitchen`, `customer-warm`.

## Documentation

| Document | Covers |
|---|---|
| [DESIGN.md](DESIGN.md) | Master reference: rules, values, surfaces, motion, themes, components, code |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Layers, platform parity, quality gates, change workflow |
| [BRAND_GUIDELINES.md](docs/BRAND_GUIDELINES.md) | Brand idea, voice, logo, colour, type, imagery |
| [DESIGN_TOKENS.md](docs/DESIGN_TOKENS.md) | Token layers, naming, outputs |
| [COMPONENT_GUIDELINES.md](docs/COMPONENT_GUIDELINES.md) | Component specifications |
| [ASSET_GUIDELINES.md](docs/ASSET_GUIDELINES.md) | Logo, icons, textures, platform usage |
| [ILLUSTRATION_GUIDELINES.md](docs/ILLUSTRATION_GUIDELINES.md) | Illustration style and scenes |
| [MOTION_GUIDELINES.md](docs/MOTION_GUIDELINES.md) | Motion principles, tokens, Lottie rules |
| [THEME_GUIDELINES.md](docs/THEME_GUIDELINES.md) | The five themes and when to use them |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Monorepo structure and decisions |
| [PROJECT_SETUP.md](docs/PROJECT_SETUP.md) | Install, build, validate, run |
| [ROADMAP.md](docs/ROADMAP.md) | Next steps and known limitations |
| [TOKEN_REFERENCE.md](docs/reference/TOKEN_REFERENCE.md) | Every token in every theme (generated) |
| [BOOTSTRAP_AUDIT.md](docs/reference/BOOTSTRAP_AUDIT.md) | Acceptance criteria, validation results and findings of the bootstrap audit |

## Licences

Inter and Plus Jakarta Sans are under the SIL Open Font License 1.1 (texts in
`packages/brand-assets/fonts/`). Lucide icons are ISC licensed. DOSA brand assets are proprietary
to the DOSA project.
