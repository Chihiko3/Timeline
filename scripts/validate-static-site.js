const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { manifestDefinitions, readAllManifests } = require("./local-gm-server");

const root = path.resolve(__dirname, "..");
const errors = [];
let checkedJavaScript = 0;
let checkedEntryAssets = 0;
let checkedImages = 0;

function report(message) {
  errors.push(message);
}

function isInside(parent, target) {
  const relative = path.relative(parent, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git" || entry.name.startsWith(".tmp-")) return [];
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function validateJavaScript() {
  walk(root)
    .filter((file) => path.extname(file).toLowerCase() === ".js")
    .forEach((file) => {
      checkedJavaScript += 1;
      try {
        new vm.Script(fs.readFileSync(file, "utf8"), { filename: file });
      } catch (error) {
        report(`JavaScript syntax: ${path.relative(root, file)} (${error.message})`);
      }
    });
}

function validateIndexAssets() {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const references = [
    ...html.matchAll(/<(?:script|link)\b[^>]*?\b(?:src|href)="([^"]+)"/gi)
  ].map((match) => match[1]);

  references
    .filter((reference) => !/^(?:[a-z]+:|#|\/\/)/i.test(reference))
    .forEach((reference) => {
      checkedEntryAssets += 1;
      const cleanReference = reference.split(/[?#]/, 1)[0];
      const target = path.resolve(root, cleanReference);
      if (!isInside(root, target)) report(`Index path escapes repository: ${reference}`);
      else if (!fs.existsSync(target)) report(`Missing index asset: ${reference}`);
    });

  Object.values(manifestDefinitions).forEach((definition) => {
    const reference = path.relative(root, definition.path).replaceAll(path.sep, "/");
    if (!references.includes(reference)) report(`Image manifest is not loaded by index.html: ${reference}`);
  });
}

function validImagePayload(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.length < 12) return false;
  const ascii = (start, end) => buffer.subarray(start, end).toString("ascii");
  return (
    (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) ||
    (buffer[0] === 0x89 && ascii(1, 4) === "PNG") ||
    ascii(0, 4) === "GIF8" ||
    (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP")
  );
}

function validateImageManifests() {
  const allImages = readAllManifests();
  const ids = new Set();

  Object.entries(manifestDefinitions).forEach(([collection, definition]) => {
    const source = fs.readFileSync(definition.path, "utf8");
    const match = source.match(/=\s*([\s\S]*);\s*$/);
    if (!match) {
      report(`Invalid image manifest: ${path.relative(root, definition.path)}`);
      return;
    }

    let manifest;
    try {
      manifest = JSON.parse(match[1]);
    } catch (error) {
      report(`Invalid image manifest JSON: ${path.relative(root, definition.path)} (${error.message})`);
      return;
    }

    Object.entries(manifest).forEach(([key, images]) => {
      if (!key.startsWith(`${collection}:`)) report(`Wrong collection prefix: ${key}`);
      if (!Array.isArray(images)) {
        report(`Image record is not an array: ${key}`);
        return;
      }

      images.forEach((image, index) => {
        checkedImages += 1;
        if (!image || typeof image !== "object") {
          report(`Invalid image object: ${key}[${index}]`);
          return;
        }
        if (!image.id || !image.name || !image.src) report(`Incomplete image object: ${key}[${index}]`);
        if (ids.has(image.id)) report(`Duplicate image id: ${image.id}`);
        ids.add(image.id);
        if (/^(?:[a-z]+:|\/\/|\/)/i.test(image.src)) {
          report(`Image must use a repository-relative path: ${image.src}`);
          return;
        }

        const target = path.resolve(root, image.src);
        if (!isInside(root, target)) {
          report(`Image path escapes repository: ${image.src}`);
          return;
        }
        if (!isInside(definition.assetDirectory, target)) {
          report(`Image is outside its timeline asset directory: ${image.src}`);
          return;
        }
        if (!fs.existsSync(target)) {
          report(`Missing timeline image: ${image.src}`);
          return;
        }
        if (!validImagePayload(target)) report(`Invalid timeline image payload: ${image.src}`);
      });
    });
  });

  if (Object.keys(allImages).length === 0) report("GM manifest reader returned no image records");
}

validateJavaScript();
validateIndexAssets();
validateImageManifests();

if (errors.length) {
  console.error(`Static validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `Static validation passed: ${checkedJavaScript} JavaScript files, ` +
    `${checkedEntryAssets} index assets, ${checkedImages} timeline images.`
  );
}
