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
// Every timeline sorts by its data source's earliest worldwide public retail release date.
const releaseDates = window.CONSOLE_RELEASE_DATES || {};
const platformVariants = window.CONSOLE_PLATFORM_VARIANTS || {};
const curatedGames = window.CONSOLE_CURATED_GAMES || {};
const gameLocalizations = window.CONSOLE_GAME_LOCALIZATIONS || {};
const pokemonReleases = window.POKEMON_CORE_RELEASES || [];
const finalFantasyReleases = window.FINAL_FANTASY_RELEASES || [];
const xenobladeReleases = window.XENOBLADE_RELEASES || [];
const pokemonReleaseInsights = window.POKEMON_RELEASE_INSIGHTS || {};
const finalFantasyReleaseInsights = window.FINAL_FANTASY_RELEASE_INSIGHTS || {};
const pokemonEditorialReading = window.POKEMON_EDITORIAL_READING || {};
const finalFantasyEditorialReading = window.FINAL_FANTASY_EDITORIAL_READING || {};
const pokemonSeriesImpact = window.POKEMON_SERIES_IMPACT || {};
const finalFantasySeriesImpact = window.FINAL_FANTASY_SERIES_IMPACT || {};
const pokemonDesignLogic = window.POKEMON_DESIGN_LOGIC || {};
const finalFantasyDesignLogic = window.FINAL_FANTASY_DESIGN_LOGIC || {};
const pokemonExternalImpactResearch = window.POKEMON_EXTERNAL_IMPACT_RESEARCH || {};
const finalFantasyExternalImpactResearch = window.FINAL_FANTASY_EXTERNAL_IMPACT_RESEARCH || {};
const pokemonPlotSummaries = window.POKEMON_PLOT_SUMMARIES || {};
const finalFantasyPlotSummaries = window.FINAL_FANTASY_PLOT_SUMMARIES || {};
const xenobladeEditorialReading = window.XENOBLADE_EDITORIAL_READING || {};
const xenobladeDesignLogic = window.XENOBLADE_DESIGN_LOGIC || {};
const xenobladeSeriesImpact = window.XENOBLADE_SERIES_IMPACT || {};
const xenobladeExternalImpactResearch = window.XENOBLADE_EXTERNAL_IMPACT_RESEARCH || {};
const xenobladePlotSummaries = window.XENOBLADE_PLOT_SUMMARIES || {};
const finalFantasyCovers = window.FINAL_FANTASY_RELEASE_COVERS || {};
const finalFantasyLogos = window.FINAL_FANTASY_RELEASE_LOGOS || {};
const timelineImageStore = window.timelineImageStore;
let managedTimelineImages = {};
const FINAL_FANTASY_DISPLAY_TAGS = {
  ff1: ["正传", "RPG"], ff2: ["正传", "RPG"], ff3: ["正传", "RPG"], ff4: ["正传", "RPG"],
  ff5: ["正传", "RPG"], ff6: ["正传", "RPG"], ff7: ["正传", "RPG"], ff8: ["正传", "RPG"],
  ff9: ["正传", "RPG"], ffx: ["正传", "RPG"], ff12: ["正传", "RPG"], ff13: ["正传", "RPG"],
  ff15: ["正传", "动作 RPG"], ff16: ["正传", "动作 RPG"], ff11: ["正传", "MMO"], "ff14-1": ["正传", "MMO"],
  "ff14-arr": ["正传", "MMO"],
  "mystic-quest": ["外传", "RPG"], "four-heroes": ["外传", "RPG"], "ff-explorers": ["外传", "动作 RPG"],
  "stranger-of-paradise": ["外传", "动作 RPG"],
  "ff-tactics": ["战略版", "战棋"], "ff-tactics-advance": ["战略版", "战棋"], "ff-tactics-a2": ["战略版", "战棋"],
  "chocobo-no-fushigi": ["陆行鸟", "迷宫探索"], "chocobo-no-fushigi-2": ["陆行鸟", "迷宫探索"],
  "chocobo-racing": ["陆行鸟", "赛车"], "chocobo-tales": ["陆行鸟", "卡牌"],
  "chocobos-dungeon": ["陆行鸟", "迷宫探索"], "chocobo-gp": ["陆行鸟", "赛车"],
  "crystal-chronicles": ["水晶编年史", "动作 RPG"], "ring-of-fates": ["水晶编年史", "动作 RPG"],
  "echoes-of-time": ["水晶编年史", "动作 RPG"], "crystal-bearers": ["水晶编年史", "动作冒险"],
  "my-life-as-king": ["水晶编年史", "城市建设"], "my-life-as-darklord": ["水晶编年史", "塔防"],
  "ff7-snowboarding": ["VII", "竞速"], "before-crisis": ["VII", "动作 RPG"], "dirge-cerberus": ["VII", "第三人称射击"],
  "crisis-core": ["VII", "动作 RPG"], "ff7-g-bike": ["VII", "竞速"], "ff7-first-soldier": ["VII", "大逃杀"],
  "ff7-ever-crisis": ["VII", "RPG"], "ff7-remake": ["VII 重制", "动作 RPG"], "ff7-rebirth": ["VII 重制", "动作 RPG"],
  ff3d: ["重制", "RPG"], "ff4-3d-remake": ["重制", "RPG"],
  "ffx-2": ["正传续作", "RPG"], "ff4-after-years": ["正传续作", "RPG"], "ff13-2": ["正传续作", "RPG"],
  "lightning-returns": ["正传续作", "动作 RPG"],
  "ff12-rw": ["伊瓦利斯", "战略 RPG"], "type-0": ["零式", "动作 RPG"], "ff-agito": ["零式", "RPG"],
  "ff-dimensions": ["移动端", "RPG"], "ff-dimensions-2": ["移动端", "RPG"], "mobius-ff": ["移动端", "RPG"]
};
const POKEMON_STARTERS_BY_GENERATION = {
  "世代 1": [["Bulbasaur", "妙蛙种子"], ["Charmander", "小火龙"], ["Squirtle", "杰尼龟"]],
  "世代 2": [["Chikorita", "菊草叶"], ["Cyndaquil", "火球鼠"], ["Totodile", "小锯鳄"]],
  "世代 3": [["Treecko", "木守宫"], ["Torchic", "火稚鸡"], ["Mudkip", "水跃鱼"]],
  "世代 4": [["Turtwig", "草苗龟"], ["Chimchar", "小火焰猴"], ["Piplup", "波加曼"]],
  "世代 5": [["Snivy", "藤藤蛇"], ["Tepig", "暖暖猪"], ["Oshawott", "水水獭"]],
  "世代 6": [["Chespin", "哈力栗"], ["Fennekin", "火狐狸"], ["Froakie", "呱呱泡蛙"]],
  "世代 7": [["Rowlet", "木木枭"], ["Litten", "火斑喵"], ["Popplio", "球球海狮"]],
  "世代 8": [["Grookey", "敲音猴"], ["Scorbunny", "炎兔儿"], ["Sobble", "泪眼蜥"]],
  "世代 9": [["Sprigatito", "新叶喵"], ["Fuecoco", "呆火鳄"], ["Quaxly", "润水鸭"]]
};
const POKEMON_STARTER_OVERRIDES = {
  yellow: [["Pikachu", "皮卡丘"]],
  "lets-go": [["Pikachu", "皮卡丘"], ["Eevee", "伊布"]],
  "legends-arceus": [["Rowlet", "木木枭"], ["Cyndaquil", "火球鼠"], ["Oshawott", "水水獭"]],
  "legends-za": [["Chikorita", "菊草叶"], ["Tepig", "暖暖猪"], ["Totodile", "小锯鳄"]]
};
const POKEMON_SPRITE_IDS = {
  Bulbasaur: 1, Charmander: 4, Squirtle: 7, Pikachu: 25, Eevee: 133,
  Chikorita: 152, Cyndaquil: 155, Totodile: 158, Treecko: 252, Torchic: 255, Mudkip: 258,
  Turtwig: 387, Chimchar: 390, Piplup: 393, Snivy: 495, Tepig: 498, Oshawott: 501,
  Chespin: 650, Fennekin: 653, Froakie: 656, Rowlet: 722, Litten: 725, Popplio: 728,
  Grookey: 810, Scorbunny: 813, Sobble: 816, Sprigatito: 906, Fuecoco: 909, Quaxly: 912
};
const POKEMON_RELEASE_COVERS = {
  "red-green-blue": [["red.png", "Pokémon Red"], ["green.png", "Pokémon Green"], ["blue.png", "Pokémon Blue"]],
  yellow: [["yellow.png", "Pokémon Yellow"]],
  "gold-silver": [["gold.png", "Pokémon Gold"], ["silver.png", "Pokémon Silver"]],
  crystal: [["crystal.png", "Pokémon Crystal"]],
  "ruby-sapphire": [["ruby.png", "Pokémon Ruby"], ["sapphire.png", "Pokémon Sapphire"]],
  "firered-leafgreen": [["firered.png", "Pokémon FireRed"], ["leafgreen.png", "Pokémon LeafGreen"]],
  emerald: [["emerald.png", "Pokémon Emerald"]],
  "diamond-pearl": [["diamond.png", "Pokémon Diamond"], ["pearl.png", "Pokémon Pearl"]],
  platinum: [["platinum.png", "Pokémon Platinum"]],
  "heartgold-soulsilver": [["heartgold.png", "Pokémon HeartGold"], ["soulsilver.png", "Pokémon SoulSilver"]],
  "black-white": [["black.png", "Pokémon Black"], ["white.png", "Pokémon White"]],
  "black2-white2": [["black-2.png", "Pokémon Black 2"], ["white-2.png", "Pokémon White 2"]],
  "x-y": [["x.png", "Pokémon X"], ["y.png", "Pokémon Y"]],
  oras: [["omega-ruby.png", "Pokémon Omega Ruby"], ["alpha-sapphire.png", "Pokémon Alpha Sapphire"]],
  "sun-moon": [["sun.png", "Pokémon Sun"], ["moon.png", "Pokémon Moon"]],
  "ultra-sun-moon": [["ultra-sun.png", "Pokémon Ultra Sun"], ["ultra-moon.png", "Pokémon Ultra Moon"]],
  "lets-go": [["lets-go-pikachu.png", "Let's Go, Pikachu!"], ["lets-go-eevee.png", "Let's Go, Eevee!"]],
  "sword-shield": [["sword.png", "Pokémon Sword"], ["shield.png", "Pokémon Shield"]],
  bdsp: [["brilliant-diamond.png", "Brilliant Diamond"], ["shining-pearl.png", "Shining Pearl"]],
  "legends-arceus": [["legends-arceus.png", "Pokémon Legends: Arceus"]],
  "scarlet-violet": [["scarlet.png", "Pokémon Scarlet"], ["violet.png", "Pokémon Violet"]],
  "legends-za": [["legends-za.png", "Pokémon Legends: Z-A"]]
};
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
const TIMELINE_TYPE_GROUPS = {
  hybrid: ["hybrid", "pc"],
  handheld: ["handheld", "remote", "phone"],
  home: ["home", "dedicated", "add-on", "educational", "tabletop"]
};
const TIMELINE_LAYOUT = {
  cardGap: 14,
  minimumTimeGap: 20,
  maximumTimeGap: 52,
  monthScale: 0.95
};

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
  pokemonTimeline: document.querySelector("#pokemonTimeline"),
  finalFantasyTimeline: document.querySelector("#finalFantasyTimeline"),
  xenobladeTimeline: document.querySelector("#xenobladeTimeline"),
  timelineArtworkDebug: document.querySelector("#timelineArtworkDebug"),
  imageManager: document.querySelector("#imageManager"),
  template: document.querySelector("#platformTemplate")
};

