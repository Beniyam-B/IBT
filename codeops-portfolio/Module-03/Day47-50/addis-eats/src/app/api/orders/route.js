import { orderSchema } from "@/lib/schema";
import { createOrder } from "@/lib/db";
import { getSession } from "@/lib/session";

// POST /api/orders - 401 signed out, 400 bad JSON, 422 invalid values, 201 created.
// The server has the final word on validation, and the owner comes from the session.
export async function POST(request) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const result = orderSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: "Validation failed", fieldErrors: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  // `items` is the checkout form's cart JSON; this endpoint does not rebuild prices from it,
  // so it is never stored. (The UI uses the placeOrder action, which does rebuild them.)
  const { items: _clientItems, ...data } = result.data;
  const order = await createOrder(data, user.id);
  return Response.json(order, { status: 201 });
}
