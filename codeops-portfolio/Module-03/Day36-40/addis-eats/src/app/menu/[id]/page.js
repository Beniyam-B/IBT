import { notFound } from "next/navigation";
import DishCard from "./DishCard";
import { getDish, db } from "@/lib/db";

// Every dish is known at build time, so each page is prebuilt as static HTML.
// dynamicParams = false: any id that was not prebuilt is a real 404 (status code included).
export const dynamicParams = false;

export async function generateStaticParams() {
  const dishes = await db.dish.findMany();
  return dishes.map((d) => ({ id: d.id }));
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) notFound();
  return <DishCard {...dish} />;
}
