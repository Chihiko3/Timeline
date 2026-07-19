const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { randomUUID } = require("crypto");

const root = path.resolve(__dirname, "..");
const timelineDirectory = path.join(root, "timelines", "DragonQuest");
const assetDirectory = path.join(timelineDirectory, "assets", "covers");
const releaseFile = path.join(timelineDirectory, "releases.js");
const manifestFile = path.join(timelineDirectory, "timeline-images.js");
const api = "https://dragon-quest.org/w/api.php";
const headers = { "User-Agent": "GameArchiveLocal/1.0 (personal research archive)" };
const preferredFiles = {
  dq4: "File:DQIV Logo.png",
  dq5: "File:DQ V Super Famicom Box (Front Side).png",
  "dq12-sfc": "File:DQ I and II SFC Logo.png",
  dq6: "File:DQ VI Super Famicom Box (Front Side).png",
  dq7: "File:DQ VII PS1 Cover (Front Side).png",
  dqm2: "File:Dqm2 Cobi box.jpg",
  "dq-heroes": "File:DQH Japan.png",
  stars: "File:DQ of the Stars logo.png",
  "dq-tact": "File:Tactlogo.png",
  "dq-treasures": "File:Dragon Quest Treasures Logo.png",
  "dqm-joker-3": "File:DQMJ3 Japan.png"
};

function loadGlobal(file, globalName) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), context, { filename: file });
  return context.window[globalName];
}

function safeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function extensionFor(url, contentType) {
  const pathname = new URL(url).pathname;
  const extension = path.extname(pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(extension)) return extension === ".jpeg" ? ".jpg" : extension;
  if (contentType?.includes("png")) return ".png";
  if (contentType?.includes("webp")) return ".webp";
  return ".jpg";
}

function queryFor(release) {
  const aliases = {
    "dq12-sfc": "Dragon Quest I & II",
    "dq3-sfc": "Dragon Quest III SFC",
    "dq4-ps": "Dragon Quest IV PlayStation",
    "dq5-ps2": "Dragon Quest V PlayStation 2",
    "dq6-ds": "Dragon Quest VI Nintendo DS",
    "dq7-3ds": "Dragon Quest VII Nintendo 3DS",
    "dq8-3ds": "Dragon Quest VIII Nintendo 3DS",
    "dq3-hd2d": "Dragon Quest III HD-2D Remake",
    "dq12-hd2d": "Dragon Quest I & II HD-2D Remake"
  };
  return aliases[release.id] || release.name.replace(/\s*\([^)]*\)\s*/g, " ").trim();
}

async function wikiImage(release) {
  const pageParams = new URLSearchParams({
    action: "query",
    format: "json",
    redirects: "1",
    titles: queryFor(release),
    prop: "images",
    imlimit: "max"
  });
  const response = await fetch(`${api}?${pageParams}`, { headers });
  if (!response.ok) throw new Error(`wiki ${response.status}`);
  const payload = await response.json();
  const page = Object.values(payload.query?.pages || {})[0];
  if (!page || page.missing !== undefined) return null;
  const images = page.images || [];
  const scored = images.map((image) => {
    const value = image.title.toLowerCase();
    let score = 0;
    if (/(box|cover|package|packaging|jacket)/.test(value)) score += 20;
    if (/(japan|jp\b|japanese)/.test(value)) score += 8;
    if (/logo/.test(value)) score += 6;
    if (/(screenshot|wallpaper|map|cast|character|monster|sprite|icon|banner|poster|scan)/.test(value)) score -= 12;
    return { ...image, score };
  }).sort((a, b) => b.score - a.score);
  if (!scored.length || scored[0].score <= 0) return null;
  const chosen = scored.find((image) => image.title === preferredFiles[release.id]) || scored[0];

  const imageParams = new URLSearchParams({
    action: "query",
    format: "json",
    titles: chosen.title,
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "720"
  });
  const imageResponse = await fetch(`${api}?${imageParams}`, { headers });
  if (!imageResponse.ok) throw new Error(`wiki image ${imageResponse.status}`);
  const imagePayload = await imageResponse.json();
  const info = Object.values(imagePayload.query?.pages || {})[0]?.imageinfo?.[0];
  return info ? {
    url: info.thumburl || info.url,
    pageTitle: `${page.title} / ${chosen.title.replace(/^File:/, "")}`
  } : null;
}

async function download(url, destinationBase) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`image ${response.status}`);
  const extension = extensionFor(url, response.headers.get("content-type"));
  const destination = `${destinationBase}${extension}`;
  fs.writeFileSync(destination, Buffer.from(await response.arrayBuffer()));
  return destination;
}

async function main() {
  fs.mkdirSync(assetDirectory, { recursive: true });
  const releases = loadGlobal(releaseFile, "DRAGON_QUEST_RELEASES");
  const manifest = loadGlobal(manifestFile, "DRAGON_QUEST_TIMELINE_IMAGES") || {};
  let downloaded = 0;
  let skipped = 0;

  for (const release of releases) {
    const key = `dragon-quest:${release.id}`;
    const forceRefresh = Object.prototype.hasOwnProperty.call(preferredFiles, release.id);
    if (manifest[key]?.length && !forceRefresh) {
      skipped += 1;
      continue;
    }
    manifest[key] = forceRefresh ? [] : manifest[key] || [];
    try {
      const result = await wikiImage(release);
      if (!result) {
        console.log(`MISS ${release.id}`);
        continue;
      }
      const destination = await download(result.url, path.join(assetDirectory, safeName(release.id)));
      const relative = path.relative(root, destination).replaceAll(path.sep, "/");
      manifest[key].push({
        id: randomUUID(),
        name: `${release.name} (${result.pageTitle})`,
        src: relative
      });
      downloaded += 1;
      console.log(`OK   ${release.id} <- ${result.pageTitle}`);
    } catch (error) {
      console.log(`FAIL ${release.id}: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 450));
  }

  fs.writeFileSync(
    manifestFile,
    `window.DRAGON_QUEST_TIMELINE_IMAGES = ${JSON.stringify(manifest, null, 2)};\n`,
    "utf8"
  );
  console.log(`Downloaded ${downloaded}; retained ${skipped}; total records ${releases.length}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
