# DOSA — Project Setup

How to install, build, validate and run everything in this repository. Commands run from the
repository root unless stated otherwise.

## 1. Requirements

| Tool | Version used | Needed for |
|---|---|---|
| Node.js | ≥ 22.12 (22.23 tested) | Everything on the web side, generators, validators |
| pnpm | 10.28 (`packageManager` field; `corepack enable` installs it) | Workspace install and scripts |
| Flutter | ≥ 3.47 with Dart ≥ 3.13 (3.50.1 tested) | `packages/flutter-ui`, `apps/staff-mobile`, `apps/customer-mobile` |
| Playwright + Chromium | 1.5x with its Chromium | `pnpm motion:validate`, `pnpm icons:export`, documentation screenshots |
| Python 3 + numpy, Pillow, fonttools | 3.13 tested | Only to regenerate the grain texture, font subsets or the outlined wordmark |
| Xcode / Android Studio | current | Only to run the mobile apps on simulators or devices |

Playwright is not a workspace dependency (CI images ship it preinstalled, and a second copy would
not find that browser). The scripts call `require('playwright')`, so on a fresh machine install it
once globally and expose it: `npm i -g playwright && npx playwright install chromium`, then
`export NODE_PATH="$(npm root -g)"`.

## 2. Install

```bash
corepack enable
pnpm install
pnpm tokens:build        # generated token outputs (committed; this verifies they are current)
pnpm web-ui:build        # packages/web-ui/dist/dosa.css + fonts and textures (not committed)

cd packages/flutter-ui && flutter pub get && cd -
cd apps/staff-mobile && flutter pub get && cd -
cd apps/customer-mobile && flutter pub get && cd -
```

pnpm may report ignored build scripts (esbuild, lmdb, @parcel/watcher). The Angular build works
without them because esbuild ships platform binaries as optional packages.

## 3. Everyday commands

| Command | What it does |
|---|---|
| `pnpm admin:start` | Admin web dev server on http://localhost:4200 (run `pnpm web-ui:build` first) |
| `pnpm admin:build` / `admin:test` / `admin:lint` | Production build, Vitest unit tests, ESLint + raw-colour check |
| `pnpm docs:build` | Builds the specimen site into `packages/documentation/dist` (open `index.html`, `illustrations.html`, `motion.html`) |
| `pnpm --filter @dosa/documentation screenshot` | Screenshots the specimen in every theme; fails on missing files, console errors or unloaded fonts |
| `cd apps/staff-mobile && flutter run` | Staff app on a device or simulator (same for `customer-mobile`) |

## 4. Validation

```bash
pnpm validate        # tokens + contrast, SVG assets, Lottie, web-ui, admin lint, build and tests
pnpm flutter:check   # Flutter asset copies, raw-colour lint, analyze + tests (package and both apps)
```

`pnpm validate` runs, in order: `tokens:check` (integrity, 205 contrast checks, generated files
up to date), `assets:validate` (59 SVGs), `motion:validate` (renders 20 Lottie files in Chromium),
`web-ui:build`, `admin:lint`, `admin:build`, `admin:test`.

`pnpm flutter:check` runs `flutter:check-assets`, `flutter:lint-colors`, then `flutter analyze`
and `flutter test` in `packages/flutter-ui`, `apps/staff-mobile` and `apps/customer-mobile`.
App tests include golden images in `test/goldens/`. After an intentional visual change run
`flutter test --update-goldens` in that app and review the image diff in the pull request. The
headless renderer does not apply blur, so goldens show glass and shadows sharper than a device.

## 5. Changing the design system

| You want to change | Edit | Then run |
|---|---|---|
| A colour, size, type style, duration, theme value | `packages/design-tokens/src/**` | `pnpm tokens:build`, `pnpm validate`, `pnpm flutter:check` |
| Glass, grain, gradient or base CSS | `packages/web-ui/src/*.css` | `pnpm web-ui:build` |
| Flutter theme mapping or shared widgets | `packages/flutter-ui/lib/src/**` | `pnpm flutter:check` |
| Logo, icons, illustrations | `packages/brand-assets/scripts/*` | `pnpm assets:generate`, `pnpm assets:validate`, `pnpm flutter:sync-assets` |
| Lottie animations | `packages/motion-assets/scripts/animations.mjs` | `pnpm motion:generate`, `node packages/motion-assets/scripts/verify.mjs --export`, `pnpm motion:validate`, `pnpm flutter:sync-assets` |
| Material mapping in admin | `apps/admin-web/src/styles/_material-dosa.scss` | `pnpm admin:build` |

Never edit generated files (they start with `DO NOT EDIT`): `packages/design-tokens/dist/**`,
`packages/flutter-ui/lib/src/tokens/dosa_tokens.g.dart`, `docs/reference/TOKEN_REFERENCE.md`, and
the copies under `packages/flutter-ui/assets` and `fonts`.

## 6. App icons

The 1024px SVG masters live in `packages/brand-assets/icons/app/`. `pnpm icons:export` renders
them with Chromium into:

- Android: `apps/*/android/app/src/main/res/mipmap-{mdpi…xxxhdpi}/ic_launcher.png` (48–192px,
  rounded square with transparent corners).
- iOS: every PNG in `apps/*/ios/Runner/Assets.xcassets/AppIcon.appiconset/` (full-bleed square,
  no alpha channel, because iOS applies its own mask).

The admin web uses `favicon.svg` directly. Android adaptive icons (separate foreground and
background layers) and a web app manifest are on the [ROADMAP](ROADMAP.md).

## 7. Raw-value lint

Application code may not contain raw colours ([ARCHITECTURE.md §4](ARCHITECTURE.md)).

- Web: `apps/admin-web/scripts/check-raw-values.mjs` fails on hex colours and `rgb()`, `hsl()`,
  `oklch()` in `apps/admin-web/src` (part of `pnpm admin:lint`).
- Flutter: `scripts/check-flutter-raw-values.mjs` fails on `Color(0x…)`, `Color.fromARGB/RGBO`
  and Material `Colors.*` (except `Colors.transparent`) in both apps' `lib/`.

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| Admin build cannot find `@dosa/web-ui/dist/dosa.css` | Run `pnpm web-ui:build` |
| `tokens:check` says generated files are out of date | Run `pnpm tokens:build` and commit the outputs |
| `flutter:check-assets` reports drift | Run `pnpm flutter:sync-assets` |
| Flutter warns about running as root | Harmless in containers; run as a normal user locally |
| `motion:validate` cannot launch a browser | Install Chromium for Playwright (see §1) |
