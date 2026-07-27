const fs = require("fs");
const path = require("path");
const vm = require("vm");
const timelines = require("./timeline-registry");

const root = path.resolve(__dirname, "..");

const weakPhrases = [
  "当前版本尚未整理",
  "后续作品可以继承其有效部分",
  "并据此调整自己的系统与内容结构",
  "为后续作品提供了参考",
  "产生了深远影响",
  "具有重要意义"
];

function loadFiles(files) {
  const context = { window: {} };
  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    vm.runInNewContext(source, context, { filename: file });
  }
  return context.window;
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
  const files = [
    config.release[0],
    config.editorial[0],
    config.design[0],
    config.impact[0],
    config.plot[0],
    ...config.overrides
  ];
  const data = loadFiles([...new Set(files)]);
  const releases = data[config.release[1]] || [];
  const ids = new Set(releases.map((release) => release.id));
  const errors = [];

  for (const release of releases) {
    if (!textIsValid(release.name) && release.name.length < 2) errors.push(`${release.id}: missing title`);
    if (!textIsValid(release.chineseName) && release.chineseName.length < 2) errors.push(`${release.id}: missing Chinese title`);
    if (!Array.isArray(release.first) || !release.first.length) errors.push(`${release.id}: missing first platform`);
    if (!Array.isArray(release.later)) errors.push(`${release.id}: later must be an array`);
  }

  auditMap(ids, "editorial", data[config.editorial[1]] || {}, ["loop", "change", "note"], errors);
  auditMap(ids, "design logic", data[config.design[1]] || {}, ["$text"], errors);
  auditMap(ids, "series impact", data[config.impact[1]] || {}, ["$text"], errors, { allowNull: true });
  auditMap(ids, "plot", data[config.plot[1]] || {}, ["summary", "innovation"], errors, { nullableFields: ["innovation"] });

  console.log(`${config.label}: ${releases.length} releases, ${errors.length} content errors`);
  for (const error of errors) console.error(`  - ${error}`);
  if (errors.length) hasErrors = true;
}

if (hasErrors) process.exitCode = 1;
