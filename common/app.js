const archive = window.CONSOLE_ARCHIVE;
const SHOW_DESIGN_DECISION_CHAINS = false;
const SHOW_RESEARCH_PROMPTS = false;
const SHOW_HARDWARE_CARD_GRID = false;

const state = {
  selectedTimelineId: null,
  timelineBrandVisibility: {}
};

// Every timeline sorts by its data source's earliest worldwide public retail release date.
const releaseDates = window.CONSOLE_RELEASE_DATES || {};
const platformVariants = window.CONSOLE_PLATFORM_VARIANTS || {};
const curatedGames = window.CONSOLE_CURATED_GAMES || {};
const gameLocalizations = window.CONSOLE_GAME_LOCALIZATIONS || {};
const pokemonReleases = window.POKEMON_CORE_RELEASES || [];
const finalFantasyReleases = window.FINAL_FANTASY_RELEASES || [];
const dragonQuestReleases = window.DRAGON_QUEST_RELEASES || [];
const likeADragonReleases = window.LIKE_A_DRAGON_RELEASES || [];
const xenobladeReleases = window.XENOBLADE_RELEASES || [];
const spikeSeriesReleases = window.SPIKE_SERIES_RELEASES || [];
const pokemonMilestones = window.POKEMON_MILESTONES || {};
const finalFantasyMilestones = window.FINAL_FANTASY_MILESTONES || {};
const dragonQuestMilestones = window.DRAGON_QUEST_MILESTONES || {};
const likeADragonMilestones = window.LIKE_A_DRAGON_MILESTONES || {};
const xenobladeMilestones = window.XENOBLADE_MILESTONES || {};
const spikeSeriesMilestones = window.SPIKE_SERIES_MILESTONES || {};
const pokemonEditorialReading = window.POKEMON_EDITORIAL_READING || {};
const finalFantasyEditorialReading = window.FINAL_FANTASY_EDITORIAL_READING || {};
const pokemonDecisionChains = window.POKEMON_DECISION_CHAINS || {};
const finalFantasyDecisionChains = window.FINAL_FANTASY_DECISION_CHAINS || {};
const pokemonDecisionChainReview = window.POKEMON_DECISION_CHAIN_REVIEW || {};
const finalFantasyDecisionChainReview = window.FINAL_FANTASY_DECISION_CHAIN_REVIEW || {};
const pokemonSeriesImpact = window.POKEMON_SERIES_IMPACT || {};
const finalFantasySeriesImpact = window.FINAL_FANTASY_SERIES_IMPACT || {};
const pokemonDesignLogic = window.POKEMON_DESIGN_LOGIC || {};
const finalFantasyDesignLogic = window.FINAL_FANTASY_DESIGN_LOGIC || {};
const pokemonExternalImpactResearch = window.POKEMON_EXTERNAL_IMPACT_RESEARCH || {};
const finalFantasyExternalImpactResearch = window.FINAL_FANTASY_EXTERNAL_IMPACT_RESEARCH || {};
const pokemonPlotSummaries = window.POKEMON_PLOT_SUMMARIES || {};
const finalFantasyPlotSummaries = window.FINAL_FANTASY_PLOT_SUMMARIES || {};
const dragonQuestEditorialReading = window.DRAGON_QUEST_EDITORIAL_READING || {};
const dragonQuestDesignLogic = window.DRAGON_QUEST_DESIGN_LOGIC || {};
const dragonQuestSeriesImpact = window.DRAGON_QUEST_SERIES_IMPACT || {};
const dragonQuestExternalImpactResearch = window.DRAGON_QUEST_EXTERNAL_IMPACT_RESEARCH || {};
const dragonQuestPlotSummaries = window.DRAGON_QUEST_PLOT_SUMMARIES || {};
const dragonQuestDecisionChains = window.DRAGON_QUEST_DECISION_CHAINS || {};
const dragonQuestDecisionChainReview = window.DRAGON_QUEST_DECISION_CHAIN_REVIEW || {};
const likeADragonEditorialReading = window.LIKE_A_DRAGON_EDITORIAL_READING || {};
const likeADragonDesignLogic = window.LIKE_A_DRAGON_DESIGN_LOGIC || {};
const likeADragonSeriesImpact = window.LIKE_A_DRAGON_SERIES_IMPACT || {};
const likeADragonExternalImpactResearch = window.LIKE_A_DRAGON_EXTERNAL_IMPACT_RESEARCH || {};
const likeADragonPlotSummaries = window.LIKE_A_DRAGON_PLOT_SUMMARIES || {};
const likeADragonDecisionChains = window.LIKE_A_DRAGON_DECISION_CHAINS || {};
const likeADragonDecisionChainReview = window.LIKE_A_DRAGON_DECISION_CHAIN_REVIEW || {};
const xenobladeEditorialReading = window.XENOBLADE_EDITORIAL_READING || {};
const xenobladeDesignLogic = window.XENOBLADE_DESIGN_LOGIC || {};
const xenobladeSeriesImpact = window.XENOBLADE_SERIES_IMPACT || {};
const xenobladeExternalImpactResearch = window.XENOBLADE_EXTERNAL_IMPACT_RESEARCH || {};
const xenobladePlotSummaries = window.XENOBLADE_PLOT_SUMMARIES || {};
const xenobladeDecisionChains = window.XENOBLADE_DECISION_CHAINS || {};
const xenobladeDecisionChainReview = window.XENOBLADE_DECISION_CHAIN_REVIEW || {};
const spikeSeriesEditorialReading = window.SPIKE_SERIES_EDITORIAL_READING || {};
const spikeSeriesDesignLogic = window.SPIKE_SERIES_DESIGN_LOGIC || {};
const spikeSeriesImpact = window.SPIKE_SERIES_IMPACT || {};
const spikeSeriesExternalImpactResearch = window.SPIKE_SERIES_EXTERNAL_IMPACT_RESEARCH || {};
const spikeSeriesPlotSummaries = window.SPIKE_SERIES_PLOT_SUMMARIES || {};
const spikeSeriesDecisionChains = window.SPIKE_SERIES_DECISION_CHAINS || {};
const spikeSeriesDecisionChainReview = window.SPIKE_SERIES_DECISION_CHAIN_REVIEW || {};
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
  "ff-dimensions": ["移动端", "RPG"], "ff-dimensions-2": ["移动端", "RPG"], "mobius-ff": ["移动端", "RPG"],
  dissidia: ["Dissidia", "对战动作"], "dissidia-012": ["Dissidia", "对战动作"],
  "dissidia-arcade-nt": ["Dissidia", "团队对战"], "opera-omnia": ["Dissidia", "回合制 RPG"],
  "dissidia-duellum": ["Dissidia", "团队竞速"],
  "theatrhythm-ff": ["Theatrhythm", "音乐节奏"], "theatrhythm-curtain-call": ["Theatrhythm", "音乐节奏"],
  "theatrhythm-final-bar-line": ["Theatrhythm", "音乐节奏"],
  "record-keeper": ["跨作品", "档案 RPG"], "world-of-ff": ["跨作品", "育成 RPG"],
  "brave-exvius": ["Brave Exvius", "RPG"], "wotv-ffbe": ["Brave Exvius", "战棋"]
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
  seriesOverviewTimeline: document.querySelector("#series-overview-panel"),
  pokemonTimeline: document.querySelector("#pokemonTimeline"),
  finalFantasyTimeline: document.querySelector("#finalFantasyTimeline"),
  dragonQuestTimeline: document.querySelector("#dragonQuestTimeline"),
  likeADragonTimeline: document.querySelector("#likeADragonTimeline"),
  xenobladeTimeline: document.querySelector("#xenobladeTimeline"),
  spikeSeriesTimeline: document.querySelector("#spikeSeriesTimeline"),
  timelineArtworkDebug: document.querySelector("#timelineArtworkDebug"),
  imageManager: document.querySelector("#imageManager"),
  template: document.querySelector("#platformTemplate")
};