let selectedPokemonReleaseId = null;
let selectedFinalFantasyReleaseId = null;
let selectedXenobladeReleaseId = null;
const pokemonArtworkIndices = new Map();
let pokemonCoverPreview = null;
let imageManagerCategory = "hardware";
let imageManagerSearch = "";
let gmImageManagerOpen = false;
let imageManagerRefreshTimer = null;

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
  if (TIMELINE_TYPE_GROUPS.hybrid.some((type) => normalized.includes(type))) return "hybrid";
  if (TIMELINE_TYPE_GROUPS.handheld.some((type) => normalized.includes(type))) return "handheld";
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
  return `${platform.year}.${month ? String(month).padStart(2, "0") : "--"}`;
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
  return Math.min(
    TIMELINE_LAYOUT.maximumTimeGap,
    Math.max(TIMELINE_LAYOUT.minimumTimeGap, Math.round(monthsElapsed * TIMELINE_LAYOUT.monthScale))
  );
}

function layoutTimelinePlatforms(platforms, sideAssignments, selectedId, reserveDetailSpace) {
  const cardHeight = 132;
  const cardGap = TIMELINE_LAYOUT.cardGap;
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
  brandTag.title = platform.brand;
  brandTag.style.setProperty("--brand-color", brandColor(platform.brand));

  const topRow = document.createElement("div");
  topRow.className = "timeline-node-top";
  topRow.append(year, brandTag);

  const name = document.createElement("strong");
  name.textContent = platform.name;
  name.title = platform.name;

  const meta = document.createElement("span");
  meta.className = "timeline-node-meta";
  const variants = variantsForPlatform(platform);
  meta.textContent = `${variants.length} 个型号`;

  button.append(topRow, name, meta);
  const artworkKey = `hardware:${id}`;
  if (managedImagesFor(artworkKey).length) {
    node.classList.add("timeline-primary-card-has-artwork");
    appendReleaseArtwork(button, { id }, {}, "", artworkKey, "timeline-hardware-artwork");
  }
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
  const managedKey = `hardware:${platformId(platform)}`;
  if (managedTimelineImages[managedKey]?.length) return { images: managedTimelineImages[managedKey], title: platform.name };
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
  source.href = images[0].page || image.page || images[0].src;
  source.target = "_blank";
  source.rel = "noreferrer";
  source.textContent = `图片来源：${image.title || images.map((item) => item.title).join(" / ")}`;
  caption.append(source);
  media.classList.add("loaded");
  if (gmImageManagerOpen) scheduleImageManagerRefresh();
}

function scheduleImageManagerRefresh() {
  window.clearTimeout(imageManagerRefreshTimer);
  imageManagerRefreshTimer = window.setTimeout(() => renderImageManager(), 250);
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
  renderPokemonTimeline();
  renderFinalFantasyTimeline();
  renderXenobladeTimeline();
}

