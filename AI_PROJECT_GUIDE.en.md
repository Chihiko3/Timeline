# AI Project Handoff Guide

[简体中文](AI_PROJECT_GUIDE.md) | **English**

> **Purpose:** This document is written specifically to help an AI coding assistant understand Game Archive quickly. Give this file to the AI together with the requested task to avoid making it rediscover the product intent, timeline architecture, and implicit repository rules.

This guide records current project conventions. It does not replace a timeline's own selection criteria or research sources. Before editing, an AI must still inspect the code and data directly related to the task instead of treating this document as a substitute for the repository.

## Project in One Sentence

Game Archive is a static website that organizes video game hardware and long-running game series on vertical timelines. Primary cards support fast identification. Selecting one opens a connected information window containing mechanics, changes, impact, plot, platforms, and timeline-specific material. The project serves both players who need a quick reference and designers or researchers tracing why a series branched and which experiments were inherited, corrected, or abandoned.

## Reading Order Before Making Changes

1. [`README.en.md`](README.en.md): public positioning, current coverage, and user-facing workflow.
2. This guide: repository structure, integration workflow, and rules that must remain intact.
3. [`common/TIMELINE_CARD_ARCHITECTURE.md`](common/TIMELINE_CARD_ARCHITECTURE.md): the shared card and layout contract for every timeline.
4. [`RESEARCH_SOURCES.en.md`](RESEARCH_SOURCES.en.md): dates, platforms, content analysis, evidence levels, and image-source policy.
5. The target timeline's `README.md` and `selection-criteria.js`: the actual inclusion and exclusion rules for that timeline.
6. `AGENTS.md`: validation-safety requirements for this repository.

## Current Product Structure

### Library Levels

- **Video Game Hardware:** the hardware timeline.
- **Game Series:** the overview and independent series timelines.
- **Overview:** after the user selects series, it merges their original primary cards and original connected details by date. No series is selected by default.
- **GM Media Manager:** a local repository-maintenance tool, not a public user feature.

### Current Timelines

- Hardware
- Pokemon
- Final Fantasy
- Dragon Quest
- Xeno Series
- Like a Dragon
- Spike Chunsoft Narrative

Game-series tabs follow the order in which timelines were added to the project, not alphabetical order. Unless the user explicitly requests a different position, append a new timeline after the existing ones. The overview filter uses the same order.

## Technical Shape

- Static website with no framework and no build step.
- `index.html` loads timeline data through ordered `<script>` tags. Data is exposed through `window.*` globals and consumed by `common/app.js`.
- `common/app.js` owns shared rendering, interaction, overview behavior, connected details, and the GM interface.
- `common/styles.css` owns shared dimensions, spacing, typography, theme colors, and responsive behavior.
- `common/language.js` owns language selection, URL state, and local persistence. `common/localization-en-data.js` stores machine-assisted English drafts, `common/localization-en-reviewed.js` stores reviewed wording that regeneration must not overwrite, and `common/localization-en.js` owns terminology priority, data localization, and dynamically rendered interface text.
- Each timeline owns its data, research text, milestones, and media under `timelines/<TimelineName>/`.
- GitHub Pages serves repository files directly, so all public assets must use repository-relative paths.

Chinese is currently the editorial source language. English mode is available through `?lang=en` and must retain a prominent unproofread warning until the user explicitly confirms that an editorial review is complete. Any new or changed user-visible Chinese text must receive a corresponding English mapping or regenerated English data. Machine translation may only provide a prose draft. Series names, product titles, genres, platforms, characters, mechanics, and milestone language must follow official English sources and be recorded in the shared terminology map or reviewed layer. Do not edit `localization-en-data.js` by hand because regeneration replaces it.

Do not introduce a framework, bundler, database, or server dependency unless the user explicitly requests an architectural migration.

## Timeline Information Hierarchy

### Primary Cards: Shared by Every Timeline

Primary-card appearance, dimensions, interaction, and region order are global contracts. A primary-card change should be implemented through the shared component so every timeline receives it, rather than patched into one timeline.

Fixed region order:

1. date at the upper left;
2. category tag at the upper right;
3. title;
4. subtitle;
5. optional relationship/supporting line;
6. expansion hint or platform/model count at the lower left;
7. optional artwork area at the lower right.

Critical rules:

- Dates use the earliest verified public release anywhere in the world.
- Games prefer a complete year-month-day date; hardware uses only the precision supported by evidence.
- Tags are right-aligned. Long tags expand left until they approach the date, then truncate with an ellipsis and expose the full value through a tooltip.
- Titles and subtitles truncated by artwork use an ellipsis and tooltip. They do not overlap the image or resize the card.
- Without artwork, text may use the reserved media area. With artwork, the image is right-aligned and scales proportionally inside that area.
- The connector must physically join the card and axis. Cards and release points must not overlap.
- Long historical gaps may be visually compressed, but chronological order must never be reversed.

