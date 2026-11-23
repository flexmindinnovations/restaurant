# DOSA staff app (`dosa_staff`)

Kitchen, servers and managers on Android and iOS phones and tablets. Built with Flutter on the shared `dosa_ui` package (`../../packages/flutter-ui`).

**Status:** app shell and a foundations check screen. There are no product screens, order
workflows, authentication or API calls yet. That is intentional for this phase.

## What is here

| Path | Purpose |
|---|---|
| `lib/main.dart` | Entry point |
| `lib/src/app.dart` | `MaterialApp` with `buildDosaTheme(...)`. Theme: `staff-light` by default; `staff-kitchen` (dark) is a user toggle. |
| `lib/src/foundations_screen.dart` | Check screen: Order status badges, a kitchen ticket with a tabular timer, primary/tonal/outlined actions, a kitchen-mode switch, standard glass and the `food-preparation` Lottie. |
| `test/app_test.dart` | Theme, accessibility and golden tests |
| `test/goldens/` | Reference renders (`staff-light.png` and `staff-kitchen.png`) |

## Commands

```bash
flutter pub get
flutter analyze
flutter test                    # includes golden comparisons
flutter test --update-goldens   # after an intentional visual change; review the PNG diff
flutter run                     # on a device or simulator
```

Golden note: the headless test renderer does not apply blur (glass `BackdropFilter` and shadow
blur render sharp). Goldens check layout, colour, type and icons; judge blur on a device.

## Rules

- Read colours from `DosaTheme.of(context)` and sizes from `DosaSpace`, `DosaRadius`, `DosaSize`,
  `DosaTypeScale`. Never type a `Color(0x...)` or a raw font size in app code.
- Icons: `lucide_icons_flutter` (`LucideIcons.*`).
- Shared widgets (`DosaGlass`, `DosaMeshBackground`, `DosaOrderStatusBadge`, `DosaLogo`,
  `DosaAnimatedIllustration`) come from `dosa_ui`; add new shared widgets there, not here.
- See [DESIGN.md](../../DESIGN.md) and [docs/COMPONENT_GUIDELINES.md](../../docs/COMPONENT_GUIDELINES.md).
