import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrdersFor } from "@/lib/db";
import { getSession } from "@/lib/session";
import { SORT_KEYS } from "@/lib/orderTable";
import { demoState } from "@/lib/demoStates";
import PageLinks from "@/components/PageLinks";
import ui from "@/components/ui.module.css";
import OrderTable from "./OrderTable";
import ExportButton from "./ExportButton";

export const metadata = {
  title: "My orders",
  description: "See your Addis Eats orders, track them and cancel any that are still pending.",
};

const PAGE_SIZE = 10;

// Reads the session cookie and searchParams, so this page is always rendered on request.
// The URL holds the whole state of the table: /orders?sort=total&dir=desc&page=2
export default async function OrdersPage({ searchParams }) {
  const params = await searchParams;
  const user = await getSession();
  if (!user) redirect("/login?next=/orders"); // layer 2: the page verifies the session

  // Anything from the URL is a claim: whitelist the sort, clamp the page.
  const sort = SORT_KEYS.includes(params.sort) ? params.sort : "date";
  const dir = params.dir === "asc" ? "asc" : "desc";
  const requested = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

  const forced = await demoState(params.demo); // only when DEMO_STATES=true: slow / error / empty

  // Scoped to the session: there is no id in the request that could ask for someone else's.
  const result = await getOrdersFor(user.id, { sort, dir, page: requested, pageSize: PAGE_SIZE });
  const empty = forced === "empty" || result.total === 0;

  return (
    <main>
      <div className={ui.pageHeader}>
        <h1>My orders</h1>
        <p>{empty ? "No orders yet." : `${result.total} order${result.total === 1 ? "" : "s"}, page ${result.page} of ${result.totalPages}`}</p>
        {!empty && <ExportButton />}
        </div>

        {empty ? (
        // Empty is not an error: say why it is empty and what to do next.
        <div className={`${ui.card} ${ui.empty}`}>
          <h2>No orders yet</h2>
          <p>Browse the menu to place your first order. It will appear here once you do.</p>
          <Link href="/menu" className={`${ui.btn} ${ui.primary}`}>Browse the menu</Link>
        </div>
      ) : (
        <>
          <OrderTable orders={result.rows} sort={sort} dir={dir} />
          <PageLinks
            basePath="/orders"
            query={{ sort: sort !== "date" ? sort : "", dir: dir !== "desc" ? dir : "" }}
            page={result.page}
            totalPages={result.totalPages}
          />
        </>
      )}
    </main>
  );
}
