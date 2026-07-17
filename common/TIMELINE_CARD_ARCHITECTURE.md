# Timeline Card Architecture

This is the standing information architecture for every timeline in Game Archive.
Change it only when the archive owner explicitly requests a new rule.

## Level 1: Timeline Card

Answers: when did it appear, what is it, and where does it belong?

Required structure: date, category tag, title, subtitle, short lineage note,
and a concise hint about the next level. Artwork is optional.

## Level 2: Snapshot Card

Answers: what is the most important thing to remember in 30 seconds?

Show a small number of high-signal fields: positioning in the series, core
experience or hardware proposition, relationship to adjacent entries, and the
most meaningful change.

## Level 3: Record Card

Answers: how did it work and how did it reach players?

Show structured evidence such as platforms, model/version history, signature
content, starters, system changes, or ecosystem information.

## Level 4: Research Card

Answers: what should be studied further and why?

Show planning observations, long-term inheritance, notable trade-offs, source
links, and deeper development or market research. It is optional when no
reliable research note exists; do not fill it with generic encyclopedia text.

## Data Rule

Timeline-specific facts and research notes stay inside that timeline folder.
`common` owns only the rendering rules and shared visual behavior.
