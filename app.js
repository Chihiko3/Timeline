const archive = window.CONSOLE_ARCHIVE;

const state = {
  selectedTimelineId: null,
  timelineBrandVisibility: {},
  imageQueue: new Set()
};

const IMAGE_CACHE_PREFIX = "console-image-v3:";
const IMAGE_NOT_FOUND = "__not_found__";
const WIKI_API = "https://en.wikipedia.org/w/api.php";
const localImages = window.CONSOLE_IMAGES || {};
const imageSources = window.CONSOLE_IMAGE_SOURCES || {};
const releaseDates = window.CONSOLE_RELEASE_DATES || {};
const platformVariants = window.CONSOLE_PLATFORM_VARIANTS || {};
const curatedGames = window.CONSOLE_CURATED_GAMES || {};
const gameLocalizations = window.CONSOLE_GAME_LOCALIZATIONS || {};
const BRAND_COLORS = [
  "#3268b8",
  "#17805d",
  "#c63f3f",
  "#d69a21",
  "#7b61b8",
  "#0f8a9d",
  "#a35f1b",
  "#5f6f7f",
  "#b14d7a",
  "#4f7d2a",
  "#8f563b",
  "#2f7f9f",
  "#9a6f13",
  "#6e5aa8",
  "#a84646",
  "#2f7f68",
  "#4d6fa3"
];

const allPlatforms = archive.flatMap((brand) =>
  brand.platforms.map((platform) => ({
    ...platform,
    brand: brand.brand,
    brandSummary: brand.summary,
    region: brand.region
  }))
);

const elements = {
  brandCount: document.querySelector("#brandCount"),
  platformCount: document.querySelector("#platformCount"),
  gameCount: document.querySelector("#gameCount"),
  variantCount: document.querySelector("#variantCount"),
  timeline: document.querySelector("#timeline"),
  resultsMeta: document.querySelector("#resultsMeta"),
  platformGrid: document.querySelector("#platformGrid"),
  template: document.querySelector("#platformTemplate")
};

function totalGames() {
  return allPlatforms.reduce((sum, platform) => {
    const gameData = gameDataForPlatform(platform);
    return sum + gameData.launchGames.length + gameData.signatureGames.length;
  }, 0);
}

function totalVariants() {
  return allPlatforms.reduce((sum, platform) => sum + variantsForPlatform(platform).length, 0);
}

function gameDataForPlatform(platform) {
  const curated = curatedGames[platformId(platform)];
  if (curated) {
    return {
      launchGames: curated.launchGames || [],
      signatureGames: curated.signatureGames || platform.games,
      note: curated.note || ""
    };
  }

  return {
    launchGames: [],
    signatureGames: platform.games,
    note: ""
  };
}

function gameLocalizationFor(game) {
  const localization = gameLocalizations[game];
  return {
    chineseTitle: localization?.chineseTitle || null,
    url: localization?.url || `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(game)}`
  };
}

function displayChineseGameTitle(title) {
  return title && !/[A-Za-z]/.test(title) ? title : null;
}

function filteredPlatforms() {
  return allPlatforms
    .sort(
      (a, b) =>
        a.year - b.year ||
        releaseMonth(a) - releaseMonth(b) ||
        a.brand.localeCompare(b.brand, "zh-CN")
    );
}

function typeClass(platform) {
  const normalized = platform.type.toLowerCase();
  if (normalized.includes("handheld")) return "handheld";
  if (normalized.includes("hybrid") || normalized.includes("pc")) return "hybrid";
  return "home";
}

function displayType(platform) {
  return platform.type === "Home" ? null : platform.type;
}

function brandColor(brand) {
  const index = archive.findIndex((item) => item.brand === brand);
  return BRAND_COLORS[(index >= 0 ? index : 0) % BRAND_COLORS.length];
}

function releaseMonth(platform) {
  return Number(platform.month || platform.releaseMonth || releaseDates[platformId(platform)]?.month || 6);
}

