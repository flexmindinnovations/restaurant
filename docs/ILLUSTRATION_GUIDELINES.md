# DOSA — Illustration Guidelines

The library: `packages/brand-assets/illustrations/{light,dark}/*.svg` — 23 original scenes, each in a
light- and dark-surface version (46 files). Generated from `packages/brand-assets/scripts/illustrations.mjs`.

## 1. Style in one sentence

**Flat shapes with a single confident ink outline, soft brand tints, a calm halo behind, a ground
shadow below, and exactly one violet spark — DOSA's mark of intelligence.**

## 2. Measurable rules

| Property | Rule |
|---|---|
| Artboard | 240 × 180 (4:3). Content inside a 16px safe area. Scales cleanly from 96px to 960px wide. |
| Outline | 2px at artboard scale, `ink` role, round caps and joins. Secondary details 1.5–1.75px in `muted`. Never thicker than 6px (handles, magnifier). |
| Fills | Flat, from the role palette only (`paper`, `cloud`, brand + brand-soft). No gradients inside illustrations (app icons excepted), no filters, no blur, no rasters. |
| Halo | One organic blob behind the subject (`halo` role, violet-50 on light). Feature scenes use the neutral halo; empty states use a larger, calmer halo; success uses mint-soft, warnings saffron-soft, errors coral-soft. On dark, tinted halos drop to 50% opacity. |
| Ground | Soft ellipse shadow at y≈150–158, 5–6px tall, no outline. Objects sit on it, they do not float (exceptions: sparks, steam, pins). |
| Light | Implied from the top-left; highlights (when used) go on the upper-left of forms. |
| Signature | Exactly one Royal Violet spark per scene (concave 4-point star, r 6–9). Celebration scenes may add ≤ 3 small secondary sparkles in Saffron/Coral/Mint. |
| Food | The dosa motif is a golden Saffron roll/crepe with darker saffron-600 ridges. Chutney bowls in Mint/Saffron. Food is appetising: warm colours, never grey. |
| People | Not depicted in this phase (avoids representation pitfalls and keeps the set geometric). If added later: no faces with features, simple rounded forms, diverse skin tones from a defined ramp. |
| Complexity | ≤ ~40 elements, ≤ 8 KB per file (validated). |

## 3. Colour roles

| Role | Light | Dark | Used for |
|---|---|---|---|
| `ink` | `#202039` | `#EBEBF3` | outlines, key detail |
| `muted` | `#66677A` | `#A2A3B4` | secondary lines, steam, routes |
| `paper` | `#FFFFFF` | `#2B2B45` | object bodies |
| `cloud` | `#ECEBF1` | `#373750` | secondary bodies |
| `halo` | `#F3F4FF` | `#202039` | backdrop blob |
| `violet` / `violetSoft` | `#7564E8` / `#D6D6FF` | `#A6A2FF` / `#4530A0` | spark, intelligence, selection |
| `saffron` / `saffronSoft` | `#E9A23B` / `#FFE9C8` | `#E9A23B` / `#6E3A00` | food, warmth, warnings |
| `coral` / `coralSoft` | `#E97861` / `#FFE4DB` | `#F89682` / `#802918` | urgency, errors, awnings |
| `mint` / `mintSoft` | `#35B99A` / `#CFF5E9` | `#35B99A` / `#00543F` | success, freshness |
| `sky` / `skySoft` | `#3C83CE` / `#D8EEFF` | `#68A2E3` / `#00417C` | information, "received" |

The dark set is not an inversion: outlines flip to near-white, bodies become raised night surfaces,
and brand hues step to their accessible dark-theme values.

## 4. The library

| Scene | Group | Typical placement |
|---|---|---|
| `restaurant` | feature | Onboarding, branch setup, about |
| `kitchen-workflow` | feature | KDS onboarding, staff help |
| `food-preparation` | feature | Order tracker "preparing", menu builder intro |
| `dining-table` | feature | Table management, dine-in flow |
| `order-processing` | feature | Order pipeline explainer |
| `online-ordering` | feature | Customer app onboarding, online ordering setup |
| `payment-checkout` | feature | Payments settings, checkout intro |
| `delivery-pickup` | feature | Delivery/pickup selection, tracking |
| `analytics-intelligence` | feature | Insights/forecast modules (pairs with Premium Glass) |
| `inventory` | feature | Inventory module empty/onboarding |
| `reservations` | feature | Reservations onboarding |
| `empty-orders` | empty | "No orders yet" (admin list, staff queue) |
| `empty-reservations` | empty | No bookings for the selected date |
| `empty-search` | empty | No search/filter results |
| `empty-notifications` | empty | All caught up |
| `empty-menu` | empty | Menu has no items |
| `offline` | empty | Connection lost; queued actions |
| `success-confirmation` | success | Generic success |
| `payment-success` | success | Payment confirmed |
| `order-ready` | success | Order ready for pickup/serving |
| `error-generic` | error | Unexpected failure |
| `warning` | error | Attention needed / delays |
| `not-found` | error | 404, missing record |

## 5. Usage rules

- **Size:** empty states 160–240px wide on mobile, 200–280px on web. Feature/onboarding up to 480px.
  Never below 96px — use an icon instead.
- **One per view.** Illustrations are punctuation, not decoration. Never in table rows, cards in a
  list, or next to every form section.
- **Always with text.** Pair every illustration with a heading and one sentence that says what
  happened and what to do next. The SVG's `<title>`/`<desc>` give it an accessible name; when the
  adjacent heading already says the same thing, render it with `alt=""`/`aria-hidden` to avoid
  double announcement.
- **Match the surface.** Use `dark/` on dark themes (`admin-monitor`, `staff-kitchen`).
- **Motion:** illustrations themselves are static. Animated counterparts live in
  `packages/motion-assets` and fall back to these SVGs (see [MOTION_GUIDELINES.md](MOTION_GUIDELINES.md)).

## 6. Adding a scene

1. Add an entry to `SCENES` in `scripts/illustrations.mjs` using only `svg-kit.mjs` primitives.
2. Keep to the rules above; reuse `plate`, `dosaRoll`, `ticket`, `phone`, `pin`, `check`, `steam`.
3. Run the generator and `pnpm assets:validate`, then review both modes in the documentation
   specimen (`pnpm docs:build`, open `packages/documentation/dist/illustrations.html`).
