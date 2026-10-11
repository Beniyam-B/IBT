import Link from "next/link";
import { db } from "@/lib/db";
import DishImage from "@/components/DishImage";
import AddToCartButton from "./AddToCartButton";
import styles from "./menu.module.css";

export default async function DishList() {
  const dishes = await db.dish.findMany();

  return (
    <ul className={styles.dishList}>
      {dishes.map((dish) => (
        <li
          key={dish.id}
          className={styles.dishCard}
          data-dish
          data-name={dish.name}
          data-category={dish.category}
        >
          <Link href={`/menu/${dish.id}`} className={styles.imageLink}>
            <DishImage src={dish.image} alt={dish.name} sizes="(max-width: 720px) 100vw, 320px" />
          </Link>
          <div className={styles.cardBody}>
            <span className={styles.tag}>{dish.category}</span>
            <h2 className={styles.cardTitle}>
              <Link href={`/menu/${dish.id}`}>{dish.name}</Link>
            </h2>
            <p className={styles.cardText}>{dish.description}</p>
            <div className={styles.cardFooter}>
              <strong className={styles.price}>
                {dish.price} {dish.currency}
              </strong>
              <AddToCartButton
                dish={{ id: dish.id, name: dish.name, price: dish.price, image: dish.image }}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
