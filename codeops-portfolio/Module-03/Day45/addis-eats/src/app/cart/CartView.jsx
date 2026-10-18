"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../providers";
import ui from "@/components/ui.module.css";
import styles from "./cart.module.css";

// Client leaf: the cart is private to this browser tab, so it is rendered on the client.
export default function CartView() {
  const { items, addItem, decrease, removeItem, clear, count, total } = useCart();

  if (items.length === 0) {
    return (
      <div className={`${ui.card} ${ui.empty}`}>
        <h2>Your cart is empty</h2>
        <p>Add a few dishes from the menu and they will show up here.</p>
        <Link href="/menu" className={`${ui.btn} ${ui.primary}`}>Browse the menu</Link>
      </div>
    );
  }

  return (
    <>
      <p className={styles.count}>{count} {count === 1 ? "dish" : "dishes"}</p>
      <div className={styles.layout}>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={`${ui.card} ${styles.row}`}>
              <div className={styles.thumb}>
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill sizes="120px" className={styles.thumbImg} />
                ) : (
                  <span className={styles.thumbFallback}>{item.name.charAt(0)}</span>
                )}
              </div>
              <div className={styles.info}>
                <Link href={`/menu/${item.id}`} className={styles.name}>{item.name}</Link>
                <span className={styles.unit}>{item.price} ETB each</span>
                <button type="button" className={styles.remove} onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
              <div className={styles.qty} aria-label={`Quantity of ${item.name}`}>
                <button type="button" onClick={() => decrease(item.id)} aria-label="Decrease quantity">−</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => addItem(item)} aria-label="Increase quantity">+</button>
              </div>
              <strong className={styles.lineTotal}>{item.price * item.quantity} ETB</strong>
            </li>
          ))}
        </ul>

        <aside className={`${ui.card} ${styles.summary}`}>
          <h2>Order summary</h2>
          <div className={styles.sumRow}>
            <span>Subtotal</span>
            <span>{total} ETB</span>
          </div>
          <div className={`${styles.sumRow} ${styles.sumTotal}`}>
            <span>Total</span>
            <span>{total} ETB</span>
          </div>
          <Link href="/checkout" className={`${ui.btn} ${ui.primary} ${styles.full}`}>
            Go to checkout
          </Link>
          <button type="button" className={`${ui.btn} ${ui.outline} ${styles.full}`} onClick={clear}>
            Clear cart
          </button>
        </aside>
      </div>
    </>
  );
}