function releaseDateLabel(platform) {
  const month = platform.month || platform.releaseMonth || releaseDates[platformId(platform)]?.month;
  return month ? `${platform.year}.${String(month).padStart(2, "0")}` : `${platform.year}`;
}

function releaseMonthIndex(platform) {
  return platform.year * 12 + releaseMonth(platform);
}

function monthsBetween(a, b) {
  return Math.abs(releaseMonthIndex(a) - releaseMonthIndex(b));
}

function assignTimelineSides(platforms) {
  const assignments = new Map();
  const lastByBrand = new Map();
  let previous = null;
  let fallbackSide = "left";

  platforms
    .slice()
    .sort(
      (a, b) =>
        releaseMonthIndex(a) - releaseMonthIndex(b) ||
        a.brand.localeCompare(b.brand, "zh-CN") ||
        a.name.localeCompare(b.name, "zh-CN")
    )
    .forEach((platform) => {
      const lastBrandPlatform = lastByBrand.get(platform.brand);
      let side;

      if (lastBrandPlatform && monthsBetween(lastBrandPlatform, platform) <= 18) {
        side = assignments.get(platformId(lastBrandPlatform));
      } else if (previous && monthsBetween(previous, platform) <= 18) {
        const previousSide = assignments.get(platformId(previous));
        side = previous.brand === platform.brand ? previousSide : oppositeSide(previousSide);
      } else if (lastBrandPlatform) {
        side = oppositeSide(assignments.get(platformId(lastBrandPlatform)));
      } else {
        side = fallbackSide;
        fallbackSide = oppositeSide(fallbackSide);
      }

      assignments.set(platformId(platform), side);
      lastByBrand.set(platform.brand, platform);
      previous = platform;
    });

  return assignments;
}

function oppositeSide(side) {
  return side === "left" ? "right" : "left";
}

function compactTimelineGap(monthsElapsed) {
  return Math.min(44, Math.max(14, Math.round(monthsElapsed * 0.9)));
}

function layoutTimelinePlatforms(platforms, sideAssignments, selectedId, reserveDetailSpace) {
  const cardHeight = 106;
  const cardGap = 6;
  const expandedCardHeight = 1300;
  const layouts = new Map();
  const monthCounts = {};
  const lastBottomBySide = { left: -Infinity, right: -Infinity };
  let lastTimelineTop = 0;
  let lastReleaseIndex = null;
  let maxBottom = 0;

  platforms
    .slice()
    .sort(
      (a, b) =>
        releaseMonthIndex(a) - releaseMonthIndex(b) ||
        a.brand.localeCompare(b.brand, "zh-CN") ||
        a.name.localeCompare(b.name, "zh-CN")
    )
    .forEach((platform) => {
      const side = sideAssignments.get(platformId(platform)) || "right";
      const releaseIndex = releaseMonthIndex(platform);
      const chronologicalTop =
        lastReleaseIndex === null || releaseIndex === lastReleaseIndex
          ? lastTimelineTop
          : lastTimelineTop + compactTimelineGap(releaseIndex - lastReleaseIndex);
      const collisionTop = Number.isFinite(lastBottomBySide[side]) ? lastBottomBySide[side] + cardGap : 0;
      const top = Math.max(chronologicalTop, collisionTop);
      const monthKey = `${side}-${releaseIndex}`;
      const branchOffset = monthCounts[monthKey] || 0;
      const occupiedHeight = reserveDetailSpace && platformId(platform) === selectedId ? expandedCardHeight : cardHeight;

      layouts.set(platformId(platform), { side, top, branchOffset });
      monthCounts[monthKey] = branchOffset + 1;
      lastBottomBySide[side] = top + occupiedHeight;
      lastTimelineTop = top;
      lastReleaseIndex = releaseIndex;
      maxBottom = Math.max(maxBottom, top + occupiedHeight);
    });

  return {
    layouts,
    height: Math.max(118, maxBottom + 10)
  };
}

