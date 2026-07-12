const archive = window.CONSOLE_ARCHIVE;

const state = {
  brand: "全部",
  type: "全部",
  query: "",
  fromYear: 1972,
  toYear: 2026,
  selectedTimelineId: null,
  imageQueue: new Set()
};

const IMAGE_CACHE_PREFIX = "console-image-v3:";
const IMAGE_NOT_FOUND = "__not_found__";
const WIKI_API = "https://en.wikipedia.org/w/api.php";
const localImages = window.CONSOLE_IMAGES || {};
const imageSources = window.CONSOLE_IMAGE_SOURCES || {};
const platformVariants = window.CONSOLE_PLATFORM_VARIANTS || {};
const curatedGames = window.CONSOLE_CURATED_GAMES || {};

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
  brandFilters: document.querySelector("#brandFilters"),
  typeFilters: document.querySelector("#typeFilters"),
  searchInput: document.querySelector("#searchInput"),
  fromYear: document.querySelector("#fromYear"),
  toYear: document.querySelector("#toYear"),
  resetButton: document.querySelector("#resetButton"),
  timeline: document.querySelector("#timeline"),
  resultsMeta: document.querySelector("#resultsMeta"),
  platformGrid: document.querySelector("#platformGrid"),
  template: document.querySelector("#platformTemplate")
};

function unique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "zh-CN"));
}

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

function matchesQuery(platform) {
  const variantText = variantsForPlatform(platform)
    .flatMap((variant) => [variant.name, variant.year, variant.kind, variant.note])
    .join(" ");
  if (!state.query) return true;
  const haystack = [
    platform.name,
    platform.brand,
    platform.year,
    platform.type,
    platform.generation,
    platform.line,
    platform.notes,
    variantText,
    ...gameDataForPlatform(platform).launchGames,
    ...gameDataForPlatform(platform).signatureGames
  ].join(" ").toLowerCase();
  return haystack.includes(state.query.toLowerCase());
}

function filteredPlatforms() {
  return allPlatforms
    .filter((platform) => state.brand === "全部" || platform.brand === state.brand)
    .filter((platform) => state.type === "全部" || platform.type === state.type)
    .filter((platform) => platform.year >= state.fromYear && platform.year <= state.toYear)
    .filter(matchesQuery)
    .sort((a, b) => a.year - b.year || a.brand.localeCompare(b.brand, "zh-CN"));
}

