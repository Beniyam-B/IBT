import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrder, getSession } from "@/lib/db";
import OrderStatus from "../OrderStatus";
import ui from "@/components/ui.module.css";

export const metadata = { title: "Track your order · Addis Eats" };

// Server component: reads the order (and the session, so it is dynamic), renders it, and
// hands it to the client poll as the starting data. Nobody ever sees a spinner for data
// the server already had.
export default async function OrderPage({ params }) {
  const { id } = await params;

  const user = await getSession();
  if (!user) redirect("/login");

  const order = await getOrder(id);
  // someone else's order looks exactly like a missing one
  if (!order || order.userId !== user.id) notFound();

  return (
    <main>
      <div className={ui.pageHeader}>
        <Link href="/orders">← My orders</Link>
        <h1>Order {order.id}</h1>
      </div>
      <OrderStatus id={order.id} initial={order} />
    </main>
  );
}
