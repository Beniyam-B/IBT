"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./menu.module.css";

const categories = ["all", "main", "vegetarian"];

export default function CategoryBar() {
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "all";
  const q = searchParams.get("q");

  return (
    <nav>
      <ul className={styles.categoryList}>
        {categories.map((c) => {
          const params = new URLSearchParams();
          if (q) params.set("q", q);
          if (c !== "all") params.set("category", c);
          const qs = params.toString();
          return (
            <li key={c}>
              <Link href={qs ? `/menu?${qs}` : "/menu"} className={c === active ? styles.active : undefined}>
                {c[0].toUpperCase() + c.slice(1)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}