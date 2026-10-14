"use client";

import { useCart } from "../providers";
import ui from "@/components/ui.module.css";
import styles from "./menu.module.css";

// A tiny client island: only this button needs the browser (onClick + cart state).
export default function AddToCartButton({ dish, size = "small" }) {
  const { items, addItem } = useCart();
  const inCart = items.find((i) => i.id === dish.id)?.quantity ?? 0;

  return (
    <span className={styles.addWrap}>
      <button
        type="button"
        className={`${ui.btn} ${ui.primary} ${size === "small" ? ui.small : ""}`}
        onClick={() => addItem(dish)}
      >
        {inCart > 0 ? "Add another" : "Add to cart"}
      </button>
      {inCart > 0 && <span className={styles.inCart}>{inCart} in cart</span>}
    </span>
  );
}
