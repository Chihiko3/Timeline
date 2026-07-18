const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const timelines = [
  {
    label: "Pokemon",
    file: "timelines/pokemon/releases.js",
    globalName: "POKEMON_CORE_RELEASES",
  },
  {
    label: "Final Fantasy",
    file: "timelines/final-fantasy/final-fantasy-releases.js",
    globalName: "FINAL_FANTASY_RELEASES",
  },
  {
    label: "Xenoblade",
    file: "timelines/xenoblade/releases.js",
    globalName: "XENOBLADE_RELEASES",
  },
];

function loadTimeline({ file, globalName }) {
  const context = { window: {} };
  const source = fs.readFileSync(path.join(root, file), "utf8");
  vm.runInNewContext(source, context, { filename: file });
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
  const releases = loadTimeline(config);
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