function pokemonPlatformCard(entry) {
  const { platform, change } = platformRecordDisplay(entry.platform);
  const displayPlatform = change ? `${platform} · ${change}` : platform;
  return `<article class="pokemon-platform-card">
    <strong>${entry.year}</strong>
    <p title="${entry.platform}">${displayPlatform}</p>
  </article>`;
}

function platformRecordDisplay(platform) {
  const match = platform.match(/^(.*?)(?:（([^）]+)）|\(([^)]+)\))$/);
  const name = match ? match[1].trim() : platform;
  const change = match?.[2] || match?.[3] || "";
  return { platform: platformDisplayName(name), change };
}

function platformDisplayName(platform) {
  return platform
    .replace(/PlayStation Network/g, "PSN")
    .replace(/PlayStation Portable/g, "PSP")
    .replace(/PlayStation Vita/g, "PS Vita")
    .replace(/PlayStation 5/g, "PS5")
    .replace(/PlayStation 4/g, "PS4")
    .replace(/PlayStation 3/g, "PS3")
    .replace(/PlayStation 2/g, "PS2")
    .replace(/PlayStation/g, "PS")
    .replace(/Nintendo Switch 2/g, "NS2")
    .replace(/Nintendo Switch/g, "NS");
}

function pokemonSubtitle(chineseName) {
  return chineseName.replace(/^\u5b9d\u53ef\u68a6[\uff1a:\s]*/, "");
}

function appendPokemonReleaseArtwork(card, release) {
  appendReleaseArtwork(card, release, {}, "", `pokemon:${release.id}`);
}

function informationCard(level, title, fields, extra = null) {
  const card = document.createElement("section");
  card.className = `timeline-information-card timeline-information-card-level-${level}`;
  const fieldMarkup = fields.map(({ label, value }) => `
    <div class="timeline-information-field"><span>${label}</span><p>${value}</p></div>`).join("");
  const headingMarkup = title ? `<header><h3>${title}</h3></header>` : "";
  card.innerHTML = `${headingMarkup}<div class="timeline-information-fields">${fieldMarkup}</div>`;
  if (extra) card.append(extra);
  return card;
}

function plotSummaryCard(plot) {
  const fields = [{ label: "剧情概要", value: plot.summary }];
  if (plot.innovation) fields.push({ label: "叙事创新", value: plot.innovation });
  return informationCard(3, "剧情解读", fields);
}

function seriesInterpretationCard(insight) {
  const fields = [
    ...(insight.loop ? [{ label: "核心体验", value: insight.loop }] : []),
    ...(insight.change ? [{ label: "本作变化", value: insight.change }] : []),
    ...(insight.designLogic ? [{ label: "机制逻辑", value: insight.designLogic }] : []),
    ...(insight.legacy ? [{ label: "系列影响", value: insight.legacy }] : []),
    ...(insight.industryImpact ? [{ label: "行业影响", value: insight.industryImpact }] : []),
    ...(insight.note ? [{ label: "研究线索", value: insight.note }] : [])
  ];
  return informationCard(2, "系列解读", fields);
}

function pokemonInsightFor(release) {
  const insight = pokemonReleaseInsights[release.id] || {};
  const editorial = pokemonEditorialReading[release.id] || {};
  const externalImpact = pokemonExternalImpactResearch[release.id];
  const relation = release.remakeOf
    ? `重制自 ${pokemonSubtitle(release.remakeOf.chineseName)}`
    : release.modOf
      ? `改版自 ${pokemonSubtitle(release.modOf)}`
      : release.official === false
        ? `${release.workType || "同人作品"} · ${release.creator || "未知制作者"}`
        : release.generation;
  return {
    position: insight.position || relation,
    loop: editorial.loop || null,
    change: editorial.change || null,
    designLogic: pokemonDesignLogic[release.id] || null,
    legacy: pokemonSeriesImpact[release.id] || null,
    industryImpact: externalImpact?.status === "verified" ? externalImpact.summary : null,
    note: editorial.note || null
  };
}

function finalFantasyInsightFor(release) {
  const insight = finalFantasyReleaseInsights[release.id] || {};
  const editorial = finalFantasyEditorialReading[release.id] || {};
  const externalImpact = finalFantasyExternalImpactResearch[release.id];
  return {
    position: finalFantasyDisplayTag(release),
    loop: editorial.loop || null,
    change: editorial.change || null,
    designLogic: finalFantasyDesignLogic[release.id] || null,
    legacy: finalFantasySeriesImpact[release.id] || null,
    industryImpact: externalImpact?.status === "verified" ? externalImpact.summary : null,
    note: editorial.note || null
  };
}

function xenobladeInsightFor(release) {
  const editorial = xenobladeEditorialReading[release.id] || {};
  const externalImpact = xenobladeExternalImpactResearch[release.id];
  return {
    loop: editorial.loop || null,
    change: editorial.change || null,
    designLogic: xenobladeDesignLogic[release.id] || null,
    legacy: xenobladeSeriesImpact[release.id] || null,
    industryImpact: externalImpact?.status === "verified" ? externalImpact.summary : null,
    note: editorial.note || null
  };
}

function platformRecordCard(release, extra = null) {
  const first = release.first.map((entry) => pokemonPlatformCard(entry)).join("");
  const later = release.later.length
    ? release.later.map((entry) => pokemonPlatformCard(entry)).join("")
    : '<p class="pokemon-empty">暂无后续独立版本</p>';
  const record = document.createElement("div");
  record.innerHTML = `<div class="pokemon-platform-group"><h4>首次登陆</h4><div class="pokemon-platform-list">${first}</div></div>
    <div class="pokemon-platform-group"><h4>后续登陆</h4><div class="pokemon-platform-list">${later}</div></div>`;
  if (extra) record.append(extra);
  return informationCard(3, "", [], record);
}

function releasePlatformCount(release) {
  return [...release.first, ...release.later].reduce((total, entry) => {
    const platformNames = entry.platform.replace(/（.*?）/g, "").split(/\s*\/\s*/).filter(Boolean);
    return total + platformNames.length;
  }, 0);
}

function appendFinalFantasyReleaseArtwork(card, release) {
  appendReleaseArtwork(card, release, {}, "", `final-fantasy:${release.id}`);
}

function appendXenobladeReleaseArtwork(card, release) {
  appendReleaseArtwork(card, release, {}, "", `xenoblade:${release.id}`);
}

