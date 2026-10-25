import { notFound } from "next/navigation";
import DishCard from "./DishCard";
import JsonLd from "@/components/JsonLd";
import { getDish, db } from "@/lib/db";
import { SITE_URL, dishDescription } from "@/lib/seo";

// Every dish is known at build time, so each page is prebuilt as static HTML.
// dynamicParams = false: any id that was not prebuilt is a real 404 (status code included).
export const dynamicParams = false;

export async function generateStaticParams() {
  const dishes = await db.dish.findMany();
  return dishes.map((d) => ({ id: d.id }));
}

// Runs on the server before the page renders. Same params as the page (a Promise in Next 16),
// and the dishes fetch is cached, so calling getDish here as well costs no second request.
export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) return { title: "Dish not found" };

  const description = dishDescription(dish);
  return {
    title: dish.name,
    description,
    alternates: { canonical: `/menu/${dish.id}` },
    openGraph: { title: dish.name, description, type: "website" },
    // og:image comes from opengraph-image.jsx in this folder (file convention)
  };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) notFound();

  // Built from the same dish object the page renders, so the two can never disagree.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dishDescription(dish),
    url: `${SITE_URL}/menu/${dish.id}`,
    ...(dish.image ? { image: `${SITE_URL}${dish.image}` } : {}),
    offers: { "@type": "Offer", price: dish.price, priceCurrency: dish.currency },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <DishCard {...dish} />
    </>
  );
}
