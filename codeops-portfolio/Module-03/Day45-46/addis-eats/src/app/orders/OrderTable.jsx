import Link from "next/link";
import { cancelOrder } from "../actions";
import { etb } from "@/lib/format";
import ui from "@/components/ui.module.css";
import table from "@/components/table.module.css";
import styles from "./orders.module.css";

const statusClass = (status) =>
  ({ CANCELLED: styles.cancelled, DELIVERED: styles.done, PENDING: styles.pending }[status] ?? styles.active);

// Server component, real table markup, no JavaScript of its own. The sort lives in the URL
// (?sort=total&dir=desc), so it is shareable, survives a refresh and costs the browser nothing.
// aria-sort tells a screen reader which column the rows are ordered by.
export default function OrderTable({ orders, sort, dir }) {
  const nextDir = (key) => (sort === key && dir === "desc" ? "asc" : "desc");
  const sortHref = (key) => `/orders?${new URLSearchParams({ sort: key, dir: nextDir(key) })}`;

  const sortable = (key, label, numeric) => (
    <th
      scope="col"
      className={numeric ? table.num : undefined}
      aria-sort={sort === key ? (dir === "asc" ? "ascending" : "descending") : undefined}
    >
      <Link href={sortHref(key)} className={table.sortLink}>
        {label}
        {sort === key && <span aria-hidden="true">{dir === "asc" ? " ▲" : " ▼"}</span>}
      </Link>
    </th>
  );

  return (
    <div className={table.wrap} role="region" aria-label="Your orders" tabIndex={0}>
      <table className={table.table}>
        <caption className={table.caption}>Your orders (times in UTC)</caption>
        <thead>
          <tr>
            <th scope="col">Order</th>
            {sortable("date", "Placed", false)}
            <th scope="col" className={table.num}>Items</th>
            {sortable("total", "Total", true)}
            {sortable("status", "Status", false)}
            <th scope="col"><span className={table.srOnly}>Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const count = (order.items ?? []).reduce((sum, i) => sum + i.quantity, 0);
            return (
              <tr key={order.id}>
                <th scope="row"><Link href={`/orders/${order.id}`}>{order.id}</Link></th>
                <td>
                  <time dateTime={order.createdAt}>
                    {new Date(order.createdAt).toLocaleString("en-GB", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" })}
                  </time>
                </td>
                <td className={table.num}>{count || "—"}</td>
                <td className={table.num}>{etb(order.total)}</td>
                <td><span className={`${styles.status} ${statusClass(order.status)}`}>{order.status}</span></td>
                <td>
                  {order.status === "PENDING" && (
                    // A plain form bound to the server action: works without JavaScript, and
                    // cancelOrder re-checks the session and the owner on the server.
                    <form action={cancelOrder.bind(null, order.id)}>
                      <button type="submit" className={`${ui.btn} ${ui.outline} ${ui.small}`}>
                        Cancel<span className={table.srOnly}> order {order.id}</span>
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
