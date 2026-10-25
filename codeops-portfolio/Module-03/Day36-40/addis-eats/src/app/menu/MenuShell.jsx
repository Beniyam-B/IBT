"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./menu.module.css";

const categories = ["all", "main", "vegetarian"];

// The one client island of the menu. It owns the filter state (category + search) and
// receives the server-rendered pages as children, so DishList stays a server component.
// It filters by hiding already-rendered cards, which keeps /menu static (ISR).
export default function MenuShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const onList = pathname === "/menu";

  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [none, setNone] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!onList || !contentRef.current) return;
    const q = query.trim().toLowerCase();
    let visible = 0;
    contentRef.current.querySelectorAll("[data-dish]").forEach((el) => {
      const matchesQuery = !q || el.dataset.name.toLowerCase().includes(q);
      const matchesCategory = category === "all" || el.dataset.category.toLowerCase() === category;
      el.hidden = !(matchesQuery && matchesCategory);
      if (!el.hidden) visible += 1;
    });
    setNone(visible === 0);
  }, [query, category, onList, pathname]);

  function choose(c) {
    setCategory(c);
    if (!onList) router.push("/menu");
  }

  return (
    <div className={styles.menuLayout}>
      <aside className={styles.sidebar}>
        <nav aria-label="Categories">
          <h2 className={styles.sideTitle}>Categories</h2>
          <ul className={styles.categoryList}>
            {categories.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  aria-pressed={c === category}
                  className={`${styles.categoryLink} ${c === category ? styles.active : ""}`}
                  onClick={() => choose(c)}
                >
                  {c[0].toUpperCase() + c.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className={styles.content} ref={contentRef}>
        {onList && (
          <input
            type="search"
            className={styles.search}
            placeholder="Search dishes…"
            aria-label="Search dishes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        {children}
        {onList && none && (
          <p className={styles.noResults}>No dishes found. Try a different search or category.</p>
        )}
      </div>
    </div>
  );
}
