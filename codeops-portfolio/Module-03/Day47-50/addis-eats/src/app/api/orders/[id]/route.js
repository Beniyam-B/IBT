import { getOrder } from "@/lib/db";
import { getSession } from "@/lib/session";

// GET /api/orders/ord_101 - polled by the order-status screen.
// 401 not signed in, 404 no such order, 403 somebody else's order, 200 the order.
export async function GET(request, { params }) {
  const { id } = await params;

  const user = await getSession();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const order = await getOrder(id);
  if (!order) return Response.json({ error: "No such order" }, { status: 404 });
  if (order.userId !== user.id) return Response.json({ error: "Not yours" }, { status: 403 });

  return Response.json(order);
}
