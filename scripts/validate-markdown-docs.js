const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const markdownFiles = [];
const errors = [];

function collectMarkdown(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectMarkdown(absolutePath);
    } else if (entry.name.endsWith(".md")) {
      markdownFiles.push(absolutePath);
    }
  }
}

function localTarget(rawTarget) {
  const trimmed = rawTarget.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return null;

  if (trimmed.startsWith("<")) {
    const end = trimmed.indexOf(">");
    return end === -1 ? trimmed.slice(1) : trimmed.slice(1, end);
  }

  return trimmed.split(/\s+["']/)[0];
}

collectMarkdown(root);

for (const absolutePath of markdownFiles) {
  const relativePath = path.relative(root, absolutePath);
  const source = fs.readFileSync(absolutePath, "utf8");

  if (source.includes("\uFFFD")) {
    errors.push(`${relativePath}: contains an invalid UTF-8 replacement character`);
  }

  for (const match of source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = localTarget(match[1]);
    if (!target) continue;

    let decodedTarget;
    try {
      decodedTarget = decodeURI(target.split("#")[0]);
    } catch {
      errors.push(`${relativePath}: invalid link encoding: ${match[1]}`);
      continue;
    }

    const resolved = path.resolve(path.dirname(absolutePath), decodedTarget);
    if (!fs.existsSync(resolved)) {
      errors.push(`${relativePath}: missing local link target: ${match[1]}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${markdownFiles.length} Markdown files; encoding and local links are valid.`);
}

