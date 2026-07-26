const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const timelines = [
  {
    label: "Pokemon",
    file: "timelines/pokemon/releases.js",
    globalName: "POKEMON_CORE_RELEASES",
    decisionFile: "timelines/pokemon/decision-chain.js",
    decisionGlobalName: "POKEMON_DECISION_CHAINS",
    reviewGlobalName: "POKEMON_DECISION_CHAIN_REVIEW",
    editorialFile: "timelines/pokemon/editorial-reading.js",
    editorialGlobalName: "POKEMON_EDITORIAL_READING",
    milestoneFile: "timelines/pokemon/milestones.js",
    milestoneGlobalName: "POKEMON_MILESTONES",
  },
  {
    label: "Final Fantasy",
    file: "timelines/final-fantasy/final-fantasy-releases.js",
    globalName: "FINAL_FANTASY_RELEASES",
    decisionFile: "timelines/final-fantasy/decision-chain.js",
    decisionGlobalName: "FINAL_FANTASY_DECISION_CHAINS",
    reviewGlobalName: "FINAL_FANTASY_DECISION_CHAIN_REVIEW",
    editorialFile: "timelines/final-fantasy/editorial-reading.js",
    editorialGlobalName: "FINAL_FANTASY_EDITORIAL_READING",
    editorialSupportFiles: [
      "timelines/final-fantasy/design-logic.js",
      "timelines/final-fantasy/series-impact.js",
      "timelines/final-fantasy/plot-summaries.js",
      "timelines/final-fantasy/verified-additions.js",
    ],
    milestoneFile: "timelines/final-fantasy/milestones.js",
    milestoneGlobalName: "FINAL_FANTASY_MILESTONES",
  },
  {
    label: "Dragon Quest",
    file: "timelines/DragonQuest/releases.js",
    globalName: "DRAGON_QUEST_RELEASES",
    decisionFile: "timelines/DragonQuest/decision-chain.js",
    decisionGlobalName: "DRAGON_QUEST_DECISION_CHAINS",
    reviewGlobalName: "DRAGON_QUEST_DECISION_CHAIN_REVIEW",
    editorialFile: "timelines/DragonQuest/editorial-reading.js",
    editorialGlobalName: "DRAGON_QUEST_EDITORIAL_READING",
    milestoneFile: "timelines/DragonQuest/milestones.js",
    milestoneGlobalName: "DRAGON_QUEST_MILESTONES",
  },
  {
    label: "Like a Dragon",
    file: "timelines/LikeADragon/releases.js",
    globalName: "LIKE_A_DRAGON_RELEASES",
    decisionFile: "timelines/LikeADragon/decision-chain.js",
    decisionGlobalName: "LIKE_A_DRAGON_DECISION_CHAINS",
    reviewGlobalName: "LIKE_A_DRAGON_DECISION_CHAIN_REVIEW",
    editorialFile: "timelines/LikeADragon/editorial-reading.js",
    editorialGlobalName: "LIKE_A_DRAGON_EDITORIAL_READING",
    milestoneFile: "timelines/LikeADragon/milestones.js",
    milestoneGlobalName: "LIKE_A_DRAGON_MILESTONES",
  },
  {
    label: "Xeno Series",
    file: "timelines/XenoSeries/releases.js",
    globalName: "XENOBLADE_RELEASES",
    decisionFile: "timelines/XenoSeries/decision-chain.js",
    decisionGlobalName: "XENOBLADE_DECISION_CHAINS",
    reviewGlobalName: "XENOBLADE_DECISION_CHAIN_REVIEW",
    editorialFile: "timelines/XenoSeries/editorial-reading.js",
    editorialGlobalName: "XENOBLADE_EDITORIAL_READING",
    milestoneFile: "timelines/XenoSeries/milestones.js",
    milestoneGlobalName: "XENOBLADE_MILESTONES",
  },
];

const decisionFields = [
  "problem",
  "hypothesis",
  "experiment",
  "outcome",
  "followUp",
  "basis",
];

function loadData(file, globalName) {
  return loadDataFiles([file], globalName);
}

function loadDataFiles(files, globalName) {
  const context = { window: {} };
  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    vm.runInNewContext(source, context, { filename: file });
  }
  return context.window[globalName];
}

