import Link from "next/link";
import { db } from "@/lib/db";

export default async function DishList({ query, category }) {
  const dishes = await db.dish.findMany();

  const filtered = dishes.filter((dish) => {
    const matchesQuery = !query || dish.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || category === "all" || dish.category.toLowerCase() === category.toLowerCase();
    return matchesQuery && matchesCategory;
  });

  if (filtered.length === 0) {
    return <p>No dishes found.</p>;
  }

  return (
    <ul>
      {filtered.map((dish) => (
        <li key={dish.id}>
          <Link href={`/menu/${dish.id}`}>{dish.name}</Link> - {dish.price} {dish.currency}
        </li>
      ))}
    </ul>
  );
}