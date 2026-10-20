import Link from "next/link";
import DishImage from "@/components/DishImage";
import AddToCartButton from "../AddToCartButton";
import ui from "@/components/ui.module.css";
import styles from "../menu.module.css";

// Server component: plain markup. Only AddToCartButton ships JavaScript.
export default function DishCard({ id, name, price, currency, category, spicy, image }) {
  return (
    <article className={styles.detail}>
      <Link href="/menu" className={styles.back}>← Back to menu</Link>
      <div className={styles.detailGrid}>
        <DishImage src={image} alt={name} className={styles.detailImage} sizes="(max-width: 720px) 100vw, 480px" preload />
        <div>
          <div className={styles.tags}>
            <span className={styles.tag}>{category}</span>
            <span className={`${styles.tag} ${spicy ? styles.spicy : styles.mild}`}>{spicy ? "Spicy" : "Mild"}</span>
          </div>
          <h1 className={styles.detailTitle}>{name}</h1>
          <p className={styles.detailPrice}>
            {price} {currency}
          </p>
          <div className={styles.detailActions}>
            <AddToCartButton dish={{ id, name, price, image }} size="large" />
            <Link href={`/checkout?dish=${id}&qty=1`} className={`${ui.btn} ${ui.outline}`}>
              Order this dish now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