function renderTimeline(platforms) {
  const availableBrands = archive
    .map((item) => item.brand)
    .filter((brand) => platforms.some((platform) => platform.brand === brand));
  const brandControls = createTimelineBrandControls(availableBrands);
  const visiblePlatforms = platforms.filter((platform) => timelineBrandVisible(platform.brand));
  const selectedStillVisible = visiblePlatforms.some((platform) => platformId(platform) === state.selectedTimelineId);
  if (!selectedStillVisible) state.selectedTimelineId = null;

  if (!visiblePlatforms.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "当前厂商开关下没有可显示的主机。";
    elements.timeline.replaceChildren(brandControls, empty);
    return;
  }

  const sideAssignments = assignTimelineSides(visiblePlatforms);
  const reserveDetailSpace = window.matchMedia?.("(max-width: 760px)").matches;
  const timelineLayout = layoutTimelinePlatforms(visiblePlatforms, sideAssignments, state.selectedTimelineId, reserveDetailSpace);

  const axis = document.createElement("div");
  axis.className = "vertical-timeline";
  const row = document.createElement("section");
  row.className = "timeline-year-row timeline-canvas";
  row.style.setProperty("--year-row-height", `${timelineLayout.height}px`);

  const yearRail = document.createElement("div");
  yearRail.className = "timeline-year-rail";
  yearRail.setAttribute("aria-label", "硬件时间线");

  const leftContent = document.createElement("div");
  leftContent.className = "timeline-year-content timeline-year-content-left";
  const rightContent = document.createElement("div");
  rightContent.className = "timeline-year-content timeline-year-content-right";

  const leftItems = document.createElement("div");
  leftItems.className = "timeline-year-items";
  const rightItems = document.createElement("div");
  rightItems.className = "timeline-year-items";
  visiblePlatforms
    .slice()
    .sort(
      (a, b) =>
        releaseMonthIndex(a) - releaseMonthIndex(b) ||
        a.brand.localeCompare(b.brand, "zh-CN") ||
        a.name.localeCompare(b.name, "zh-CN")
    )
    .forEach((platform) => {
      const layout = timelineLayout.layouts.get(platformId(platform));
      const branch = document.createElement("div");
      branch.className = `timeline-branch ${layout.side === "left" ? "timeline-branch-left" : "timeline-branch-right"}`;
      branch.style.setProperty("--branch-offset", layout.branchOffset);
      branch.style.setProperty("--month-offset", `${layout.top}px`);
      const cardAnchor = document.createElement("div");
      cardAnchor.className = "timeline-card-anchor";
      cardAnchor.append(createTimelineNode(platform));
      if (platformId(platform) === state.selectedTimelineId) {
        cardAnchor.append(createTimelineDetailFlyout(platform, layout.side));
      }
      branch.append(cardAnchor);
      if (layout.side === "left") {
        leftItems.append(branch);
      } else {
        rightItems.append(branch);
      }
    });
  leftContent.append(leftItems);
  rightContent.append(rightItems);

  row.append(leftContent, yearRail, rightContent);
  axis.append(row);

  elements.timeline.replaceChildren(brandControls, axis);
}

function timelineBrandVisible(brand) {
  return state.timelineBrandVisibility[brand] ?? true;
}

