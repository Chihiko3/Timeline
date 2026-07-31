# Hardware Timeline

This directory owns the hardware chronology, primary-card copy, model relationships, representative software and repository-local images used by the console timeline.

## Scope

The timeline includes home consoles, handhelds, hybrid systems, handheld PCs, important add-ons and hardware with a distinct platform identity. Cost reductions, regional shells and integrated revisions remain variants when they run the same software platform; separately indexed successors and add-ons are not duplicated as parent-card variants.

Each card uses the earliest verified public availability anywhere in the world. Hardware dates keep the highest precision supported by evidence: a known year is not given an invented month, and documented test-market sales or public rental phases are included only when their status is explained.

## Visible Information

Primary cards use the shared timeline component and show:

- earliest verified release date;
- manufacturer tag;
- hardware name;
- a concise historical position as the subtitle;
- a defining technical or product characteristic as the supporting line;
- number of models or revisions;
- optional repository-local hardware artwork.

Product-line identity is deliberately moved out of the primary card. The connected detail stack presents the product line, models and revisions, then launch-window and signature games.

## Files

- `data.js`: hardware identity, chronology, classifications and platform records.
- `release-dates.js`: reviewed date corrections and precision overrides.
- `card-copy.js`: historical position and defining feature used on primary cards.
- `platform-variants.js`: models, revisions and related hardware.
- `curated-games.js`: launch-window and signature-game selections.
- `game-localizations.js`: Chinese display names and game links.
- `timeline-images.js`: ordered image records used by both the public timeline and GM media manager.
- `image-sources.js`: curated source mapping used by image maintenance tools.
- `IMAGE_SOURCES.md`: provenance notes for the initial local image archive.
- `DATA_AUDIT.md`: date, classification and software-selection audit rules.
- `assets/consoles/`: the only runtime image directory for hardware cards.
- `../../scripts/download-images.js`: fills empty image records from reviewed source mappings without replacing GM-managed images.

Shared timeline layout, card styling and connected-detail behavior live under `../../common/`.

## Media Rules

The public timeline and GM image manager both read `timeline-images.js`. Adding, replacing or deleting an image through GM therefore changes the same repository files used by local browsing and GitHub Pages.

Runtime Wiki lookup and remote hotlink fallback are intentionally disabled. Downloaded or imported files must exist under `assets/consoles/` and use repository-relative manifest paths.

## Validation

After changing hardware records, games or images, run:

```text
node scripts/audit-hardware-data.js
node scripts/validate-static-site.js
```