function appendReleaseArtwork(card, release, coverMap, assetDirectory, artworkKey, artworkClass = "") {
  const managed = managedImagesFor(artworkKey);
  const rawArtworks = managed;
  const artworks = rawArtworks.length && typeof rawArtworks[0] === "string" ? [rawArtworks] : rawArtworks;
  if (!artworks.length) return;

  let artworkIndex = pokemonArtworkIndices.get(artworkKey) || 0;
  artworkIndex %= artworks.length;
  const frame = document.createElement("div");
  frame.className = "pokemon-release-artwork";
  if (artworkClass) frame.classList.add(artworkClass);
  const image = document.createElement("img");
  image.alt = "";
  image.decoding = "async";
  image.draggable = false;
  image.addEventListener("load", () => {
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const displayedWidth = Math.min(frame.clientWidth, frame.clientHeight * imageRatio);
    frame.style.setProperty("--cover-display-width", `${Math.round(displayedWidth)}px`);
  });
  bindPokemonCoverPreview(image, artworks, assetDirectory);
  frame.append(image);

  const updateArtwork = () => {
    const [filename, label] = artworks[artworkIndex];
    image.src = resolveArtworkSource(filename, assetDirectory);
    image.alt = label;
    pokemonArtworkIndices.set(artworkKey, artworkIndex);
  };

  if (artworks.length > 1) {
    frame.classList.add("pokemon-release-artwork-switchable");
    frame.addEventListener("click", (event) => {
      event.stopPropagation();
      const frameBounds = frame.getBoundingClientRect();
      const displayedWidth = Number.parseFloat(frame.style.getPropertyValue("--cover-display-width")) || frameBounds.width;
      const imageLeft = frameBounds.width - displayedWidth;
      const pointerOffset = event.clientX - frameBounds.left;
      if (pointerOffset < imageLeft) return;
      artworkIndex = pointerOffset - imageLeft < displayedWidth / 2
        ? (artworkIndex - 1 + artworks.length) % artworks.length
        : (artworkIndex + 1) % artworks.length;
      updateArtwork();
    });
  }

  updateArtwork();
  card.append(frame);
}

function managedImagesFor(key) {
  return (managedTimelineImages[key] || []).map((image) => [image.src, image.name]);
}

function hasManagedImages(key) {
  return Object.prototype.hasOwnProperty.call(managedTimelineImages, key);
}

function resolveArtworkSource(source, assetDirectory) {
  if (/^(?:https?:|blob:|data:|\/)/.test(source)) return source;
  return assetDirectory ? `${assetDirectory}/${source}` : source;
}

function bindPokemonCoverPreview(image, artworks, assetDirectory) {
  const showPreview = (event) => {
    const preview = pokemonCoverPreview || document.createElement("div");
    if (!pokemonCoverPreview) {
      preview.className = "pokemon-cover-preview";
      document.body.append(preview);
      pokemonCoverPreview = preview;
    }

    const previewArtworks = artworks.length > 1 ? artworks : [[image.currentSrc || image.src, image.alt]];
    const gap = 8;
    const frameChrome = 14;
    const viewportMargin = 16;
    const availableWidth = window.innerWidth - viewportMargin * 2 - frameChrome - gap * (previewArtworks.length - 1);
    const availableHeight = window.innerHeight - viewportMargin * 2 - frameChrome;
    const previewSize = Math.min(
      320,
      Math.max(1, Math.floor(availableWidth / previewArtworks.length)),
      Math.max(1, availableHeight)
    );
    preview.replaceChildren(...previewArtworks.map(([source, label]) => {
      const previewImage = document.createElement("img");
      previewImage.src = resolveArtworkSource(source, assetDirectory);
      previewImage.alt = label;
      return previewImage;
    }));
    preview.style.setProperty("--cover-preview-size", `${previewSize}px`);
    preview.hidden = false;
    positionPokemonCoverPreview(preview, event);
  };

  image.addEventListener("pointerenter", showPreview);
  image.addEventListener("pointermove", (event) => {
    if (pokemonCoverPreview && !pokemonCoverPreview.hidden) {
      positionPokemonCoverPreview(pokemonCoverPreview, event);
    }
  });
  image.addEventListener("pointerleave", () => {
    if (pokemonCoverPreview) pokemonCoverPreview.hidden = true;
  });
}

function positionPokemonCoverPreview(preview, event) {
  const gap = 16;
  const previewBounds = preview.getBoundingClientRect();
  const preferredLeft = event.clientX + gap + previewBounds.width > window.innerWidth
    ? event.clientX - previewBounds.width - gap
    : event.clientX + gap;
  const maximumLeft = Math.max(gap, window.innerWidth - previewBounds.width - gap);
  const maximumTop = Math.max(gap, window.innerHeight - previewBounds.height - gap);
  const left = Math.min(Math.max(gap, preferredLeft), maximumLeft);
  const top = Math.min(Math.max(gap, event.clientY - 36), maximumTop);
  preview.style.left = `${left}px`;
  preview.style.top = `${top}px`;
}

function staticArtworkEntries(rawArtworks, directory) {
  const artworks = rawArtworks?.length && typeof rawArtworks[0] === "string" ? [rawArtworks] : rawArtworks || [];
  return artworks.map(([filename, name]) => ({ src: resolveArtworkSource(filename, directory), name }));
}

function consoleFallbackImages(platform) {
  const manual = manualImageForPlatform(platform);
  if (manual?.images?.length) return manual.images.map((image) => ({ src: image.src, name: image.title || platform.name }));
  if (manual?.src) return [{ src: manual.src, name: manual.title || platform.name }];
  const local = localImages[platformId(platform)];
  if (local?.images?.length) return local.images.map((image) => ({ src: image.src, name: image.title || platform.name }));
  if (local?.src) return [{ src: local.src, name: local.title || platform.name }];
  try {
    const cached = JSON.parse(localStorage.getItem(imageKey(platform)) || "null");
    if (cached?.images?.length) return cached.images.map((image) => ({ src: image.src, name: image.title || platform.name }));
    if (cached?.src) return [{ src: cached.src, name: cached.title || platform.name }];
  } catch {
    return [];
  }
  return [];
}

function imageManagerGroups() {
  return [
    {
      id: "hardware",
      label: "游戏主机",
      entries: allPlatforms.map((platform) => ({
        key: `hardware:${platformId(platform)}`,
        title: platform.name,
        meta: `${platform.brand} · ${releaseDateLabel(platform)}`
      }))
    },
    {
      id: "pokemon",
      label: "Pokémon",
      entries: pokemonReleases.map((release) => ({
        key: `pokemon:${release.id}`,
        title: release.name,
        meta: pokemonSubtitle(release.chineseName)
      }))
    },
    {
      id: "final-fantasy",
      label: "Final Fantasy",
      entries: finalFantasyReleases.map((release) => ({
        key: `final-fantasy:${release.id}`,
        title: release.name,
        meta: release.chineseName
      }))
    },
    {
      id: "xenoblade",
      label: "Xenoblade",
      entries: xenobladeReleases.map((release) => ({
        key: `xenoblade:${release.id}`,
        title: release.name,
        meta: release.chineseName
      }))
    }
  ];
}

