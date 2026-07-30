# Hardware Timeline

This folder owns all console timeline content:

- `data.js`: hardware chronology and platform records
- `platform-variants.js`: models, revisions, and related hardware
- `curated-games.js` and `game-localizations.js`: launch and notable games
- `timeline-images.js`: GM-managed image records for hardware cards
- `IMAGE_SOURCES.md`: provenance notes for the initial local image archive
- `DATA_AUDIT.md`: release-date and classification rules plus the source set
- `assets/consoles`: the only runtime image store for hardware cards
- `../../scripts/download-images.js`: fills empty GM image records from the
  curated Wikipedia page mapping without replacing images already managed by
  the archive owner

The timeline and the GM image manager both read `timeline-images.js`. Adding,
replacing, or deleting an image in the GM tool therefore changes the same
repo-local file set used by the static site and GitHub Pages. Runtime Wiki
lookups are intentionally not used.

Shared timeline layout and card styling are in `../../common`.

After editing hardware records, run:

```text
node scripts/audit-hardware-data.js
```