function createTimelineBrandControls(brands) {
  const controls = document.createElement("div");
  controls.className = "timeline-brand-controls";

  const brandRow = document.createElement("div");
  brandRow.className = "timeline-brand-row";

  const label = document.createElement("span");
  label.textContent = "厂商显示";
  brandRow.append(label);

  const selectAll = document.createElement("button");
  selectAll.type = "button";
  selectAll.className = "timeline-brand-action";
  selectAll.textContent = "全选";
  selectAll.addEventListener("click", () => {
    brands.forEach((brand) => {
      state.timelineBrandVisibility[brand] = true;
    });
    renderTimeline(filteredPlatforms());
  });
  brandRow.append(selectAll);

  const clearAll = document.createElement("button");
  clearAll.type = "button";
  clearAll.className = "timeline-brand-action";
  clearAll.textContent = "全不选";
  clearAll.addEventListener("click", () => {
    brands.forEach((brand) => {
      state.timelineBrandVisibility[brand] = false;
    });
    renderTimeline(filteredPlatforms());
  });
  brandRow.append(clearAll);

  brands.forEach((brand) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `timeline-brand-toggle${timelineBrandVisible(brand) ? " active" : ""}`;
    button.textContent = brand;
    button.setAttribute("aria-pressed", timelineBrandVisible(brand) ? "true" : "false");
    button.addEventListener("click", () => {
      state.timelineBrandVisibility[brand] = !timelineBrandVisible(brand);
      renderTimeline(filteredPlatforms());
    });
    brandRow.append(button);
  });

  const legend = document.createElement("div");
  legend.className = "timeline-type-legend";
  [
    ["home", "家用机"],
    ["handheld", "掌机"],
    ["hybrid", "混合 / PC 掌机"]
  ].forEach(([className, labelText]) => {
    const item = document.createElement("span");
    const swatch = document.createElement("i");
    swatch.className = className;
    item.append(swatch, document.createTextNode(labelText));
    legend.append(item);
  });

  controls.append(brandRow, legend);
  return controls;
}

function createTimelineNode(platform) {
  const node = document.createElement("article");
  node.className = `timeline-node ${typeClass(platform)}`;
  const id = platformId(platform);
  if (state.selectedTimelineId === id) node.classList.add("selected");

  const button = document.createElement("button");
  button.type = "button";
  button.className = "timeline-platform-button";
  button.title = `${platform.year} ${platform.name}`;
  button.setAttribute("aria-pressed", state.selectedTimelineId === id ? "true" : "false");
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    state.selectedTimelineId = state.selectedTimelineId === id ? null : id;
    renderTimeline(filteredPlatforms());
  });

  const year = document.createElement("span");
  year.className = "timeline-node-year";
  year.textContent = releaseDateLabel(platform);

  const brandTag = document.createElement("span");
  brandTag.className = "timeline-brand-tag";
  brandTag.textContent = platform.brand;
  brandTag.style.setProperty("--brand-color", brandColor(platform.brand));

  const topRow = document.createElement("div");
  topRow.className = "timeline-node-top";
  topRow.append(year, brandTag);

  const name = document.createElement("strong");
  name.textContent = platform.name;

  const meta = document.createElement("span");
  meta.className = "timeline-node-meta";
  const variants = variantsForPlatform(platform);
  meta.textContent = `${variants.length} 个型号`;

  button.append(topRow, name, meta);
  node.append(button);

  return node;
}

function createTimelineDetailFlyout(platform, side) {
  const flyout = document.createElement("section");
  flyout.className = `timeline-detail-flyout timeline-detail-flyout-${side}`;
  flyout.setAttribute("aria-live", "polite");
  flyout.append(createTimelineDetail(platform), createTimelineGamesFlyout(platform, side));
  return flyout;
}

function createTimelineGamesFlyout(platform, side) {
  const flyout = document.createElement("section");
  flyout.className = `timeline-games-flyout timeline-games-flyout-${side}`;

  const panel = document.createElement("div");
  panel.className = "timeline-games-panel";
  const title = document.createElement("h3");
  title.textContent = "游戏";
  const groups = document.createElement("div");
  groups.className = "timeline-games-groups";
  const games = gameDataForPlatform(platform);
  appendTimelineGameGroup(groups, "护航 / 首发", games.launchGames);
  appendTimelineGameGroup(groups, "特色 / 高讨论", games.signatureGames);
  panel.append(title, groups);
  flyout.append(panel);
  return flyout;
}