function isValidDate(value) {
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split(".").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function auditTimeline(config) {
  const releases = loadData(config.file, config.globalName);
  const decisionChains = loadData(
    config.decisionFile,
    config.decisionGlobalName,
  );
  const review = loadData(config.decisionFile, config.reviewGlobalName);
  const editorial = loadDataFiles(
    [config.file, config.editorialFile, ...(config.editorialSupportFiles || [])],
    config.editorialGlobalName,
  );
  const milestones = loadData(config.milestoneFile, config.milestoneGlobalName);
  const errors = [];
  const ids = new Set();

  for (const release of releases) {
    if (!isValidDate(release.date)) {
      errors.push(`${release.id}: invalid date "${release.date}"`);
    }
    if (ids.has(release.id)) {
      errors.push(`${release.id}: duplicate id`);
    }
    ids.add(release.id);

    if (!release.first?.length) {
      errors.push(`${release.id}: missing first-release platform`);
      continue;
    }

    const releaseYear = Number(release.date.slice(0, 4));
    if (release.first.some((entry) => entry.year !== releaseYear)) {
      errors.push(`${release.id}: first platform year does not match ${releaseYear}`);
    }

    let previousPlatformYear = releaseYear;
    for (const entry of [...release.first, ...(release.later || [])]) {
      if (!Number.isInteger(entry.year)) {
        errors.push(`${release.id}: invalid platform year "${entry.year}"`);
      } else if (entry.year < previousPlatformYear) {
        errors.push(`${release.id}: platform years are not chronological`);
      }
      previousPlatformYear = entry.year;
    }
  }

  const renderedOrder = [...releases].sort(
    (a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name),
  );
  for (let index = 1; index < renderedOrder.length; index += 1) {
    if (renderedOrder[index].date < renderedOrder[index - 1].date) {
      errors.push(`${renderedOrder[index].id}: rendered timeline order is invalid`);
    }
  }

  for (const [id, chain] of Object.entries(decisionChains)) {
    if (!ids.has(id)) {
      errors.push(`${id}: decision chain references an unknown release`);
    }
    for (const field of decisionFields) {
      if (typeof chain[field] !== "string" || !chain[field].trim()) {
        errors.push(`${id}: decision chain is missing "${field}"`);
      }
    }
  }

  const reviewIds = new Map();
  const addReviewId = (id, status) => {
    if (!ids.has(id)) {
      errors.push(`${id}: ${status} review references an unknown release`);
    }
    if (reviewIds.has(id) || decisionChains[id]) {
      errors.push(`${id}: decision review is classified more than once`);
    }
    reviewIds.set(id, status);
  };

  for (const id of review.inferred || []) {
    addReviewId(id, "inferred");
    if (!editorial[id]?.loop || !editorial[id]?.change) {
      errors.push(`${id}: inferred decision chain lacks specific editorial data`);
    }
  }
  for (const [reason, reasonIds] of Object.entries(review.insufficient || {})) {
    for (const id of reasonIds) addReviewId(id, `insufficient:${reason}`);
  }

  for (const id of ids) {
    if (!decisionChains[id] && !reviewIds.has(id)) {
      errors.push(`${id}: decision chain has not been reviewed`);
    }
  }

  const milestoneEntries = Object.entries(milestones);
  if (!milestoneEntries.length) {
    errors.push("timeline has no milestone entry");
  }
  for (const [id, milestone] of milestoneEntries) {
    if (!ids.has(id)) {
      errors.push(`${id}: milestone references an unknown release`);
    }
    for (const field of ["label", "achievement", "evidence"]) {
      if (typeof milestone[field] !== "string" || !milestone[field].trim()) {
        errors.push(`${id}: milestone is missing "${field}"`);
      }
    }
  }

  return { count: releases.length, uniqueIds: ids.size, errors };
}

let hasErrors = false;

for (const timeline of timelines) {
  const result = auditTimeline(timeline);
  console.log(
    `${timeline.label}: ${result.count} records, ${result.uniqueIds} unique IDs, ` +
      `${result.errors.length} errors`,
  );
  if (result.errors.length) {
    hasErrors = true;
    for (const error of result.errors) console.error(`  - ${error}`);
  }
}

if (hasErrors) process.exitCode = 1;
