# Font provenance and licensing

| Family | File | Version | Axes | Licence | Source |
|---|---|---|---|---|---|
| Inter | `inter/InterVariable.ttf` | 4.001 (git-66647c0bb) | `opsz` 14–32, `wght` 100–900 | SIL OFL 1.1 (`inter/OFL.txt`) | github.com/google/fonts `ofl/inter/Inter[opsz,wght].ttf` @ `06bfe0d6` (2026-11-20) |
| Plus Jakarta Sans | `plus-jakarta-sans/PlusJakartaSansVariable.ttf` | 2.071 | `wght` 200–800 | SIL OFL 1.1 (`plus-jakarta-sans/OFL.txt`) | github.com/google/fonts `ofl/plusjakartasans/PlusJakartaSans[wght].ttf` @ `06bfe0d6` |

**Licence summary (not legal advice):** OFL 1.1 permits use, bundling and embedding in commercial
apps and websites. The font files may not be sold on their own, and the `OFL.txt` notice must travel
with them. Modified versions (our `-latin.woff2` subsets) may not use a Reserved Font Name; neither
family declares one in its OFL notice, so subsets keep their names.

## Derived files

`*-latin.woff2` are subsets for the web: Latin, Latin Extended, general punctuation, currency
symbols (incl. ₹ U+20B9 and € U+20AC), arrows, minus sign. All OpenType layout features are kept
(verified `tnum` present). Regenerate:

```bash
pip install fonttools brotli
U="U+0000-00FF,U+0100-024F,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+2113,U+2122,U+2190-2199,U+2212,U+2215,U+FEFF,U+FFFD"
pyftsubset inter/InterVariable.ttf --unicodes="$U" --layout-features='*' --flavor=woff2 --output-file=inter/InterVariable-latin.woff2
pyftsubset plus-jakarta-sans/PlusJakartaSansVariable.ttf --unicodes="$U" --layout-features='*' --flavor=woff2 --output-file=plus-jakarta-sans/PlusJakartaSansVariable-latin.woff2
```

Flutter bundles the full `.ttf` files (copied into `packages/flutter-ui/fonts/` by
`pnpm --filter @dosa/brand-assets fonts:sync`; `validate` fails if the copies drift).
Italics are intentionally not shipped: the DOSA UI does not use italic text.

## Verified OpenType features

- Inter: `tnum`, `pnum`, `zero` (slashed zero), `cv05` (l with tail), `cv08` (serifed I), `case`, `ss01–ss08`.
- Plus Jakarta Sans: `tnum`, `pnum`, `case`, `ss01–ss03`.
