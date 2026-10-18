import { Suspense } from "react";
import { listCategories } from "@/lib/db";
import CategoryBar from "./CategoryBar";
import styles from "./menu.module.css";

// Nested layout: the sidebar stays mounted while you move between /menu and /menu/[id].
// useSearchParams (in CategoryBar) needs a Suspense boundary around it.
export default async function MenuLayout({ children }) {
  const categories = await listCategories();

  return (
    <div className={styles.menuLayout}>
      <aside className={styles.sidebar}>
        <Suspense fallback={null}>
          <CategoryBar categories={categories} />
        </Suspense>
      </aside>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
