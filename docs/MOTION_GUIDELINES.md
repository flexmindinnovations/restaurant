# DOSA — Motion Guidelines

Motion in DOSA explains change. It never decorates and it never slows down a task.

## 1. Principles

1. **Purposeful:** every animation answers "what just changed?" (an order arrived, a payment
   cleared, a panel opened). If nothing changed, nothing moves.
2. **Fast at the point of work:** feedback on input is ≤ 180ms; nothing blocks input while it plays.
   Staff can tap the next action before a status animation finishes.
3. **Calm:** no continuous motion except genuinely ongoing states (preparing, loading, live).
   Idle loops on empty states are slow (3.6s), small in amplitude (≤ 4px, ≤ 12°) and optional.
4. **Consistent physics:** one easing family, one set of durations (tokens). Things enter with
   deceleration and leave faster with acceleration.
5. **Respect the user:** `prefers-reduced-motion` / OS "reduce motion" collapses all non-essential
   motion to an instant state change and swaps Lottie for its static SVG fallback.

## 2. Tokens

| Token | Value | Use |
|---|---:|---|
| `motion.duration.instant` | 80ms | checkbox tick, ripple start |
| `motion.duration.fast` | 120ms | hover/press (lower bound), exit of small elements |
| `motion.duration.quick` | 160ms | hover/press default, icon swaps |
| `motion.duration.moderate` | 200ms | tabs, dropdowns, navigation, tooltips |
| `motion.duration.base` | 240ms | dialogs and drawers entering, page transitions |
| `motion.duration.slow` | 280ms | bottom sheets, large surfaces |
| `motion.duration.deliberate` | 400ms | order status change emphasis |
| `motion.duration.chart` | 600ms | chart first draw (once) |
| `motion.duration.ambient` | 1200ms | skeleton shimmer cycle, live pulse |

| Easing | Curve | Use |
|---|---|---|
| `standard` | `cubic-bezier(0.2, 0, 0, 1)` | anything moving between two on-screen states |
| `decelerate` | `cubic-bezier(0, 0, 0, 1)` | entering |
| `accelerate` | `cubic-bezier(0.3, 0, 1, 1)` | leaving (pair with ~70% of the enter duration) |
| `emphasized` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | status changes, success moments, sheets |
| `linear` | `cubic-bezier(0, 0, 1, 1)` | progress, shimmer, rotation only |

Ranges from the brief are honoured: hover/press 120–180ms; navigation 180–250ms; modals 200–280ms.

## 3. Choosing a technique

| Need | Use | Why |
|---|---|---|
| Hover, press, focus, enter/exit, skeletons, live dot | **CSS** (`packages/motion-assets/css/dosa-motion.css`) / Flutter implicit animations | Cheapest, crisp, token-driven, no asset |
| Illustrative status moments (order ready, payment success, onboarding) | **Lottie** (`packages/motion-assets/lottie/{light,dark}`) | Vector, small (2.5–12 KB), identical on web and Flutter |
| Interactive, state-machine characters (future onboarding mascot, gamified loyalty) | **Rive** — *not used yet* | `.riv` is a binary authored in the Rive editor; it cannot be produced or verified from code. Evaluate when a designer owns it (see ROADMAP). |
| Simple icon state change | Icon swap with 160ms cross-fade | Don't animate Lucide paths |

## 4. The animation library

All 10 files exist in light and dark variants, are generated from
`packages/motion-assets/scripts/animations.mjs`, run at 60fps on a 240×180 artboard, and are
verified by rendering every frame range in lottie-web (Chromium) **and** parsing with the Flutter
`lottie` package (no warnings).

| Animation | Duration | Loop | Poster (static fallback) | Use |
|---|---:|:---:|---|---|
| `order-received` | 1.40s | – | end | New order arrives |
| `order-accepted` | 1.20s | – | end | Order accepted |
| `food-preparation` | 2.00s | ✓ | mid | While status = preparing |
| `order-ready` | 1.40s | – | end | Ready to serve / collect |
| `payment-success` | 1.60s | – | end | Payment confirmed |
| `empty-orders` | 3.60s | ✓ (idle) | start | No orders |
| `empty-reservations` | 3.60s | ✓ (idle) | start | No bookings |
| `loading-processing` | 1.20s | ✓ | start | Indeterminate work > 1s |
| `sync-success` | 1.50s | – | end | Sync / offline queue flushed |
| `restaurant-onboarding` | 2.20s | – | end | First-run welcome |

Static fallbacks (`packages/motion-assets/fallbacks/{light,dark}/*.svg`) are the poster frame
exported from the real Lottie render, so the fallback always matches the animation.

### Rules for Lottie
- Play once for events; hold the final frame. Only `food-preparation`, `loading-processing` and
  idle empty states loop.
- Never more than **one** Lottie playing in a viewport region; never in list rows.
- Size: 120–240px wide on mobile, ≤ 320px on web.
- Don't block: actions are available while an animation plays; navigation never waits for it.
- Pair with text (the animation is not the message) and mark decorative instances as hidden from
  assistive tech.
- Load lazily (web: `lottie_light` SVG renderer ≈ 160 KB once, per-file 2.5–12 KB).

## 5. Interaction patterns

| Pattern | Spec |
|---|---|
| Button press | scale 0.98, 120ms `standard`; release 160ms |
| Card hover (web) | translateY −2px + `shadow.2`, 160ms |
| Dropdown / menu | fade + 4px rise, 200ms `decelerate`; close 140ms `accelerate` |
| Dialog | scrim fade 200ms; panel scale 0.96→1 + fade, 240ms `emphasized` |
| Drawer / bottom sheet | translate from edge, 240ms / 280ms `emphasized`; close 200ms `accelerate` |
| Tabs / segmented | indicator slides 200ms `standard`; content cross-fade 160ms |
| Toast | rise 8px + fade 240ms; auto-dismiss 5s (errors persist); exit 160ms |
| Order status change | row/card highlight sweep (`dosa-status-changed`, 2 × 400ms) + status badge colour cross-fade 200ms; kitchen: optional `order-received` Lottie in the queue header only |
| Metric update | value ticks in (`dosa-value-updated`, 200ms `emphasized`); never count-up animations on operational screens |
| Charts | draw once on first load (600ms); data refreshes update without animation |
| Live indicator | mint dot with 1.2s halo pulse; reduced motion → static halo ring |
| Loading | skeletons for content (shimmer 1.2s); spinner only inside buttons/inline; Lottie loader only for > 1s blocking work |

## 6. Reduced motion

| Platform | Detection | Behaviour |
|---|---|---|
| Web | `@media (prefers-reduced-motion: reduce)` | `dosa-motion.css` swaps animations for 1ms fades, removes shimmer, freezes live pulse to a static ring; `web-ui` base layer applies a global safety net; Lottie components must render the fallback SVG instead. |
| Flutter | `MediaQuery.disableAnimationsOf(context)` → `DosaMotion.reduced(context)` | `DosaAnimatedIllustration` shows the fallback SVG; use `DosaMotion.duration(context, token)` for implicit animations (returns zero). |

Essential motion that conveys progress (a spinner inside a busy button) remains, slowed to 2.4s.

## 7. Performance budget

- Animate only `transform` and `opacity` on web; never animate `backdrop-filter`, `box-shadow` on
  many elements, or layout properties.
- No animation runs while hidden (`IntersectionObserver` / Flutter `TickerMode`).
- Lottie files ≤ 15 KB, ≤ 12 layers, no masks/mattes/expressions/images (all current files comply).
- Staff app on low-end Android: disable glass blur via `DosaGlassScope(enabled: false)` before
  removing motion.
