import fs from "node:fs";
import path from "node:path";

// Dish photos live flat in public/images/ and are named like the dish ("Doro Wat.jpg").
// The match ignores case, spaces, dashes and underscores, and accepts common extensions,
// so "Doro Wat.jpg", "doro-wat.png" and "DORO_WAT.webp" all belong to the dish "Doro Wat".
// Server-only: it reads the folder with fs. Returns null when no photo exists.
const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"];
const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export function findDishImage(dishName) {
  const dir = path.join(process.cwd(), "public", "images");
  let files = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return null;
  }

  const wanted = normalize(dishName);
  const matches = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return EXTENSIONS.includes(ext) && normalize(path.basename(file, path.extname(file))) === wanted;
  });
  if (matches.length === 0) return null;

  matches.sort(
    (a, b) =>
      EXTENSIONS.indexOf(path.extname(a).toLowerCase()) - EXTENSIONS.indexOf(path.extname(b).toLowerCase())
  );
  return `/images/${encodeURIComponent(matches[0])}`;
}
