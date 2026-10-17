"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useDebounce } from "@/lib/useDebounce";
import DishItem from "./DishItem";
import Pager from "./Pager";
import styles from "./menu.module.css";

// Search, category and page live in the URL (?q=&category=&page=), so a result can be linked to.
// - Default view (no search, all categories, page 1): the server already rendered it, so it is
//   shown as `children` and NO request is sent (the SWR key is null).
// - Anything else: SWR fetches /api/dishes?... and keeps the previous list on screen while the
//   next one loads (keepPreviousData), so the list never flashes empty.
export default function MenuBrowser({ children, pageSize }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const isDefault = !q && category === "all" && page === 1;

  // The input is local state; the URL is only updated once typing has paused for 300 ms.
  // We reset the uncontrolled input when the URL changes, instead of synchronizing state in an effect.
  const [term, setTerm] = useState(q);
  const debounced = useDebounce(term, 300);

  useEffect(() => {
    if (debounced !== term || debounced === q) return; // still typing, or nothing to change
    const params = new URLSearchParams(searchParams.toString());
    if (debounced) params.set("q", debounced);
    else params.delete("q");
    params.delete("page"); // a new search starts on page 1
    const qs = params.toString();
    router.replace(qs ? `/menu?${qs}` : "/menu", { scroll: false });
  }, [debounced, term, q, searchParams, router]);

  const apiParams = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (q) apiParams.set("q", q);
  if (category !== "all") apiParams.set("category", category);

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    isDefault ? null : `/api/dishes?${apiParams}`, // null key = do not fetch
    fetcher,
    { keepPreviousData: true }
  );

  return (
    <div>
      <input
        key={q || "all"}
        type="search"
        className={styles.search}
        placeholder="Search dishes…"
        aria-label="Search dishes"
        defaultValue={q}
        onChange={(e) => setTerm(e.target.value)}
      />

      {isDefault && children}

      {!isDefault && (
        <div className={isValidating ? styles.refreshing : undefined} aria-busy={isValidating}>
          {error && (
            <p className={styles.noResults}>
              Could not load dishes.{" "}
              <button type="button" className={styles.linkButton} onClick={() => mutate()}>
                Try again
              </button>
            </p>
          )}
          {!error && !data && isLoading && <p className={styles.noResults}>Loading dishes…</p>}
          {data && data.items.length === 0 && (
            <p className={styles.noResults}>No dishes found. Try a different search or category.</p>
          )}
          {data && data.items.length > 0 && (
            <ul className={styles.dishList}>
              {data.items.map((dish) => (
                <DishItem key={dish.id} dish={dish} />
              ))}
            </ul>
          )}
        </div>
      )}

      {/* the default view brings its own server-rendered pager inside `children` */}
      {!isDefault && data && (
        <Pager
          page={data.page}
          totalPages={data.totalPages}
          query={{ q, category: category !== "all" ? category : "" }}
        />
      )}
    </div>
  );
}
