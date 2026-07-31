# Spike Chunsoft Narrative Timeline

This directory owns the Spike Chunsoft Narrative timeline's research data, card content, milestones and local media. The filesystem-safe directory name corresponds to the displayed timeline title; it is not intended as a complete company-history archive.

## Scope

The timeline follows a narrative-design lineage rather than every game published by Chunsoft, Spike or Spike Chunsoft. Its trunk begins with the Famicom version of The Portopia Serial Murder Case as a command-adventure prehistory, then follows Sound Novel, Kamaitachi no Yoru, Machi and 428. Zero Escape and Danganronpa form major parallel branches, followed by AI: The Somnium Files, Master Detective Archives, No Sleep For Kaname Date and Shuten Order.

Dragon Quest, Mystery Dungeon, wrestling games and other unrelated company output are excluded even when the same company developed or published them. Ordinary ports and compilations stay in platform records unless they materially change the work being studied.

The date on each primary card is the earliest verified public release anywhere in the world.

## Visible Information

Primary cards show the release date, lineage/genre tag, original title, Chinese subtitle, platform count and local artwork.

The connected detail stack presents:

1. core experience, changes, mechanism logic, series impact and supported industry impact;
2. plot summary and narrative innovation;
3. first-release and later-platform records.

Milestones identify domestic recognition, global breakthroughs and the first relevant work after the 2012 Spike/Chunsoft integration when the evidence supports that relationship. Research prompts and design-decision chains remain in source data but are currently hidden from the public interface.

## Files

- `selection-criteria.js`: public scope statement shown above the timeline.
- `releases.js`: release identity, dates, classifications, names and platform records.
- `editorial-reading.js`: release-level editorial interpretation consumed by the detail renderer.
- `design-logic.js`: detailed mechanism and lineage-change analysis.
- `series-impact.js`: concrete inheritance, correction and abandonment across branches.
- `external-impact-research.js`: evidence-gated industry-impact notes.
- `plot-summaries.js`: plot summaries and narrative innovations.
- `milestones.js`: domestic, global and integration markers.
- `decision-chain.js`: retained design-decision research; not currently rendered.
- `timeline-images.js`: ordered artwork lists used by both the public timeline and GM media manager.
- `assets/covers/`: repository-local Japanese covers and reviewed promotional artwork.

## Media Rules

Japanese first-release covers are preferred. Searches may use Japanese, English and Chinese titles and may collect more than one candidate, but a single release should not accumulate more than a small reviewable set. Images already selected through the GM tool are not automatically replaced.

The public page never downloads artwork at runtime. The GM manager edits the same local assets and manifest consumed by the timeline.

## Key Source Families

Research prioritizes Spike Chunsoft company history and official game pages, contemporary Famitsu, 4Gamer and Game Watch interviews, platform store records and directly observable game systems. The shared source list and evidence policy are maintained in [`../../RESEARCH_SOURCES.md`](../../RESEARCH_SOURCES.md).

## Validation

After changing dates, platforms or release coverage, run:

```text
node scripts/audit-release-data.js
node scripts/audit-timeline-content.js
node scripts/validate-static-site.js
```
