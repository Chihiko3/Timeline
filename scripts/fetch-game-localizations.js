const fs = require("fs");
const https = require("https");
const path = require("path");

const root = path.resolve(__dirname, "..");
global.window = {};
require(path.join(root, "timelines", "hardware", "curated-games.js"));

const curatedGames = global.window.CONSOLE_CURATED_GAMES || {};
const gameNames = [
  ...new Set(
    Object.values(curatedGames).flatMap((record) => [
      ...(record.launchGames || []),
      ...(record.signatureGames || [])
    ])
  )
].sort((a, b) => a.localeCompare(b, "en"));

function requestJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "GameConsoleArchiveLocal/1.0 (personal local archive)" } }, (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`Wikipedia returned ${response.statusCode}`));
            return;
          }
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", reject);
  });
}

function chineseWikiUrl(title) {
  return `https://zh.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;
}

async function main() {
  const localizations = {};
  const batchSize = 40;

  for (let index = 0; index < gameNames.length; index += batchSize) {
    const batch = gameNames.slice(index, index + batchSize);
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      formatversion: "2",
      redirects: "1",
      prop: "langlinks|info",
      inprop: "url",
      lllang: "zh",
      titles: batch.join("|")
    });
    const payload = await requestJson(`https://en.wikipedia.org/w/api.php?${params}`);
    const pages = payload.query?.pages || [];
    const byRequestedTitle = new Map();

    pages.forEach((page) => {
      if (page.missing) return;
      const chinese = page.langlinks?.[0]?.title || page.langlinks?.[0]?.["*"];
      const entry = {
        title: chinese || page.title,
        url: chinese ? chineseWikiUrl(chinese) : page.fullurl
      };
      byRequestedTitle.set(page.title, entry);
      (page.redirects || []).forEach((redirect) => byRequestedTitle.set(redirect.from, entry));
    });

    batch.forEach((game) => {
      const entry = byRequestedTitle.get(game);
      if (entry) localizations[game] = entry;
    });
    console.log(`Resolved ${Math.min(index + batch.length, gameNames.length)} / ${gameNames.length}`);
  }

  const output = `window.CONSOLE_GAME_LOCALIZATIONS = ${JSON.stringify(localizations, null, 2)};\n`;
  fs.writeFileSync(path.join(root, "timelines", "hardware", "game-localizations.js"), output, "utf8");
  const chineseCount = Object.values(localizations).filter((entry) => entry.url.startsWith("https://zh.wikipedia.org/")).length;
  console.log(`Wrote ${Object.keys(localizations).length} links (${chineseCount} Chinese Wikipedia entries).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
