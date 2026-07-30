const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const hardwareDirectory = path.join(root, "timelines", "hardware");
const dataPath = path.join(hardwareDirectory, "data.js");
const imageSourcesPath = path.join(hardwareDirectory, "image-sources.js");
const manifestPath = path.join(hardwareDirectory, "timeline-images.js");
const outputDirectory = path.join(hardwareDirectory, "assets", "consoles");
const wikiApi = "https://en.wikipedia.org/w/api.php";
const headers = {
  "User-Agent": "GameArchiveLocal/1.0 (personal research archive; hardware image migration)",
  "Accept": "application/json,image/avif,image/webp,image/png,image/jpeg,image/gif,*/*;q=0.8"
};
const requestTimeoutMs = 20000;
const requestIntervalMs = 1000;
const maximumAttempts = 4;
let lastRequestAt = 0;

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function retryDelay(response, attempt) {
  const retryAfter = Number(response?.headers.get("retry-after"));
  if (Number.isFinite(retryAfter) && retryAfter > 0) return retryAfter * 1000;
  return Math.min(30000, 2000 * (2 ** attempt));
}

async function fetchWithRetry(url, options = {}) {
  let lastError = null;
  for (let attempt = 0; attempt < maximumAttempts; attempt += 1) {
    const waitForSlot = Math.max(0, requestIntervalMs - (Date.now() - lastRequestAt));
    if (waitForSlot) await sleep(waitForSlot);
    lastRequestAt = Date.now();

    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(requestTimeoutMs)
      });
      if (response.ok || (response.status < 500 && response.status !== 429)) return response;
      lastError = new Error(`HTTP ${response.status}`);
      if (attempt < maximumAttempts - 1) await sleep(retryDelay(response, attempt));
    } catch (error) {
      lastError = error;
      if (attempt < maximumAttempts - 1) await sleep(retryDelay(null, attempt));
    }
  }
  throw lastError || new Error("request failed");
}

function loadGlobals(files) {
  const context = { window: {} };
  vm.createContext(context);
  files.forEach((file) => vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file }));
  return context.window;
}

const globals = loadGlobals([dataPath, imageSourcesPath, manifestPath]);
const archive = globals.CONSOLE_ARCHIVE;
const imageSources = globals.CONSOLE_IMAGE_SOURCES || {};
const existingManifest = globals.HARDWARE_TIMELINE_IMAGES || {};
const platforms = archive.flatMap((brand) =>
  brand.platforms.map((platform) => ({ ...platform, brand: brand.brand }))
);

function platformId(platform) {
  return `${platform.brand}-${platform.name}-${platform.year}`.replace(/[^a-z0-9]+/gi, "-");
}

function manifestKey(platform) {
  return `hardware:${platformId(platform)}`;
}

function imageQueries(platform) {
  const names = platform.name.split("/").map((name) => name.trim()).filter(Boolean);
  return [
    `${platform.name} video game console`,
    ...names.map((name) => `${name} console`),
    `${platform.brand} ${platform.name}`
  ];
}

function extensionFor(url, contentType = "") {
  const pathname = new URL(url).pathname;
  const extension = path.extname(pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(extension)) {
    return extension === ".jpeg" ? ".jpg" : extension;
  }
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("gif")) return ".gif";
  return ".jpg";
}

async function wikiPageImage(title) {
  const params = new URLSearchParams({
    action: "query",
    titles: title,
    prop: "pageimages|info",
    piprop: "thumbnail",
    pithumbsize: "900",
    redirects: "1",
    inprop: "url",
    format: "json",
    origin: "*"
  });
  const response = await fetchWithRetry(`${wikiApi}?${params}`, { headers });
  if (!response.ok) return null;
  const payload = await response.json();
  const page = Object.values(payload.query?.pages || {}).find((item) => item.thumbnail?.source);
  return page ? {
    src: page.thumbnail.source,
    page: page.fullurl,
    title: page.title
  } : null;
}

async function wikiSearchImage(query) {
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
  const response = await fetchWithRetry(`${wikiApi}?${params}`, { headers });
  if (!response.ok) return null;
  const payload = await response.json();
  const page = Object.values(payload.query?.pages || {}).find((item) => item.thumbnail?.source);
  return page ? {
    src: page.thumbnail.source,
    page: page.fullurl,
    title: page.title
  } : null;
}

async function candidatesFor(platform) {
  const source = imageSources[platformId(platform)];
  if (source?.images?.length) return source.images;
  if (source?.title) {
    const exact = await wikiPageImage(source.title);
    if (exact) return [exact];
  }
  for (const query of imageQueries(platform)) {
    const result = await wikiSearchImage(query);
    if (result) return [result];
  }
  return [];
}

async function saveCandidate(platform, candidate, index) {
  const response = await fetchWithRetry(candidate.src, { headers });
  if (!response.ok) throw new Error(`image ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) throw new Error(`unexpected content type ${contentType || "unknown"}`);
  if (buffer.length < 1024) throw new Error("image payload is too small");
  const extension = extensionFor(response.url || candidate.src, contentType);
  const id = platformId(platform);
  const filename = `${id}-${String(index + 1).padStart(2, "0")}${extension}`;
  fs.writeFileSync(path.join(outputDirectory, filename), buffer);
  return {
    id: `seed-hardware-${id}-${index}`,
    name: candidate.title || platform.name,
    src: `timelines/hardware/assets/consoles/${filename}`
  };
}

function writeManifest(manifest) {
  const ordered = Object.fromEntries(platforms.map((platform) => {
    const key = manifestKey(platform);
    return [key, manifest[key] || []];
  }));
  fs.writeFileSync(
    manifestPath,
    `window.HARDWARE_TIMELINE_IMAGES = ${JSON.stringify(ordered, null, 2)};\n`,
    "utf8"
  );
}

async function main() {
  fs.mkdirSync(outputDirectory, { recursive: true });
  const manifest = { ...existingManifest };
  let saved = 0;
  let missed = 0;

  for (const platform of platforms) {
    const key = manifestKey(platform);
    if (manifest[key]?.length) {
      console.log(`keep  ${platform.name}`);
      continue;
    }

    try {
      const candidates = await candidatesFor(platform);
      const images = [];
      for (const [index, candidate] of candidates.entries()) {
        images.push(await saveCandidate(platform, candidate, index));
      }
      manifest[key] = images;
      if (images.length) {
        saved += images.length;
        console.log(`saved ${platform.name} (${images.length})`);
      } else {
        missed += 1;
        console.log(`miss  ${platform.name}`);
      }
    } catch (error) {
      missed += 1;
      manifest[key] = [];
      console.log(`fail  ${platform.name} (${error.message})`);
    }

    writeManifest(manifest);
  }

  console.log(`\nSaved ${saved} images; ${missed} platforms still missing.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
