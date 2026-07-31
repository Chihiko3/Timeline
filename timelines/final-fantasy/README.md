# Final Fantasy Timeline

This directory owns the Final Fantasy timeline's research data, card content, milestones and local media.

## Scope

The timeline includes standalone games centered on Final Fantasy worlds, characters or named subseries: numbered entries, direct sequels and prequels, substantial remakes or reconstructions, Tactics, Crystal Chronicles, Chocobo and other materially independent branches.

Guest appearances and crossover-only products are excluded. Ordinary ports, remasters and service reissues stay in the original game's platform record. A release receives a new primary card when its plot, playable structure, systems or production treatment make it a distinct work; the Final Fantasy VII Remake project is therefore separate, while faithful extensions such as later editions of Final Fantasy Tactics can remain attached to the original record when appropriate.

The date on each primary card is the earliest verified public release anywhere in the world.

## Visible Information

Primary cards show the release date, branch and genre tag, original title, Chinese subtitle, optional relationship note, platform count and local artwork. Tags use the compact `branch · genre` structure, such as `正传 · RPG` or `战略版 · 战棋`.

The connected detail stack presents:

1. core experience, changes, mechanism logic, series impact and supported industry impact;
2. plot summary and narrative innovation;
3. first-release and later-platform records, including material edition differences.

Complex lineage notes belong in the details rather than the primary card. Research prompts and design-decision chains remain in source data but are currently hidden from the public interface.

## Files

- `selection-criteria.js`: public scope statement shown above the timeline.
- `final-fantasy-releases.js`: release identity, dates, classifications, names and platform records.
- `verified-additions.js`: reviewed corrections and additions kept separate from the base release list.
- `editorial-reading.js`: release-level editorial interpretation consumed by the detail renderer.
- `design-logic.js`: detailed mechanism and installment-change analysis.
- `series-impact.js`: concrete inheritance, correction and abandonment across branches.
- `external-impact-research.js`: evidence-gated industry-impact notes.
- `plot-summaries.js`: plot summaries and narrative innovations.
- `milestones.js`: domestic, global and integration markers.
- `decision-chain.js`: retained design-decision research; not currently rendered.
- `timeline-images.js`: ordered artwork lists used by both the public timeline and GM media manager.
- `assets/covers/`: repository-local logos, covers and promotional artwork.

## Media Rules

Artwork prefers the earliest Japanese release's official logo or cover. Landscape series logos are acceptable when they identify the work more clearly inside the shared card media area. Multiple reviewed images remain in manifest order for cycling and enlarged preview.

The public page never hotlinks Final Fantasy Wiki or another remote image host. Downloaded candidates must be placed under `assets/covers/` and registered in `timeline-images.js` before they appear.

## Validation

After changing dates, platforms or release coverage, run:

```text
node scripts/audit-release-data.js
node scripts/audit-timeline-content.js
node scripts/validate-static-site.js
```
