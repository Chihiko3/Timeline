const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const indexSource = fs.readFileSync(indexPath, "utf8");
const scriptPaths = [...indexSource.matchAll(/<script src="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((scriptPath) => scriptPath.startsWith("timelines/") || [
    "common/localization-en-reviewed.js",
    "common/localization-en-data.js",
    "common/localization-en.js"
  ].includes(scriptPath));

const context = { window: {} };
vm.createContext(context);

for (const scriptPath of scriptPaths) {
  const absolutePath = path.join(root, scriptPath);
  vm.runInContext(fs.readFileSync(absolutePath, "utf8"), context, { filename: scriptPath });
}

if (typeof context.window.applyEnglishLocalization !== "function") {
  console.error("English localization is not loaded from common/localization-en.js.");
  process.exit(1);
}

context.window.applyEnglishLocalization();

const ignoredGlobals = /(?:IMAGE_SOURCES|TIMELINE_IMAGES|DECISION_CHAINS|DECISION_CHAIN_REVIEW)$/;
const untranslated = [];
const visited = new Set();
const containsChinese = (value) => /[\u3400-\u9fff]/u.test(value);

function scanInterfaceString(value, location) {
  if (!containsChinese(value) || value === "中文") return;
  const translated = context.window.translateGameArchiveText(value);
  if (translated === value || containsChinese(translated)) untranslated.push({ location, value });
}

function scan(value, location) {
  if (typeof value === "string") {
    if (containsChinese(value)) {
      untranslated.push({
        location,
        value,
        directTranslation: context.window.translateGameArchiveText(value),
      });
    }
    return;
  }
  if (!value || typeof value !== "object" || visited.has(value)) return;
  visited.add(value);
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scan(entry, `${location}[${index}]`));
    return;
  }
  Object.entries(value).forEach(([key, entry]) => scan(entry, `${location}.${key}`));
}

Object.entries(context.window).forEach(([key, value]) => {
  if (!ignoredGlobals.test(key) && ![
    "applyEnglishLocalization",
    "translateGameArchiveText"
  ].includes(key)) scan(value, key);
});

const staticMarkup = indexSource
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
for (const match of staticMarkup.matchAll(/>([^<]+)</g)) {
  scanInterfaceString(match[1].trim(), "index.html text");
}
for (const match of staticMarkup.matchAll(/(?:aria-label|title|placeholder|alt|content)="([^"]+)"/g)) {
  scanInterfaceString(match[1].trim(), "index.html attribute");
}

const appSource = fs.readFileSync(path.join(root, "common", "app.js"), "utf8");
const ignoredSourceRanges = [
  [appSource.indexOf("const POKEMON_STARTERS_BY_GENERATION"), appSource.indexOf("const POKEMON_SPRITE_IDS")],
  [appSource.indexOf("const DECISION_REVIEW_REASONS"), appSource.indexOf("function seriesInsightFor")]
];
for (const match of appSource.matchAll(/(["'])([^"'`\r\n]*[\u3400-\u9fff][^"'`\r\n]*)\1/g)) {
  if (ignoredSourceRanges.some(([start, end]) => start >= 0 && match.index >= start && match.index < end)) continue;
  if (/[<>]/.test(match[2])) continue;
  scanInterfaceString(match[2], "common/app.js interface literal");
}

[
  "3 个型号 / 改版",
  "型号 / 改版 3",
  "型号 / 改版 3 项",
  "护航与特色游戏 3 款",
  "3 个平台",
  "当前显示 3 台硬件，覆盖 12 个护航与特色游戏条目。",
  "打开 Example 的资料页",
  "Example 图片",
  "图片来源：Example",
  "年份待补 · Example",
  "判断依据：Example",
  "谱系关系：Example",
  "重制：Example",
  "改版：Example",
  "Example 像素图"
].forEach((value) => scanInterfaceString(value, "dynamic interface pattern"));

if (untranslated.length) {
  const preview = untranslated.slice(0, 50)
    .map(({ location, value, directTranslation }) => {
      const candidate = directTranslation && directTranslation !== value
        ? ` -> ${directTranslation}`
        : "";
      return `${location}: ${value}${candidate}`;
    })
    .join("\n");
  console.error(`English localization still contains ${untranslated.length} Chinese strings:\n${preview}`);
  if (untranslated.length > 50) console.error(`...and ${untranslated.length - 50} more.`);
  process.exitCode = 1;
} else {
  console.log("English localization audit passed: timeline data and shared interface strings are covered.");
}
