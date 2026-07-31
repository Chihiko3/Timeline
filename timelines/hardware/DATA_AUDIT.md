# Hardware Data Audit

- Data baseline last fully reviewed: 2026-07-30
- Documentation and validation rules reviewed: 2026-07-31

## Data Rules

- A primary-card date uses the earliest confirmed public availability anywhere in the world, not a preferred region. Documented test-market sales and public rental phases count when their limited status is explained.
- If reliable sources agree only on a year, the card shows only the year. The archive does not invent a month for visual consistency.
- “Launch / escort” normally means software available with the hardware in its earliest market. Later regional launch titles are excluded unless the note explicitly treats them as launch-window promotion.
- Open PC platforms, compatibility handhelds, dedicated consoles and remote-play devices do not receive fabricated closed-platform launch lineups.
- A separately indexed add-on or successor cannot also appear as a model of its parent card. Licensed shells, cost revisions and integrated versions remain variants when they run the same platform software.
- Hardware type follows use and software environment: Steam Deck and ROG Ally are PC handhelds rather than conventional handheld consoles; remote-play-only hardware is not treated as an independent game platform.

## High-Risk Records Reviewed

- **Atari 7800**: the public retail launch remains May 1986; the planned 1984 launch did not become a normal store release.
- **Sega Mark III / Master System**: October 1985 belongs to the Japanese Mark III. Master System is the overseas redesign introduced in 1986.
- **Neo Geo AES**: the 1990 home entry is the rental phase; ordinary retail sales followed in 1991.
- **ColecoVision**: the earliest documented New York and Boston test-market launch was at the end of July 1982.
- **Watara Supervision**: dependable references agree on 1992 but not a month, so the timeline intentionally uses year precision.

## Reference Set

- [Nintendo product and software history](https://www.nintendo.com/jp/)
- [Sega hardware history](https://www.sega.jp/history/hard/)
- [PlayStation press archive](https://sonyinteractive.com/en/newsroom/)
- [SNK history](https://www.snk-corp.co.jp/snk-history/)
- [Famitsu release schedules](https://www.famitsu.com/schedule/)
- [Atari Archive](https://www.atariarchive.org/)
- [PC Engine software chronology](https://www.pcengine.co.uk/)
- [Game Watch contemporary reporting](https://game.watch.impress.co.jp/)

## Required Checks

Run the following after changing hardware identity, dates, classifications, variants, curated games or image records:

```text
node scripts/audit-hardware-data.js
node scripts/validate-static-site.js
```

The hardware audit validates IDs, date precision, variants, game groups, source mappings and runtime image manifests. The static-site validator then checks script syntax, HTML assets, repository-relative paths, file existence and image payloads.
