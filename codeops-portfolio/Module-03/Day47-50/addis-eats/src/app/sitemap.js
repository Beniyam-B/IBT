import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

// Built from the real dishes, so a dish added later appears without anyone editing a file.
// Private routes (cart, checkout, orders, kitchen, login) are left out on purpose.
export default async function sitemap() {
  const dishes = await db.dish.findMany();
  return [
    { url: `${SITE_URL}/`, priority: 1 },
    { url: `${SITE_URL}/menu`, priority: 0.8 },
    ...dishes.map((d) => ({ url: `${SITE_URL}/menu/${d.id}`, priority: 0.6 })),
  ];
}
