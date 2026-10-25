// Prints an approximate "First Load JS" (gzip, kB) per route from a finished `next build`.
// Next 16 (Turbopack) no longer prints these sizes, but the Day 40 brief asks you to compare them.
// Usage:  npm run build && node scripts/first-load-js.mjs
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const next = path.join(process.cwd(), ".next");
const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const gzipSize = (file) => {
  const p = path.join(next, file);
  return fs.existsSync(p) ? zlib.gzipSync(fs.readFileSync(p)).length : 0;
};
const manifestOf = (file) => {
  const text = fs.readFileSync(file, "utf8");
  const match = text.match(/=\s*(\{[\s\S]*\})\s*;?\s*$/);
  return match ? JSON.parse(match[1]) : {};
};

const build = readJson(path.join(next, "build-manifest.json"));
const shared = [...(build.rootMainFiles ?? []), ...(build.polyfillFiles ?? [])];

function* pages(dir, rel = "") {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) yield* pages(path.join(dir, entry.name), `${rel}/${entry.name}`);
    else if (entry.name === "page_client-reference-manifest.js") yield [rel || "/", path.join(dir, entry.name)];
  }
}

const rows = [];
for (const [route, file] of pages(path.join(next, "server", "app"))) {
  if (route.includes("[") || route.includes("_not-found") || route.startsWith("/api") || route.startsWith("/_")) continue;
  const files = new Set(shared);
  for (const [key, list] of Object.entries(manifestOf(file).entryJSFiles ?? {})) {
    if (key.endsWith("src/app/layout") || key.endsWith(`src/app${route === "/" ? "" : route}/page`)) {
      list.forEach((f) => files.add(f));
    }
  }
  const total = [...files].filter((f) => f.endsWith(".js")).reduce((n, f) => n + gzipSize(f), 0);
  rows.push([route, total]);
}
rows.sort((a, b) => a[0].localeCompare(b[0]));
console.log("Route".padEnd(14) + "First Load JS (gzip)");
for (const [route, total] of rows) console.log(route.padEnd(14) + (total / 1024).toFixed(1) + " kB");
