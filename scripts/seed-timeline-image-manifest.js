const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const runDataFile = (filename) => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, filename), "utf8"), context);
  return context.window;
};
const extractObject = (source, name, followingName) => {
  const expression = new RegExp(`const ${name} = (\\{[\\s\\S]*?\\});\\r?\\nconst ${followingName}`).exec(source)?.[1];
  if (!expression) throw new Error(`Could not read ${name}`);
  return vm.runInNewContext(`(${expression})`);
};
const id = (key, index) => `seed-${key.replace(/[^a-z0-9]+/gi, "-")}-${index}`;
const normalize = (raw, directory, key) => {
  const entries = raw?.length && typeof raw[0] === "string" ? [raw] : raw || [];
  return entries
    .filter(([filename]) => fs.existsSync(path.join(root, directory, filename)))
    .map(([filename, name], index) => ({ id: id(key, index), name, src: `${directory}/${filename}` }));
};

const archive = runDataFile("data.js").CONSOLE_ARCHIVE;
const pokemon = runDataFile("pokemon-releases.js").POKEMON_CORE_RELEASES;
const finalFantasy = runDataFile("final-fantasy-releases.js").FINAL_FANTASY_RELEASES;
const covers = runDataFile("final-fantasy-covers.js").FINAL_FANTASY_RELEASE_COVERS;
const logos = runDataFile("final-fantasy-logos.js").FINAL_FANTASY_RELEASE_LOGOS;
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const pokemonCovers = extractObject(appSource, "POKEMON_RELEASE_COVERS", "POKEMON_RELEASE_DAYS");
const manifest = {};

archive.forEach((brand) => brand.platforms.forEach((platform) => {
  const key = `hardware:${`${brand.brand}-${platform.name}-${platform.year}`.replace(/[^a-z0-9]+/gi, "-")}`;
  manifest[key] = [];
}));
pokemon.forEach((release) => {
  const key = `pokemon:${release.id}`;
  manifest[key] = normalize(pokemonCovers[release.id], "assets/pokemon-covers", key);
});
finalFantasy.forEach((release) => {
  const key = `final-fantasy:${release.id}`;
  const hasLogo = Boolean(logos[release.id]?.length);
  manifest[key] = normalize(
    hasLogo ? logos[release.id] : covers[release.id],
    "assets/final-fantasy-covers",
    key
  );
});

fs.writeFileSync(
  path.join(root, "timeline-image-overrides.js"),
  `window.TIMELINE_MANAGED_IMAGES = ${JSON.stringify(manifest, null, 2)};\n`,
  "utf8"
);
console.log(`Seeded ${Object.keys(manifest).length} timeline image records.`);