function createButton(label, active, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `filter-button${active ? " active" : ""}`;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function renderFilters() {
  const brands = ["全部", ...archive.map((item) => item.brand)];
  const types = ["全部", ...unique(allPlatforms.map((platform) => platform.type))];

  elements.brandFilters.replaceChildren(
    ...brands.map((brand) =>
      createButton(brand, state.brand === brand, () => {
        state.brand = brand;
        state.selectedTimelineId = null;
        render();
      })
    )
  );

  elements.typeFilters.replaceChildren(
    ...types.map((type) =>
      createButton(type, state.type === type, () => {
        state.type = type;
        state.selectedTimelineId = null;
        render();
      })
    )
  );
}

function typeClass(platform) {
  const normalized = platform.type.toLowerCase();
  if (normalized.includes("handheld")) return "handheld";
  if (normalized.includes("hybrid") || normalized.includes("pc")) return "hybrid";
  return "home";
}

function renderTimeline(platforms) {
  const byBrand = new Map();
  platforms.forEach((platform) => {
    if (!byBrand.has(platform.brand)) byBrand.set(platform.brand, []);
    byBrand.get(platform.brand).push(platform);
  });

  const rows = [...byBrand.entries()].map(([brand, brandPlatforms]) => {
    const brandDetails = document.createElement("details");
    brandDetails.className = "brand-timeline";
    brandDetails.open = state.brand !== "全部" || brandPlatforms.length <= 5;

    const summary = document.createElement("summary");
    summary.className = "brand-timeline-summary";
    const variantTotal = brandPlatforms.reduce((sum, platform) => sum + variantsForPlatform(platform).length, 0);
    const brandName = document.createElement("strong");
    brandName.textContent = brand;
    const brandMeta = document.createElement("span");
    brandMeta.textContent = `${brandPlatforms.length} 个平台 / ${variantTotal} 个型号`;
    summary.append(brandName, brandMeta);

    const track = document.createElement("div");
    track.className = "brand-track";

    brandPlatforms
      .slice()
      .sort((a, b) => a.year - b.year || a.name.localeCompare(b.name, "zh-CN"))
      .forEach((platform) => {
        track.append(createTimelineNode(platform));
      });

    const selectedPlatform = brandPlatforms.find((platform) => platformId(platform) === state.selectedTimelineId);
    const detailPanel = document.createElement("section");
    detailPanel.className = "timeline-detail-panel";
    detailPanel.setAttribute("aria-live", "polite");
    detailPanel.hidden = !selectedPlatform;
    if (selectedPlatform) detailPanel.append(createTimelineDetail(selectedPlatform));

    brandDetails.append(summary, track, detailPanel);
    return brandDetails;
  });

  elements.timeline.replaceChildren(...rows);
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
  button.addEventListener("click", () => {
    state.selectedTimelineId = state.selectedTimelineId === id ? null : id;
    renderTimeline(filteredPlatforms());
  });

  const year = document.createElement("span");
  year.className = "timeline-node-year";
  year.textContent = platform.year;

  const name = document.createElement("strong");
  name.textContent = platform.name;

  const meta = document.createElement("span");
  meta.className = "timeline-node-meta";
  const variants = variantsForPlatform(platform);
  meta.textContent = `${platform.type} · ${platform.generation} · ${variants.length} 型号`;

  button.append(year, name, meta);
  node.append(button);

  return node;
}

function createTimelineDetail(platform) {
  const panel = document.createElement("div");
  panel.className = `timeline-detail ${typeClass(platform)}`;

  const header = document.createElement("div");
  header.className = "timeline-detail-header";

  const titleGroup = document.createElement("div");
  const year = document.createElement("span");
  year.className = "timeline-node-year";
  year.textContent = platform.year;
  const title = document.createElement("h3");
  title.textContent = platform.name;
  const meta = document.createElement("p");
  meta.textContent = `${platform.type} · ${platform.generation} · ${platform.line}`;
  titleGroup.append(year, title, meta);

  const jumpButton = document.createElement("button");
  jumpButton.type = "button";
  jumpButton.className = "timeline-jump-button";
  jumpButton.textContent = "查看卡片";
  jumpButton.addEventListener("click", () => {
    document.querySelector(`[data-platform-id="${platformId(platform)}"]`)?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });

  header.append(titleGroup, jumpButton);

  const note = document.createElement("p");
  note.className = "timeline-detail-note";
  note.textContent = platform.notes;

  const variants = variantsForPlatform(platform);
  if (variants.length) {
    const list = document.createElement("ol");
    list.className = "timeline-variant-list";
    variants
      .slice()
      .sort((a, b) => (a.year || 9999) - (b.year || 9999) || a.name.localeCompare(b.name, "zh-CN"))
      .forEach((variant) => {
        const item = document.createElement("li");
        const itemTitle = document.createElement("strong");
        itemTitle.textContent = `${variant.year || "年份待补"} · ${variant.name}`;
        const itemNote = document.createElement("span");
        itemNote.textContent = `${variant.kind || "硬件型号"}${variant.note ? `：${variant.note}` : ""}`;
        item.append(itemTitle, itemNote);
        list.append(item);
      });

    const variantsTitle = document.createElement("h4");
    variantsTitle.textContent = `型号 / 改版 ${variants.length}`;
    panel.append(header, note, variantsTitle, list);
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
    [platform.type, platform.generation, platform.line].forEach((tag) => {
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
  renderFilters();
  const platforms = filteredPlatforms();
  renderTimeline(platforms);
  renderMeta(platforms);
  renderCards(platforms);
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim();
    state.selectedTimelineId = null;
    render();
  });

  elements.fromYear.addEventListener("input", (event) => {
    state.fromYear = Number(event.target.value) || 1972;
    state.selectedTimelineId = null;
    render();
  });

  elements.toYear.addEventListener("input", (event) => {
    state.toYear = Number(event.target.value) || 2026;
    state.selectedTimelineId = null;
    render();
  });

  elements.resetButton.addEventListener("click", () => {
    state.brand = "全部";
    state.type = "全部";
    state.query = "";
    state.fromYear = 1972;
    state.toYear = 2026;
    state.selectedTimelineId = null;
    elements.searchInput.value = "";
    elements.fromYear.value = state.fromYear;
    elements.toYear.value = state.toYear;
    render();
  });
}

function init() {
  elements.brandCount.textContent = archive.length;
  elements.platformCount.textContent = allPlatforms.length;
  elements.gameCount.textContent = totalGames();
  if (elements.variantCount) elements.variantCount.textContent = totalVariants();
  elements.fromYear.value = state.fromYear;
  elements.toYear.value = state.toYear;
  bindEvents();
  render();
}

init();
