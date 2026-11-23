# Animations

The 10 Lottie animations (light and dark) are authored as code in
`packages/motion-assets/scripts/animations.mjs` and verified by rendering every frame in
lottie-web and parsing them with Flutter `lottie`. Rules: [MOTION_GUIDELINES.md](../../docs/MOTION_GUIDELINES.md).

Adding or changing an animation:
1. Write a brief here: the event it explains, duration (token), loop or play-once, poster frame.
2. Implement it in `animations.mjs`, then `pnpm motion:generate`,
   `node packages/motion-assets/scripts/verify.mjs --export` (refreshes static fallbacks) and
   `pnpm motion:validate`.
3. `pnpm flutter:sync-assets`.

Files exported from After Effects (Bodymovin) are accepted only if they pass the same validation:
≤ 15 KB, ≤ 12 layers, no masks, mattes, expressions or images, palette colours only, with a
light and a dark version. Rive is not used yet (see the ROADMAP).