function appendTimelineGameGroup(container, title, games) {
  const group = document.createElement("section");
  group.className = "timeline-games-group";
  const heading = document.createElement("h4");
  heading.textContent = `${title} ${games.length}`;
  group.append(heading);

  if (!games.length) {
    const empty = document.createElement("p");
    empty.textContent = "暂未整理。";
    group.append(empty);
  } else {
    const list = document.createElement("ol");
    list.className = "timeline-games-list";
    games.forEach((game) => {
      const item = document.createElement("li");
      const localization = gameLocalizationFor(game);
      const link = document.createElement("a");
      link.href = localization.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = game;
      link.title = `打开 ${game} 的资料页`;
      item.append(link);
      const chineseTitle = displayChineseGameTitle(localization.chineseTitle);
      if (chineseTitle) {
        const chineseName = document.createElement("span");
        chineseName.className = "timeline-game-chinese-name";
        chineseName.textContent = chineseTitle;
        item.append(document.createTextNode(" - "), chineseName);
      }
      list.append(item);
    });
    group.append(list);
  }

  container.append(group);
}

function createTimelineDetail(platform) {
  const panel = document.createElement("div");
  panel.className = `timeline-detail ${typeClass(platform)}`;

  const header = document.createElement("div");
  header.className = "timeline-detail-header";

  const titleGroup = document.createElement("div");
  const year = document.createElement("span");
  year.className = "timeline-node-year";
  year.textContent = releaseDateLabel(platform);
  const title = document.createElement("h3");
  title.textContent = platform.name;
  titleGroup.append(year, title);
  header.append(titleGroup);

  const note = document.createElement("p");
  note.className = "timeline-detail-note";
  note.textContent = platform.notes;

  const variants = variantsForPlatform(platform);
  if (variants.length) {
    const variantGrid = document.createElement("div");
    variantGrid.className = "timeline-variant-grid";
    if (variants.length <= 5) variantGrid.classList.add("timeline-variant-grid-expanded");
    variants
      .slice()
      .sort((a, b) => (a.year || 9999) - (b.year || 9999) || a.name.localeCompare(b.name, "zh-CN"))
      .forEach((variant) => {
        const item = document.createElement("article");
        item.className = "timeline-variant-card";

        const itemYear = document.createElement("span");
        itemYear.className = "timeline-variant-year";
        itemYear.textContent = variant.year || "年份待补";

        const itemTitle = document.createElement("strong");
        itemTitle.textContent = variant.name;

        const itemMeta = document.createElement("span");
        itemMeta.className = "timeline-variant-meta";
        itemMeta.textContent = variant.kind || "硬件型号";

        const itemHeader = document.createElement("div");
        itemHeader.className = "timeline-variant-header";
        itemHeader.append(itemYear, itemMeta);
        item.append(itemHeader, itemTitle);

        if (variant.note) {
          const itemNote = document.createElement("p");
          itemNote.textContent = variant.note;
          item.append(itemNote);
        }

        variantGrid.append(item);
      });

    const variantsTitle = document.createElement("h4");
    variantsTitle.textContent = `型号 / 改版 ${variants.length}`;
    panel.append(header, note, variantsTitle, variantGrid);
  } else {
    panel.append(header, note);
  }

  return panel;
}

function platformId(platform) {
  return `${platform.brand}-${platform.name}-${platform.year}`.replace(/[^a-z0-9]+/gi, "-");
}

function variantsForPlatform(platform) {
  return platformVariants[platformId(platform)] || [];
}

function imageKey(platform) {
  return `${IMAGE_CACHE_PREFIX}${platformId(platform)}`;
}

function imageQueries(platform) {
  const names = platform.name
    .split("/")
    .map((name) => name.trim())
    .filter(Boolean);
  return [
    `${platform.name} video game console`,
    ...names.map((name) => `${name} console`),
    `${platform.brand} ${platform.name}`,
    platform.name
  ];
}

