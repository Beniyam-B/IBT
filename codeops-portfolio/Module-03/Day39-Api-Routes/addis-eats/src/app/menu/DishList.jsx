import Link from "next/link";
import { getDishes } from "./dishes";

export default async function DishList() {
  const dishes = await getDishes();
  return (
    <ul>
      {dishes.map((dish) => (
        <li key={dish.id}>
          <Link href={`/menu/${dish.id}`}>{dish.name}</Link> — {dish.price} ETB
        </li>
      ))}
    </ul>
  );
}