Hardware primary cards show the hardware name, historical position, defining characteristic, and model count; product-line identity belongs in the connected details. Game primary cards show the original/English title, compact Chinese subtitle, necessary version relationship, platform count, and optional cover or logo.

### Connected Details: Timeline-Specific Content Is Allowed

Expanded information lives inside one connected window beside the primary card. The interface does not display labels such as “level 2,” “level 3,” or “level 4,” and does not use large wrapper headings such as “Series Interpretation,” “Plot Interpretation,” or “Objective Record.” It displays compact field labels directly.

Standard game-series order:

1. core experience;
2. changes in this release;
3. mechanism logic;
4. series impact;
5. industry impact, only when reliable evidence exists;
6. plot summary and narrative innovation;
7. first-release and later-platform records;
8. timeline-specific supplements, such as Pokemon starter trios.

Standard hardware order:

1. product-line identity;
2. models and revisions;
3. launch-window and signature games.

When changing fields for one timeline, do not spread the change to other timelines. Change the shared detail structure only when the user explicitly says the rule applies to every timeline.

`SHOW_RESEARCH_PROMPTS` and `SHOW_DESIGN_DECISION_CHAINS` are currently both `false`. Research prompts and decision-chain data may remain in the repository, but the public interface hides them.

## Research and Writing Standards

- Establish why a work belongs to the timeline before writing its card.
- “Changes” must identify a comparison baseline; “added a new system” is not sufficient.
- “Mechanism Logic” must explain the loop between player input, system evaluation, feedback, and the player's next decision.
- “Series Impact” must identify which specific rule a later work inherited, corrected, replaced, or abandoned.
- “Industry Impact” appears only when reliable evidence supports it. Hide the field instead of padding it.
- Plot-summary length follows the narrative weight of the game and should identify verifiable narrative innovation.
- Inference must be written as editorial analysis, never as stated developer intent.
- Remove filler such as “enriched the experience,” “laid the foundation,” or “allowed later games to inherit effective elements” when no concrete object is identified.
- Keep explicit facts, directly observable behavior, multi-source analysis, and insufficient evidence distinct.

The complete evidence and source policy is in [`RESEARCH_SOURCES.en.md`](RESEARCH_SOURCES.en.md).

## Dates, Versions, and Platforms

- A primary-card date is the earliest public release worldwide, not automatically the Japanese, North American, or European release.
- If the month or day is unknown, retain the true precision. Do not append `01` to make the date look complete.
- Ordinary ports, budget editions, subscription releases, and digital reissues normally belong in the original work's `later` platform records.
- Create a new primary card only when plot, structure, systems, or production scope has been materially reconstructed.
- Use existing platform abbreviations: `PlayStation` may become `PS`, `PlayStation 4` becomes `PS4`, `Nintendo Switch` becomes `NS`, and `Nintendo Switch 2` becomes `NS2`. Xbox generations normally keep their full names.
- First-release and later-platform entries display “year + platform” on one row. Long platform names use an ellipsis and tooltip.

## Milestones

Milestones sit between a primary card and the axis so they do not consume card space. Three types exist:

- `domestic`: established or decisively expanded recognition in the original market;
- `global`: created a major international breakthrough;
- `integration`: the first confirmed relevant release after a company, studio, or project-team integration.

One release may have multiple markers, each with its own explanation. Do not infer a milestone solely from sales rank, and do not describe a publisher merger as proof that two development teams jointly made the game.

## Artwork and GM Media Rules

- Store each timeline's images inside that timeline, for example `timelines/LikeADragon/assets/covers/`.
- Hardware images belong in `timelines/hardware/assets/consoles/`.
- Runtime only reads each timeline's `timeline-images.js`. It does not hotlink a Wiki or download remote images while loading.
- Image keys usually follow `<imageCollectionId>:<release.id>`; hardware uses its own stable hardware keys.
- Array order defines both card cycling and enlarged hover-preview order.
- One stored image means one displayed image. Multiple images may cycle, and hover preview shows them together in stored order.
- Enlarged hover preview shows images only, not filenames, and must stay inside the viewport.
- When researching artwork for a Japanese game, search Chinese, English, and Japanese titles and prefer the earliest Japanese cover or official Japanese material.
- Normally keep one to four reviewable candidate images per work instead of accumulating large duplicate sets.
- Do not automatically replace artwork the user has already selected or imported through GM.
- GM add, replace, reorder, and delete operations modify the real repository files and manifest. There is no hidden “restore default image” layer.
- When renaming a timeline, check its asset directory, manifest global, image collection ID, GM service mapping, and public label together.

Start the GM service through `start-gm-server.cmd` only when the user explicitly wants to operate the media manager. Automated validation must not start a background server.

## Adding a Game Timeline: Complete Integration Checklist

The safest approach is to copy the existing timeline whose structure is closest, then replace its content and global names. Do not copy a timeline and change only the page title.

### 1. Create the Directory

Create `timelines/<TimelineName>/`. The directory should correspond semantically to the displayed timeline title and use a filesystem-safe spelling. Standard contents:

