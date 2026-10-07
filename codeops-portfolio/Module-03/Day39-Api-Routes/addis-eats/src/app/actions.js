"use server";

import { orderSchema } from "@/lib/schema";
import { createOrder, getSession, getOrder, markCancelled } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function placeOrder(prevState, formData) {
  const parsed = orderSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    dishId: formData.get("dishId") || undefined,
    quantity: formData.get("quantity") ? Number(formData.get("quantity")) : undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const order = await createOrder(parsed.data);
  revalidatePath("/orders");
  return { id: order.id };
}

export async function cancelOrder(orderId) {
  const user = await getSession();
  if (!user) {
    throw new Error("Not signed in");
  }

  const order = await getOrder(orderId);
  if (!order) {
    throw new Error("No such order");
  }
  if (order.userId !== user.id) {
    throw new Error("Not yours");
  }

  await markCancelled(orderId);
  revalidatePath("/orders");
}