"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../providers";
import { etb } from "@/lib/format";
import ui from "@/components/ui.module.css";
import styles from "./dishCard.module.css";

// A card is NOT a clickable div. The only interactive thing in it is a real button (or a real
// link when signed out), so Tab, Enter, Space, focus and screen-reader announcement all come
// free, and there is no parent click handler, so stopPropagation is not needed anywhere.
export default function DishCard({ dish }) {
  const cart = useCart();
  const { user, sessionReady } = cart;
  const [added, setAdded] = useState(false);
  const [problem, setProblem] = useState("");
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []); // clean up on unmount

  // Your providers.jsx decides the real name. If none of these exists, tell me which one it is.
  const addToCart = cart.addToCart ?? cart.addItem ?? cart.add ?? cart.addDish;

  function handleAdd() {
    if (typeof addToCart !== "function") {
      console.error("DishCard: useCart() has no add function. Keys:", Object.keys(cart));
      setProblem("Cart is not connected yet.");
      return;
    }
    addToCart({ id: dish.id, name: dish.name, price: dish.price, image: dish.image });
    setProblem("");
    setAdded(true); // immediate feedback, well inside 100ms
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className={styles.card}>
      {typeof dish.image === "string" && dish.image && (
        // The dish name sits right beside the photo, so the photo itself is decorative (alt="").
        // Width and height reserve the space, so nothing jumps when it loads.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={dish.image} alt="" width={480} height={320} loading="lazy" className={styles.photo} />
      )}

      <div className={styles.body}>
        <h3 className={styles.name}>{dish.name}</h3>
        <p className={styles.meta}>
          <span>{dish.category}</span>
          {dish.spicy && (
            <span className={styles.spicy}>
              <span aria-hidden="true">🌶️ </span>Spicy
            </span>
          )}
        </p>
        <p className={styles.price}>{etb(dish.price)}</p>

        {sessionReady && !user ? (
          <Link href="/login?next=/menu" className={`${ui.btn} ${ui.outline} ${styles.action}`}>
            Log in to order
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            disabled={!sessionReady}
            className={`${ui.btn} ${ui.primary} ${styles.action}`}
          >
            {added ? (
              "Added ✓"
            ) : (
              <>
                Add to cart<span className={styles.srOnly}> {dish.name}</span>
              </>
            )}
          </button>
        )}

        {/* Always in the page, so a screen reader announces the change when it fills in */}
        <p className={styles.status} role="status" aria-live="polite">
          {added ? `${dish.name} added to your cart.` : problem}
        </p>
      </div>
    </article>
  );
}