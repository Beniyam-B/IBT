import { orderSchema } from "@/lib/schema";
import { createOrder } from "@/lib/db";

// POST /api/orders - the server has the final word on validation
export async function POST(request) {
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

  const order = await createOrder(result.data);
  return Response.json(order, { status: 201 });
}
