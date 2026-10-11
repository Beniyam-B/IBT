"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { orderSchema, registerSchema, loginSchema } from "@/lib/schema";
import {
  SESSION_COOKIE,
  createOrder,
  getDish,
  getOrder,
  getSession,
  markCancelled,
  registerUser,
  verifyUser,
} from "@/lib/db";

// Every server action is a public endpoint: the checks live INSIDE each action.

async function startSession(userId) {
  (await cookies()).set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

// ---- Orders ------------------------------------------------------------------
export async function placeOrder(prevState, formData) {
  const values = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };

  const user = await getSession();
  if (!user) return { values, error: "Please log in to place an order." };

  const parsed = orderSchema.safeParse({
    ...values,
    notes: values.notes || undefined,
    items: String(formData.get("items") ?? "[]"),
  });
  if (!parsed.success) {
    return { values, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Never trust the client's prices: rebuild every line from the database.
  let cart;
  try {
    cart = JSON.parse(parsed.data.items);
  } catch {
    return { values, error: "We could not read your cart. Please try again." };
  }

  const lines = [];
  for (const entry of Array.isArray(cart) ? cart : []) {
    const dish = await getDish(entry?.dishId);
    const quantity = Number(entry?.quantity);
    if (!dish || !Number.isInteger(quantity) || quantity < 1) {
      return { values, error: "Something in your cart is no longer available." };
    }
    lines.push({ dishId: dish.id, name: dish.name, price: dish.price, quantity });
  }
  if (lines.length === 0) return { values, error: "Your cart is empty." };

  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const order = await createOrder(
    {
      name: parsed.data.name,
      phone: parsed.data.phone,
      notes: parsed.data.notes,
      items: lines,
      total,
      currency: "ETB",
    },
    user.id
  );

  revalidatePath("/orders");
  return { id: order.id, total };
}

export async function cancelOrder(orderId) {
  const user = await getSession();
  if (!user) return { error: "Not signed in" };

  const order = await getOrder(orderId);
  if (!order) return { error: "No such order" };
  if (order.userId !== user.id) return { error: "Not yours" };
  if (order.status === "CANCELLED") return { error: "Already cancelled" };

  await markCancelled(orderId);
  revalidatePath("/orders");
  return { ok: true };
}

// ---- Auth ----------------------------------------------------------------------
export async function registerAction(prevState, formData) {
  const values = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
  };
  const parsed = registerSchema.safeParse({
    ...values,
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { values, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let user;
  try {
    user = await registerUser(parsed.data);
  } catch (e) {
    return { values, error: e.message };
  }

  await startSession(user.id);
  redirect("/menu");
}

export async function loginAction(prevState, formData) {
  const values = { identifier: String(formData.get("identifier") ?? "") };
  const parsed = loginSchema.safeParse({
    ...values,
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { values, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let user;
  try {
    user = await verifyUser(parsed.data);
  } catch (e) {
    return { values, error: e.message };
  }

  await startSession(user.id);
  redirect("/menu");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