```text
README.md
selection-criteria.js
releases.js
milestones.js
editorial-reading.js
design-logic.js
series-impact.js
external-impact-research.js
plot-summaries.js
decision-chain.js
timeline-images.js
assets/covers/
```

`decision-chain.js` must remain structurally compatible even though the interface currently hides it. Add an override file similar to `verified-content.js` only when a real layering need exists.

### 2. Define Release Data

Use stable, unique IDs that do not change with the displayed title:

```js
window.EXAMPLE_RELEASES = [
  {
    id: "example-1",
    date: "2000.01.01",
    category: "正传",
    tag: "正传 · RPG",
    name: "Example Game",
    chineseName: "示例游戏",
    lineage: "重制：Original Game",
    first: [{ year: 2000, platform: "PS2" }],
    later: [{ year: 2020, platform: "NS / PC" }]
  }
];
```

A timeline may add fields, but must not casually rename the base fields consumed by shared rendering.

### 3. Write Selection and Research Data

- `selection-criteria.js` must directly answer why the included works were selected and which works are excluded.
- Supply compatible editorial, mechanism, impact, and plot records for every release ID.
- Do not fabricate industry impact when evidence is absent.
- Add timeline-specific material through the definition's `supplementFor` hook rather than changing every series' shared detail structure.

### 4. Register Artwork

- Copy candidate files into the timeline's `assets/covers/` directory.
- Register repository-relative paths under stable keys in `timeline-images.js`.
- Add the new manifest global to the fallback collection in `common/timeline-image-store.js`.
- Register the manifest file, global variable, and asset directory in `scripts/local-gm-server.js` under `manifestDefinitions`.

### 5. Connect the Page

- Append a tab button and matching panel to `index.html`, preserving creation order.
- Load every timeline script in dependency order in `index.html`. Its `timeline-images.js` must load before `common/timeline-image-store.js` and `common/app.js`.
- Register the timeline in the element map and `gameSeriesDefinitions()` in `common/app.js`. Supply a stable ID, display label, release array, DOM element, theme, image collection ID, card class, detail class, color, tag function, criteria, milestones, and content maps.
- A new definition automatically becomes an overview filter option but is not selected by default. Overview must reuse the timeline's original cards and details rather than duplicate a new UI.
- Add the series theme variable and necessary theme selectors to `common/styles.css`; keep dimensions, typography, and spacing on shared rules.

### 6. Connect Auditing

- Register release, editorial, design, series impact, industry impact, plot, decision-chain, milestone, and optional override files in `scripts/timeline-registry.js`.
- Confirm static validation can discover the new script tags, image manifest, and local files.
- Add a directory `README.md` describing scope, visible information, file ownership, image rules, and validation commands.

## Boundaries When Editing Existing Timelines

- Inspect the working tree first and never overwrite unrelated user changes.
- Keep timeline-specific releases, text, milestones, and artwork inside their timeline directory instead of moving them into `common/`.
- Keep shared dimensions, layout, card structure, and common interaction in `common/`; do not duplicate shared code for one series.
- A primary-card rule change applies to every timeline by default. A detail-content change applies only to the named timeline by default.
- New series become overview filter options, while the overview remains empty by default.
- Do not restore previously hidden features such as the old hardware card grid, artwork-boundary debug control, research prompts, or design-decision chains.
- Do not expose the GM manager as a public-site feature.

## Validation and Anti-Hang Rules

Routine validation requires no local server. Run:

```text
node scripts/validate-markdown-docs.js
node scripts/validate-static-site.js
node scripts/audit-english-localization.js
node scripts/audit-english-terminology.js
node scripts/audit-english-prose.js
node scripts/audit-hardware-data.js
node scripts/audit-release-data.js
node scripts/audit-timeline-content.js
```

Hardware audit is optional when only a game series changes. Static validation still runs when only hardware changes. A new game timeline must pass both release and content audits.

Never use `Start-Process`, `start /b`, `Start-Job`, or another detached/hidden server for routine validation. Only changes to the GM HTTP API justify a foreground server test, and that test must use an operating-system-assigned temporary port, enforce a hard timeout, and close the server in `finally`.

## Delivery Format

- Briefly state what changed and why.
- List the validation commands actually run and their results; explicitly state anything not run.
- By default, provide `Summary` and `Description` text ready to paste into GitHub Desktop.
- Do not commit, push, or delete user files unless the user explicitly asks.

## Final AI Checklist

Before finishing, verify:

- Did I read the target timeline's selection criteria instead of guessing its scope from the series name?
- Does the primary card still follow the shared dimensions and region order?
- Is the date genuinely the earliest worldwide public release?
- Did an ordinary port accidentally become a primary card?
- Do changes, mechanics, and impact identify concrete rules rather than generic claims?
- Are images stored under the correct timeline, registered in the manifest, and manageable through GM?
- Is a new timeline connected to the page, overview, image store, GM service, and audit registry?
- Did I avoid starting a background server?
- Did documentation, static-resource validation, and relevant focused audits pass?
