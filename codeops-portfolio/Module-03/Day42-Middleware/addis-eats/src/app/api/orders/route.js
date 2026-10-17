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

  const order = await createOrder(result.data, user.id);
  return Response.json(order, { status: 201 });
}
