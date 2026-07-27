const fs = require("fs");
const path = require("path");
const vm = require("vm");
const timelines = require("./timeline-registry");

const root = path.resolve(__dirname, "..");

const decisionFields = [
  "problem",
  "hypothesis",
  "experiment",
  "outcome",
  "followUp",
  "basis",
];

function loadTimelineData(config) {
  const context = { window: {} };
  const files = [
    config.release[0],
    config.editorial[0],
    config.design[0],
    config.impact[0],
    config.externalImpact[0],
    config.plot[0],
    config.decision[0],
    config.milestone[0],
    ...config.overrides
  ];
  for (const file of new Set(files)) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    vm.runInNewContext(source, context, { filename: file });
  }
  return context.window;
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
  const data = loadTimelineData(config);
  const releases = data[config.release[1]] || [];
  const decisionChains = data[config.decision[1]] || {};
  const review = data[config.decision[2]] || {};
  const editorial = data[config.editorial[1]] || {};
  const milestones = data[config.milestone[1]] || {};
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
