# Foundations in design tools

**Tokens.** Import the generated, fully resolved theme files (W3C Design Tokens format, one per
theme) into a token plugin such as Tokens Studio:

- `packages/design-tokens/dist/json/primitives.json`
- `packages/design-tokens/dist/json/admin-light.json`, `admin-monitor.json`, `staff-light.json`,
  `staff-kitchen.json`, `customer-warm.json`

Create one mode per theme. Use the semantic names (`color.surface.primary`) in components, never
primitives. Every value with descriptions: [TOKEN_REFERENCE.md](../../docs/reference/TOKEN_REFERENCE.md).

**Fonts.** Install the variable TTFs from `packages/brand-assets/fonts/` (Inter, Plus Jakarta Sans;
SIL OFL 1.1). Turn on tabular figures (`tnum`) for any number text style.

**Grids.** 4px base. Frames: 390×844 (phones), 834×1194 (tablets), 1440×1024 (admin). Columns and
gutters per [DESIGN.md §4](../../DESIGN.md#4-layout-and-shape).

**Glass, grain, gradients.** Recreate with the values in
[DESIGN.md §6](../../DESIGN.md#6-surfaces-glass-grain-gradients-light): background blur equals the
token in px, tint fill at the stated opacity, 1px inside stroke. Use the grain tile
`packages/brand-assets/textures/paper-grain-256.png` as a pattern fill at 3.5% (light, multiply)
or 4% (dark, soft light).
