"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkoutSchema, registerSchema, loginSchema } from "@/lib/schema";
import {
  advanceStatus,
  createOrder,
  getDish,
  getOrder,
  markCancelled,
  registerUser,
  verifyUser,
} from "@/lib/db";
import { endSession, getSession, startSession } from "@/lib/session";
import { safeNext } from "@/lib/safeNext";

// Every server action is a public endpoint: the checks live INSIDE each action.
// Layer 3 of 3, the one that cannot be bypassed:
//   authentication (who are you?)  ->  authorisation (may you touch THIS record / do THIS?)

// ---- Orders ------------------------------------------------------------------
export async function placeOrder(prevState, formData) {
  const values = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    area: String(formData.get("area") ?? ""),
  };

  const user = await getSession();
  if (!user) return { values, error: "Please log in to place an order." };

  const parsed = checkoutSchema.safeParse({
    ...values,
    notes: values.notes || undefined,
    items: String(formData.get("items") ?? "[]"),
  });
  if (!parsed.success) {
    return { values, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Never trust the client's prices: rebuild every line from the dishes list.
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
      area: parsed.data.area,
      items: lines,
      total,
      currency: "ETB",
    },
    user.id // from the session, never from the form
  );

  revalidatePath("/orders");
  return { id: order.id, total };
}

export async function cancelOrder(orderId) {
  const user = await getSession();
  if (!user) return { error: "Not signed in" }; // 401

  const order = await getOrder(orderId);
  if (!order) return { error: "No such order" }; // 404
  if (order.userId !== user.id) return { error: "Not yours" }; // 403
  if (order.status === "CANCELLED") return { error: "Already cancelled" };
  if (order.status !== "PENDING") return { error: "Too late to cancel: the kitchen has started" };

  await markCancelled(orderId);
  revalidatePath("/orders");
  return { ok: true };
}

// Staff only. The role is checked HERE, where the effect happens, not in the markup.
export async function advanceOrder(orderId) {
  const user = await getSession();
  if (!user) return { error: "Not signed in" }; // 401
  if (user.role !== "staff") return { error: "Not allowed" }; // 403

  const order = await getOrder(orderId);
  if (!order) return { error: "No such order" }; // 404

  await advanceStatus(orderId);
  revalidatePath("/kitchen");
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
  redirect(safeNext(String(formData.get("next") ?? ""))); // only same-site paths
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
  redirect(safeNext(String(formData.get("next") ?? ""))); // only same-site paths
}

export async function logoutAction() {
  await endSession(); // deletes the server-side session AND the cookie
  redirect("/");
}
