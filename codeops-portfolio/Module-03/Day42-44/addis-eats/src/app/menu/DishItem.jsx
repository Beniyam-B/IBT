import Link from "next/link";
import DishImage from "@/components/DishImage";
import AddToCartButton from "./AddToCartButton";
import styles from "./menu.module.css";

// One dish card. It has no directive on purpose: the server renders it inside DishList
// (first page, no JavaScript) and the client renders it for search results and later pages.
export default function DishItem({ dish }) {
  return (
    <li className={styles.dishCard}>
      <Link href={`/menu/${dish.id}`} className={styles.imageLink}>
        <DishImage src={dish.image} alt={dish.name} sizes="(max-width: 720px) 100vw, 320px" />
      </Link>
      <div className={styles.cardBody}>
        <div className={styles.tags}>
          <span className={styles.tag}>{dish.category}</span>
          <span className={`${styles.tag} ${dish.spicy ? styles.spicy : styles.mild}`}>
            {dish.spicy ? "Spicy" : "Mild"}
          </span>
        </div>
        <h2 className={styles.cardTitle}>
          <Link href={`/menu/${dish.id}`}>{dish.name}</Link>
        </h2>
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
  );
}
