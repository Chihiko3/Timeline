const fs = require("fs");
const http = require("http");
const path = require("path");
const { randomUUID } = require("crypto");
const { spawn } = require("child_process");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 5173);
const timelinesDirectory = path.join(root, "timelines");
const manifestDefinitions = {
  hardware: {
    path: path.join(timelinesDirectory, "hardware", "timeline-images.js"),
    globalName: "HARDWARE_TIMELINE_IMAGES"
  },
  pokemon: {
    path: path.join(timelinesDirectory, "pokemon", "timeline-images.js"),
    globalName: "POKEMON_TIMELINE_IMAGES"
  },
  "final-fantasy": {
    path: path.join(timelinesDirectory, "final-fantasy", "timeline-images.js"),
    globalName: "FINAL_FANTASY_TIMELINE_IMAGES"
  },
  xenoblade: {
    path: path.join(timelinesDirectory, "XenoSeries", "timeline-images.js"),
    globalName: "XENOBLADE_TIMELINE_IMAGES"
  }
};
const mimeTypes = {
  ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml"
};

function collectionFromKey(key) {
  return key.split(":", 1)[0];
}

function readManifest(collection) {
  const definition = manifestDefinitions[collection];
  if (!definition || !fs.existsSync(definition.path)) return {};
  const source = fs.readFileSync(definition.path, "utf8");
  const match = source.match(/=\s*([\s\S]*);\s*$/);
  if (!match) return {};
  try { return JSON.parse(match[1]); } catch { return {}; }
}

function readAllManifests() {
  return Object.assign({}, ...Object.keys(manifestDefinitions).map(readManifest));
}

function writeManifest(collection, images) {
  const definition = manifestDefinitions[collection];
  if (!definition) throw new Error("Unsupported timeline collection");
  const source = `window.${definition.globalName} = ${JSON.stringify(images, null, 2)};\n`;
  fs.writeFileSync(definition.path, source, "utf8");
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > 24 * 1024 * 1024) reject(new Error("单次上传不能超过 24MB"));
      else chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

function parseMultipart(buffer, boundary) {
  const delimiter = Buffer.from(`--${boundary}`);
  const fields = {};
  const files = [];
  let offset = 0;
  while (offset < buffer.length) {
    const start = buffer.indexOf(delimiter, offset);
    if (start < 0) break;
    const next = buffer.indexOf(delimiter, start + delimiter.length);
    if (next < 0) break;
    const part = buffer.subarray(start + delimiter.length + 2, next - 2);
    const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd >= 0) {
      const header = part.subarray(0, headerEnd).toString("utf8");
      const content = part.subarray(headerEnd + 4);
      const name = header.match(/name="([^"]+)"/)?.[1];
      const filename = header.match(/filename="([^"]*)"/)?.[1];
      if (name && filename) files.push({ name, filename, content });
      else if (name) fields[name] = content.toString("utf8");
    }
    offset = next;
  }
  return { fields, files };
}

function collectionDirectoryForKey(key) {
  const collection = collectionFromKey(key);
  if (collection === "hardware") return path.join(timelinesDirectory, "hardware", "assets", "consoles");
  if (collection === "pokemon") return path.join(timelinesDirectory, "pokemon", "assets", "covers");
  if (collection === "final-fantasy") return path.join(timelinesDirectory, "final-fantasy", "assets", "covers");
  if (collection === "xenoblade") return path.join(timelinesDirectory, "XenoSeries", "assets", "covers");
  throw new Error("Unsupported timeline collection");
}

function indexedFilename(directory, key, extension) {
  const index = (key.split(":").slice(1).join("-") || "timeline-image").replace(/[^a-z0-9_-]/gi, "-");
  let ordinal = 1;
  let filename = "";
  do {
    filename = `${index}-${String(ordinal).padStart(2, "0")}${extension}`;
    ordinal += 1;
  } while (fs.existsSync(path.join(directory, filename)));
  return filename;
}

function saveUpload(file, key) {
  const extension = path.extname(file.filename).toLowerCase();
  if (!mimeTypes[extension] || extension === ".svg") throw new Error("只支持 PNG、JPG、WEBP 或 GIF 图片");
  const directory = collectionDirectoryForKey(key);
  if (!directory.startsWith(timelinesDirectory)) throw new Error("无效的图片目录");
  fs.mkdirSync(directory, { recursive: true });
  const filename = indexedFilename(directory, key, extension);
  fs.writeFileSync(path.join(directory, filename), file.content);
  return { id: randomUUID(), name: file.filename, src: `${path.relative(root, directory).replaceAll(path.sep, "/")}/${filename}` };
}

