# Timeline Card Architecture

This is the standing information architecture for every timeline in Game Archive.
Change it only when the archive owner explicitly requests a new rule.

## Level 1: Timeline Card

Answers: when did it appear, what is it, and where does it belong?

Required structure: date, category tag, title, subtitle, short lineage note,
and a concise hint about the next level. Artwork is optional.

All timelines render this structure through the shared Level 1 card component
in `common/app.js`. Timeline folders provide content and theme tokens only.
Hardware and game-series cards must not fork their DOM hierarchy, keyboard
interaction, truncation rules, artwork bounds, hover state, or selected state.
Date precision remains a timeline-level data rule: hardware currently displays
year and month, while game releases may display a verified full date.
Managed local artwork is always preferred. Hardware cards with an empty GM
image record may lazily resolve the timeline's curated source mapping so the
card does not lose its image while local media is still being collected.

Game-series timelines use two recognition milestone types: `domestic` identifies the work
that established broad recognition in the series' home market, while `global`
identifies international expansion or a later worldwide breakthrough. Every
long-running series must contain at least one of each type. A single work may
carry both milestones, but they remain separate markers with separate
explanations.

Use an optional `integration` marker when a timeline crosses a documented
company merger, studio consolidation, or project-team integration. Attach it
to the first release after that organizational event only when both the event
date and the release relationship are verifiable. Its note must distinguish
"first release in this timeline after the integration" from stronger claims
such as "the companies' first product" or "the teams' first fully shared
design", unless those stronger claims have direct evidence.

Every `integration` marker stores the effective organizational date as
`eventDate` in `YYYY.MM.DD` format. The release-data audit verifies that the
marked card is the first timeline entry on or after that date. Timelines without
a qualifying documented event keep this marker absent rather than substituting
a publisher change, joint marketing arrangement, or brand-management company.

Milestone markers sit between the card and timeline axis, never inside card
content. Their hover/focus notes state the milestone type, concrete
achievement, and evidence used for the editorial judgment. Multiple milestones
of the same type are allowed when they describe distinct later breakthroughs;
popularity alone is not sufficient.

## Level 2: Series Reading Card

Answers: how should a player or developer understand this entry within its
series?

Every timeline uses one connected detail flyout containing a compact stack of
`.timeline-information-card` sections. A timeline may vary the information
inside those sections, but it must not create a second flyout, a different
container hierarchy, or separate scrolling behavior for later levels.

Show these categories in a compact, high-signal form: series positioning, core
experience and player motivation, changes from adjacent entries, long-term
effect on the series, broader industry/cultural impact, and research guidance.
Do not treat this level as an encyclopedia summary.

## Level 3: Detail Cards

Answers: what detailed information supports the interpretation?

Use separate compact cards as appropriate. For game timelines, the default
order is `设计决策链` (when researched), `剧情解读`, and `客观记录`.

`设计决策链` explains why a branch exists rather than merely listing its new
features. Its fixed sequence is: design problem, design hypothesis, experiment,
result and cost, later choice, and evidence basis. Separate verifiable facts
from research inference in the evidence basis.

Every game entry must have exactly one decision-chain review state:

- `manual`: a separately researched chain with an entry-specific evidence note.
- `inferred`: a comparative chain derived from verifiable mechanics, release
  structure, and adjacent entries. It must state that the problem and hypothesis
  are editorial inference rather than an official developer statement.
- `insufficient`: the entry has been reviewed, but the available creator,
  version, service, or branch evidence cannot support a reliable chain. Render
  the missing-evidence reason instead of fabricating six generic fields.

`unreviewed` is not a valid shipped state. The release audit must fail when any
entry is missing all three classifications.

`剧情解读` always includes a plot summary. RPGs and narrative-heavy games may
use a longer summary; gameplay-led entries remain concise. Add `叙事创新` only
when the work has a meaningful innovation in story structure, subject matter,
or narrative delivery.

`客观记录` contains structured facts such as first and later platforms,
version/model history, release-specific changes, and other comparable records.
Keep labels compact and preserve the full value in a hover tip when a row must
truncate.

For the hardware timeline, model/revision history is the first information
card and launch/signature games are the next information card in the same
flyout. These hardware-specific records follow the same density, borders,
spacing, scrolling, connector, and responsive rules as game-series details.

## Level 4: Timeline-Specific Supplement Card

Answers: what compact information matters uniquely to this timeline?

Use this only for a timeline-specific extra, such as Pokemon starters. It is
optional; do not create one merely to make every timeline have four levels.

## Data Rule

Timeline-specific facts and research notes stay inside that timeline folder.
`common` owns only the rendering rules and shared visual behavior.
Milestone judgments stay in that timeline's `milestones.js`; the shared marker
and tooltip behavior stays in `common`.

The timeline folder name must match the current display name using the
repository's filesystem-safe naming form. Renaming a timeline therefore also
requires renaming its folder and updating page scripts, the registry, GM media
paths, downloader paths, and image-manifest sources in the same change.
