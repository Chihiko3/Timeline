# Like a Dragon Timeline

This directory owns the Like a Dragon timeline's research data, card content, milestones and local media.

## Scope

The timeline follows works developed by Ryu Ga Gotoku Studio or its direct Sega production lineage: numbered main games, historical settings, Kurohyo, Judgment, substantial remakes and major standalone spin-offs.

Ordinary ports, HD collections and platform reissues stay in the original work's later-platform record. DLC, guest crossovers, unconfirmed projects and unrelated RGG Studio new IP are excluded. Remakes receive a primary card when their systems, presentation or story treatment make them useful as a separate design comparison.

The date on each primary card is the earliest verified public release anywhere in the world.

## Visible Information

Primary cards show the release date, branch and genre tag, original title, Chinese subtitle, optional remake relationship, platform count and local artwork.

The connected detail stack presents:

1. core experience, changes, mechanism logic, series impact and supported industry impact;
2. plot summary and narrative innovation;
3. first-release and later-platform records, including material edition differences.

Research prompts and design-decision chains remain in source data but are currently hidden from the public interface.

## Files

- `selection-criteria.js`: public scope statement shown above the timeline.
- `releases.js`: release identity, dates, classifications, names and platform records.
- `editorial-reading.js`: release-level editorial interpretation consumed by the detail renderer.
- `design-logic.js`: detailed mechanism and installment-change analysis.
- `series-impact.js`: concrete inheritance, correction and abandonment across the series.
- `external-impact-research.js`: evidence-gated industry-impact notes.
- `plot-summaries.js`: plot summaries and narrative innovations.
- `milestones.js`: domestic, global and integration markers.
- `decision-chain.js`: retained design-decision research; not currently rendered.
- `timeline-images.js`: ordered artwork lists used by both the public timeline and GM media manager.
- `assets/covers/`: repository-local Japanese covers and official promotional artwork.

## Media Rules

Japanese first-release covers and Sega/RGG Studio promotional material are preferred. Multiple reviewed images may be stored for cycling and enlarged preview, but the public page only reads repository-local paths registered in `timeline-images.js`.

GM additions, replacements and deletions modify the same local assets and manifest used after publication.

## Validation

After changing dates, platforms or release coverage, run:

```text
node scripts/audit-release-data.js
node scripts/audit-timeline-content.js
node scripts/validate-static-site.js
```
