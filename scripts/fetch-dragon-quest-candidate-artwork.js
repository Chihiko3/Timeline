const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { randomUUID } = require("crypto");

const root = path.resolve(__dirname, "..");
const timelineDirectory = path.join(root, "timelines", "DragonQuest");
const assetDirectory = path.join(timelineDirectory, "assets", "covers");
const releaseFile = path.join(timelineDirectory, "releases.js");
const manifestFile = path.join(timelineDirectory, "timeline-images.js");
const headers = { "User-Agent": "Mozilla/5.0 GameArchiveLocal/1.0" };

const launchBoxPages = {
  "torneko-1": "https://gamesdb.launchbox-app.com/games/images/6023-torneko-no-daibouken-fushigi-no-dungeon",
  "dq3-sfc": "https://gamesdb.launchbox-app.com/games/images/14280",
  "torneko-2": "https://gamesdb.launchbox-app.com/games/images/13055-torneko-the-last-hope",
  "dq4-ps": "https://gamesdb.launchbox-app.com/games/images/95500-dragon-quest-iv-michibikareshi-mono-tachi",
  dqm12: "https://gamesdb.launchbox-app.com/games/images/105521-dragon-quest-monsters-12-hoshifuri-no-yuusha-to-bokujou-no-nakamatachi",
  "torneko-3": "https://gamesdb.launchbox-app.com/games/images/128759-dragon-quest-characters-torneko-no-daibouken-3-fushigi-no-dungeon",
  "slime-1": "https://gamesdb.launchbox-app.com/games/images/105592-slime-mori-mori-dragon-quest",
  "dq5-ps2": "https://gamesdb.launchbox-app.com/games/images/5310-dragon-quest-v-hand-of-the-heavenly-bride",
  "dq6-ds": "https://gamesdb.launchbox-app.com/games/images/10629-dragon-quest-vi-realms-of-revelation",
  "slime-3": "https://gamesdb.launchbox-app.com/games/images/145581-slime-morimori-dragon-quest-3-taikaizoku-to-shippo-dan",
  dq10: "https://gamesdb.launchbox-app.com/games/images/15571-dragon-quest-x",
  "dq7-3ds": "https://gamesdb.launchbox-app.com/games/images/72365-dragon-quest-vii-fragments-of-the-forgotten-past",
  "dq8-3ds": "https://gamesdb.launchbox-app.com/games/images/73234-dragon-quest-viii-journey-of-the-cursed-king",
  dq11s: "https://gamesdb.launchbox-app.com/games/images/119550-dragon-quest-xi-s-echoes-of-an-elusive-age-definitive-edition"
};

const directCandidates = {
  "young-yangus": [
    {
      label: "Japanese product artwork (Famitsu)",
      url: "https://image.kagali.kgl-systems.io/item/12148/KOBA4q38?w=300&h=300&func=bound"
    }
  ],
  "battle-road-2": [
    {
      label: "Official logo (Square Enix)",
      url: "https://www.jp.square-enix.com/company/ja/news/images/DQ-MBR2_Logo_RGB.jpg"
    }
  ],
  "dqm2-sp": [
    {
      label: "Official logo (Square Enix)",
      url: "https://cache-www.dragonquest.jp/dqm2_sp/assets/images/logo01.png"
    },
    {
      label: "Official key visual (Square Enix)",
      url: "https://cache-www.dragonquest.jp/dqm2_sp/assets/images/ogp.jpg"
    }
  ],
  "dai-cross-blade": [
    {
      label: "Official game logo (GS2 developer case study)",
      url: "https://gs2.io/_astro/logo.BXXCFHEU_3ttG9.png"
    },
    {
      label: "Official promotional artwork (GS2 developer case study)",
      url: "https://static.docs.gs2.io/interview/dai_no_dai_bouken_cross_blade/og.jpg"
    }
  ],
  "dai-bonds": [
    {
      label: "Promotional key visual (Dengeki Online)",
      url: "https://dengekionline.com/images/s1xG/50yY/mLAI/4Ckk/PyLnX96ZpXrgl65g1UF8bkQfr8f3WhCSjYpMBHJQDynpovGmQsZlNWqhPZo2xFN4GY6TQ6uhYEDweUqO_main.jpg"
    }
  ],
  "infinity-strash": [
    {
      label: "Official Japanese logo (Square Enix)",
      url: "https://www.dragonquest.jp/dqdai-is/asset/img/common/logo@2x.png"
    },
    {
      label: "Official Japanese key visual (Square Enix)",
      url: "https://www.dragonquest.jp/dqdai-is/asset/img/ogp.jpg"
    }
  ]
};

const preferredKinds = [
  /Box - Front(?: Image)? \(Japan\)/i,
  /Clear Logo(?: Image)? \(Japan\)/i,
  /Fanart - Box - Front \(Japan\)/i,
  /Screenshot - Game Title \(Japan\)/i
];

