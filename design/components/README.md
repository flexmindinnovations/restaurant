# Components

The specification for every component (anatomy, sizes, states, tokens, accessibility, motion,
Angular and Flutter mapping) is [docs/COMPONENT_GUIDELINES.md](../../docs/COMPONENT_GUIDELINES.md).
Design files for components belong here, built only from the token modes described in
[foundations/](../foundations/).

Implemented today: Angular Material components themed through the DOSA bridge
(`apps/admin-web/src/styles/_material-dosa.scss`); Flutter Material widgets themed by
`buildDosaTheme`; shared Flutter widgets `DosaGlass`, `DosaGrain`, `DosaMeshBackground`,
`DosaOrderStatusBadge`, `DosaLogo`, `DosaAnimatedIllustration`. See the renders in
[references/renders/](../references/renders/).

When a design needs a component state that the spec does not cover, update the spec first.
