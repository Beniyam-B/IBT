import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { ordersPerDay, revenueByArea } from "@/lib/stats";
import { dayRange, etb } from "@/lib/format";
import { demoState } from "@/lib/demoStates";
import SummaryTable from "@/components/SummaryTable";
import ui from "@/components/ui.module.css";
import RevenueChart from "./RevenueChart";
import OrdersChart from "./OrdersChart";
import styles from "./dashboard.module.css";

export const metadata = {
  title: "Dashboard",
  description: "Staff only: revenue by delivery area and orders per day.",
};

// Staff only, like /kitchen. Layer 1 (proxy) needs a cookie, layer 2 (here) verifies the session
// AND the role; a customer gets the same page as a missing one. There is no action on this page.
// Shape the data here, on the server: only a few summarised rows cross into the chart leaves.
export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const user = await getSession();
  if (!user) redirect("/login?next=/dashboard");
  if (user.role !== "staff") notFound();

  const forced = await demoState(params.demo); // only when DEMO_STATES=true: slow / error / empty

  const orders = forced === "empty" ? [] : await db.order.findMany();
  if (orders.length === 0) {
    return (
      <main>
        <div className={ui.pageHeader}><h1>Dashboard</h1></div>
        <div className={`${ui.card} ${ui.empty}`}>
          <h2>No orders yet</h2>
          <p>The charts appear once customers start ordering. Until then there is nothing to measure.</p>
          <Link href="/menu" className={`${ui.btn} ${ui.primary}`}>View the menu</Link>
        </div>
      </main>
    );
  }

  const revenue = revenueByArea(orders);
  const daily = ordersPerDay(orders, 14);
  const range = dayRange(daily[0].date, daily.at(-1).date);

  return (
    <main>
      <div className={ui.pageHeader}>
        <h1>Dashboard</h1>
        <p>{orders.length} order{orders.length === 1 ? "" : "s"} in total</p>
      </div>

      <section className={styles.section} aria-labelledby="revenue-heading">
        <h2 id="revenue-heading">Revenue by neighbourhood</h2>
        <p className={styles.sub}>ETB, all orders except cancelled ones, largest first</p>
        {revenue.some((r) => r.revenue > 0) ? (
        <RevenueChart data={revenue} />
        ) : (
  <p className={styles.sub}>No revenue yet: every order so far was cancelled.</p>
)}
        <SummaryTable
          caption="Revenue by neighbourhood (ETB)"
          head={["Neighbourhood", "Revenue"]}
          rows={revenue.map((r) => [r.area, etb(r.revenue)])}
          numeric={[false, true]}
        />
      </section>

      <section className={styles.section} aria-labelledby="orders-heading">
        <h2 id="orders-heading">Orders per day, {range}</h2>
        <p className={styles.sub}>Number of orders placed each day (UTC), including cancelled ones</p>
        <OrdersChart data={daily} />
        <SummaryTable
          caption={`Orders placed per day, ${range}`}
          head={["Day", "Orders"]}
          rows={daily.map((d) => [d.label, String(d.orders)])}
          numeric={[false, true]}
        />
      </section>
    </main>
  );
}
