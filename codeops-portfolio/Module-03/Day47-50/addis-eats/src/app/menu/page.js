import Link from "next/link";
import { listCategories, listDishes } from "@/lib/db";
import PageLinks from "@/components/PageLinks";
import ui from "@/components/ui.module.css";
import DishCard from "./DishCard";
import styles from "./menu.module.css";

export const metadata = {
  title: "Menu",
  description: "Browse every Addis Eats dish, search by name and filter by category.",
};

const PAGE_SIZE = 8;

// Server component. The URL holds the whole state: /menu?q=doro&category=Mains&page=2
// Search is a plain GET form, so Enter works, the back button works and the result is shareable.
export default async function MenuPage({ searchParams }) {
  const params = await searchParams;

  // Anything from the URL is a claim: trim the search, whitelist the category, clamp the page.
  const q = String(params.q ?? "").trim().slice(0, 60);
  const categories = await listCategories();
  const category =
    categories.find((c) => c.toLowerCase() === String(params.category ?? "").toLowerCase()) ?? "all";
  const requested = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const result = await listDishes({ q, category, page: requested, pageSize: PAGE_SIZE });

  const filterHref = (cat) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (cat !== "all") p.set("category", cat);
    const qs = p.toString();
    return qs ? `/menu?${qs}` : "/menu";
  };

  return (
    <main>
      <div className={ui.pageHeader}>
        <h1>Menu</h1>
        <p>Fresh Ethiopian dishes, delivered across Addis Ababa.</p>
      </div>

      <form action="/menu" method="get" role="search" className={styles.search}>
        <div className={styles.searchField}>
          <label htmlFor="q">Search dishes</label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Doro wat, tibs, shiro…"
            autoComplete="off"
            enterKeyHint="search"
          />
        </div>
        {category !== "all" && <input type="hidden" name="category" value={category} />}
        <button type="submit" className={`${ui.btn} ${ui.primary}`}>Search</button>
        {q && <Link href={filterHref("all").split("?")[0]} className={`${ui.btn} ${ui.outline}`}>Clear</Link>}
      </form>

      <nav aria-label="Categories">
        <ul className={styles.chips}>
          {["all", ...categories].map((cat) => {
            const active = cat === category;
            return (
              <li key={cat}>
                <Link
                  href={filterHref(cat)}
                  className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {active && <span aria-hidden="true">✓&nbsp;</span>}
                  {cat === "all" ? "All" : cat}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {result.total === 0 ? (
        // Empty is not an error: say why, and what to do next.
        <div className={`${ui.card} ${ui.empty}`}>
          <h2>No dishes match</h2>
          <p>Try a different word, or clear the filters to see the whole menu.</p>
          <Link href="/menu" className={`${ui.btn} ${ui.primary}`}>Show the whole menu</Link>
        </div>
      ) : (
        <>
          <p className={styles.count} role="status">
            {result.total} dish{result.total === 1 ? "" : "es"}, page {result.page} of {result.totalPages}
          </p>
          <ul className={styles.grid}>
            {result.items.map((dish) => (
              <li key={dish.id}>
                <DishCard dish={dish} />
              </li>
            ))}
          </ul>
          <PageLinks
            basePath="/menu"
            query={{ q, category: category !== "all" ? category : "" }}
            page={result.page}
            totalPages={result.totalPages}
          />
        </>
      )}
    </main>
  );
}