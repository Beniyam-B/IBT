import { Suspense } from "react";
import DishList from "./DishList";
import styles from "./menu.module.css";

// ISR: built as static HTML, regenerated in the background at most once an hour.
// Nothing here reads a cookie, header or searchParams, so the route stays static.
export const revalidate = 3600;

export default function MenuPage() {
  return (
    <div>
      <div className={styles.pageHead}>
        <h1>Our menu</h1>
        <p>Fresh, home-style Ethiopian dishes. Pick something and add it to your cart.</p>
      </div>
      <Suspense fallback={<p className={styles.noResults}>Loading dishes…</p>}>
        <DishList />
      </Suspense>
    </div>
  );
}