function loadGlobal(file, globalName) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), context, { filename: file });
  return context.window[globalName];
}

function extensionFor(url, contentType) {
  const extension = path.extname(new URL(url).pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(extension)) {
    return extension === ".jpeg" ? ".jpg" : extension;
  }
  if (contentType?.includes("png")) return ".png";
  if (contentType?.includes("webp")) return ".webp";
  return ".jpg";
}

function safeFragment(value) {
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function parseCandidates(html) {
  const anchors = html.match(/<a\b[\s\S]*?<\/a>/gi) || [];
  const candidates = [];
  for (const anchor of anchors) {
    const href = anchor.match(/\bhref="(https:\/\/images\.launchbox-app\.com\/[^"]+)"/i)?.[1];
    const title = anchor.match(/\bdata-title="([^"]+)"/i)?.[1];
    if (!href || !title) continue;
    const label = title.split(" - ").slice(1).join(" - ");
    candidates.push({ url: href.replaceAll("&amp;", "&"), label });
  }

  const picked = [];
  for (const pattern of preferredKinds) {
    const candidate = candidates.find((item) => pattern.test(item.label));
    if (candidate && !picked.some((item) => item.url === candidate.url)) picked.push(candidate);
  }
  return picked.slice(0, 3);
}

async function download(candidate, destinationBase) {
  const response = await fetch(candidate.url, { headers });
  if (!response.ok) throw new Error(`image ${response.status}`);
  const extension = extensionFor(candidate.url, response.headers.get("content-type"));
  const destination = `${destinationBase}${extension}`;
  if (!fs.existsSync(destination)) {
    fs.writeFileSync(destination, Buffer.from(await response.arrayBuffer()));
  }
  return destination;
}

async function main() {
  fs.mkdirSync(assetDirectory, { recursive: true });
  const releases = loadGlobal(releaseFile, "DRAGON_QUEST_RELEASES");
  const releasesById = new Map(releases.map((release) => [release.id, release]));
  const manifest = loadGlobal(manifestFile, "DRAGON_QUEST_TIMELINE_IMAGES") || {};
  let downloaded = 0;

  for (const [releaseId, pageUrl] of Object.entries(launchBoxPages)) {
    const release = releasesById.get(releaseId);
    if (!release) continue;
    const key = `dragon-quest:${releaseId}`;
    manifest[key] ||= [];
    try {
      const response = await fetch(pageUrl, { headers });
      if (!response.ok) throw new Error(`page ${response.status}`);
      const candidates = parseCandidates(await response.text());
      if (!candidates.length) {
        console.log(`MISS ${releaseId}: no suitable candidate`);
        continue;
      }

      for (const [index, candidate] of candidates.entries()) {
        const stem = `${releaseId}-launchbox-${String(index + 1).padStart(2, "0")}-${safeFragment(candidate.label)}`;
        const existing = manifest[key].find((image) => path.basename(image.src).startsWith(stem));
        if (existing) continue;
        const destination = await download(candidate, path.join(assetDirectory, stem));
        const relative = path.relative(root, destination).replaceAll(path.sep, "/");
        manifest[key].push({
          id: randomUUID(),
          name: `${release.name} (${candidate.label}; LaunchBox Games Database)`,
          src: relative
        });
        downloaded += 1;
        console.log(`OK   ${releaseId} <- ${candidate.label}`);
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    } catch (error) {
      console.log(`FAIL ${releaseId}: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  for (const [releaseId, candidates] of Object.entries(directCandidates)) {
    const release = releasesById.get(releaseId);
    if (!release) continue;
    const key = `dragon-quest:${releaseId}`;
    manifest[key] ||= [];
    for (const [index, candidate] of candidates.entries()) {
      const stem = `${releaseId}-candidate-${String(index + 1).padStart(2, "0")}-${safeFragment(candidate.label)}`;
      const existing = manifest[key].find((image) => path.basename(image.src).startsWith(stem));
      if (existing) continue;
      try {
        const destination = await download(candidate, path.join(assetDirectory, stem));
        const relative = path.relative(root, destination).replaceAll(path.sep, "/");
        manifest[key].push({
          id: randomUUID(),
          name: `${release.name} (${candidate.label})`,
          src: relative
        });
        downloaded += 1;
        console.log(`OK   ${releaseId} <- ${candidate.label}`);
      } catch (error) {
        console.log(`FAIL ${releaseId}: ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }

  fs.writeFileSync(
    manifestFile,
    `window.DRAGON_QUEST_TIMELINE_IMAGES = ${JSON.stringify(manifest, null, 2)};\n`,
    "utf8"
  );
  console.log(`Added ${downloaded} candidate images.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
