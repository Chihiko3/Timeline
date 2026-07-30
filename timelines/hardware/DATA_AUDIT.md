# Hardware data audit

Last full review: 2026-07-30

## Data rules

- A card date uses the earliest confirmed public availability anywhere in the
  world, not a preferred region. Test-market sales and public rental count when
  they are documented and are explained in the card text.
- If reliable sources agree only on a year, the card shows only the year. The
  archive does not invent a month for visual consistency.
- "Launch / escort" normally means software available with the hardware in its
  earliest market. Later regional launch titles are excluded unless the card
  note explicitly treats them as launch-window promotion.
- Open PC platforms, compatibility handhelds, dedicated consoles, and remote
  play devices do not receive fabricated closed-platform launch lineups.
- A separately indexed add-on or successor cannot also appear as a model of its
  parent card. Licensed shells, cost revisions, and integrated versions remain
  variants when they run the same platform software.

## High-risk records reviewed

- Atari 7800: the public retail launch remains May 1986; the planned 1984
  launch did not become a normal store release.
- Sega Mark III / Master System: October 1985 belongs to the Japanese Mark III.
  Master System is the overseas redesign introduced in 1986.
- Neo Geo AES: the 1990 home entry is the rental phase; ordinary retail sales
  followed in 1991.
- ColecoVision: the earliest documented New York and Boston test-market launch
  was at the end of July 1982.
- Watara Supervision: dependable references agree on 1992 but not a month, so
  the timeline intentionally uses year precision.

## Reference set

- Nintendo product and software history: https://www.nintendo.com/jp/
- Sega hardware history: https://www.sega.jp/history/hard/
- PlayStation press archive: https://sonyinteractive.com/en/newsroom/
- SNK museum: https://www.snk-corp.co.jp/snk-history/
- Famitsu release schedules: https://www.famitsu.com/schedule/
- Atari launch research: https://www.atariarchive.org/
- PC Engine software chronology: https://www.pcengine.co.uk/
- Contemporary Japanese reports: https://game.watch.impress.co.jp/

Run `node scripts/audit-hardware-data.js` after changing hardware records. The
audit validates IDs, dates, variants, game groups, and both image registries.
