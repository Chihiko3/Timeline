# Timeline Card Architecture

This is the standing information architecture for every timeline in Game Archive.
Change it only when the archive owner explicitly requests a new rule.

## Level 1: Timeline Card

Answers: when did it appear, what is it, and where does it belong?

Required structure: date, category tag, title, subtitle, short lineage note,
and a concise hint about the next level. Artwork is optional.

## Level 2: Series Reading Card

Answers: how should a player or developer understand this entry within its
series?

Show these categories in a compact, high-signal form: series positioning, core
experience and player motivation, changes from adjacent entries, long-term
effect on the series, broader industry/cultural impact, and research guidance.
Do not treat this level as an encyclopedia summary.

## Level 3: Detail Cards

Answers: what detailed information supports the interpretation?

Use separate compact cards as appropriate. For game timelines, the default
cards are `剧情解读` and `客观记录`.

`剧情解读` always includes a plot summary. RPGs and narrative-heavy games may
use a longer summary; gameplay-led entries remain concise. Add `叙事创新` only
when the work has a meaningful innovation in story structure, subject matter,
or narrative delivery.

`客观记录` contains structured facts such as first and later platforms,
version/model history, release-specific changes, and other comparable records.
Keep labels compact and preserve the full value in a hover tip when a row must
truncate.

## Level 4: Timeline-Specific Supplement Card

Answers: what compact information matters uniquely to this timeline?

Use this only for a timeline-specific extra, such as Pokemon starters. It is
optional; do not create one merely to make every timeline have four levels.

## Data Rule

Timeline-specific facts and research notes stay inside that timeline folder.
`common` owns only the rendering rules and shared visual behavior.
