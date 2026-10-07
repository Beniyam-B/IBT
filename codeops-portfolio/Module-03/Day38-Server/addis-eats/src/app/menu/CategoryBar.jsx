"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const categories = ["all", "mains", "sides", "drinks"]; // must match dish.category in dishes.js

export default function CategoryBar() {
  const params = useSearchParams();
  const current = params.get("category") ?? "all";

  function hrefFor(cat) {
    const next = new URLSearchParams(params.toString());
    if (cat === "all") next.delete("category");
    else next.set("category", cat);
    return `/menu?${next.toString()}`;
  }

  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {categories.map((cat) => (
        <Link
          key={cat}
          href={hrefFor(cat)}
          style={{ fontWeight: cat === current ? "700" : "400" }}
        >
          {cat}
        </Link>
      ))}
    </nav>
  );
}