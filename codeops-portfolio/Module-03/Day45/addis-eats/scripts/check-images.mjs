// Which dish has which photo? Run from the project root:   node scripts/check-images.mjs
// Uses the same matching rules as src/lib/images.js (keep the two in sync) and the same dishes
// as the app (the public API, or the bundled copy if it cannot be reached).
import fs from "node:fs";
import path from "node:path";

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];
const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const root = process.cwd();

function listImages(dir, parts = []) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return []; }
  return entries.flatMap((e) => {
    if (e.isDirectory()) return listImages(path.join(dir, e.name), [...parts, e.name]);
    const ext = path.extname(e.name).toLowerCase();
    if (!EXTENSIONS.includes(ext)) return [];
    const full = path.join(dir, e.name);
    return [{ key: normalize(path.basename(e.name, ext)), ext, url: "/" + [...parts, e.name].join("/"), kb: Math.round(fs.statSync(full).size / 1024) }];
  });
}

function match(files, name, id) {
  const n = normalize(name), i = normalize(id);
  const numbered = new RegExp(`^${n}\\d+$`);
  const tiers = [
    ["exact name", (f) => f.key === n],
    ["dish id", (f) => i && f.key === i],
    ["name plus a number", (f) => n && numbered.test(f.key)],
  ];
  for (const [how, test] of tiers) {
    const hit = files.filter(test)[0];
    if (hit) return { hit, how };
  }
  return null;
}

let dishes;
try {
  const res = await fetch(process.env.DISHES_API_URL ?? "https://cdn.jsdelivr.net/gh/juffalx/TESTsss@main/day01/api.json");
  if (!res.ok) throw new Error("HTTP " + res.status);
  dishes = await res.json();
} catch (e) {
  console.log("(dishes API unreachable: " + e.message + "; using the bundled copy)\n");
  dishes = JSON.parse(fs.readFileSync(path.join(root, "src/lib/dishes.fallback.json"), "utf8"));
}

const files = listImages(path.join(root, "public"));
console.log(`${dishes.length} dishes, ${files.length} image files under public/\n`);

const used = new Set();
let missing = 0;
for (const d of dishes) {
  const m = match(files, d.name, "dish_" + d.id);
  if (!m) { missing++; console.log(`MISSING  ${d.name.padEnd(18)} (${d.category})  no photo named like "${d.name}"`); continue; }
  used.add(m.hit.url);
  const flags = [m.how === "exact name" || m.how === "dish id" ? "" : "CHECK: " + m.how, m.hit.kb > 300 ? `BIG: ${m.hit.kb} kB, resize to ~800px wide` : ""].filter(Boolean).join("  ");
  console.log(`ok       ${d.name.padEnd(18)} -> ${m.hit.url}  (${m.hit.kb} kB)  ${flags}`);
}
const unused = files.filter((f) => !used.has(f.url));
if (unused.length) {
  console.log("\nPhotos no dish uses (check the spelling of the file name):");
  for (const f of unused) console.log("  " + f.url);
}
console.log(`\n${dishes.length - missing} matched, ${missing} without a photo.`);
