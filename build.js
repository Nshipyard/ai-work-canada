// Static build: copies src/ into out/ for static hosting (e.g. Vercel with outputDirectory=out).
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "src");
const OUT = path.join(__dirname, "out");

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const f of fs.readdirSync(SRC)) {
  fs.copyFileSync(path.join(SRC, f), path.join(OUT, f));
}

console.log(`Built ${fs.readdirSync(OUT).length} files into ${OUT}`);
