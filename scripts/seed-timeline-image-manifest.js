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

const archive = runDataFile("timelines/hardware/data.js").CONSOLE_ARCHIVE;
const pokemon = runDataFile("timelines/pokemon/releases.js").POKEMON_CORE_RELEASES;
const finalFantasy = runDataFile("timelines/final-fantasy/final-fantasy-releases.js").FINAL_FANTASY_RELEASES;
const xenoblade = runDataFile("timelines/XenoSeries/releases.js").XENOBLADE_RELEASES;
const xenobladeImages = runDataFile("timelines/XenoSeries/timeline-images.js").XENOBLADE_TIMELINE_IMAGES;
const covers = runDataFile("timelines/final-fantasy/final-fantasy-covers.js").FINAL_FANTASY_RELEASE_COVERS;
const logos = runDataFile("timelines/final-fantasy/final-fantasy-logos.js").FINAL_FANTASY_RELEASE_LOGOS;
const appSource = fs.readFileSync(path.join(root, "common/app.js"), "utf8");
const pokemonCovers = extractObject(appSource, "POKEMON_RELEASE_COVERS", "BRAND_COLORS");
const hardwareManifest = {};
const pokemonManifest = {};
const finalFantasyManifest = {};
const xenobladeManifest = {};

archive.forEach((brand) => brand.platforms.forEach((platform) => {
  const key = `hardware:${`${brand.brand}-${platform.name}-${platform.year}`.replace(/[^a-z0-9]+/gi, "-")}`;
  hardwareManifest[key] = [];
}));
pokemon.forEach((release) => {
  const key = `pokemon:${release.id}`;
  pokemonManifest[key] = normalize(pokemonCovers[release.id], "timelines/pokemon/assets/covers", key);
});
finalFantasy.forEach((release) => {
  const key = `final-fantasy:${release.id}`;
  const hasLogo = Boolean(logos[release.id]?.length);
  finalFantasyManifest[key] = normalize(
    hasLogo ? logos[release.id] : covers[release.id],
    "timelines/final-fantasy/assets/covers",
    key
  );
});
xenoblade.forEach((release) => {
  const key = `xenoblade:${release.id}`;
  xenobladeManifest[key] = (xenobladeImages[key] || []).filter((entry) =>
    entry.src?.startsWith("timelines/XenoSeries/") && fs.existsSync(path.join(root, entry.src))
  );
});

const writeManifest = (file, globalName, manifest) => fs.writeFileSync(
  path.join(root, file),
  `window.${globalName} = ${JSON.stringify(manifest, null, 2)};\n`,
  "utf8"
);
writeManifest("timelines/hardware/timeline-images.js", "HARDWARE_TIMELINE_IMAGES", hardwareManifest);
writeManifest("timelines/pokemon/timeline-images.js", "POKEMON_TIMELINE_IMAGES", pokemonManifest);
writeManifest("timelines/final-fantasy/timeline-images.js", "FINAL_FANTASY_TIMELINE_IMAGES", finalFantasyManifest);
writeManifest("timelines/XenoSeries/timeline-images.js", "XENOBLADE_TIMELINE_IMAGES", xenobladeManifest);
console.log(`Seeded ${Object.keys(hardwareManifest).length + Object.keys(pokemonManifest).length + Object.keys(finalFantasyManifest).length + Object.keys(xenobladeManifest).length} timeline image records.`);
