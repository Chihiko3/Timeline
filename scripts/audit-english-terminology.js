const fs = require("fs");
const path = require("path");
const vm = require("vm");
const timelines = require("./timeline-registry");

const root = path.resolve(__dirname, "..");
const context = { window: {} };
vm.createContext(context);

function load(relativePath) {
  vm.runInContext(
    fs.readFileSync(path.join(root, relativePath), "utf8"),
    context,
    { filename: relativePath },
  );
}

for (const timeline of timelines) {
  load(timeline.release[0]);
  load(timeline.milestone[0]);
}
load("common/localization-en-data.js");
load("common/localization-en.js");

const translate = context.window.translateGameArchiveText;
const rows = new Map();

function add(timeline, field, source) {
  if (typeof source !== "string" || !source.trim()) return;
  const key = `${field}\u0000${source}`;
  if (!rows.has(key)) rows.set(key, { timeline, field, source, translated: translate(source) });
}

for (const timeline of timelines) {
  const releases = context.window[timeline.release[1]] || [];
  for (const release of releases) {
    for (const field of ["category", "tag", "generation", "workType"]) {
      add(timeline.label, field, release[field]);
    }
  }
  const milestones = context.window[timeline.milestone[1]] || {};
  for (const milestoneGroup of Object.values(milestones)) {
    for (const milestone of Object.values(milestoneGroup)) {
      add(timeline.label, "milestone label", milestone?.label);
    }
  }
}

const entries = [...rows.values()].sort(
  (left, right) => left.timeline.localeCompare(right.timeline) ||
    left.field.localeCompare(right.field) ||
    left.source.localeCompare(right.source, "zh-CN"),
);

if (process.argv.includes("--list")) {
  for (const entry of entries) {
    console.log(`${entry.timeline}\t${entry.field}\t${entry.source}\t${entry.translated}`);
  }
}

const errors = [];
const chinese = /[\u3400-\u9fff]/u;
const knownBadEnglish = /\b(?:current|on the move|external|fighting chess|breeding rpg|polar)\b/i;
for (const entry of entries) {
  if (chinese.test(entry.translated)) {
    errors.push(`${entry.timeline} ${entry.field}: untranslated "${entry.source}"`);
  } else if (knownBadEnglish.test(entry.translated)) {
    errors.push(
      `${entry.timeline} ${entry.field}: suspicious "${entry.source}" -> "${entry.translated}"`,
    );
  }
}

if (errors.length) {
  console.error(`English terminology audit found ${errors.length} errors:`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exitCode = 1;
} else {
  console.log(`English terminology audit passed: ${entries.length} card and milestone terms checked.`);
}
