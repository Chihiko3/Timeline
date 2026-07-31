const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scriptPaths = [...indexSource.matchAll(/<script src="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((scriptPath) => scriptPath.startsWith("timelines/") && !scriptPath.endsWith("timeline-images.js"));
const context = { window: {} };
vm.createContext(context);

for (const scriptPath of scriptPaths) {
  vm.runInContext(fs.readFileSync(path.join(root, scriptPath), "utf8"), context, { filename: scriptPath });
}

const excludedGlobals = /(?:IMAGE_SOURCES|TIMELINE_IMAGES|DECISION_CHAINS|DECISION_CHAIN_REVIEW)$/;
const strings = new Map();
const visited = new Set();

function collect(value, location) {
  if (typeof value === "string") {
    if (/[\u3400-\u9fff]/u.test(value)) {
      if (!strings.has(value)) strings.set(value, []);
      strings.get(value).push(location);
    }
    return;
  }
  if (!value || typeof value !== "object" || visited.has(value)) return;
  visited.add(value);
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collect(entry, `${location}[${index}]`));
    return;
  }
  Object.entries(value).forEach(([key, entry]) => collect(entry, `${location}.${key}`));
}

Object.entries(context.window).forEach(([key, value]) => {
  if (!excludedGlobals.test(key)) collect(value, key);
});

const payload = [...strings.entries()]
  .map(([source, locations]) => ({ source, locations }))
  .sort((left, right) => left.source.localeCompare(right.source, "zh-CN"));
const outputPath = process.argv[2];

if (outputPath) {
  fs.writeFileSync(path.resolve(outputPath), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

const characters = payload.reduce((total, entry) => total + entry.source.length, 0);
console.log(`Collected ${payload.length} unique Chinese strings (${characters} characters) from ${scriptPaths.length} timeline scripts.`);
if (outputPath) console.log(`Wrote ${path.resolve(outputPath)}`);