async function fetchPlatformImage(platform) {
  const manualImage = manualImageForPlatform(platform);
  if (manualImage) return manualImage;

  const localImage = localImages[platformId(platform)];
  if (localImage) return localImage;

  const cacheKey = imageKey(platform);
  const cached = localStorage.getItem(cacheKey);
  if (cached === IMAGE_NOT_FOUND) return null;
  if (cached) return JSON.parse(cached);

  const exactImage = await fetchExactPlatformImage(platform);
  if (exactImage) {
    localStorage.setItem(cacheKey, JSON.stringify(exactImage));
    return exactImage;
  }

  for (const query of imageQueries(platform)) {
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: query,
      gsrlimit: "3",
      prop: "pageimages|info",
      piprop: "thumbnail",
      pithumbsize: "640",
      inprop: "url",
      format: "json",
      origin: "*"
    });

    try {
      const response = await fetch(`${WIKI_API}?${params}`);
      if (!response.ok) continue;
      const payload = await response.json();
      const pages = Object.values(payload.query?.pages || {});
      const match = pages.find((page) => page.thumbnail?.source);
      if (match) {
        const result = {
          src: match.thumbnail.source,
          page: match.fullurl,
          title: match.title
        };
        localStorage.setItem(cacheKey, JSON.stringify(result));
        return result;
      }
    } catch (error) {
      return null;
    }
  }

  localStorage.setItem(cacheKey, IMAGE_NOT_FOUND);
  return null;
}

function manualImageForPlatform(platform) {
  const source = imageSources[platformId(platform)];
  if (source?.images?.length) {
    return {
      images: source.images,
      title: source.title || platform.name
    };
  }
  if (source?.src) {
    return source;
  }
  return null;
}

async function fetchExactPlatformImage(platform) {
  const title = imageSources[platformId(platform)]?.title;
  if (!title) return null;

  const params = new URLSearchParams({
    action: "query",
    titles: title,
    prop: "pageimages|info",
    piprop: "thumbnail",
    pithumbsize: "640",
    redirects: "1",
    inprop: "url",
    format: "json",
    origin: "*"
  });

  try {
    const response = await fetch(`${WIKI_API}?${params}`);
    if (!response.ok) return null;
    const payload = await response.json();
    const pages = Object.values(payload.query?.pages || {});
    const match = pages.find((page) => page.thumbnail?.source);
    if (!match) return null;
    return {
      src: match.thumbnail.source,
      page: match.fullurl,
      title: match.title
    };
  } catch (error) {
    return null;
  }
}

async function hydratePlatformImage(platform, card) {
  const media = card.querySelector(".platform-media");
  const img = media.querySelector("img");
  const caption = media.querySelector("figcaption");
  caption.textContent = "正在匹配图片";

  const image = await fetchPlatformImage(platform);
  if (!image || card.dataset.platformId !== platformId(platform)) {
    caption.textContent = "未匹配到图片";
    return;
  }

  const images = image.images || [image];
  const stack = media.querySelector(".image-stack");
  stack.replaceChildren();
  images.forEach((item) => {
    const imageNode = img.cloneNode();
    imageNode.className = "";
    imageNode.src = item.src;
    imageNode.alt = `${platform.name} 图片`;
    stack.append(imageNode);
  });

  caption.replaceChildren();
  const source = document.createElement("a");
  source.href = images[0].page || image.page;
  source.target = "_blank";
  source.rel = "noreferrer";
  source.textContent = `图片来源：${image.title || images.map((item) => item.title).join(" / ")}`;
  caption.append(source);
  media.classList.add("loaded");
}

