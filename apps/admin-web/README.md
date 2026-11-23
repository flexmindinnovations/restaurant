# @dosa/admin-web

DOSA web admin: Angular 22 + Angular Material 22, themed only through DOSA tokens.

**Status:** application shell and a foundations check page. There are no product screens, order
workflows, authentication or API calls yet. That is intentional for this phase.

## What is here

| Path | Purpose |
|---|---|
| `src/styles/_material-dosa.scss` | Bridge that points every Material `--mat-sys-*` variable (colour, type, shape, elevation) at a `--dosa-*` variable, plus DOSA component overrides (8px buttons, 40px fields) |
| `src/styles.scss` | Applies the bridge on `<html>` |
| `src/app/core/dosa-theme.ts` | `DosaThemeService`: sets `data-dosa-theme` (`admin-light` / `admin-monitor`) and remembers the choice |
| `src/app/shell/` | Glass top bar, sidebar, content frame |
| `src/app/ui/dosa-icon.ts` | Lucide icon component (`lucide-static`), token-sized |
| `src/app/foundations/` | Check page: Material controls, order status badges, metric cards, premium glass, empty state |
| `scripts/check-raw-values.mjs` | Lint step that fails on raw hex / `rgb()` / `hsl()` colours in `src/` |

`@dosa/web-ui/dist/dosa.css` (tokens, fonts, base, glass, grain, gradients, motion) is loaded
before `styles.scss` in `angular.json`. Logo, favicon and illustrations are copied from
`@dosa/brand-assets` at build time.

## Commands (from the repository root)

```bash
pnpm web-ui:build   # once, and after token or web-ui changes
pnpm admin:start    # dev server on http://localhost:4200
pnpm admin:lint     # ESLint (angular-eslint, template a11y) + raw colour check
pnpm admin:test     # Vitest unit tests
pnpm admin:build    # production build into apps/admin-web/dist
```

## Rules

- Use `var(--dosa-…)` in styles. Never type a hex colour, font size or duration.
- Use Material components; restyle them through tokens in `_material-dosa.scss`, not per page.
- Icons come from Lucide via `<dosa-icon>`. Do not load Material Icons.
- See [DESIGN.md](../../DESIGN.md) and [docs/COMPONENT_GUIDELINES.md](../../docs/COMPONENT_GUIDELINES.md).
