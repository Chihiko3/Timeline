const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const timelines = [
  {
    label: "Pokemon",
    releases: ["timelines/pokemon/releases.js", "POKEMON_CORE_RELEASES"],
    editorial: ["timelines/pokemon/editorial-reading.js", "POKEMON_EDITORIAL_READING"],
    design: ["timelines/pokemon/design-logic.js", "POKEMON_DESIGN_LOGIC"],
    impact: ["timelines/pokemon/series-impact.js", "POKEMON_SERIES_IMPACT"],
    plot: ["timelines/pokemon/plot-summaries.js", "POKEMON_PLOT_SUMMARIES"]
  },
  {
    label: "Final Fantasy",
    releases: ["timelines/final-fantasy/final-fantasy-releases.js", "FINAL_FANTASY_RELEASES"],
    editorial: ["timelines/final-fantasy/editorial-reading.js", "FINAL_FANTASY_EDITORIAL_READING"],
    design: ["timelines/final-fantasy/design-logic.js", "FINAL_FANTASY_DESIGN_LOGIC"],
    impact: ["timelines/final-fantasy/series-impact.js", "FINAL_FANTASY_SERIES_IMPACT"],
    plot: ["timelines/final-fantasy/plot-summaries.js", "FINAL_FANTASY_PLOT_SUMMARIES"],
    overrides: "timelines/final-fantasy/verified-additions.js"
  },
  {
    label: "Dragon Quest",
    releases: ["timelines/DragonQuest/releases.js", "DRAGON_QUEST_RELEASES"],
    editorial: ["timelines/DragonQuest/editorial-reading.js", "DRAGON_QUEST_EDITORIAL_READING"],
    design: ["timelines/DragonQuest/design-logic.js", "DRAGON_QUEST_DESIGN_LOGIC"],
    impact: ["timelines/DragonQuest/series-impact.js", "DRAGON_QUEST_SERIES_IMPACT"],
    plot: ["timelines/DragonQuest/plot-summaries.js", "DRAGON_QUEST_PLOT_SUMMARIES"],
    overrides: "timelines/DragonQuest/verified-content.js"
  },
  {
    label: "Like a Dragon",
    releases: ["timelines/LikeADragon/releases.js", "LIKE_A_DRAGON_RELEASES"],
    editorial: ["timelines/LikeADragon/editorial-reading.js", "LIKE_A_DRAGON_EDITORIAL_READING"],
    design: ["timelines/LikeADragon/design-logic.js", "LIKE_A_DRAGON_DESIGN_LOGIC"],
    impact: ["timelines/LikeADragon/series-impact.js", "LIKE_A_DRAGON_SERIES_IMPACT"],
    plot: ["timelines/LikeADragon/plot-summaries.js", "LIKE_A_DRAGON_PLOT_SUMMARIES"]
  },
  {
    label: "Xeno Series",
    releases: ["timelines/XenoSeries/releases.js", "XENOBLADE_RELEASES"],
    editorial: ["timelines/XenoSeries/editorial-reading.js", "XENOBLADE_EDITORIAL_READING"],
    design: ["timelines/XenoSeries/design-logic.js", "XENOBLADE_DESIGN_LOGIC"],
    impact: ["timelines/XenoSeries/series-impact.js", "XENOBLADE_SERIES_IMPACT"],
    plot: ["timelines/XenoSeries/plot-summaries.js", "XENOBLADE_PLOT_SUMMARIES"]
  }
];

const weakPhrases = [
  "当前版本尚未整理",
  "后续作品可以继承其有效部分",
  "并据此调整自己的系统与内容结构",
  "为后续作品提供了参考",
  "产生了深远影响",
  "具有重要意义"
];

function load(file, globalName) {
  return loadFiles([file], globalName);
}

function loadFiles(files, globalName) {
  const context = { window: {} };
  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    vm.runInNewContext(source, context, { filename: file });
  }
  return context.window[globalName] || {};
}

function textIsValid(value) {
  return typeof value === "string" && value.trim().length >= 12;
}

function auditMap(ids, label, map, requiredFields, errors, options = {}) {
  const nullableFields = new Set(options.nullableFields || []);
  for (const id of ids) {
    const value = map[id];
    if (requiredFields.length === 1 && requiredFields[0] === "$text") {
      if (options.allowNull && Object.prototype.hasOwnProperty.call(map, id) && value === null) continue;
      if (!textIsValid(value)) errors.push(`${id}: missing or thin ${label}`);
      continue;
    }
    if (!value || typeof value !== "object") {
      errors.push(`${id}: missing ${label}`);
      continue;
    }
    for (const field of requiredFields) {
      if (nullableFields.has(field) && Object.prototype.hasOwnProperty.call(value, field) && value[field] === null) continue;
      if (!textIsValid(value[field])) errors.push(`${id}: ${label} missing or thin "${field}"`);
    }
  }

  for (const [id, value] of Object.entries(map)) {
    if (!ids.has(id)) errors.push(`${id}: ${label} references an unknown release`);
    const texts = typeof value === "string" ? [value] : Object.values(value || {}).filter((entry) => typeof entry === "string");
    for (const phrase of weakPhrases) {
      if (texts.some((text) => text.includes(phrase))) errors.push(`${id}: ${label} contains weak phrase "${phrase}"`);
    }
  }
}

let hasErrors = false;
for (const config of timelines) {
  const releases = load(...config.releases);
  const ids = new Set(releases.map((release) => release.id));
  const errors = [];
  const releaseFile = config.releases[0];
  const sharedContentFiles = config.overrides
    ? [
        releaseFile,
        config.editorial[0],
        config.design[0],
        config.impact[0],
        config.plot[0],
        config.overrides
      ]
    : null;
  const loadContent = ([file, globalName]) =>
    loadFiles(sharedContentFiles || [releaseFile, file], globalName);

  for (const release of releases) {
    if (!textIsValid(release.name) && release.name.length < 2) errors.push(`${release.id}: missing title`);
    if (!textIsValid(release.chineseName) && release.chineseName.length < 2) errors.push(`${release.id}: missing Chinese title`);
    if (!Array.isArray(release.first) || !release.first.length) errors.push(`${release.id}: missing first platform`);
    if (!Array.isArray(release.later)) errors.push(`${release.id}: later must be an array`);
  }

  auditMap(ids, "editorial", loadContent(config.editorial), ["loop", "change", "note"], errors);
  auditMap(ids, "design logic", loadContent(config.design), ["$text"], errors);
  auditMap(ids, "series impact", loadContent(config.impact), ["$text"], errors, { allowNull: true });
  auditMap(ids, "plot", loadContent(config.plot), ["summary", "innovation"], errors, { nullableFields: ["innovation"] });

  console.log(`${config.label}: ${releases.length} releases, ${errors.length} content errors`);
  for (const error of errors) console.error(`  - ${error}`);
  if (errors.length) hasErrors = true;
}

if (hasErrors) process.exitCode = 1;
