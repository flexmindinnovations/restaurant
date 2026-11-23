# DOSA — Roadmap

What exists after the bootstrap, what is deliberately left out, and what comes next. Dates are
not committed; order reflects dependency.

## Done in the bootstrap (v0.1, 2026-11-23)

- Canonical W3C tokens → CSS, SCSS, TypeScript, JSON, Dart and a generated token reference;
  5 themes; 205 automated contrast checks.
- Fonts (Inter, Plus Jakarta Sans), type scale with tabular numerals, glass (4 variants with
  fallbacks), paper grain, 4 gradients, ambient mesh, elevation — on web and Flutter.
- Logo, wordmark, lock-ups, favicon, 3 app-icon masters, rendered Android and iOS launcher icons.
- 23 illustrations × light/dark; 10 Lottie animations × light/dark with static SVG fallbacks.
- Component specifications for about 30 components; master DESIGN.md and 11 guideline docs.
- Angular 22 + Material admin shell themed through a token bridge; staff and customer Flutter
  apps on `dosa_ui`; unit, widget and golden tests; raw-colour lint on web and Flutter.

## Next: foundations hardening

| Item | Why |
|---|---|
| CI pipeline running `pnpm validate` and `pnpm flutter:check` on every pull request | Today these run locally only |
| Android adaptive launcher icons (foreground + background layers) and a web app manifest | Current Android icon is the legacy single-layer PNG |
| Symbol variant tuned for 16–23px | The spark merges into the D below 24px; the favicon covers browsers only |
| Angular component wrappers (`dosa-status-badge`, `dosa-metric-card`, `dosa-empty-state`, `dosa-glass-panel`) | The admin foundations page shows the patterns inline; product screens need reusable components |
| Lottie playback component for Angular (lazy `lottie_light`, reduced-motion fallback) | Motion spec exists; the web player is not wired into the admin yet |
| Responsive admin shell (navigation rail at 905–1239px, drawer below 905px) | Shell currently shows the expanded sidebar only |
| Visual regression for web (Playwright screenshots in CI) | Flutter has goldens; web relies on manual screenshot review |
| Localisation setup (Angular i18n, Flutter `gen-l10n`) | Labels such as order states are English defaults |

## Then: product phase 1

1. Backend skeleton per [backend/api/README.md](../backend/api/README.md): NestJS, PostgreSQL,
   auth, `restaurants`/`menu`/`tables`/`orders`, WebSocket gateway, OpenAPI with generated TS and
   Dart clients.
2. Staff app: order queue, kitchen tickets with timers, status changes over WebSockets,
   offline queue with `sync-success`.
3. Customer app: menu, cart, order tracking (stepper), payment.
4. Admin: live orders board, menu management, reports with the chart palette.

## Later

| Item | Notes |
|---|---|
| Rive for interactive moments (onboarding mascot, loyalty) | Needs a designer working in the Rive editor; `.riv` files cannot be authored or verified from code. Must ship with the same static fallbacks and reduced-motion behaviour as Lottie. |
| Customer dark mode | Not honoured in this phase because food photography reads better on warm light surfaces. Revisit with real photography and a `customer-night` theme. |
| Multi-branch UI | API carries `branchId` from day one; UI adds a branch switcher, not new themes. |
| Monitoring wall (CCTV) | `admin-monitor` theme and Dark Glass are ready; video integration is a separate decision. |
| Publishing `@dosa/*` packages | Only if another repository needs them; semantic versioning rules are in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). |
| Nx or Turborepo | Add when build times or the number of packages justify caching ([ARCHITECTURE.md D1](ARCHITECTURE.md)). |

## Known limitations today

- Flutter goldens come from the headless test renderer, which does not apply blur.
- Admin production bundle is about 600 KB raw / 127 KB transferred (budget raised to 700 KB
  warning); revisit when real screens arrive.
- Illustrations exclude people by design in this phase.
