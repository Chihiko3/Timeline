# Hardware Image Sources

Hardware timeline images are stored in `assets/consoles/` and referenced by `timeline-images.js`. The public page and GM manager use these same repository-local files; neither keeps a dependency on the user's original import path or an external image host.

The initial local archive was assembled from these public repositories and their documented source records:

- [Retro Chiba](https://github.com/MakiDevelop/retro-chiba): most console and handheld photographs; its per-console records identify the original image source and license.
- [Spela](https://github.com/mattias800/spela): additional transparent console photographs; see its `CREDITS.json`.
- [Misterzine](https://github.com/matijaerceg/misterzine): Super Cassette Vision system artwork; see its `credits.json`.
- [History of Video Games](https://github.com/niemasd/History-of-Video-Games-OLD): Nintendo Color TV-Game photograph.
- [RPCS3 website](https://github.com/DAGINATSUKO/www-rpcs3): Steam Deck and ROG Ally device artwork.
- [web-programming-project](https://github.com/DatoShar/web-programming-project): PlayStation Portal device artwork.
- [Romm frontend](https://github.com/HowDoDownhill/romm-frontend): temporary 64DD and Cassette Vision identity artwork used when a stable device photograph was not available during migration.

The 64DD and Cassette Vision entries intentionally use labeled identity artwork instead of a photograph of a different device. They can be replaced directly through the GM image manager when better verified photographs are available.

## Import Rules

- Keep the original source URL and source-specific license in this file or a neighboring source record.
- Do not substitute a visually similar model for the hardware named by the card.
- Prefer a clearly identifiable device photograph over packaging, controller-only or unrelated accessory images.
- GM imports are copied into `assets/consoles/`; replacing or deleting an image changes the repository copy and its manifest entry.
- The MIT license for project code does not automatically relicense third-party photography, logos or artwork. Their rights and reuse terms remain with the original sources and rights holders.