function renderImageManager() {
  if (!elements.imageManager) return;
  const groups = imageManagerGroups();
  const activeGroup = groups.find((group) => group.id === imageManagerCategory) || groups[0];
  const search = imageManagerSearch.trim().toLocaleLowerCase();
  const entries = activeGroup.entries
    .filter((entry) => !search || `${entry.title} ${entry.meta}`.toLocaleLowerCase().includes(search))
    .sort((a, b) => a.title.localeCompare(b.title, "en"));

  const header = document.createElement("header");
  header.className = "image-manager-header";
  const heading = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "Timeline Media";
  const title = document.createElement("h2");
  title.textContent = "时间线图片";
  heading.append(eyebrow, title);
  const searchInput = document.createElement("input");
  searchInput.type = "search";
  searchInput.placeholder = "搜索卡片";
  searchInput.value = imageManagerSearch;
  searchInput.addEventListener("input", () => {
    imageManagerSearch = searchInput.value;
    renderImageManager();
  });
  const headerActions = document.createElement("div");
  headerActions.className = "image-manager-header-actions";
  const openFolderButton = document.createElement("button");
  openFolderButton.type = "button";
  openFolderButton.className = "image-manager-open-folder";
  openFolderButton.textContent = "打开仓库图片目录";
  openFolderButton.title = "在资源管理器中打开 assets 文件夹";
  openFolderButton.addEventListener("click", async () => {
    if (!timelineImageStore) return;
    try {
      await timelineImageStore.openAssetsFolder();
    } catch {
      window.alert("无法打开本地图片目录。请确认正在使用本地 GM 服务。");
    }
  });
  headerActions.append(openFolderButton, searchInput);
  header.append(heading, headerActions);

  const tabs = document.createElement("div");
  tabs.className = "image-manager-tabs";
  groups.forEach((group) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `image-manager-tab${group.id === activeGroup.id ? " active" : ""}`;
    button.textContent = `${group.label} ${group.entries.length}`;
    button.addEventListener("click", () => {
      imageManagerCategory = group.id;
      imageManagerSearch = "";
      renderImageManager();
    });
    tabs.append(button);
  });

  const grid = document.createElement("div");
  grid.className = "image-manager-grid";
  entries.forEach((entry) => grid.append(createImageManagerEntry(entry)));
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "image-manager-empty";
    empty.textContent = "没有匹配的卡片";
    grid.append(empty);
  }
  elements.imageManager.replaceChildren(header, tabs, grid);
}

function createImageManagerEntry(entry) {
  const card = document.createElement("article");
  card.className = "image-manager-card";
  const header = document.createElement("div");
  header.className = "image-manager-card-head";
  const text = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = entry.title;
  title.title = entry.title;
  const meta = document.createElement("p");
  meta.textContent = entry.meta;
  text.append(title, meta);
  const managed = managedTimelineImages[entry.key] || [];
  header.append(text);

  const images = managed;
  const strip = document.createElement("div");
  strip.className = "image-manager-strip";
  if (images.length) {
    images.forEach((image, index) => {
      const item = document.createElement("label");
      item.className = "image-manager-thumbnail";
      const preview = document.createElement("img");
      preview.src = image.src;
      preview.alt = image.name || "";
      preview.loading = "lazy";
      preview.title = image.name || "";
      const caption = document.createElement("span");
      caption.textContent = `${index + 1}`;
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.addEventListener("change", () => {
        if (input.files?.[0]) updateManagedImage(() => timelineImageStore.replaceImage(entry.key, image.id, input.files[0]));
        input.value = "";
      });
      item.append(preview, caption, input);
      if (managed.length) {
        const controls = document.createElement("div");
        controls.className = "image-manager-image-actions";
        controls.append(
          imageManagerIconButton("←", "前移", () => updateManagedImage(() => timelineImageStore.moveImage(entry.key, image.id, -1))),
          imageManagerIconButton("→", "后移", () => updateManagedImage(() => timelineImageStore.moveImage(entry.key, image.id, 1)))
        );
        item.append(controls);
      }
      item.append(imageManagerDeleteButton(entry.key, image.id));
      strip.append(item);
    });
  } else {
    const empty = document.createElement("span");
    empty.textContent = "暂无图片";
    strip.append(empty);
  }

  const actions = document.createElement("div");
  actions.className = "image-manager-actions";
  actions.append(
    imageManagerFileAction("添加", (files) => updateManagedImage(() => timelineImageStore.append(entry.key, files)))
  );
  card.append(header, strip, actions);
  return card;
}

function imageManagerIconButton(icon, title, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "image-manager-icon-button";
  button.textContent = icon;
  button.title = title;
  button.setAttribute("aria-label", title);
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    handler();
  });
  return button;
}

function imageManagerDeleteButton(key, imageId) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "image-manager-delete-button";
  button.textContent = "×";
  button.title = "删除图片";
  button.setAttribute("aria-label", "删除图片");
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!window.confirm("确认删除这张图片吗？")) return;
    updateManagedImage(() => timelineImageStore.removeImage(key, imageId));
  });
  return button;
}

function imageManagerFileAction(label, handler) {
  const labelElement = document.createElement("label");
  labelElement.className = "image-manager-file-action";
  labelElement.textContent = label;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.multiple = true;
  input.addEventListener("change", () => {
    if (input.files?.length) handler(input.files);
    input.value = "";
  });
  labelElement.append(input);
  return labelElement;
}

async function updateManagedImage(update) {
  if (!timelineImageStore) return;
  await update();
  managedTimelineImages = await timelineImageStore.loadAll();
  render();
  renderImageManager();
}

function renderPokemonTimeline() {
  if (!elements.pokemonTimeline) return;
  elements.pokemonTimeline.textContent = "";

  const releases = [...pokemonReleases].sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
  const reserveDetailSpace = window.matchMedia?.("(max-width: 760px)").matches;
  const layout = layoutPokemonReleases(releases, reserveDetailSpace);
  const axis = document.createElement("div");
  axis.className = "vertical-timeline pokemon-vertical-timeline";
  const canvas = document.createElement("section");
  canvas.className = "timeline-year-row pokemon-timeline-canvas";
  canvas.style.setProperty("--year-row-height", `${layout.height}px`);
  const leftContent = document.createElement("div");
  leftContent.className = "timeline-year-content timeline-year-content-left";
  const rightContent = document.createElement("div");
  rightContent.className = "timeline-year-content timeline-year-content-right";
  const yearRail = document.createElement("div");
  yearRail.className = "timeline-year-rail";
  const leftItems = document.createElement("div");
  leftItems.className = "timeline-year-items";
  const rightItems = document.createElement("div");
  rightItems.className = "timeline-year-items";

  releases.forEach((release) => {
    const itemLayout = layout.items.get(release.id);
    const branch = document.createElement("div");
    branch.className = `timeline-branch pokemon-branch ${itemLayout.side === "left" ? "timeline-branch-left" : "timeline-branch-right"}${selectedPokemonReleaseId === release.id ? " selected" : ""}`;
    branch.style.setProperty("--branch-offset", itemLayout.branchOffset);
    branch.style.setProperty("--month-offset", `${itemLayout.top}px`);
    branch.style.setProperty("--pokemon-color", release.official === false ? "var(--pokemon-fan)" : "var(--pokemon-official)");

    const stack = document.createElement("div");
    stack.className = "timeline-card-anchor pokemon-release-stack";
    const card = document.createElement("article");
    card.className = "pokemon-release-card";
    if (managedImagesFor(`pokemon:${release.id}`).length) {
      card.classList.add("pokemon-release-card-has-artwork", "timeline-primary-card-has-artwork");
    }
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-expanded", String(selectedPokemonReleaseId === release.id));
    const releaseLabel = release.official === false
      ? `${release.workType || "同人作品"}・${release.creator || "未知制作者"}`
      : release.generation;
    const platformTotal = releasePlatformCount(release);
    const cardLineage = release.remakeOf
      ? `<span class="pokemon-card-lineage">重制：${pokemonSubtitle(release.remakeOf.chineseName)}</span>`
      : release.modOf
        ? `<span class="pokemon-card-lineage">改版：${pokemonSubtitle(release.modOf)}</span>`
        : "";
    card.innerHTML = `<div class="pokemon-release-head"><time>${pokemonReleaseDateLabel(release)}</time><span class="pokemon-release-tag" title="${releaseLabel}">${releaseLabel}</span></div>
      <div class="pokemon-release-title"><strong title="${release.name}">${release.name}</strong><p title="${pokemonSubtitle(release.chineseName)}">${pokemonSubtitle(release.chineseName)}</p>${cardLineage}</div>
      <div class="pokemon-release-foot"><small>${platformTotal} 个平台</small></div>`;
    appendPokemonReleaseArtwork(card, release);
    const toggleRelease = () => {
      selectedPokemonReleaseId = selectedPokemonReleaseId === release.id ? null : release.id;
      renderPokemonTimeline();
    };
    card.addEventListener("click", toggleRelease);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleRelease();
    });
    stack.append(card);

    if (selectedPokemonReleaseId === release.id) {
      const flyout = document.createElement("section");
      flyout.className = `timeline-detail-flyout timeline-detail-flyout-${itemLayout.side} pokemon-detail-flyout`;
      const detail = document.createElement("section");
      detail.className = "pokemon-release-detail timeline-information-stack";
      const insight = pokemonInsightFor(release);
      const snapshot = seriesInterpretationCard(insight);
      const plot = plotSummaryCard(pokemonPlotSummaries[release.id] || {
        summary: "当前版本尚未整理该作品的剧情概要。"
      });
      const record = platformRecordCard(release);
      const supplement = informationCard(4, "补充信息", [], createPokemonStartersPanel(release));
      detail.append(snapshot, plot, record, supplement);
      flyout.append(detail);
      stack.append(flyout);
    }

    branch.append(stack);
    if (itemLayout.side === "left") leftItems.append(branch);
    else rightItems.append(branch);
  });

  leftContent.append(leftItems);
  rightContent.append(rightItems);
  canvas.append(leftContent, yearRail, rightContent);
  axis.append(canvas);
  elements.pokemonTimeline.append(axis);
}

