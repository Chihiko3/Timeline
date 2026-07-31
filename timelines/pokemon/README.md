# Pokemon Timeline

This directory owns the Pokemon timeline's research data, card content, milestones and local media.

## Scope

The timeline follows the official core RPG lineage: paired generation launches, enhanced or third versions, direct sequels, remakes and the Legends branch. A small number of historically notable fan games and ROM hacks may be included when they illuminate how the community extended the core rules; they are visually separated from official releases.

Anime, trading-card products, generic character crossovers and unrelated spin-offs are outside this timeline. Ordinary ports and subscription reissues belong in the original release's platform record instead of receiving duplicate primary cards.

The date on each primary card is the earliest verified public release anywhere in the world.

## Visible Information

Primary cards show the release date, generation or creator/type tag, original title, compact Chinese subtitle, version relationship when needed, platform count and optional cover art.

The connected detail stack presents:

1. core experience, changes, mechanism logic, series impact and supported industry impact;
2. plot summary and narrative innovation;
3. first-release and later-platform records;
4. the starter trio as a compact Pokemon-specific supplement.

Version structure explains why a generation appears as a pair, a single enhanced release, a direct sequel pair or another exception. Terms such as anime adaptation, enhanced version and combined version are not treated as interchangeable; the detail text must state the concrete content relationship.

Research prompts and design-decision chains remain in source data but are currently hidden from the public interface.

## Files

- `selection-criteria.js`: public scope statement shown above the timeline.
- `releases.js`: release identity, date, classification, names, platforms, remake/mod relationships and Pokemon-specific metadata.
- `editorial-reading.js`: release-level editorial interpretation consumed by the detail renderer.
- `design-logic.js`: detailed mechanism and generational-change analysis.
- `series-impact.js`: concrete inheritance, correction and abandonment across the series.
- `external-impact-research.js`: evidence-gated industry-impact notes.
- `plot-summaries.js`: plot summaries and narrative innovations.
- `milestones.js`: domestic, global and integration markers.
- `decision-chain.js`: retained design-decision research; not currently rendered.
- `timeline-images.js`: ordered cover lists used by both the public timeline and GM media manager.
- `assets/covers/`: repository-local release artwork.
- `assets/sprites/`: repository-local starter sprites.

## Media Rules

Official releases prefer Japanese first-release covers or official Japanese material when available. Multiple version covers remain in release order so the card can cycle them and the hover preview can show the complete set. Fan-game and ROM-hack artwork stays hidden unless it has been deliberately reviewed and enabled.

The public page never fetches remote artwork at runtime. GM additions, replacements and deletions update the same local files and manifest used by the timeline.

## Validation

After changing dates, platforms or release coverage, run:

```text
node scripts/audit-release-data.js
node scripts/audit-timeline-content.js
node scripts/validate-static-site.js
```
