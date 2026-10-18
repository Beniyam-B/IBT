// One place for the public address of the site and the text built from a dish.
// NEXT_PUBLIC_ values are inlined at BUILD time: change the variable, rebuild.
export const SITE_NAME = "Addis Eats";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn("[seo] NEXT_PUBLIC_SITE_URL is not set: previews, sitemap and canonical URLs will point at localhost");
}

// Written from the dish's own data, so forty dish pages never share one description.
export const dishDescription = (dish) =>
  `${dish.name} — ${dish.price} ${dish.currency}. A ${dish.spicy ? "spicy" : "mild"} ${dish.category.toLowerCase()} dish, delivered across Addis Ababa.`;