function pokemonStartersForRelease(release) {
  if (release.official === false) return [];
  return POKEMON_STARTER_OVERRIDES[release.id] || POKEMON_STARTERS_BY_GENERATION[release.generation.split("・")[0]] || [];
}

function createPokemonStartersPanel(release) {
  const panel = document.createElement("section");
  panel.className = "pokemon-starters-panel";
  const starters = pokemonStartersForRelease(release);
  const title = document.createElement("h3");
  title.textContent = "御三家";
  panel.append(title);

  if (!starters.length) {
    const empty = document.createElement("p");
    empty.textContent = "非官方作品，初始伙伴资料不适用。";
    panel.append(empty);
    return panel;
  }

  const list = document.createElement("div");
  list.className = "pokemon-starter-list";
  starters.forEach(([englishName, chineseName]) => {
    const item = document.createElement("article");
    item.className = "pokemon-starter-card";
    const names = document.createElement("div");
    names.className = "pokemon-starter-names";
    names.innerHTML = `<strong>${englishName}</strong><span>${chineseName}</span>`;
    const sprite = document.createElement("img");
    sprite.className = "pokemon-starter-sprite";
    const spriteId = POKEMON_SPRITE_IDS[englishName];
    sprite.src = spriteId ? `timelines/pokemon/assets/sprites/${spriteId}.png` : "";
    sprite.alt = `${englishName} 像素图`;
    sprite.loading = "lazy";
    item.append(names);
    item.append(sprite);
    list.append(item);
  });
  panel.append(list);
  return panel;
}

function releaseTimeIndex(release) {
  const [year, month = 1, day = 1] = release.date.split(".").map(Number);
  const utcDay = Date.UTC(year, month - 1, day) / 86400000;
  return utcDay / (365.2425 / 12);
}

function pokemonReleaseDateLabel(release) {
  const [year, month = "--", day = "--"] = release.date.split(".");
  return `${year}.${month}.${day}`;
}

function layoutPokemonReleases(releases, reserveDetailSpace) {
  const items = new Map();
  const lastByLine = new Map();
  const lastBottomBySide = { left: -Infinity, right: -Infinity };
  const monthCounts = {};
  let previous = null;
  let fallbackSide = "left";
  let lastTimelineTop = 0;
  let lastReleaseIndex = null;
  let maxBottom = 0;

  releases.forEach((release) => {
    const releaseIndex = releaseTimeIndex(release);
    const line = release.official === false ? "fan" : "official";
    const priorOnLine = lastByLine.get(line);
    let side;

    if (priorOnLine && Math.abs(releaseIndex - releaseTimeIndex(priorOnLine)) <= 18) {
      side = items.get(priorOnLine.id).side;
    } else if (previous && Math.abs(releaseIndex - releaseTimeIndex(previous)) <= 18) {
      side = previous.official === release.official ? items.get(previous.id).side : oppositeSide(items.get(previous.id).side);
    } else if (priorOnLine) {
      side = oppositeSide(items.get(priorOnLine.id).side);
    } else {
      side = fallbackSide;
      fallbackSide = oppositeSide(fallbackSide);
    }

    const chronologicalTop = lastReleaseIndex === null || releaseIndex === lastReleaseIndex
      ? lastTimelineTop
      : lastTimelineTop + compactTimelineGap(releaseIndex - lastReleaseIndex);
    const collisionTop = Number.isFinite(lastBottomBySide[side])
      ? lastBottomBySide[side] + TIMELINE_LAYOUT.cardGap
      : 0;
    const top = Math.max(chronologicalTop, collisionTop);
    const monthKey = `${side}-${releaseIndex}`;
    const branchOffset = monthCounts[monthKey] || 0;
    const occupiedHeight = reserveDetailSpace && selectedPokemonReleaseId === release.id ? 760 : 132;

    items.set(release.id, { side, top, branchOffset });
    monthCounts[monthKey] = branchOffset + 1;
    lastBottomBySide[side] = top + occupiedHeight;
    lastByLine.set(line, release);
    previous = release;
    lastTimelineTop = top;
    lastReleaseIndex = releaseIndex;
    maxBottom = Math.max(maxBottom, top + occupiedHeight);
  });

  return { items, height: Math.max(118, maxBottom + 10) };
}

function gameReleaseDateLabel(release) {
  const [year, month = "--", day = "--"] = release.date.split(".");
  return `${year}.${month}.${day}`;
}

function finalFantasyDisplayTag(release) {
  const tag = FINAL_FANTASY_DISPLAY_TAGS[release.id];
  return tag ? `${tag[0]} · ${tag[1]}` : release.category;
}

