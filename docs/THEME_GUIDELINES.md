# DOSA — Theme Guidelines

One brand, five environments. Every theme exposes the **same semantic token keys** (enforced by
the token build), so a component written once against `color.surface.primary` works everywhere.

| Theme id | App / context | Scheme | Character |
|---|---|---|---|
| `admin-light` | Web admin (default) | light | Pearl canvas, white surfaces, Midnight Ink type, Violet actions, Saffron highlights. |
| `admin-monitor` | Web admin: CCTV & live monitoring | dark | Deepest night canvas (`ink.975`), charcoal panels, high-contrast controls, Mint live dots, Coral critical alerts. |
| `staff-light` | Staff mobile (default) | light | Admin palette with darker secondary text (`ink.700`) and firmer borders for glanceability. |
| `staff-kitchen` | Staff mobile: optional kitchen / night mode | dark | Reduced glare, brighter secondary text (`ink.200`), firmer borders, saturated order statuses. |
| `customer-warm` | Customer mobile | light | Pearl + Saffron-50 surfaces, warm mesh, Coral-tinted brand panels, Saffron "Add to order" CTA. Violet stays for focus and selection. |

## 1. Switching themes

**Web:** set the attribute on any element; everything inside re-themes at runtime.

```html
<html data-dosa-theme="admin-light">
  …
  <section data-dosa-theme="admin-monitor"> <!-- CCTV wall inside the light admin --> </section>
</html>
```

`color-scheme` is set by each theme block, so native scrollbars and form controls follow.

**Flutter:**

```dart
MaterialApp(
  theme: buildDosaTheme(DosaThemeTokens.staffLight),
  darkTheme: buildDosaTheme(DosaThemeTokens.staffKitchen),
  themeMode: kitchenMode ? ThemeMode.dark : ThemeMode.light,
);
// In widgets:
final t = DosaTheme.of(context);
Container(color: t.surfacePrimary);
```

## 2. What may differ between themes

| Allowed to vary | Must stay identical |
|---|---|
| Surface/canvas tones, border strength, text-secondary tone | Brand colours and their roles (Violet = action/intelligence, Mint = success/live, Coral = error/critical, Saffron = warning/highlight) |
| Glass tint and mesh blob colours | Order-status hue per state (`color.order.*` keeps its hue family in every theme) |
| Grain opacity and blend mode | Typography, spacing, radii, motion |
| Shadow colour (ink on light, black on dark) | Iconography and illustration style |

A theme override may only reference palette primitives. Introducing a new hex value requires a
primitive change reviewed against [BRAND_GUIDELINES.md](BRAND_GUIDELINES.md).

## 3. Dark themes: specific rules

1. Never pure black canvases. Use `ink.950` / `ink.975` (Midnight-tinted night), which keeps the
   identity recognisable and reduces halation.
2. Elevation reads through **lighter surfaces** (`ink.900 → ink.850`) plus borders
   (`white @ 8–16%`), not through shadows alone.
3. Accent colours step **lighter** (violet.400, mint.300 for text) to keep ≥ 4.5:1.
4. Filled primary buttons keep `violet.650` with white text in every theme (5.37:1).
5. Live video (CCTV) tiles sit on `surface.primary` with a 1px `color.border.subtle`; overlays on video
   use Dark Glass with ≥ 4.5:1 text.

## 4. Choosing the theme per surface

- Admin: `admin-light` everywhere except the Monitoring module (`admin-monitor`), which may also be
  applied to a single panel embedded in a light page.
- Staff: `staff-light` by default; `staff-kitchen` is a user toggle and may default on for the
  Kitchen role (decided per device, persisted locally).
- Customer: `customer-warm` only. System dark mode is **not** honoured in this phase; food
  photography reads better on warm light surfaces (revisit in [ROADMAP.md](ROADMAP.md)).

## 5. Verification

`pnpm tokens:check` validates 41 contrast pairs per theme (205 total) and fails the build on any
regression. The full table is printed with `pnpm --filter @dosa/design-tokens report`.
