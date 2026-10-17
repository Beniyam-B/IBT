import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { STAGE_NAMES, db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { advanceOrder } from "../actions";
import ui from "@/components/ui.module.css";
import styles from "../orders/orders.module.css";

export const metadata = { title: "Kitchen · Addis Eats" };

// Staff only. Layer 2 checks the session AND the role while rendering; the advanceOrder
// action checks the role again, because the button is not what protects the write.
export default async function KitchenPage() {
  const user = await getSession();
  if (!user) redirect("/login?next=/kitchen");
  if (user.role !== "staff") notFound(); // a customer gets the same page as a missing one

  const all = await db.order.findMany();
  const open = all.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status)).reverse();

  return (
    <main>
      <div className={ui.pageHeader}>
        <h1>Kitchen</h1>
        <p>{open.length === 0 ? "No open orders." : `${open.length} open order${open.length === 1 ? "" : "s"}`}</p>
      </div>

      <ul className={styles.list}>
        {open.map((order) => {
          const next = STAGE_NAMES[STAGE_NAMES.indexOf(order.status) + 1];
          return (
            <li key={order.id} className={`${ui.card} ${styles.order}`}>
              <div className={styles.head}>
                <strong>{order.id}</strong>
                <span className={`${styles.status} ${styles.active}`}>{order.status}</span>
              </div>
              <ul className={styles.lines}>
                {order.items.map((i) => (
                  <li key={i.dishId}>
                    <span>{i.quantity} × {i.name}</span>
                    <span>{order.name}, {order.phone}</span>
                  </li>
                ))}
              </ul>
              {next && (
                <form action={advanceOrder.bind(null, order.id)}>
                  <button type="submit" className={`${ui.btn} ${ui.primary} ${ui.small}`}>
                    Move to {next}
                  </button>
                </form>
              )}
            </li>
          );
        })}
      </ul>
      <p><Link href="/orders">← My orders</Link></p>
    </main>
  );
}