function renderFinalFantasyTimeline() {
  if (!elements.finalFantasyTimeline) return;
  elements.finalFantasyTimeline.textContent = "";

  const releases = [...finalFantasyReleases].sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
  const reserveDetailSpace = window.matchMedia?.("(max-width: 760px)").matches;
  const layout = layoutCategorizedReleases(releases, reserveDetailSpace, selectedFinalFantasyReleaseId);
  const axis = document.createElement("div");
  axis.className = "vertical-timeline final-fantasy-vertical-timeline";
  const canvas = document.createElement("section");
  canvas.className = "timeline-year-row final-fantasy-timeline-canvas";
  canvas.style.setProperty("--year-row-height", `${layout.height}px`);
  const leftContent = document.createElement("div");
  leftContent.className = "timeline-year-content timeline-year-content-left";
  const rightContent = document.createElement("div");
  rightContent.className = "timeline-year-content timeline-year-content-right";
  const yearRail = document.createElement("div");
  yearRail.className = "timeline-year-rail";
  const leftItems = document.createElement("div");
  leftItems.className = "timeline-year-items";
  const rightItems = document.createElement("div");
  rightItems.className = "timeline-year-items";

  releases.forEach((release) => {
    const itemLayout = layout.items.get(release.id);
    const branch = document.createElement("div");
    branch.className = `timeline-branch pokemon-branch final-fantasy-branch ${itemLayout.side === "left" ? "timeline-branch-left" : "timeline-branch-right"}${selectedFinalFantasyReleaseId === release.id ? " selected" : ""}`;
    branch.style.setProperty("--branch-offset", itemLayout.branchOffset);
    branch.style.setProperty("--month-offset", `${itemLayout.top}px`);
    branch.style.setProperty("--pokemon-color", "var(--final-fantasy-color)");

    const stack = document.createElement("div");
    stack.className = "timeline-card-anchor pokemon-release-stack";
    const card = document.createElement("article");
    card.className = "pokemon-release-card final-fantasy-release-card";
    const managedKey = `final-fantasy:${release.id}`;
    if (managedImagesFor(managedKey).length) {
      card.classList.add("timeline-primary-card-has-artwork");
    }
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-expanded", String(selectedFinalFantasyReleaseId === release.id));
    const platformTotal = releasePlatformCount(release);
    const cardLineage = release.lineage
      ? `<span class="final-fantasy-card-lineage" title="${release.lineage}">${release.lineage}</span>`
      : "";
    const displayTag = finalFantasyDisplayTag(release);
    card.innerHTML = `<div class="pokemon-release-head"><time>${gameReleaseDateLabel(release)}</time><span class="pokemon-release-tag" title="${displayTag}">${displayTag}</span></div>
      <div class="pokemon-release-title"><strong title="${release.name}">${release.name}</strong><p title="${release.chineseName}">${release.chineseName}</p>${cardLineage}</div>
      <div class="pokemon-release-foot"><small>${platformTotal} 个平台</small></div>`;
    appendFinalFantasyReleaseArtwork(card, release);
    const toggleRelease = () => {
      selectedFinalFantasyReleaseId = selectedFinalFantasyReleaseId === release.id ? null : release.id;
      renderFinalFantasyTimeline();
    };
    card.addEventListener("click", toggleRelease);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleRelease();
    });
    stack.append(card);

    if (selectedFinalFantasyReleaseId === release.id) {
      const flyout = document.createElement("section");
      flyout.className = `timeline-detail-flyout timeline-detail-flyout-${itemLayout.side} pokemon-detail-flyout final-fantasy-detail-flyout`;
      const detail = document.createElement("section");
      detail.className = "pokemon-release-detail timeline-information-stack";
      const insight = finalFantasyInsightFor(release);
      const snapshot = seriesInterpretationCard(insight);
      const plot = plotSummaryCard(finalFantasyPlotSummaries[release.id] || {
        summary: "当前版本尚未整理该作品的剧情概要。"
      });
      const lineage = release.lineage
        ? Object.assign(document.createElement("div"), { className: "timeline-related-note", textContent: `谱系关系：${release.lineage}` })
        : null;
      const record = platformRecordCard(release, lineage);
      detail.append(snapshot, plot, record);
      flyout.append(detail);
      stack.append(flyout);
    }

    branch.append(stack);
    if (itemLayout.side === "left") leftItems.append(branch);
    else rightItems.append(branch);
  });

  leftContent.append(leftItems);
  rightContent.append(rightItems);
  canvas.append(leftContent, yearRail, rightContent);
  axis.append(canvas);
  elements.finalFantasyTimeline.append(axis);
}

function renderXenobladeTimeline() {
  if (!elements.xenobladeTimeline) return;
  elements.xenobladeTimeline.textContent = "";

  const releases = [...xenobladeReleases].sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
  const reserveDetailSpace = window.matchMedia?.("(max-width: 760px)").matches;
  const layout = layoutCategorizedReleases(releases, reserveDetailSpace, selectedXenobladeReleaseId);
  const axis = document.createElement("div");
  axis.className = "vertical-timeline xenoblade-vertical-timeline";
  const canvas = document.createElement("section");
  canvas.className = "timeline-year-row xenoblade-timeline-canvas";
  canvas.style.setProperty("--year-row-height", `${layout.height}px`);
  const leftContent = document.createElement("div");
  leftContent.className = "timeline-year-content timeline-year-content-left";
  const rightContent = document.createElement("div");
  rightContent.className = "timeline-year-content timeline-year-content-right";
  const yearRail = document.createElement("div");
  yearRail.className = "timeline-year-rail";
  const leftItems = document.createElement("div");
  leftItems.className = "timeline-year-items";
  const rightItems = document.createElement("div");
  rightItems.className = "timeline-year-items";

  releases.forEach((release) => {
    const itemLayout = layout.items.get(release.id);
    const branch = document.createElement("div");
    branch.className = `timeline-branch pokemon-branch xenoblade-branch ${itemLayout.side === "left" ? "timeline-branch-left" : "timeline-branch-right"}${selectedXenobladeReleaseId === release.id ? " selected" : ""}`;
    branch.style.setProperty("--branch-offset", itemLayout.branchOffset);
    branch.style.setProperty("--month-offset", `${itemLayout.top}px`);
    branch.style.setProperty("--pokemon-color", "var(--xenoblade-color)");

    const stack = document.createElement("div");
    stack.className = "timeline-card-anchor pokemon-release-stack";
    const card = document.createElement("article");
    card.className = "pokemon-release-card xenoblade-release-card";
    const managedKey = `xenoblade:${release.id}`;
    if (managedImagesFor(managedKey).length) {
      card.classList.add("timeline-primary-card-has-artwork");
    }
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-expanded", String(selectedXenobladeReleaseId === release.id));
    const platformTotal = releasePlatformCount(release);
    const cardLineage = release.lineage
      ? `<span class="final-fantasy-card-lineage" title="${release.lineage}">${release.lineage}</span>`
      : "";
    const displayTag = release.tag || release.category;
    card.innerHTML = `<div class="pokemon-release-head"><time>${gameReleaseDateLabel(release)}</time><span class="pokemon-release-tag" title="${displayTag}">${displayTag}</span></div>
      <div class="pokemon-release-title"><strong title="${release.name}">${release.name}</strong><p title="${release.chineseName}">${release.chineseName}</p>${cardLineage}</div>
      <div class="pokemon-release-foot"><small>${platformTotal} 个平台</small></div>`;
    appendXenobladeReleaseArtwork(card, release);
    const toggleRelease = () => {
      selectedXenobladeReleaseId = selectedXenobladeReleaseId === release.id ? null : release.id;
      renderXenobladeTimeline();
    };
    card.addEventListener("click", toggleRelease);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleRelease();
    });
    stack.append(card);

    if (selectedXenobladeReleaseId === release.id) {
      const flyout = document.createElement("section");
      flyout.className = `timeline-detail-flyout timeline-detail-flyout-${itemLayout.side} pokemon-detail-flyout xenoblade-detail-flyout`;
      const detail = document.createElement("section");
      detail.className = "pokemon-release-detail timeline-information-stack";
      const snapshot = seriesInterpretationCard(xenobladeInsightFor(release));
      const plot = plotSummaryCard(xenobladePlotSummaries[release.id] || {
        summary: "当前版本尚未整理该作品的剧情概要。"
      });
      const lineage = release.lineage
        ? Object.assign(document.createElement("div"), { className: "timeline-related-note", textContent: `谱系关系：${release.lineage}` })
        : null;
      const record = platformRecordCard(release, lineage);
      detail.append(snapshot, plot, record);
      flyout.append(detail);
      stack.append(flyout);
    }

    branch.append(stack);
    if (itemLayout.side === "left") leftItems.append(branch);
    else rightItems.append(branch);
  });

  leftContent.append(leftItems);
  rightContent.append(rightItems);
  canvas.append(leftContent, yearRail, rightContent);
  axis.append(canvas);
  elements.xenobladeTimeline.append(axis);
}

