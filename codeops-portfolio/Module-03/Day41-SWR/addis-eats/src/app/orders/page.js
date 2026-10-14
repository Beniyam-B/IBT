import Link from "next/link";
import { db, getSession } from "@/lib/db";
import ui from "@/components/ui.module.css";
import { cancelOrder } from "../actions";
import styles from "./orders.module.css";

const statusClass = (status) =>
  ({ CANCELLED: styles.cancelled, DELIVERED: styles.done, PENDING: styles.pending }[status] ?? styles.active);

// Reads the session cookie, so this page is always rendered on request.
export default async function OrdersPage() {
  const user = await getSession();

  if (!user) {
    return (
      <main>
        <div className={`${ui.card} ${ui.empty}`}>
          <h1>Log in to see your orders</h1>
          <p>Your order history is tied to your account.</p>
          <Link href="/login" className={`${ui.btn} ${ui.primary}`}>Log in</Link>
        </div>
      </main>
    );
  }

  const all = await db.order.findMany();
  const orders = all.filter((o) => o.userId === user.id).reverse();

  return (
    <main>
      <div className={ui.pageHeader}>
        <h1>My orders</h1>
        <p>{orders.length === 0 ? "No orders yet." : `${orders.length} order${orders.length === 1 ? "" : "s"}`}</p>
      </div>

      {orders.length === 0 ? (
        <div className={`${ui.card} ${ui.empty}`}>
          <p>Once you place an order it will appear here.</p>
          <Link href="/menu" className={`${ui.btn} ${ui.primary}`}>Browse the menu</Link>
        </div>
      ) : (
        <ul className={styles.list}>
          {orders.map((order) => (
            <li key={order.id} className={`${ui.card} ${styles.order}`}>
              <div className={styles.head}>
                <Link href={`/orders/${order.id}`}><strong>{order.id}</strong></Link>
                <span className={`${styles.status} ${statusClass(order.status)}`}>{order.status}</span>
              </div>
              <ul className={styles.lines}>
                {(order.items ?? []).map((i) => (
                  <li key={i.dishId}>
                    <span>{i.quantity} × {i.name}</span>
                    <span>{i.price * i.quantity} ETB</span>
                  </li>
                ))}
              </ul>
              <div className={styles.foot}>
                <span>{new Date(order.createdAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC</span>
                <strong>{order.total} {order.currency}</strong>
              </div>
              <Link href={`/orders/${order.id}`} className={styles.track}>Track this order →</Link>
              {order.status === "PENDING" && (
                // A plain form bound to the server action: works without JavaScript, and
                // cancelOrder re-checks the session and the owner on the server.
                <form action={cancelOrder.bind(null, order.id)}>
                  <button type="submit" className={`${ui.btn} ${ui.outline} ${ui.small}`}>
                    Cancel order
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
