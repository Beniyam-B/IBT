import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import styles from "./menu.module.css";

export default async function DishList({ query, category }) {
  const dishes = await db.dish.findMany();

  const filtered = dishes.filter((dish) => {
    const matchesQuery = !query || dish.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || category === "all" || dish.category.toLowerCase() === category.toLowerCase();
    return matchesQuery && matchesCategory;
  });

  if (filtered.length === 0) return <p>No dishes found.</p>;

  return (
    <ul className={styles.dishList}>
      {filtered.map((dish) => (
        <li key={dish.id} className={styles.dishItem}>
          <Image src={dish.image} alt={dish.name} width={80} height={80} className={styles.thumb} />
          <div>
            <Link href={`/menu/${dish.id}`}>{dish.name}</Link>
            <p className={styles.meta}>{dish.price} {dish.currency}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}