function removeUnreferencedImageFile(image, images) {
  if (!image?.src?.startsWith("timelines/")) return;
  const stillReferenced = Object.values(images).some((entries) => entries.some((entry) => entry.src === image.src));
  if (stillReferenced) return;
  const target = path.resolve(root, image.src);
  if (target.startsWith(timelinesDirectory) && fs.existsSync(target)) fs.unlinkSync(target);
}

async function handleUpload(request, response) {
  const boundary = request.headers["content-type"]?.match(/boundary=([^;]+)/)?.[1];
  if (!boundary) return sendJson(response, 400, { error: "缺少上传边界" });
  const { fields, files } = parseMultipart(await readBody(request), boundary);
  if (!fields.key || !files.length) return sendJson(response, 400, { error: "缺少图片或卡片标识" });
  const collection = collectionFromKey(fields.key);
  const images = readManifest(collection);
  const current = images[fields.key] || [];
  const uploaded = files.map((file) => saveUpload(file, fields.key));
  if (fields.replaceId) {
    const index = current.findIndex((image) => image.id === fields.replaceId);
    if (index >= 0) {
      const replaced = current[index];
      current.splice(index, 1, uploaded[0]);
      images[fields.key] = current;
      removeUnreferencedImageFile(replaced, images);
    }
    else current.push(uploaded[0]);
    if (uploaded.length > 1) current.push(...uploaded.slice(1));
  } else {
    current.push(...uploaded);
  }
  images[fields.key] = current;
  writeManifest(collection, images);
  sendJson(response, 200, { images });
}

async function handleJsonMutation(request, response, action) {
  const payload = JSON.parse((await readBody(request)).toString("utf8") || "{}");
  const collection = collectionFromKey(payload.key);
  const images = readManifest(collection);
  const current = images[payload.key] || [];
  if (action === "remove") {
    const removed = current.find((image) => image.id === payload.imageId);
    const next = current.filter((image) => image.id !== payload.imageId);
    images[payload.key] = next;
    removeUnreferencedImageFile(removed, images);
  }
  if (action === "move") {
    const index = current.findIndex((image) => image.id === payload.imageId);
    const target = index + Number(payload.direction);
    if (index >= 0 && target >= 0 && target < current.length) [current[index], current[target]] = [current[target], current[index]];
    images[payload.key] = current;
  }
  if (action === "reset") {
    delete images[payload.key];
    current.forEach((image) => removeUnreferencedImageFile(image, images));
  }
  writeManifest(collection, images);
  sendJson(response, 200, { images });
}

function openAssetsFolder(response) {
  // This server only binds to localhost and deliberately exposes no path input.
  const explorer = spawn("explorer.exe", [timelinesDirectory], { detached: true, stdio: "ignore" });
  explorer.unref();
  sendJson(response, 200, { opened: true });
}

function serveStatic(request, response) {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const target = path.resolve(root, relative);
  if (!target.startsWith(root) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
    response.writeHead(404); response.end("Not found"); return;
  }
  response.writeHead(200, { "Content-Type": mimeTypes[path.extname(target).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(target).pipe(response);
}

http.createServer(async (request, response) => {
  try {
    if (request.method === "GET" && request.url === "/api/timeline-images") return sendJson(response, 200, { images: readAllManifests() });
    if (request.method === "POST" && request.url === "/api/timeline-images/upload") return handleUpload(request, response);
    if (request.method === "POST" && request.url === "/api/timeline-images/remove") return handleJsonMutation(request, response, "remove");
    if (request.method === "POST" && request.url === "/api/timeline-images/move") return handleJsonMutation(request, response, "move");
    if (request.method === "POST" && request.url === "/api/timeline-images/reset") return handleJsonMutation(request, response, "reset");
    if (request.method === "POST" && request.url === "/api/timeline-images/open-assets") return openAssetsFolder(response);
    serveStatic(request, response);
  } catch (error) {
    sendJson(response, 500, { error: error.message || "本地图片服务错误" });
  }
}).listen(port, "127.0.0.1", () => console.log(`GM server: http://127.0.0.1:${port}`));
