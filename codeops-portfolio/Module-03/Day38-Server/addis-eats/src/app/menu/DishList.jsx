import Link from "next/link";
import { getDishes } from "./dishes";

export default async function DishList({ query = "", category = "all" }) {
  const dishes = await getDishes();

  const filtered = dishes.filter(
    (dish) =>
      (category === "all" || dish.category === category) &&
      dish.name.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) return <p>No dishes found.</p>;

  return (
    <ul className="dish-list">
      {filtered.map((dish) => (
        <li key={dish.id}>
          <Link href={`/menu/${dish.id}`}>{dish.name}</Link> — {dish.price} ETB
        </li>
      ))}
    </ul>
  );
}