import { notFound, redirect } from "next/navigation";
import { getOrder } from "@/lib/db";
import { getSession } from "@/lib/session";
import { etb, when } from "@/lib/format";
import { KITCHEN, coordsFor } from "@/lib/places";
import ui from "@/components/ui.module.css";
import TrackView from "./TrackView";

export const metadata = { title: "Track your order" };

export default async function TrackPage({ params }) {
  const { id } = await params;
  const user = await getSession();
  if (!user) redirect(`/login?next=/track/${id}`);

  const order = await getOrder(id);
  if (!order || (order.userId !== user.id && user.role !== "staff")) notFound();

  return (
    <main>
      <div className={ui.pageHeader}>
        <h1>Track order {order.id}</h1>
        <p>Placed {when(order.createdAt)} (Addis Ababa time)</p>
      </div>
      <TrackView
        id={order.id}
        initialStatus={order.status}
        area={order.area ?? null}
        totalLabel={etb(order.total)}
        placedAt={order.createdAt}
        kitchen={KITCHEN}
        destination={coordsFor(order.area)}
      />
    </main>
  );
}