const selectedSeriesReleaseIds = Object.create(null);
let selectedSeriesOverviewReleaseKey = null;
const selectedSeriesOverviewTimelineIds = new Set();
const releaseArtworkIndices = new Map();
let releaseArtworkPreview = null;
let gameSeriesDefinitionCache = null;
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
      note: curated.note || "",
      launchEmptyLabel: curated.launchEmptyLabel || ""
    };
  }

  return {
    launchGames: [],
    signatureGames: platform.games,
    note: "",
    launchEmptyLabel: ""
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

function hardwareTimelineAccent(platform) {
  return {
    home: "var(--blue)",
    handheld: "var(--green)",
    hybrid: "var(--yellow)"
  }[typeClass(platform)];
}

function hardwarePrimaryCardLineage(platform) {
  const lineage = platform.line?.trim();
  if (!lineage) return "";
  const normalize = (value) => value.toLocaleLowerCase().replace(/[\s\-_/|]+/g, "");
  return normalize(lineage) === normalize(platform.name) ? "" : `产品线：${lineage}`;
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
  return month ? `${platform.year}.${String(month).padStart(2, "0")}` : String(platform.year);
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
  const expandedCardHeight = 760;
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
      const selected = platformId(platform) === state.selectedTimelineId;
      const branch = document.createElement("div");
      branch.className = `timeline-branch hardware-branch ${layout.side === "left" ? "timeline-branch-left" : "timeline-branch-right"}${selected ? " selected" : ""}`;
      branch.style.setProperty("--branch-offset", layout.branchOffset);
      branch.style.setProperty("--month-offset", `${layout.top}px`);
      branch.style.setProperty("--timeline-accent", hardwareTimelineAccent(platform));
      const cardAnchor = document.createElement("div");
      cardAnchor.className = "timeline-card-anchor";
      cardAnchor.append(createTimelineNode(platform));
      if (selected) {
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
  const id = platformId(platform);
  const variants = variantsForPlatform(platform);
  const togglePlatform = (event) => {
    event.stopPropagation();
    state.selectedTimelineId = state.selectedTimelineId === id ? null : id;
    renderTimeline(filteredPlatforms());
  };

  return createTimelinePrimaryCard({
    cardClasses: ["hardware-primary-card"],
    dateLabel: releaseDateLabel(platform),
    tagLabel: platform.brand,
    title: platform.name,
    subtitle: platform.notes,
    lineage: hardwarePrimaryCardLineage(platform),
    footLabel: `${variants.length} 个型号 / 改版`,
    accent: hardwareTimelineAccent(platform),
    tagColor: brandColor(platform.brand),
    artworkKey: `hardware:${id}`,
    isSelected: state.selectedTimelineId === id,
    toggle: togglePlatform
  });
}

function createTimelineDetailFlyout(platform, side) {
  const flyout = document.createElement("section");
  flyout.className = `timeline-detail-flyout timeline-detail-flyout-${side} pokemon-detail-flyout hardware-detail-flyout`;
  flyout.setAttribute("aria-live", "polite");
  const detail = document.createElement("section");
  detail.className = "pokemon-release-detail timeline-information-stack";
  detail.append(createHardwareVariantsCard(platform), createHardwareGamesCard(platform));
  flyout.append(detail);
  return flyout;
}

function createHardwareVariantsCard(platform) {
  const panel = document.createElement("section");
  panel.className = "hardware-detail-group";
  const title = document.createElement("h4");
  const variants = variantsForPlatform(platform)
    .slice()
    .sort((a, b) => (a.year || 9999) - (b.year || 9999) || a.name.localeCompare(b.name, "zh-CN"));
  title.textContent = `型号 / 改版 ${variants.length}`;
  const list = document.createElement("div");
  list.className = "hardware-variant-list";

  if (!variants.length) {
    const empty = document.createElement("p");
    empty.className = "pokemon-empty";
    empty.textContent = "暂未整理型号。";
    list.append(empty);
  } else {
    variants.forEach((variant) => {
      const item = document.createElement("article");
      item.className = "pokemon-platform-card hardware-variant-record";
      const year = document.createElement("strong");
      year.textContent = variant.year || "待补";
      const content = document.createElement("div");
      content.className = "hardware-variant-content";
      const name = document.createElement("p");
      name.textContent = variant.name;
      name.title = variant.name;
      const meta = document.createElement("small");
      const detail = [variant.kind || "硬件型号", variant.note].filter(Boolean).join(" · ");
      meta.textContent = detail;
      meta.title = detail;
      content.append(name, meta);
      item.append(year, content);
      list.append(item);
    });
  }

  panel.append(title, list);
  return informationCard([], panel);
}

function createHardwareGamesCard(platform) {
  const groups = document.createElement("div");
  groups.className = "timeline-games-groups";
  const games = gameDataForPlatform(platform);
  appendTimelineGameGroup(groups, "护航 / 首发", games.launchGames, games.launchEmptyLabel);
  appendTimelineGameGroup(groups, "特色 / 高讨论", games.signatureGames);
  if (games.note) {
    const note = document.createElement("p");
    note.className = "timeline-related-note";
    note.textContent = games.note;
    groups.append(note);
  }
  return informationCard([], groups);
}

function appendTimelineGameGroup(container, title, games, emptyLabel = "暂未整理。") {
  const group = document.createElement("section");
  group.className = "timeline-games-group";
  const heading = document.createElement("h4");
  heading.textContent = `${title} ${games.length}`;
  group.append(heading);

  if (!games.length) {
    const empty = document.createElement("p");
    empty.textContent = emptyLabel;
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

function platformId(platform) {
  return `${platform.brand}-${platform.name}-${platform.year}`.replace(/[^a-z0-9]+/gi, "-");
}

function variantsForPlatform(platform) {
  return platformVariants[platformId(platform)] || [];
}

async function fetchPlatformImage(platform) {
  const managedKey = `hardware:${platformId(platform)}`;
  const images = managedTimelineImages[managedKey] || [];
  return images.length ? { images, title: platform.name } : null;
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
  if (SHOW_HARDWARE_CARD_GRID) {
    renderMeta(platforms);
    renderCards(platforms);
  }
  renderSeriesOverviewTimeline();
  gameSeriesDefinitions().forEach(renderGameSeriesTimeline);
}

function platformRecordEntryCard(entry) {
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

function informationCard(fields, extra = null) {
  const card = document.createElement("section");
  card.className = "timeline-information-card";
  const fieldMarkup = fields.map(({ label, value }) => `
    <div class="timeline-information-field"><span>${label}</span><p>${value}</p></div>`).join("");
  card.innerHTML = `<div class="timeline-information-fields">${fieldMarkup}</div>`;
  if (extra) card.append(extra);
  return card;
}

function plotSummaryCard(plot) {
  const fields = [{ label: "剧情概要", value: plot.summary }];
  if (plot.innovation) fields.push({ label: "叙事创新", value: plot.innovation });
  return informationCard(fields);
}

function seriesInterpretationCard(insight) {
  const fields = [
    ...(insight.releaseStructure ? [{ label: "版本结构", value: insight.releaseStructure }] : []),
    ...(insight.loop ? [{ label: "核心体验", value: insight.loop }] : []),
    ...(insight.change ? [{ label: "本作变化", value: insight.change }] : []),
    ...(insight.designLogic ? [{ label: "机制逻辑", value: insight.designLogic }] : []),
    ...(insight.legacy ? [{ label: "系列影响", value: insight.legacy }] : []),
    ...(insight.industryImpact ? [{ label: "行业影响", value: insight.industryImpact }] : []),
    ...(SHOW_RESEARCH_PROMPTS && insight.note ? [{ label: "研究线索", value: insight.note }] : [])
  ];
  return informationCard(fields);
}

function designDecisionChainCard(chain) {
  if (!chain) return null;
  const fields = [
    { label: "设计问题", value: chain.problem },
    { label: "设计假设", value: chain.hypothesis },
    { label: "本作实验", value: chain.experiment },
    { label: "结果与代价", value: chain.outcome },
    { label: "后续选择", value: chain.followUp },
    { label: "判断依据", value: chain.basis }
  ].filter(({ value }) => value);
  const card = informationCard(fields);
  card.classList.add("timeline-decision-chain-card");
  return card;
}

const DECISION_REVIEW_REASONS = {
  "creator-evidence": "现有资料可以确认成品内容，但缺少可核对的作者访谈、版本日志和连续开发记录，无法可靠区分作者原始目标、社区解释与后期改动。",
  "version-evidence": "现有资料能确认作品或版本存在，但还不足以逐项核对相对原作改变了什么、为何改变，以及这些变化是否被后续作品继承。",
  "service-evidence": "作品依赖街机、联网运营或已经停服的内容版本；当前缺少完整规则、版本演进和运营复盘，无法建立可靠的实验结果与后续选择。",
  "branch-evidence": "现有资料主要说明类型与题材，尚不足以证明本作相对同分支前后作品解决了哪个具体问题，强行补链会把产品差异误写成设计动机。",
  unreviewed: "该作品尚未完成证据判断。"
};

function decisionReviewStatus(releaseId, review) {
  if ((review.inferred || []).includes(releaseId)) return { status: "inferred" };
  for (const [reason, ids] of Object.entries(review.insufficient || {})) {
    if (ids.includes(releaseId)) return { status: "insufficient", reason };
  }
  return { status: "unreviewed", reason: "unreviewed" };
}

function inferredDecisionChain(insight) {
  return {
    problem: `现有资料未能确认团队的原始命题。依据成品与相邻作品的差异，可研究的问题是：如何在保留系列识别度的同时完成这项结构变化——${insight.change}`,
    hypothesis: `编辑推断：团队可能认为，把玩家的主要活动组织为“${insight.loop}”，能够回应上述问题。此处不是官方动机陈述。`,
    experiment: insight.designLogic
      ? `成品中可以直接验证的机制实验是：${insight.designLogic}`
      : `成品中可以直接验证的规则、内容或发行结构变化是：${insight.change}`,
    outcome: `成品最终形成的核心体验是：${insight.loop}。其代价与适用边界需要沿以下线索继续检验：${insight.note || "比较玩家行为、流程摩擦与版本差异。"}`,
    followUp: insight.legacy || "当前没有足够材料证明这项实验被后续作品明确继承、修正或放弃，因此暂不作长期影响判断。",
    basis: "证据等级：比较推断。机制、流程和前后作差异属于可验证事实；“设计问题”与“设计假设”是编辑研究结论，不代表开发团队的官方说法。"
  };
}

function decisionChainReviewCard(release, insight, manualChains, review) {
  if (manualChains[release.id]) return designDecisionChainCard(manualChains[release.id]);
  const assessment = decisionReviewStatus(release.id, review);
  if (assessment.status === "inferred") {
    return designDecisionChainCard(inferredDecisionChain(insight));
  }
  const card = informationCard([
    { label: "判断结果", value: assessment.status === "insufficient" ? "证据不足，暂不建立决策链。" : "尚未完成判断。" },
    { label: "缺少依据", value: DECISION_REVIEW_REASONS[assessment.reason] || DECISION_REVIEW_REASONS.unreviewed }
  ]);
  card.classList.add("timeline-decision-chain-status-card");
  return card;
}

function seriesInsightFor(release, definition) {
  const { editorial, designLogic, seriesImpact, externalImpactResearch } = definition.content;
  const reading = editorial[release.id] || {};
  const externalImpact = externalImpactResearch[release.id];
  return {
    releaseStructure: definition.releaseStructure?.(release) || null,
    loop: reading.loop || null,
    change: reading.change || null,
    designLogic: designLogic[release.id] || null,
    legacy: seriesImpact[release.id] || null,
    industryImpact: typeof externalImpact === "string"
      ? externalImpact
      : externalImpact?.status === "verified" ? externalImpact.summary : null,
    note: reading.note || null
  };
}

function platformRecordCard(release, extra = null) {
  const first = release.first.map((entry) => platformRecordEntryCard(entry)).join("");
  const later = release.later.length
    ? release.later.map((entry) => platformRecordEntryCard(entry)).join("")
    : '<p class="pokemon-empty">暂无后续独立版本</p>';
  const record = document.createElement("div");
  record.innerHTML = `<div class="pokemon-platform-group"><h4>首次登陆</h4><div class="pokemon-platform-list">${first}</div></div>
    <div class="pokemon-platform-group"><h4>后续登陆</h4><div class="pokemon-platform-list">${later}</div></div>`;
  if (extra) record.append(extra);
  return informationCard([], record);
}

function releasePlatformCount(release) {
  return [...release.first, ...release.later].reduce((total, entry) => {
    const platformNames = entry.platform.replace(/（.*?）/g, "").split(/\s*\/\s*/).filter(Boolean);
    return total + platformNames.length;
  }, 0);
}

function appendReleaseArtwork(card, artworkKey, artworkClass = "") {
  const artworks = managedImagesFor(artworkKey);
  if (!artworks.length) return;
  appendTimelineArtwork(card, artworkKey, artworks, artworkClass);
}

function appendTimelineArtwork(card, artworkKey, artworks, artworkClass = "") {
  let artworkIndex = releaseArtworkIndices.get(artworkKey) || 0;
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
  bindReleaseArtworkPreview(image, artworks);
  frame.append(image);

  const updateArtwork = () => {
    const [filename, label] = artworks[artworkIndex];
    image.src = filename;
    image.alt = label;
    releaseArtworkIndices.set(artworkKey, artworkIndex);
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

function bindReleaseArtworkPreview(image, artworks) {
  const showPreview = (event) => {
    const preview = releaseArtworkPreview || document.createElement("div");
    if (!releaseArtworkPreview) {
      preview.className = "pokemon-cover-preview";
      document.body.append(preview);
      releaseArtworkPreview = preview;
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
      previewImage.src = source;
      previewImage.alt = label;
      return previewImage;
    }));
    preview.style.setProperty("--cover-preview-size", `${previewSize}px`);
    preview.hidden = false;
    positionReleaseArtworkPreview(preview, event);
  };

  image.addEventListener("pointerenter", showPreview);
  image.addEventListener("pointermove", (event) => {
    if (releaseArtworkPreview && !releaseArtworkPreview.hidden) {
      positionReleaseArtworkPreview(releaseArtworkPreview, event);
    }
  });
  image.addEventListener("pointerleave", () => {
    if (releaseArtworkPreview) releaseArtworkPreview.hidden = true;
  });
}

function positionReleaseArtworkPreview(preview, event) {
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

function imageManagerGroups() {
  const hardware = {
    id: "hardware",
    label: "游戏主机",
    entries: allPlatforms.map((platform) => ({
      key: `hardware:${platformId(platform)}`,
      title: platform.name,
      meta: `${platform.brand} · ${releaseDateLabel(platform)}`
    }))
  };
  const gameSeries = gameSeriesDefinitions().map((definition) => ({
    id: definition.imageCollectionId,
    label: definition.label,
    entries: definition.releases.map((release) => ({
      key: `${definition.imageCollectionId}:${release.id}`,
      title: release.name,
      meta: definition.subtitleFor(release)
    }))
  }));
  return [hardware, ...gameSeries];
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

function bindTimelinePrimaryCard(card, isSelected, toggleCard) {
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-expanded", String(isSelected));
  card.addEventListener("click", toggleCard);
  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleCard(event);
  });
}

function createTimelinePrimaryCard({
  cardClasses = [],
  dateLabel,
  tagLabel,
  title,
  subtitle = "",
  lineage = "",
  footLabel,
  accent,
  tagColor = accent,
  artworkKey,
  isSelected,
  toggle
}) {
  const card = document.createElement("article");
  card.classList.add("timeline-primary-card", ...cardClasses.filter(Boolean));
  card.style.setProperty("--timeline-accent", accent);
  card.style.setProperty("--timeline-tag-color", tagColor);

  const artworkExists = artworkKey && managedImagesFor(artworkKey).length > 0;
  if (artworkExists) card.classList.add("timeline-primary-card-has-artwork");

  const head = document.createElement("div");
  head.className = "timeline-primary-card-head";
  const date = document.createElement("time");
  date.className = "timeline-primary-card-date";
  date.textContent = dateLabel;
  const tag = document.createElement("span");
  tag.className = "timeline-primary-card-tag";
  tag.textContent = tagLabel;
  tag.title = tagLabel;
  head.append(date, tag);

  const content = document.createElement("div");
  content.className = "timeline-primary-card-content";
  const heading = document.createElement("strong");
  heading.className = "timeline-primary-card-title";
  heading.textContent = title;
  heading.title = title;
  content.append(heading);

  if (subtitle) {
    const subtitleElement = document.createElement("p");
    subtitleElement.className = "timeline-primary-card-subtitle";
    subtitleElement.textContent = subtitle;
    subtitleElement.title = subtitle;
    content.append(subtitleElement);
  }

  if (lineage) {
    const lineageElement = document.createElement("span");
    lineageElement.className = "timeline-primary-card-lineage";
    lineageElement.textContent = lineage;
    lineageElement.title = lineage;
    content.append(lineageElement);
  }

  const foot = document.createElement("small");
  foot.className = "timeline-primary-card-foot";
  foot.textContent = footLabel;

  card.append(head, content, foot);
  if (artworkExists) appendReleaseArtwork(card, artworkKey);
  bindTimelinePrimaryCard(card, isSelected, toggle);
  return card;
}

function appendReleaseMilestone(stack, release, side, milestones, seriesLabel) {
  const releaseMilestones = milestones[release.id];
  if (!releaseMilestones) return;

  const entries = ["domestic", "global", "integration"]
    .filter((type) => releaseMilestones[type])
    .map((type) => [type, releaseMilestones[type]]);

  entries.forEach(([type, milestone], index) => {
    const typeLabel = {
      domestic: "国内里程碑",
      global: "全球化里程碑",
      integration: "组织整合节点"
    }[type];
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = `timeline-milestone-marker timeline-milestone-marker-${side} timeline-milestone-marker-${type}`;
    marker.style.setProperty("--milestone-index", index);
    marker.setAttribute(
      "aria-label",
      `${seriesLabel} ${typeLabel}，${release.name}：${milestone.label}。${milestone.achievement}`
    );

    const tooltip = document.createElement("span");
    tooltip.className = "timeline-milestone-tooltip";
    tooltip.setAttribute("role", "tooltip");

    const label = document.createElement("strong");
    label.textContent = `${typeLabel} · ${milestone.label}`;
    const achievement = document.createElement("span");
    achievement.textContent = milestone.achievement;
    const evidence = document.createElement("small");
    evidence.textContent = `判断依据：${milestone.evidence}`;

    tooltip.append(label, achievement, evidence);
    marker.append(tooltip);
    stack.append(marker);
  });
}

function createSeriesReleaseStack(release, side, isSelected, toggleRelease, definition) {
  const stack = document.createElement("div");
  stack.className = "timeline-card-anchor pokemon-release-stack";
  const artworkKey = `${definition.imageCollectionId}:${release.id}`;
  const releaseLabel = definition.tagFor(release);
  const platformTotal = releasePlatformCount(release);
  const subtitle = definition.subtitleFor(release);
  const cardLineage = definition.cardLineageFor?.(release) || "";
  const accent = definition.color(release);
  const card = createTimelinePrimaryCard({
    cardClasses: [definition.cardClass],
    dateLabel: gameReleaseDateLabel(release),
    tagLabel: releaseLabel,
    title: release.name,
    subtitle,
    lineage: cardLineage,
    footLabel: `${platformTotal} 个平台`,
    accent,
    artworkKey,
    isSelected,
    toggle: toggleRelease
  });
  stack.append(card);
  appendReleaseMilestone(stack, release, side, definition.milestones, definition.label);

  if (isSelected) {
    const flyout = document.createElement("section");
    flyout.className = `timeline-detail-flyout timeline-detail-flyout-${side} pokemon-detail-flyout${definition.detailClass ? ` ${definition.detailClass}` : ""}`;
    const detail = document.createElement("section");
    detail.className = "pokemon-release-detail timeline-information-stack";
    const insight = seriesInsightFor(release, definition);
    detail.append(seriesInterpretationCard(insight));
    if (SHOW_DESIGN_DECISION_CHAINS) {
      detail.append(decisionChainReviewCard(
        release,
        insight,
        definition.content.decisionChains,
        definition.content.decisionReview
      ));
    }
    const plot = plotSummaryCard(definition.content.plotSummaries[release.id] || {
      summary: "当前版本尚未整理该作品的剧情概要。"
    });
    const lineage = definition.showDetailLineage && release.lineage
      ? Object.assign(document.createElement("div"), { className: "timeline-related-note", textContent: `谱系关系：${release.lineage}` })
      : null;
    const record = platformRecordCard(release, lineage);
    detail.append(plot, record);
    const supplement = definition.supplementFor?.(release);
    if (supplement) detail.append(supplement);
    flyout.append(detail);
    stack.append(flyout);
  }

  return stack;
}

function gameSeriesDefinitions() {
  if (gameSeriesDefinitionCache) return gameSeriesDefinitionCache;
  const standardTag = (release) => release.tag || release.category;
  const standardSubtitle = (release) => release.chineseName;
  gameSeriesDefinitionCache = [
    {
      id: "pokemon",
      label: "Pokémon",
      releases: pokemonReleases,
      element: elements.pokemonTimeline,
      theme: "pokemon",
      imageCollectionId: "pokemon",
      cardClass: "",
      detailClass: "",
      branchClass: "pokemon-branch",
      color: (release) => release.official === false ? "var(--pokemon-fan)" : "var(--pokemon-official)",
      filterColor: "var(--pokemon-official)",
      tagFor: (release) => release.official === false
        ? `${release.workType || "同人作品"}・${release.creator || "未知制作者"}`
        : release.generation,
      subtitleFor: (release) => pokemonSubtitle(release.chineseName),
      cardLineageFor: (release) => release.remakeOf
        ? `重制：${pokemonSubtitle(release.remakeOf.chineseName)}`
        : release.modOf
          ? `改版：${pokemonSubtitle(release.modOf)}`
          : release.editionNote
            ? release.editionNote
            : "",
      milestones: pokemonMilestones,
      criteria: window.POKEMON_TIMELINE_SELECTION_CRITERIA,
      releaseStructure: (release) => release.releaseStructure,
      supplementFor: (release) => pokemonStartersForRelease(release).length
        ? informationCard([], createPokemonStartersPanel(release))
        : null,
      layout: (releases, reserveDetailSpace, selectedId) =>
        layoutPokemonReleases(releases, reserveDetailSpace, selectedId),
      content: {
        editorial: pokemonEditorialReading,
        designLogic: pokemonDesignLogic,
        seriesImpact: pokemonSeriesImpact,
        externalImpactResearch: pokemonExternalImpactResearch,
        plotSummaries: pokemonPlotSummaries,
        decisionChains: pokemonDecisionChains,
        decisionReview: pokemonDecisionChainReview
      }
    },
    {
      id: "final-fantasy",
      label: "Final Fantasy",
      releases: finalFantasyReleases,
      element: elements.finalFantasyTimeline,
      theme: "final-fantasy",
      imageCollectionId: "final-fantasy",
      cardClass: "final-fantasy-release-card",
      detailClass: "final-fantasy-detail-flyout",
      branchClass: "pokemon-branch final-fantasy-branch",
      color: () => "var(--final-fantasy-color)",
      filterColor: "var(--final-fantasy-color)",
      tagFor: finalFantasyDisplayTag,
      subtitleFor: standardSubtitle,
      cardLineageFor: (release) => release.lineage || "",
      showDetailLineage: true,
      milestones: finalFantasyMilestones,
      criteria: window.FINAL_FANTASY_TIMELINE_SELECTION_CRITERIA,
      content: {
        editorial: finalFantasyEditorialReading,
        designLogic: finalFantasyDesignLogic,
        seriesImpact: finalFantasySeriesImpact,
        externalImpactResearch: finalFantasyExternalImpactResearch,
        plotSummaries: finalFantasyPlotSummaries,
        decisionChains: finalFantasyDecisionChains,
        decisionReview: finalFantasyDecisionChainReview
      }
    },
    {
      id: "dragon-quest",
      label: "Dragon Quest",
      releases: dragonQuestReleases,
      element: elements.dragonQuestTimeline,
      theme: "dragon-quest",
      imageCollectionId: "dragon-quest",
      cardClass: "dragon-quest-release-card",
      detailClass: "dragon-quest-detail-flyout",
      branchClass: "pokemon-branch dragon-quest-branch",
      color: () => "var(--dragon-quest-color)",
      filterColor: "var(--dragon-quest-color)",
      tagFor: standardTag,
      subtitleFor: standardSubtitle,
      showDetailLineage: true,
      milestones: dragonQuestMilestones,
      criteria: window.DRAGON_QUEST_TIMELINE_SELECTION_CRITERIA,
      content: {
        editorial: dragonQuestEditorialReading,
        designLogic: dragonQuestDesignLogic,
        seriesImpact: dragonQuestSeriesImpact,
        externalImpactResearch: dragonQuestExternalImpactResearch,
        plotSummaries: dragonQuestPlotSummaries,
        decisionChains: dragonQuestDecisionChains,
        decisionReview: dragonQuestDecisionChainReview
      }
    },
    {
      id: "xeno-series",
      label: "Xeno Series",
      releases: xenobladeReleases,
      element: elements.xenobladeTimeline,
      theme: "xenoblade",
      imageCollectionId: "xenoblade",
      cardClass: "xenoblade-release-card",
      detailClass: "xenoblade-detail-flyout",
      branchClass: "pokemon-branch xenoblade-branch",
      color: () => "var(--xenoblade-color)",
      filterColor: "var(--xenoblade-color)",
      tagFor: standardTag,
      subtitleFor: standardSubtitle,
      showDetailLineage: true,
      milestones: xenobladeMilestones,
      criteria: window.XENOBLADE_TIMELINE_SELECTION_CRITERIA,
      content: {
        editorial: xenobladeEditorialReading,
        designLogic: xenobladeDesignLogic,
        seriesImpact: xenobladeSeriesImpact,
        externalImpactResearch: xenobladeExternalImpactResearch,
        plotSummaries: xenobladePlotSummaries,
        decisionChains: xenobladeDecisionChains,
        decisionReview: xenobladeDecisionChainReview
      }
    },
    {
      id: "like-a-dragon",
      label: "Like a Dragon",
      releases: likeADragonReleases,
      element: elements.likeADragonTimeline,
      theme: "like-a-dragon",
      imageCollectionId: "like-a-dragon",
      cardClass: "like-a-dragon-release-card",
      detailClass: "like-a-dragon-detail-flyout",
      branchClass: "pokemon-branch like-a-dragon-branch",
      color: () => "var(--like-a-dragon-color)",
      filterColor: "var(--like-a-dragon-color)",
      tagFor: standardTag,
      subtitleFor: standardSubtitle,
      showDetailLineage: true,
      milestones: likeADragonMilestones,
      criteria: window.LIKE_A_DRAGON_TIMELINE_SELECTION_CRITERIA,
      content: {
        editorial: likeADragonEditorialReading,
        designLogic: likeADragonDesignLogic,
        seriesImpact: likeADragonSeriesImpact,
        externalImpactResearch: likeADragonExternalImpactResearch,
        plotSummaries: likeADragonPlotSummaries,
        decisionChains: likeADragonDecisionChains,
        decisionReview: likeADragonDecisionChainReview
      }
    },
    {
      id: "spike-series",
      label: "Spike Chunsoft Narrative",
      releases: spikeSeriesReleases,
      element: elements.spikeSeriesTimeline,
      theme: "spike-series",
      imageCollectionId: "spike-series",
      cardClass: "spike-series-release-card",
      detailClass: "spike-series-detail-flyout",
      branchClass: "pokemon-branch spike-series-branch",
      color: () => "var(--spike-series-color)",
      filterColor: "var(--spike-series-color)",
      tagFor: standardTag,
      subtitleFor: standardSubtitle,
      showDetailLineage: true,
      milestones: spikeSeriesMilestones,
      criteria: window.SPIKE_SERIES_TIMELINE_SELECTION_CRITERIA,
      content: {
        editorial: spikeSeriesEditorialReading,
        designLogic: spikeSeriesDesignLogic,
        seriesImpact: spikeSeriesImpact,
        externalImpactResearch: spikeSeriesExternalImpactResearch,
        plotSummaries: spikeSeriesPlotSummaries,
        decisionChains: spikeSeriesDecisionChains,
        decisionReview: spikeSeriesDecisionChainReview
      }
    }
  ];
  return gameSeriesDefinitionCache;
}

function createSeriesOverviewFilter(definitions) {
  const filter = document.createElement("section");
  filter.className = "series-overview-filter";
  filter.setAttribute("aria-label", "选择总览中显示的游戏系列");
  const label = document.createElement("span");
  label.className = "series-overview-filter-label";
  label.textContent = "显示时间线";
  const options = document.createElement("div");
  options.className = "series-overview-filter-options";

  definitions.forEach((definition) => {
    const option = document.createElement("label");
    option.className = "series-overview-filter-option";
    option.style.setProperty("--series-filter-color", definition.filterColor);
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = selectedSeriesOverviewTimelineIds.has(definition.id);
    input.addEventListener("change", () => {
      if (input.checked) selectedSeriesOverviewTimelineIds.add(definition.id);
      else selectedSeriesOverviewTimelineIds.delete(definition.id);
      renderSeriesOverviewTimeline();
    });
    const swatch = document.createElement("i");
    swatch.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    text.textContent = definition.label;
    option.append(input, swatch, text);
    options.append(option);
  });

  filter.append(label, options);
  return filter;
}

function renderSeriesOverviewTimeline() {
  if (!elements.seriesOverviewTimeline) return;
  elements.seriesOverviewTimeline.textContent = "";

  const definitions = gameSeriesDefinitions();
  const activeDefinitions = definitions.filter((definition) => selectedSeriesOverviewTimelineIds.has(definition.id));
  if (
    selectedSeriesOverviewReleaseKey
    && !activeDefinitions.some((definition) => selectedSeriesOverviewReleaseKey.startsWith(`${definition.id}:`))
  ) {
    selectedSeriesOverviewReleaseKey = null;
  }
  elements.seriesOverviewTimeline.append(createSeriesOverviewFilter(definitions));

  if (!activeDefinitions.length) {
    const empty = document.createElement("p");
    empty.className = "series-overview-empty";
    empty.textContent = "请选择要显示的游戏系列。";
    elements.seriesOverviewTimeline.append(empty);
    return;
  }

  const entries = activeDefinitions
    .flatMap((definition) => definition.releases.map((release) => ({
      id: `${definition.id}:${release.id}`,
      date: release.date,
      name: release.name,
      category: definition.id,
      definition,
      release
    })))
    .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
  const reserveDetailSpace = window.matchMedia?.("(max-width: 760px)").matches;
  const layout = layoutCategorizedReleases(entries, reserveDetailSpace, selectedSeriesOverviewReleaseKey, 760);
  const axis = document.createElement("div");
  axis.className = "vertical-timeline series-overview-vertical-timeline";
  const canvas = document.createElement("section");
  canvas.className = "timeline-year-row series-overview-timeline-canvas";
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

  entries.forEach((entry) => {
    const itemLayout = layout.items.get(entry.id);
    const selected = selectedSeriesOverviewReleaseKey === entry.id;
    const branch = document.createElement("div");
    branch.className = `timeline-branch ${entry.definition.branchClass} series-overview-branch ${itemLayout.side === "left" ? "timeline-branch-left" : "timeline-branch-right"}${selected ? " selected" : ""}`;
    branch.style.setProperty("--branch-offset", itemLayout.branchOffset);
    branch.style.setProperty("--month-offset", `${itemLayout.top}px`);
    branch.style.setProperty("--pokemon-color", entry.definition.color(entry.release));
    const toggleRelease = () => {
      selectedSeriesOverviewReleaseKey = selected ? null : entry.id;
      renderSeriesOverviewTimeline();
    };
    const stack = createSeriesReleaseStack(entry.release, itemLayout.side, selected, toggleRelease, entry.definition);
    branch.append(stack);
    if (itemLayout.side === "left") leftItems.append(branch);
    else rightItems.append(branch);
  });

  leftContent.append(leftItems);
  rightContent.append(rightItems);
  canvas.append(leftContent, yearRail, rightContent);
  axis.append(canvas);
  elements.seriesOverviewTimeline.append(axis);
}

function renderGameSeriesTimeline(definition) {
  if (!definition.element) return;
  definition.element.textContent = "";

  const releases = [...definition.releases].sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
  const reserveDetailSpace = window.matchMedia?.("(max-width: 760px)").matches;
  const selectedId = selectedSeriesReleaseIds[definition.id] || null;
  const layout = definition.layout
    ? definition.layout(releases, reserveDetailSpace, selectedId)
    : layoutCategorizedReleases(releases, reserveDetailSpace, selectedId);
  const axis = document.createElement("div");
  axis.className = `vertical-timeline ${definition.theme}-vertical-timeline`;
  const canvas = document.createElement("section");
  canvas.className = `timeline-year-row ${definition.theme}-timeline-canvas`;
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
    branch.className = `timeline-branch ${definition.branchClass} ${itemLayout.side === "left" ? "timeline-branch-left" : "timeline-branch-right"}${selectedId === release.id ? " selected" : ""}`;
    branch.style.setProperty("--branch-offset", itemLayout.branchOffset);
    branch.style.setProperty("--month-offset", `${itemLayout.top}px`);
    branch.style.setProperty("--pokemon-color", definition.color(release));
    branch.style.setProperty("--timeline-accent", definition.color(release));

    const toggleRelease = () => {
      selectedSeriesReleaseIds[definition.id] = selectedSeriesReleaseIds[definition.id] === release.id
        ? null
        : release.id;
      renderGameSeriesTimeline(definition);
    };
    const stack = createSeriesReleaseStack(
      release,
      itemLayout.side,
      selectedId === release.id,
      toggleRelease,
      definition
    );

    branch.append(stack);
    if (itemLayout.side === "left") leftItems.append(branch);
    else rightItems.append(branch);
  });

  leftContent.append(leftItems);
  rightContent.append(rightItems);
  canvas.append(leftContent, yearRail, rightContent);
  axis.append(canvas);
  definition.element.append(
    createTimelineSelectionNote(definition.criteria, definition.theme),
    axis
  );
}

function createTimelineSelectionNote(criteria, theme) {
  const note = document.createElement("section");
  note.className = `timeline-selection-note timeline-selection-note-${theme}`;
  note.setAttribute("aria-label", criteria.label);

  const label = document.createElement("span");
  label.className = "timeline-selection-note-label";
  label.textContent = criteria.label;

  const text = document.createElement("p");
  text.textContent = criteria.text;

  note.append(label, text);
  return note;
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

function layoutPokemonReleases(releases, reserveDetailSpace, selectedReleaseId) {
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
    const occupiedHeight = reserveDetailSpace && selectedReleaseId === release.id ? 760 : 132;

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

function layoutCategorizedReleases(releases, reserveDetailSpace, selectedReleaseId, selectedDetailHeight = 480) {
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
    const occupiedHeight = reserveDetailSpace && selectedReleaseId === release.id ? selectedDetailHeight : 132;

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

  const tablist = button?.parentElement;
  if (tablist?.classList.contains("series-tabs")) {
    requestAnimationFrame(() => {
      const left = button.offsetLeft;
      const right = left + button.offsetWidth;
      if (left < tablist.scrollLeft) tablist.scrollLeft = left;
      else if (right > tablist.scrollLeft + tablist.clientWidth) {
        tablist.scrollLeft = right - tablist.clientWidth;
      }
    });
  }
}

function currentArchiveLocation() {
  if (gmImageManagerOpen) return "gm-images";
  const activeLibrary = document.querySelector("[data-library-tab].active")?.dataset.libraryTab;
  if (activeLibrary === "console-library-panel") return "console";

  const activeSeries = document.querySelector("[data-series-tab].active")?.dataset.seriesTab;
  if (activeSeries === "pokemon-library-panel") return "pokemon";
  if (activeSeries === "final-fantasy-library-panel") return "final-fantasy";
  if (activeSeries === "dragon-quest-library-panel") return "dragon-quest";
  if (activeSeries === "like-a-dragon-library-panel") return "like-a-dragon";
  if (activeSeries === "xenoblade-library-panel") return "xeno-series";
  if (activeSeries === "spike-series-library-panel") return "spike-series";
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

  if (location === "dragon-quest") {
    activateTab(libraryTabs, "libraryTab", libraryTabs.find((button) => button.dataset.libraryTab === "series-library-panel"));
    activateTab(seriesTabs, "seriesTab", seriesTabs.find((button) => button.dataset.seriesTab === "dragon-quest-library-panel"));
    return;
  }

  if (location === "like-a-dragon") {
    activateTab(libraryTabs, "libraryTab", libraryTabs.find((button) => button.dataset.libraryTab === "series-library-panel"));
    activateTab(seriesTabs, "seriesTab", seriesTabs.find((button) => button.dataset.seriesTab === "like-a-dragon-library-panel"));
    return;
  }

  if (location === "xeno-series" || location === "xenoblade") {
    activateTab(libraryTabs, "libraryTab", libraryTabs.find((button) => button.dataset.libraryTab === "series-library-panel"));
    activateTab(seriesTabs, "seriesTab", seriesTabs.find((button) => button.dataset.seriesTab === "xenoblade-library-panel"));
    return;
  }

  if (location === "spike-series") {
    activateTab(libraryTabs, "libraryTab", libraryTabs.find((button) => button.dataset.libraryTab === "series-library-panel"));
    activateTab(seriesTabs, "seriesTab", seriesTabs.find((button) => button.dataset.seriesTab === "spike-series-library-panel"));
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
