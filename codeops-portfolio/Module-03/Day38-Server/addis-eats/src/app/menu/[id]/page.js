import { notFound } from "next/navigation";
import DishCard from "./DishCard";
import { getDish, getDishes } from "../dishes";

export async function generateStaticParams() {
  const dishes = await getDishes();
  return dishes.map((d) => ({ id: d.id }));
}

export default async function DishPage({ params }) {
  const { id } = params;
  const dish = await getDish(id);
  if (!dish) notFound();
  return <DishCard {...dish} />;
}