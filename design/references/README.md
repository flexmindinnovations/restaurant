# References

`renders/` holds reduced WebP renders of the current system for review and handoff. They are
regenerated from the real apps and specimen site, not drawn:

| File | Source |
|---|---|
| `admin-web-light.webp`, `admin-web-monitor.webp` | `apps/admin-web` foundations page in Chromium |
| `staff-light.webp`, `staff-kitchen.webp` | Golden tests in `apps/staff-mobile/test/goldens` |
| `customer-warm.webp` | Golden test in `apps/customer-mobile/test/goldens` |
| `specimen-*.webp` | `packages/documentation` specimen site (`pnpm docs:build`) |

Flutter goldens come from the headless test renderer, which does not apply blur: glass and
shadows look sharper there than on a device.
