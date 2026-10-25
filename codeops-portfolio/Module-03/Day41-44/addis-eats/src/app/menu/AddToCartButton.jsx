"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../providers";
import ui from "@/components/ui.module.css";
import styles from "./menu.module.css";

// A tiny client island: only this button needs the browser (onClick + cart state).
// The cart is for signed-in people, so a visitor gets a link to log in instead.
export default function AddToCartButton({ dish, size = "small" }) {
  const { items, addItem, user, sessionReady } = useCart();
  const pathname = usePathname();
  const btn = `${ui.btn} ${ui.primary} ${size === "small" ? ui.small : ""}`;
  const inCart = items.find((i) => i.id === dish.id)?.quantity ?? 0;

  if (sessionReady && !user) {
    return (
      <Link href={`/login?next=${encodeURIComponent(pathname)}`} className={btn}>
        Log in to order
      </Link>
    );
  }

  return (
    <span className={styles.addWrap}>
      <button type="button" className={btn} disabled={!sessionReady} onClick={() => addItem(dish)}>
        {inCart > 0 ? "Add another" : "Add to cart"}
      </button>
      {inCart > 0 && <span className={styles.inCart}>{inCart} in cart</span>}
    </span>
  );
}
