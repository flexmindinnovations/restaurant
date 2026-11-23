# design/

Working area for designers and design tools. **Nothing here is a source of truth for code.**
Values live in `packages/design-tokens`, artwork in `packages/brand-assets`, animation in
`packages/motion-assets`, and rules in [DESIGN.md](../DESIGN.md). If a design file and the tokens
disagree, the tokens win and the design file is updated.

| Folder | Holds |
|---|---|
| [`foundations/`](foundations/) | How to bring DOSA tokens and fonts into a design tool |
| [`brand/`](brand/) | Pointers to the logo, app icon masters and their rules |
| [`components/`](components/) | Component design source files (when created) and the spec they follow |
| [`illustrations/`](illustrations/) | Illustration briefs and the process for adding a scene |
| [`animations/`](animations/) | Animation briefs and the process for adding a Lottie |
| [`references/`](references/) | Rendered references of the current system (`renders/`) for review and handoff |

Rules for files added here:
- Name files `area-topic-vN.ext` (e.g. `components-buttons-v2.fig`), no spaces.
- Large binaries (> 10 MB) go in the team's design storage; link them from a README instead.
- Exported artwork that ships must go through the generator scripts in `packages/`, not be copied
  from here.
