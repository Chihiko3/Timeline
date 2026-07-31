# Research and Verification Policy

[简体中文](RESEARCH_SOURCES.md) | **English**

Game Archive uses timelines to study video game hardware and long-running creative lineages. The research goal is not to maximize the number of entries. It is to make release order, version relationships and platform migrations easy to verify, then provide enough depth to study how mechanics, narrative methods and production choices were inherited, corrected or abandoned.

The repository stores structured research and local display images. It does not distribute ROMs, cracks or other game content.

## Scope and Selection

Every timeline owns a public selection rule. A candidate is evaluated against that timeline's hardware lineage, brand lineage or creative lineage before it is added; a shared publisher, similar title or guest character is not sufficient on its own.

- **Hardware:** home consoles, handhelds, hybrid devices, handheld PCs, important add-ons, revisions and devices with a distinct platform identity.
- **Game series:** main entries, important spin-offs, remakes, sequels and branches relevant to the questions defined by that timeline. Ordinary ports normally remain in platform records.
- **Creative lineages:** timelines such as Xeno Series and Spike Chunsoft Narrative may connect work across companies and rights holders through recurring lead creators, teams and design methods. They are not claims that every included game shares one canonical setting.
- **Unofficial work:** included only when a timeline explicitly permits it and the work is sufficiently representative; it must remain visibly distinct from official releases.

Crossover-only appearances, adaptations, content-free compilations and unconfirmed projects are excluded by default.

## Dates and Platforms

- A primary card uses the earliest verified public release anywhere in the world, rather than always preferring Japan, North America or Europe.
- Dates use only the precision supported by evidence. Unknown months and days are not invented.
- First-release and later platforms are recorded separately, including the actual year of ports, digital releases and subscription versions.
- Ordinary ports remain attached to the original work. A new primary card is created when plot, structure, systems or production treatment make the release useful as a distinct work.
- Timeline layout may compress long empty periods, but it must never reverse chronological order.

## Research Layers

### Primary cards

Primary cards support scanning and comparison. They contain the release date, category tag, title, Chinese subtitle, a necessary relationship note, an expansion hint and optional repository-local artwork.

### Connected details

Game-series details prioritize:

- **Core experience:** the repeated player activity and the reason it remains engaging.
- **Changes:** concrete differences from an identified predecessor or previous rule set.
- **Mechanism logic:** how player input, system conditions, feedback and the next decision form a loop.
- **Series impact:** which specific rules later work inherited, corrected, replaced or abandoned.
- **Industry impact:** shown only when reliable evidence supports a concrete influence on other games, genre conventions, production practice or market reach.
- **Plot and narrative:** the central conflict plus any verifiable structural or presentation innovation.
- **Platform record:** first release, later platforms and material version differences.

Timeline-specific supplements can follow these records, such as Pokemon starter trios. Design-decision chains and research prompts may remain in source data for later editorial review, but they are currently hidden from the public interface and must never present inference as stated developer intent.

Hardware details instead present product-line identity, models and revisions, then launch-window and signature games.

## Evidence Levels

1. **Explicit primary evidence:** official pages, developer interviews, manuals, financial reports, press releases and contemporary formal material can support dates, specifications, business results and stated design goals.
2. **Directly observable behavior:** repeatable rules, interfaces, stages, values, scripts and hardware structures can explain how a system works.
3. **Multi-source analysis:** comparisons supported by several reliable sources or durable expert consensus remain editorial analysis, not official intent.
4. **Insufficient evidence:** retain confirmed facts and remove filler such as “enriched the experience” or “laid the foundation” when no concrete mechanism or inheritance can be identified.

An impact claim must identify a specific object and action: what rule was inherited, by which later release, and how it was changed. If this cannot be established, the field should be omitted rather than padded.

## Source Priority

### Hardware and release facts

Manufacturer websites, manuals, press archives, store history, museums and preservation projects are preferred. Wikipedia/Wikimedia, specialist hardware archives and contemporary reporting are used for discovery and cross-checking.

Hardware research verifies earliest availability, regional differences, model relationships, product-line identity and whether a device is a console, add-on or compatible accessory.

### Game and version records

Official game sites, platform stores, developer interviews, manuals and contemporary coverage are preferred. MobyGames, GameFAQs, IGDB, TheGamesDB, LaunchBox Games Database, No-Intro, Redump, MAME/MESS, TOSEC, RetroAchievements and Libretro documentation can expose omissions and help cross-check records, but no single secondary database decides the final result.

Emulator compatibility lists, front-end databases and ROM-management catalogs are discovery tools only. A filename or one download site's categorization is not sufficient evidence of a commercial release. ROM hacks, prototypes, homebrew, fan translations and licensed releases must remain clearly distinguished.

### Images

- Runtime artwork comes only from each timeline's repository-local asset directory and `timeline-images.js` manifest. The public page does not hotlink images or query a Wiki while loading.
- The GM media manager edits the same files used by the published timeline.
- Image research uses Chinese, English and Japanese titles. Japanese games prefer the earliest Japanese cover or official Japanese material when available.
- Rights and reuse terms remain source-specific. The repository's code license does not automatically cover third-party photography, logos or cover art.

## Verification Workflow

1. Read the timeline's selection criteria and confirm that the candidate belongs to its research scope.
2. Confirm title, earliest date, platforms, version identity and lineage through primary or high-confidence sources.
3. Establish a specific comparison baseline for mechanics and narrative, then compare developer statements with directly observable behavior.
4. Cross-check high-risk facts with a second independent source. Rewrite unsupported intent as analysis or leave it out.
5. Update release data, platform records, milestones, local image manifests and source notes together.
6. Run `node scripts/validate-static-site.js`; run the relevant focused audit whenever release dates, platforms or timeline content change.
7. Before publication, sample obscure entries, long titles, entries without images, multi-image previews and overview filtering to catch repeated batch errors.

## Generational Comparison Standard

Every “Changes” and “Mechanism Logic” note should answer four questions:

1. What exact predecessor or established rule is the baseline?
2. What observable inputs, resources, states, values, level conditions, failure costs or narrative triggers changed?
3. What player action does the system read, what feedback does it produce, and what decision does that feedback force next?
4. What problem did the change solve, what new problem did it create, and which later release inherited, corrected or abandoned it?

## Maintained Source Registry

The Chinese version of this document keeps the current direct-link registry for recurring official and high-confidence sources used by Spike Chunsoft Narrative, Final Fantasy, Pokemon, Dragon Quest, Xeno Series and Like a Dragon. Timeline-specific scope and file ownership are documented in each timeline directory's `README.md`.
