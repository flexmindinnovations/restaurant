# Brand

The logo, wordmark, lock-ups, favicon and app-icon masters are generated SVGs in
`packages/brand-assets/brand/` and `packages/brand-assets/icons/`. The full list with sizes and
usage is in [ASSET_INDEX.md](../../packages/brand-assets/ASSET_INDEX.md). Rules: [BRAND_GUIDELINES.md](../../docs/BRAND_GUIDELINES.md).

To change the mark, change `packages/brand-assets/scripts/generate-svg.mjs` (geometry lives there),
run `pnpm assets:generate && pnpm assets:validate`, then `pnpm icons:export` to refresh the
Android and iOS launcher icons, and `pnpm flutter:sync-assets`.

Launcher icons: Android uses the rounded-square master; iOS gets a full-bleed square (iOS applies
its own mask). Adaptive Android icons (separate foreground/background layers) are on the
[ROADMAP](../../docs/ROADMAP.md).
