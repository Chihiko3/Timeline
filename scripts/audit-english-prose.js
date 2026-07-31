const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = { window: {} };
vm.createContext(context);

for (const relativePath of [
  "common/localization-en-reviewed.js",
  "common/localization-en-data.js",
  "common/localization-en.js",
]) {
  vm.runInContext(
    fs.readFileSync(path.join(root, relativePath), "utf8"),
    context,
    { filename: relativePath },
  );
}

const translate = context.window.translateGameArchiveText;
const sources = Object.keys(context.window.ENGLISH_TRANSLATIONS || {});
const errors = [];
const suspicious = [
  [/[\u3400-\u9fff]/u, "contains Chinese characters"],
  [/\bcurrent rpg\b/i, "uses the old mistranslation 'current RPG'"],
  [/\bon the move\b(?=.*(?:game|title|series))/i, "may mistranslate a series category as 'on the move'"],
  [/\b(?:fighting chess|breeding rpg|mobile end|landing platform|subsequent login)\b/i, "contains a known machine-translation phrase"],
  [/\b(?:eight-god|gorbeza|gorbachev|silicon valley|lotus pearl|language bomb)\b/i, "contains a known proper-name mistranslation"],
  [/\bthe dragon of the seven\b/i, "mistranslates Like a Dragon 7"],
  [/\bheroes assemble\b/i, "mistranslates Dragon Quest Heroes"],
  [/\bverbal bullet\b/i, "mistranslates Truth Bullet"],
  [/\bthe \"extreme\" (?:approach|line|route)\b/i, "mistranslates the Kiwami line"],
  [/\ba led by date\b/i, "breaks the phrase 'led by Date'"],
  [/[.;!?](?=[A-Z][a-z])/, "is missing a space after sentence punctuation"],
];

for (const source of sources) {
  const translated = translate(source);
  for (const [pattern, reason] of suspicious) {
    if (pattern.test(translated)) {
      errors.push({ source, translated, reason });
      break;
    }
  }
}

if (errors.length) {
  console.error(`English prose audit found ${errors.length} suspicious translations:`);
  for (const error of errors.slice(0, 40)) {
    console.error(`  - ${error.reason}\n    ${error.source}\n    -> ${error.translated}`);
  }
  if (errors.length > 40) console.error(`  ...and ${errors.length - 40} more.`);
  process.exitCode = 1;
} else {
  console.log(`English prose audit passed: ${sources.length} runtime translations checked.`);
}
