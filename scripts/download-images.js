const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const dataPath = path.join(root, "timelines", "hardware", "data.js");
const imageSourcesPath = path.join(root, "timelines", "hardware", "image-sources.js");
const outputDir = path.join(root, "timelines", "hardware", "assets", "consoles");
const imagesPath = path.join(root, "timelines", "hardware", "images.js");
const wikiApi = "https://en.wikipedia.org/w/api.php";

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(dataPath, "utf8"), context);
vm.runInContext(fs.readFileSync(imageSourcesPath, "utf8"), context);

const archive = context.window.CONSOLE_ARCHIVE;
const imageSources = context.window.CONSOLE_IMAGE_SOURCES || {};
const allPlatforms = archive.flatMap((brand) =>
  brand.platforms.map((platform) => ({
    ...platform,
    brand: brand.brand,
    region: brand.region
  }))
);

function platformId(platform) {
  return `${platform.brand}-${platform.name}-${platform.year}`.replace(/[^a-z0-9]+/gi, "-");
}

function imageQueries(platform) {
  const names = platform.name
    .split("/")
    .map((name) => name.trim())
    .filter(Boolean);
  return [
    `${platform.name} video game console`,
    ...names.map((name) => `${name} console`),
    `${platform.brand} ${platform.name}`,
    platform.name
  ];
}

function extensionFromUrl(url) {
  const cleanUrl = new URL(url);
  const ext = path.extname(cleanUrl.pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) return ext;
  return ".jpg";
}

async function findImage(platform) {
  const manual = manualImageForPlatform(platform);
  if (manual) return manual;

  const exact = await findExactImage(platform);
  if (exact) return exact;

  for (const query of imageQueries(platform)) {
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: query,
      gsrlimit: "5",
      prop: "pageimages|info",
      piprop: "thumbnail",
      pithumbsize: "900",
      inprop: "url",
      format: "json",
      origin: "*"
    });

    try {
      const response = await fetch(`${wikiApi}?${params}`);
      if (!response.ok) continue;

      const payload = await response.json();
      const pages = Object.values(payload.query?.pages || {});
      const match = pages.find((page) => page.thumbnail?.source);
      if (match) {
        return {
          remoteSrc: match.thumbnail.source,
          page: match.fullurl,
          title: match.title
        };
      }
    } catch (error) {
      console.log(`skip  ${platform.name} (${error.cause?.code || error.code || "network error"})`);
      return null;
    }
  }

  return null;
}

function manualImageForPlatform(platform) {
  const source = imageSources[platformId(platform)];
  const image = source?.images?.[0];
  if (!image?.src) return null;
  return {
    remoteSrc: image.src,
    page: image.page,
    title: image.title
  };
}

async function findExactImage(platform) {
  const source = imageSources[platformId(platform)];
  if (!source?.title) return null;

  const params = new URLSearchParams({
    action: "query",
    titles: source.title,
    prop: "pageimages|info",
    piprop: "thumbnail",
    pithumbsize: "900",
    redirects: "1",
    inprop: "url",
    format: "json",
    origin: "*"
  });

  try {
    const response = await fetch(`${wikiApi}?${params}`);
    if (!response.ok) return null;
    const payload = await response.json();
    const pages = Object.values(payload.query?.pages || {});
    const match = pages.find((page) => page.thumbnail?.source);
    if (!match) return null;
    return {
      remoteSrc: match.thumbnail.source,
      page: match.fullurl,
      title: match.title
    };
  } catch (error) {
    console.log(`skip  ${platform.name} exact (${error.cause?.code || error.code || "network error"})`);
    return null;
  }
}

async function downloadImage(platform) {
  const id = platformId(platform);
  const found = await findImage(platform);
  if (!found) {
    console.log(`miss  ${platform.name}`);
    return null;
  }

  const ext = extensionFromUrl(found.remoteSrc);
  const filename = `${id}${ext}`;
  const localPath = path.join(outputDir, filename);
  try {
    const response = await fetch(found.remoteSrc);
    if (!response.ok) {
      console.log(`fail  ${platform.name}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(localPath, buffer);
    console.log(`saved ${platform.name}`);
  } catch (error) {
    console.log(`skip  ${platform.name} (${error.cause?.code || error.code || "network error"})`);
    return null;
  }

  return [
    id,
    {
      src: `timelines/hardware/assets/consoles/${filename}`,
      page: found.page,
      title: found.title
    }
  ];
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  const entries = [];
  for (const platform of allPlatforms) {
    const result = await downloadImage(platform);
    if (result) entries.push(result);
  }

  const images = Object.fromEntries(entries);
  const content = `window.CONSOLE_IMAGES = ${JSON.stringify(images, null, 2)};\n`;
  fs.writeFileSync(imagesPath, content, "utf8");
  console.log(`\nGenerated ${path.relative(root, imagesPath)} with ${entries.length} images.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