function layoutCategorizedReleases(releases, reserveDetailSpace, selectedReleaseId) {
  const items = new Map();
  const lastByCategory = new Map();
  const lastBottomBySide = { left: -Infinity, right: -Infinity };
  const monthCounts = {};
  let previous = null;
  let fallbackSide = "left";
  let lastTimelineTop = 0;
  let lastReleaseIndex = null;
  let maxBottom = 0;

  releases.forEach((release) => {
    const releaseIndex = releaseTimeIndex(release);
    const priorInCategory = lastByCategory.get(release.category);
    let side;

    if (previous && Math.abs(releaseIndex - releaseTimeIndex(previous)) <= 18) {
      side = previous.category === release.category
        ? items.get(previous.id).side
        : oppositeSide(items.get(previous.id).side);
    } else if (priorInCategory) {
      side = oppositeSide(items.get(priorInCategory.id).side);
    } else {
      side = fallbackSide;
      fallbackSide = oppositeSide(fallbackSide);
    }

    const chronologicalTop = lastReleaseIndex === null || releaseIndex === lastReleaseIndex
      ? lastTimelineTop
      : lastTimelineTop + compactTimelineGap(releaseIndex - lastReleaseIndex);
    const collisionTop = Number.isFinite(lastBottomBySide[side])
      ? lastBottomBySide[side] + TIMELINE_LAYOUT.cardGap
      : 0;
    const top = Math.max(chronologicalTop, collisionTop);
    const monthKey = `${side}-${releaseIndex}`;
    const branchOffset = monthCounts[monthKey] || 0;
    const occupiedHeight = reserveDetailSpace && selectedReleaseId === release.id ? 480 : 132;

    items.set(release.id, { side, top, branchOffset });
    monthCounts[monthKey] = branchOffset + 1;
    lastBottomBySide[side] = top + occupiedHeight;
    lastByCategory.set(release.category, release);
    previous = release;
    lastTimelineTop = top;
    lastReleaseIndex = releaseIndex;
    maxBottom = Math.max(maxBottom, top + occupiedHeight);
  });

  return { items, height: Math.max(118, maxBottom + 10) };
}

function bindTabs(buttonSelector, panelAttribute) {
  const buttons = [...document.querySelectorAll(buttonSelector)];
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      gmImageManagerOpen = false;
      const managerPanel = document.querySelector("#image-manager-panel");
      if (managerPanel) managerPanel.hidden = true;
      activateTab(buttons, panelAttribute, button);
      saveArchiveLocation();
    });
  });

  return buttons;
}

function activateTab(buttons, panelAttribute, button) {
  buttons.forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", String(active));
    document.querySelector(`#${item.dataset[panelAttribute]}`).hidden = !active;
  });
}

function currentArchiveLocation() {
  if (gmImageManagerOpen) return "gm-images";
  const activeLibrary = document.querySelector("[data-library-tab].active")?.dataset.libraryTab;
  if (activeLibrary === "console-library-panel") return "console";

  const activeSeries = document.querySelector("[data-series-tab].active")?.dataset.seriesTab;
  if (activeSeries === "pokemon-library-panel") return "pokemon";
  if (activeSeries === "final-fantasy-library-panel") return "final-fantasy";
  if (activeSeries === "xenoblade-library-panel") return "xenoblade";
  return "series-overview";
}

function saveArchiveLocation() {
  const location = currentArchiveLocation();
  const url = new URL(window.location.href);
  url.searchParams.delete("gm");
  history.replaceState(null, "", `${url.pathname}${url.search}#${location}`);
}

function restoreArchiveLocation(libraryTabs, seriesTabs) {
  if (new URLSearchParams(window.location.search).get("gm") === "images") {
    gmImageManagerOpen = true;
    libraryTabs.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-selected", "false");
      document.querySelector(`#${button.dataset.libraryTab}`).hidden = true;
    });
    const managerPanel = document.querySelector("#image-manager-panel");
    if (managerPanel) managerPanel.hidden = false;
    return;
  }

  const location = window.location.hash.slice(1);
  if (location === "pokemon") {
    activateTab(libraryTabs, "libraryTab", libraryTabs.find((button) => button.dataset.libraryTab === "series-library-panel"));
    activateTab(seriesTabs, "seriesTab", seriesTabs.find((button) => button.dataset.seriesTab === "pokemon-library-panel"));
    return;
  }

  if (location === "final-fantasy") {
    activateTab(libraryTabs, "libraryTab", libraryTabs.find((button) => button.dataset.libraryTab === "series-library-panel"));
    activateTab(seriesTabs, "seriesTab", seriesTabs.find((button) => button.dataset.seriesTab === "final-fantasy-library-panel"));
    return;
  }

  if (location === "xenoblade") {
    activateTab(libraryTabs, "libraryTab", libraryTabs.find((button) => button.dataset.libraryTab === "series-library-panel"));
    activateTab(seriesTabs, "seriesTab", seriesTabs.find((button) => button.dataset.seriesTab === "xenoblade-library-panel"));
    return;
  }

  if (location === "series-overview") {
    activateTab(libraryTabs, "libraryTab", libraryTabs.find((button) => button.dataset.libraryTab === "series-library-panel"));
    activateTab(seriesTabs, "seriesTab", seriesTabs.find((button) => button.dataset.seriesTab === "series-overview-panel"));
  }

}

function restoreScrollPosition() {
  const savedState = JSON.parse(sessionStorage.getItem("game-archive-scroll-state") || "null");
  if (!savedState || savedState.location !== currentArchiveLocation() || !Number.isFinite(savedState.y) || savedState.y <= 0) return;
  requestAnimationFrame(() => window.scrollTo(0, savedState.y));
}

async function init() {
  if (elements.brandCount) elements.brandCount.textContent = archive.length;
  if (elements.platformCount) elements.platformCount.textContent = allPlatforms.length;
  if (elements.gameCount) elements.gameCount.textContent = totalGames();
  if (elements.variantCount) elements.variantCount.textContent = totalVariants();
  const libraryTabs = bindTabs("[data-library-tab]", "libraryTab");
  const seriesTabs = bindTabs("[data-series-tab]", "seriesTab");
  elements.timelineArtworkDebug?.addEventListener("change", () => {
    document.body.classList.toggle("show-timeline-artwork-bounds", elements.timelineArtworkDebug.checked);
  });
  restoreArchiveLocation(libraryTabs, seriesTabs);
  if (timelineImageStore) managedTimelineImages = await timelineImageStore.loadAll();
  render();
  renderImageManager();
  restoreScrollPosition();
}

window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("game-archive-scroll-state", JSON.stringify({
    location: currentArchiveLocation(),
    y: window.scrollY
  }));
});

init();
