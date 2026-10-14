import { Suspense } from "react";
import { listDishes } from "@/lib/db";
import DishList from "./DishList";
import MenuBrowser from "./MenuBrowser";
import Pager from "./Pager";
import styles from "./menu.module.css";

// ISR: built as static HTML, regenerated in the background at most once an hour.
// Nothing here reads a cookie, header or searchParams, so the route stays static.
export const revalidate = 3600;

const PAGE_SIZE = 8;

export default async function MenuPage() {
  // Page one is rendered on the server: fast, indexable, and no client request.
  const first = await listDishes({ page: 1, pageSize: PAGE_SIZE });
  const firstPage = (
    <>
      <DishList dishes={first.items} />
      <Pager page={1} totalPages={first.totalPages} />
    </>
  );

  return (
    <div>
      <div className={styles.pageHead}>
        <h1>Our menu</h1>
        <p>Fresh, home-style Ethiopian dishes. Search, filter, or page through the menu.</p>
      </div>
      {/* MenuBrowser reads the URL (useSearchParams). While that is not available, e.g. in the
          static HTML, the same server-rendered first page is shown as the fallback. */}
      <Suspense
        fallback={
          <>
            {/* same size as the real search box, so nothing jumps when it hydrates */}
            <input className={styles.search} placeholder="Search dishes…" aria-label="Search dishes" disabled />
            {firstPage}
          </>
        }
      >
        <MenuBrowser pageSize={PAGE_SIZE}>
          {firstPage}
        </MenuBrowser>
      </Suspense>
    </div>
  );
}
