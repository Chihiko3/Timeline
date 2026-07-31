# Xeno Series Timeline

This directory owns the Xeno Series timeline's research data, card content, milestones and local media.

## Scope

Xeno Series is a creative-lineage timeline rather than a single canonical universe. It follows works led by Tetsuya Takahashi and related core teams across Xenogears, Xenosaga and Xenoblade, showing how recurring production problems, themes and system ideas continued through different companies and rights holders.

Primary cards cover standalone releases, major canonical expansions and versions with substantial structural or system changes. Ordinary ports, books, animation, crossovers and unrelated Monolith Soft projects are excluded or recorded only as context.

The date on each primary card is the earliest verified public release anywhere in the world.

## Visible Information

Primary cards show the release date, branch and genre tag, original title, Chinese subtitle, platform count and local artwork. Complex creative-lineage explanations are intentionally kept out of the primary card and appear at the end of the platform details.

The connected detail stack presents:

1. core experience, changes, mechanism logic, series impact and supported industry impact;
2. plot summary and narrative innovation;
3. first-release and later-platform records followed by the relevant lineage note.

Research prompts and design-decision chains remain in source data but are currently hidden from the public interface.

## Files

- `selection-criteria.js`: public scope statement shown above the timeline.
- `releases.js`: release identity, dates, classifications, names, platforms and lineage notes.
- `editorial-reading.js`: release-level editorial interpretation consumed by the detail renderer.
- `design-logic.js`: detailed mechanism and installment-change analysis.
- `series-impact.js`: concrete inheritance, correction and abandonment across the creative lineage.
- `external-impact-research.js`: evidence-gated industry-impact notes.
- `plot-summaries.js`: plot summaries and narrative innovations.
- `milestones.js`: domestic, global and integration markers.
- `decision-chain.js`: retained design-decision research; not currently rendered.
- `timeline-images.js`: ordered artwork lists used by both the public timeline and GM media manager.
- `assets/covers/`: repository-local Japanese covers and other reviewed artwork.

## Media Rules

Japanese first-release package art is preferred. Artwork from another region is used only when a suitable Japanese source cannot be verified or when the release itself was region-specific. User-managed images are not replaced automatically by later research passes.

The public page and GM manager read the same `timeline-images.js` manifest. No separate managed-image directory or runtime remote fallback exists.

## Validation

After changing dates, platforms or release coverage, run:

```text
node scripts/audit-release-data.js
node scripts/audit-timeline-content.js
node scripts/validate-static-site.js
```
