"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./menu.module.css";

// Sidebar links. The URL is the state: ?category=Main (and ?q= is kept).
export default function CategoryBar({ categories }) {
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "all";
  const q = searchParams.get("q");

  return (
    <nav aria-label="Categories">
      <h2 className={styles.sideTitle}>Categories</h2>
      <ul className={styles.categoryList}>
        {["all", ...categories].map((c) => {
          const params = new URLSearchParams();
          if (q) params.set("q", q);
          if (c !== "all") params.set("category", c);
          const qs = params.toString();
          return (
            <li key={c}>
              <Link
                href={qs ? `/menu?${qs}` : "/menu"}
                className={`${styles.categoryLink} ${c === active ? styles.active : ""}`}
              >
                {c === "all" ? "All" : c}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