function renderCards(platforms) {
  if (platforms.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "没有找到匹配的主机或游戏。";
    elements.platformGrid.replaceChildren(empty);
    return;
  }

  const cards = platforms.map((platform) => {
    const fragment = elements.template.content.cloneNode(true);
    const card = fragment.querySelector(".platform-card");
    card.dataset.platformId = platformId(platform);
    card.dataset.type = platform.type;

    fragment.querySelector(".platform-year").textContent = platform.year;
    fragment.querySelector("h3").textContent = platform.name;
    fragment.querySelector(".platform-brand").textContent = `${platform.brand} · ${platform.region}`;
    fragment.querySelector(".platform-notes").textContent = platform.notes;

    const tagRow = fragment.querySelector(".tag-row");
    [displayType(platform), platform.generation, platform.line].filter(Boolean).forEach((tag) => {
      const node = document.createElement("span");
      node.className = "tag";
      node.textContent = tag;
      tagRow.append(node);
    });

    const variants = variantsForPlatform(platform);
    const variantDetails = fragment.querySelector(".variant-details");
    variantDetails.querySelector("summary").textContent = `型号 / 改版 ${variants.length} 项`;
    renderVariants(variantDetails.querySelector(".variant-list"), variants);

    const gameData = gameDataForPlatform(platform);
    const gameCount = gameData.launchGames.length + gameData.signatureGames.length;
    fragment.querySelector(".game-details summary").textContent = `护航与特色游戏 ${gameCount} 款`;
    const gameGroups = fragment.querySelector(".game-groups");
    renderGameGroup(gameGroups, "护航 / 早期主推", gameData.launchGames);
    renderGameGroup(gameGroups, "特色 / 高讨论", gameData.signatureGames);
    if (gameData.note) {
      const sourceNote = document.createElement("p");
      sourceNote.className = "source-note";
      sourceNote.textContent = gameData.note;
      gameGroups.append(sourceNote);
    }

    queueMicrotask(() => hydratePlatformImage(platform, card));

    return fragment;
  });

  elements.platformGrid.replaceChildren(...cards);
}

function renderMeta(platforms) {
  const games = platforms.reduce((sum, platform) => {
    const gameData = gameDataForPlatform(platform);
    return sum + gameData.launchGames.length + gameData.signatureGames.length;
  }, 0);
  elements.resultsMeta.textContent = `当前显示 ${platforms.length} 台硬件，覆盖 ${games} 个护航与特色游戏条目。`;
}

function renderGameGroup(container, title, games) {
  const section = document.createElement("section");
  section.className = "game-group";

  const heading = document.createElement("h4");
  heading.textContent = `${title} ${games.length ? games.length : 0}`;
  section.append(heading);

  if (!games.length) {
    const empty = document.createElement("p");
    empty.className = "source-note";
    empty.textContent = "暂未整理。";
    section.append(empty);
    container.append(section);
    return;
  }

  const list = document.createElement("ol");
  list.className = "game-list";
  games.forEach((game) => {
    const item = document.createElement("li");
    item.textContent = game;
    list.append(item);
  });
  section.append(list);
  container.append(section);
}

function renderVariants(container, variants) {
  if (!variants.length) {
    const empty = document.createElement("p");
    empty.className = "source-note";
    empty.textContent = "暂未整理型号。";
    container.append(empty);
    return;
  }

  variants.forEach((variant) => {
    const item = document.createElement("article");
    item.className = "variant-item";

    const title = document.createElement("h4");
    title.textContent = `${variant.year || "年份待补"} · ${variant.name}`;

    const meta = document.createElement("p");
    meta.className = "variant-meta";
    meta.textContent = variant.kind || "硬件型号";

    const note = document.createElement("p");
    note.textContent = variant.note || "";

    item.append(title, meta, note);
    container.append(item);
  });
}

function render() {
  const platforms = filteredPlatforms();
  renderTimeline(platforms);
  renderMeta(platforms);
  renderCards(platforms);
}

function bindTabs(buttonSelector, panelAttribute) {
  const buttons = [...document.querySelectorAll(buttonSelector)];
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const panelId = button.dataset[panelAttribute];
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
        document.querySelector(`#${item.dataset[panelAttribute]}`).hidden = !active;
      });
      document.querySelector(`#${panelId}`).hidden = false;
    });
  });
}

function init() {
  elements.brandCount.textContent = archive.length;
  elements.platformCount.textContent = allPlatforms.length;
  elements.gameCount.textContent = totalGames();
  if (elements.variantCount) elements.variantCount.textContent = totalVariants();
  bindTabs("[data-library-tab]", "libraryTab");
  bindTabs("[data-series-tab]", "seriesTab");
  render();
}

init();
