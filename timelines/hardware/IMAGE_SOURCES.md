# Hardware Image Sources

Hardware timeline images are stored in `assets/consoles` and referenced by
`timeline-images.js`. The initial local archive was assembled from these
public repositories and their documented source records:

- [Retro Chiba](https://github.com/MakiDevelop/retro-chiba): most console and
  handheld photographs; its per-console records identify the original image
  source and license.
- [Spela](https://github.com/mattias800/spela): additional transparent console
  photographs; see its `CREDITS.json`.
- [Misterzine](https://github.com/matijaerceg/misterzine): Super Cassette
  Vision system artwork; see its `credits.json`.
- [History of Video Games](https://github.com/niemasd/History-of-Video-Games-OLD):
  Nintendo Color TV-Game photograph.
- [RPCS3 website](https://github.com/DAGINATSUKO/www-rpcs3): Steam Deck and
  ROG Ally device artwork.
- [web-programming-project](https://github.com/DatoShar/web-programming-project):
  PlayStation Portal device artwork.
- [Romm frontend](https://github.com/HowDoDownhill/romm-frontend): temporary
  64DD and Cassette Vision identity artwork where a stable device photograph
  was not available during migration.

The 64DD and Cassette Vision entries intentionally use labeled identity
artwork instead of a photograph of a different device. They can be replaced
directly in the GM image manager when preferred photographs are available.

Future imports should keep the original source URL and license in this file or
in a neighboring source record. The GM tool always copies imported files into
`assets/consoles`; it never retains a dependency on the user's original path.
