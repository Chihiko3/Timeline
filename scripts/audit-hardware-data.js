const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const files = [
  "timelines/hardware/data.js",
  "timelines/hardware/card-copy.js",
  "timelines/hardware/release-dates.js",
  "timelines/hardware/platform-variants.js",
  "timelines/hardware/curated-games.js",
  "timelines/hardware/image-sources.js",
  "timelines/hardware/timeline-images.js"
];

const context = { window: {} };
for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  vm.runInNewContext(source, context, { filename: file });
}

const data = context.window;
const archive = data.CONSOLE_ARCHIVE || [];
const releaseDates = data.CONSOLE_RELEASE_DATES || {};
const variants = data.CONSOLE_PLATFORM_VARIANTS || {};
const curatedGames = data.CONSOLE_CURATED_GAMES || {};
const cardCopy = data.HARDWARE_CARD_COPY || {};
const imageSources = data.CONSOLE_IMAGE_SOURCES || {};
const timelineImages = data.HARDWARE_TIMELINE_IMAGES || {};
const errors = [];

function platformId(platform) {
  return `${platform.brand}-${platform.name}-${platform.year}`.replace(/[^a-z0-9]+/gi, "-");
}

function normalizedName(value) {
  return String(value || "").replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function isNonEmptyText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function duplicateValues(values) {
  const seen = new Set();
  return values.filter((value) => {
    const normalized = value.trim().toLowerCase();
    if (seen.has(normalized)) return true;
    seen.add(normalized);
    return false;
  });
}

const platforms = archive.flatMap((group) =>
  (group.platforms || []).map((platform) => ({
    ...platform,
    brand: group.brand,
    region: group.region
  }))
);
const ids = new Set();
const platformNameOwners = new Map();

for (const platform of platforms) {
  const id = platformId(platform);
  if (ids.has(id)) errors.push(`${id}: duplicate platform id`);
  ids.add(id);

  for (const field of ["brand", "region", "name", "type", "generation", "line", "notes"]) {
    if (!isNonEmptyText(platform[field])) errors.push(`${id}: missing "${field}"`);
  }
  if (!Number.isInteger(platform.year)) errors.push(`${id}: invalid release year`);
  if (platform.notes.trim().length < 18) errors.push(`${id}: hardware note is too thin`);
  if (!cardCopy[id]) {
    errors.push(`${id}: missing primary-card copy`);
  } else {
    if (!isNonEmptyText(cardCopy[id].status)) errors.push(`${id}: missing primary-card historical status`);
    if (!isNonEmptyText(cardCopy[id].feature)) errors.push(`${id}: missing primary-card feature`);
  }
  if (!Array.isArray(platform.games) || !platform.games.length) {
    errors.push(`${id}: missing representative games`);
  }

  const date = releaseDates[id];
  if (!date) {
    errors.push(`${id}: missing release date`);
  } else if (date.month === null) {
    if (date.precision !== "year") errors.push(`${id}: null month must declare year precision`);
  } else if (!Number.isInteger(date.month) || date.month < 1 || date.month > 12) {
    errors.push(`${id}: invalid release month "${date.month}"`);
  }

  const platformVariants = variants[id];
  if (!Array.isArray(platformVariants) || !platformVariants.length) {
    errors.push(`${id}: missing models or revisions`);
  } else {
    for (const variant of platformVariants) {
      if (!isNonEmptyText(variant.name) || !isNonEmptyText(variant.kind) || !isNonEmptyText(variant.note)) {
        errors.push(`${id}: incomplete variant record`);
      }
      if (!Number.isInteger(variant.year) || variant.year < platform.year) {
        errors.push(`${id}: variant "${variant.name}" predates the platform`);
      }
    }
  }

  const games = curatedGames[id];
  if (!games || !Array.isArray(games.launchGames) || !Array.isArray(games.signatureGames)) {
    errors.push(`${id}: missing curated game groups`);
  } else {
    if (!games.signatureGames.length) errors.push(`${id}: missing signature games`);
    for (const [groupName, group] of Object.entries({
      launchGames: games.launchGames,
      signatureGames: games.signatureGames
    })) {
      if (group.some((game) => !isNonEmptyText(game))) {
        errors.push(`${id}: ${groupName} contains an empty title`);
      }
      const duplicates = duplicateValues(group);
      if (duplicates.length) {
        errors.push(`${id}: ${groupName} contains duplicates: ${duplicates.join(", ")}`);
      }
    }
  }

  if (!imageSources[id]) errors.push(`${id}: missing fallback image source`);
  const imageKey = `hardware:${id}`;
  if (!Object.prototype.hasOwnProperty.call(timelineImages, imageKey)) {
    errors.push(`${id}: missing GM image record`);
  } else if (!Array.isArray(timelineImages[imageKey]) || !timelineImages[imageKey].length) {
    errors.push(`${id}: GM image record is empty`);
  } else {
    for (const image of timelineImages[imageKey]) {
      if (!isNonEmptyText(image.id) || !isNonEmptyText(image.name) || !isNonEmptyText(image.src)) {
        errors.push(`${id}: incomplete GM image record`);
        continue;
      }
      const expectedPrefix = "timelines/hardware/assets/consoles/";
      if (!image.src.startsWith(expectedPrefix)) {
        errors.push(`${id}: image is not stored in the hardware asset folder (${image.src})`);
        continue;
      }
      if (!fs.existsSync(path.join(root, image.src))) {
        errors.push(`${id}: image file does not exist (${image.src})`);
      }
    }
  }

  platformNameOwners.set(normalizedName(platform.name), id);
}

for (const id of Object.keys(cardCopy)) {
  if (!ids.has(id)) errors.push(`${id}: primary-card copy references an unknown platform`);
}

for (const [id, platformVariants] of Object.entries(variants)) {
  if (!ids.has(id)) errors.push(`${id}: variants reference an unknown platform`);
  for (const variant of platformVariants || []) {
    const ownerId = platformNameOwners.get(normalizedName(variant.name));
    if (ownerId && ownerId !== id) {
      errors.push(`${id}: variant "${variant.name}" already has its own platform card (${ownerId})`);
    }
  }
}

for (const [label, map, prefix = ""] of [
  ["release date", releaseDates],
  ["curated games", curatedGames],
  ["image source", imageSources],
  ["GM image", timelineImages, "hardware:"]
]) {
  for (const key of Object.keys(map)) {
    const id = prefix && key.startsWith(prefix) ? key.slice(prefix.length) : key;
    if (!ids.has(id)) errors.push(`${key}: orphaned ${label} record`);
  }
}

console.log(
  `Hardware: ${archive.length} manufacturers, ${platforms.length} platforms, ` +
    `${errors.length} data errors`
);
for (const error of errors) console.error(`  - ${error}`);
if (errors.length) process.exitCode = 1;
