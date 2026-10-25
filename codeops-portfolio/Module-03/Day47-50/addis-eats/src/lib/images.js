import fs from "node:fs";
import path from "node:path";

// Photos can live anywhere under public/ (public/images, public/image, public/images/dishes, ...).
// A photo belongs to a dish when its file name matches the dish NAME or the dish ID, ignoring
// case, spaces, dashes, underscores and the extension ("Doro Wat.jpg", "doro-wat.png",
// "DORO_WAT_1.webp" and "dish_1.jpg" all match the dish "Doro Wat" with id "dish_1").
// Partial matches are NOT accepted, so a dish never shows another dish's photo.
// Server-only: reads the folder with fs. Returns null when no photo matches.
const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];
const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function listImages(dir, parts = []) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries.flatMap((entry) => {
    if (entry.isDirectory()) return listImages(path.join(dir, entry.name), [...parts, entry.name]);
    const ext = path.extname(entry.name).toLowerCase();
    if (!EXTENSIONS.includes(ext)) return [];
    return [
      {
        key: normalize(path.basename(entry.name, path.extname(entry.name))),
        ext,
        url: "/" + [...parts, entry.name].map(encodeURIComponent).join("/"),
      },
    ];
  });
}

export function findDishImage(dishName, dishId = "") {
  const files = listImages(path.join(process.cwd(), "public"));
  const name = normalize(dishName);
  const id = normalize(dishId);
  const rank = (f) => EXTENSIONS.indexOf(f.ext);

  // Exact name, then the dish id, then the name plus a number ("doro-wat-2"). Never a partial
  // match: "tibs" must not pick up "derek-tibs", and "bozena shiro" must not pick up "shiro".
  const numbered = new RegExp(`^${name}\\d+$`);
  const tiers = [
    (f) => f.key === name,
    (f) => id && f.key === id,
    (f) => name && numbered.test(f.key),
  ];
  for (const test of tiers) {
    const hit = files.filter(test).sort((a, b) => rank(a) - rank(b) || a.url.length - b.url.length)[0];
    if (hit) return hit.url;
  }
  return null;
}
