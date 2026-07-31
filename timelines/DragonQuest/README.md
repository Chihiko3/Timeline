# Dragon Quest Timeline

This directory owns the Dragon Quest timeline's research data, card content, milestones and local media.

## Scope

The timeline includes official standalone works centered on the Dragon Quest brand or worlds: numbered games, substantial remakes, Monsters, Mystery Dungeon, Slime, Heroes, Builders, Battle Road, The Adventure of Dai and other material branches.

Ordinary ports, mobile conversions, remasters and subscription reissues belong in the original work's later-platform record. A remake or definitive edition receives its own primary card only when its content, systems, presentation or production scope supports studying it as a distinct release. Crossovers and appearances that do not make Dragon Quest the subject of the work are excluded.

The date on each primary card is the earliest verified public release anywhere in the world.

## Visible Information

Primary cards show the release date, branch and genre tag, original title, Chinese subtitle, optional edition relationship, platform count and local artwork.

The connected detail stack presents:

1. core experience, changes, mechanism logic, series impact and supported industry impact;
2. plot summary and narrative innovation;
3. first-release and later-platform records, including material version differences.

Research prompts and design-decision chains remain in source data but are currently hidden from the public interface.

## Files

- `selection-criteria.js`: public scope statement shown above the timeline.
- `releases.js`: release identity, dates, classifications, names and platform records.
- `verified-content.js`: reviewed corrections and additions layered onto the base data.
- `editorial-reading.js`: release-level editorial interpretation consumed by the detail renderer.
- `design-logic.js`: detailed mechanism and branch-change analysis.
- `series-impact.js`: concrete inheritance, correction and abandonment across the series.
- `external-impact-research.js`: evidence-gated industry-impact notes.
- `plot-summaries.js`: plot summaries and narrative innovations.
- `milestones.js`: domestic, global and integration markers.
- `decision-chain.js`: retained design-decision research; not currently rendered.
- `timeline-images.js`: ordered artwork lists used by both the public timeline and GM media manager.
- `assets/covers/`: repository-local covers, logos and candidate artwork.

## Media Rules

Japanese first-release covers are preferred for Japanese games. Candidate images may be gathered from official stores, preservation databases and well-documented fan archives, but only reviewed repository-local files registered in `timeline-images.js` are rendered.

Multiple candidates are allowed so they can be compared and removed through the GM tool. The public site never depends on remote image URLs.

## Validation

After changing dates, platforms or release coverage, run:

```text
node scripts/audit-release-data.js
node scripts/audit-timeline-content.js
node scripts/validate-static-site.js
```
