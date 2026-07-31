# Timeline Card Architecture

This document records the current shared presentation contract for every timeline. It describes behavior that is visible in the application; timeline-specific research rules remain in each timeline directory.

## Design Goal

The primary timeline is a common comparison surface. Hardware and game-series entries must feel like parts of the same product even when their colors, labels, images and expanded information differ.

The shared layer controls:

- axis, release points and connector lines;
- chronological layout and minimum spacing;
- primary-card dimensions and typography;
- hover, selected and focus states;
- image placement, cycling and enlarged preview behavior;
- milestone and organization-change markers;
- the connected detail stack opened from a primary card.

Timeline modules control their own data, selection criteria, accent colors and detail fields.

## Primary Card Contract

Every primary card uses the same ordered regions:

1. earliest verified release date at the upper left;
2. right-aligned category tag at the upper right;
3. primary title;
4. subtitle;
5. optional supporting line;
6. compact footer at the lower left;
7. optional artwork area at the lower right.

The date and tag share a baseline. A long tag grows leftward until it approaches the date, then truncates with an ellipsis; its full text remains available through the native tooltip. Titles and subtitles follow the same rule when artwork reduces their usable width.

Artwork never changes the external size of the card. When no artwork exists, text may use the reserved area. When artwork exists, it is right-aligned and scales within the media bounds without distortion. Multiple images cycle in stored order, and hover preview shows every stored image while staying inside the viewport.

Cards on opposite sides of the axis use identical dimensions. Their connector line reaches the card edge, and the release point represents the entry date without introducing false chronological order.

## Hardware Primary Cards

Hardware cards map the shared regions as follows:

- **title**: hardware name;
- **subtitle**: concise historical position, preferably complete on the first line;
- **supporting line**: the hardware's defining technical or product characteristic;
- **footer**: number of models or revisions;
- **tag**: manufacturer;
- **artwork**: repository-local hardware image when available.

Product-line identity is intentionally excluded from the primary card and appears in the connected details.

## Game-Series Primary Cards

Game cards map the shared regions as follows:

- **title**: English or original release title;
- **subtitle**: concise Chinese title without redundant series prefixes where the context is already clear;
- **supporting line**: remake source, ROM-hack base, edition structure or another timeline-specific relationship when needed;
- **footer**: number of recorded platforms or a timeline-specific expansion hint;
- **tag**: branch/type or another compact classification;
- **artwork**: repository-local cover, logo or promotional image.

Each game timeline supplies its own palette, but hover and selected states are derived consistently from that palette.

## Connected Detail Stack

Clicking a primary card opens one connected information window on the card's outer side. The interface does not label sections as “level 2”, “level 3” or “level 4”, and it does not display large wrapper headings such as “系列解读”, “剧情解读” or “客观记录”. Information is presented through compact field labels inside a unified stack.

### Game-Series Order

The standard order is:

1. series interpretation: version structure when needed, core experience, changes, mechanism logic, series impact and verified industry impact;
2. plot summary and narrative innovation;
3. first-release and later-platform records, including material version differences;
4. timeline-specific supplements, such as Pokemon starter trios.

Research prompts and design-decision chains remain available in source data for future editorial work, but the public interface currently hides them. Industry impact is omitted when the evidence does not support a concrete claim.

### Hardware Order

The standard order is:

1. product-line identity;
2. models and revisions;
3. launch-window and signature games.

Hardware detail cards use the same compact container and typography rules as game-series details, while keeping hardware-specific content.

## Timeline Markers

Markers live between the card and the axis so they do not consume primary-card space.

- **domestic milestone**: the work that established or decisively expanded recognition in its original market;
- **global milestone**: the work that created a major international breakthrough;
- **integration milestone**: the first confirmed release after a relevant studio, company or project-team integration.

A release may carry more than one marker. Each marker exposes a concise explanation on hover or keyboard focus. Marker claims require a concrete reason and should not be inferred solely from sales rank.

## Chronology and Layout

- Entries sort by their earliest verified worldwide public release.
- Full dates are preferred for games; hardware keeps the highest precision supported by evidence.
- Layout compresses long empty periods for readability but preserves chronological order.
- Cards may alternate sides when that reduces unused space. Nearby entries on the same side keep the shared minimum gap and never overlap.
- Entries in different months do not receive artificial same-date offsets. Truly identical dates may be separated visually without changing their order.
- The center axis remains continuous through selection criteria, cards and the end of the visible timeline.

## Overview Reuse

The game-series overview does not create duplicate card implementations. It reads registered timelines, reuses each timeline's primary-card mapping, palette, images and connected details, then merges selected releases by date. No series is selected by default; newly registered timelines become available to the overview filter but are not automatically shown.

## Data and Asset Ownership

Each timeline directory owns its release data, editorial analysis, selection criteria, milestones, image manifest and assets. Shared rendering and layout code lives under `common/`.

Runtime images must come from repository-relative paths registered in the timeline's `timeline-images.js`. The public site does not fetch Wiki images or other remote artwork at runtime. The GM tool edits the same manifests and local asset folders used by the public timeline.

When a timeline is renamed, update its directory, registrations, manifest identifiers, GM mapping and public label together. Filesystem-safe directory names do not have to reproduce spaces or punctuation in the displayed title, but ownership must remain unambiguous.

## Accessibility and Responsive Rules

- Primary cards remain keyboard focusable and expose the same details as pointer interaction.
- Truncated text keeps its full value in a tooltip or accessible label.
- Image navigation areas receive descriptive labels without permanently covering the artwork.
- Enlarged image previews are constrained to the viewport and never require horizontal page scrolling.
- On narrow screens, card and detail placement may stack, but the information order and card hierarchy remain unchanged.
