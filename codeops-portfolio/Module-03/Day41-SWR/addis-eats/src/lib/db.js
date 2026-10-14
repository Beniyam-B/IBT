/**
 * Data layer for Addis Eats (server only).
 *  - Menu (dishes): read from a public JSON API (with an offline copy as a fallback).
 *  - Users and orders: in-memory mock store until a real database exists.
 */
import { cookies } from "next/headers";
import { findDishImage } from "./images";
import fallbackDishes from "./dishes.fallback.json";

// ---- Menu: the public dishes API -----------------------------------------------------
const DISHES_API =
  process.env.DISHES_API_URL ?? "https://cdn.jsdelivr.net/gh/juffalx/TESTsss@main/day01/api.json";

// The API returns { id: 1, name, category, price, spicy }. We keep our own id format
// ("dish_1"), add a currency, and attach the photo whose file name matches the dish.
const toDish = (raw) => {
  const dish = {
    id: `dish_${raw.id}`,
    name: raw.name,
    category: raw.category,
    price: raw.price,
    spicy: Boolean(raw.spicy),
    currency: "ETB",
    available: true,
  };
  return { ...dish, image: findDishImage(dish.name, dish.id) };
};

// Cached by Next.js for an hour (it is the same menu for everyone). If the API cannot be
// reached, the bundled copy keeps the app working instead of showing an error page.
async function loadDishes() {
  try {
    const res = await fetch(DISHES_API, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).map(toDish);
  } catch (error) {
    console.warn(`[db] dishes API unreachable (${error.message}); using the bundled copy`);
    return fallbackDishes.map(toDish);
  }
}

// One page of the menu, optionally filtered. Used by the menu page (page 1, on the server)
// and by GET /api/dishes (every other page, for the client).
export async function listDishes({ q = "", category = "all", page = 1, pageSize = 8 } = {}) {
  const all = await loadDishes();
  const term = q.trim().toLowerCase();
  const matches = all.filter(
    (d) =>
      (!term || d.name.toLowerCase().includes(term)) &&
      (category === "all" || d.category.toLowerCase() === category.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  return {
    items: matches.slice((current - 1) * pageSize, current * pageSize),
    total: matches.length,
    page: current,
    pageSize,
    totalPages,
  };
}

export async function listCategories() {
  const all = await loadDishes();
  return [...new Set(all.map((d) => d.category))];
}

export const db = {
  dish: {
    findMany: async () => loadDishes(),
    findUnique: async ({ where }) => (await loadDishes()).find((d) => d.id === where.id) || null,
  },
  order: {
    findMany: async () => store.orders.map(withStatus),
  },
  user: {
    findMany: async () => [...store.users],
    findUnique: async ({ where }) =>
      store.users.find((u) => (where.phone ? u.phone === where.phone : u.email === where.email)) || null,
  },
};

export async function getDish(id) {
  return (await loadDishes()).find((d) => d.id === id) || null;
}

// ---- Users and orders (in memory) -------------------------------------------------------
// Kept on globalThis so the data survives hot reloads and is shared by every route bundle.
// Resets when the server restarts.
const g = globalThis;
g.__addisEats ??= { users: [], orders: [], nextUser: 101, nextOrder: 101 };
const store = g.__addisEats;

// Demo "kitchen": an order moves on by itself, so a polling screen has something to show.
// (A real system would update the status when the kitchen does.) Times are in milliseconds.
const STAGES = [
  ["PENDING", 0],
  ["PREPARING", 20_000],
  ["ON THE WAY", 50_000],
  ["DELIVERED", 90_000],
];

function currentStatus(order) {
  if (order.status === "CANCELLED") return "CANCELLED";
  const age = Date.now() - new Date(order.createdAt).getTime();
  let status = "PENDING";
  for (const [name, from] of STAGES) if (age >= from) status = name;
  return status;
}

const withStatus = (order) => ({ ...order, status: currentStatus(order) });

export async function createOrder(data, userId = null) {
  const order = {
    id: `ord_${store.nextOrder++}`,
    ...data,
    status: "PENDING",
    userId,
    createdAt: new Date().toISOString(),
  };
  store.orders.push(order);
  return withStatus(order);
}

export async function getOrder(id) {
  const order = store.orders.find((o) => o.id === id);
  return order ? withStatus(order) : null;
}

export async function markCancelled(id) {
  const order = store.orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found");
  order.status = "CANCELLED";
  order.updatedAt = new Date().toISOString();
  return withStatus(order);
}

// ---- Users -----------------------------------------------------------------------------
// Phone number is the main identifier (like orders); email is optional.
// NOTE: passwords are stored in plain text ONLY because this is a temporary
// mock store. A real database needs hashed passwords (e.g. bcrypt).
export function normalizePhone(input) {
  const digits = String(input).replace(/[\s-]/g, "");
  return digits.startsWith("+251") ? `0${digits.slice(4)}` : digits;
}

export async function registerUser({ name, phone, email, password }) {
  const cleanPhone = normalizePhone(phone);
  const cleanEmail = (email ?? "").trim().toLowerCase();

  if (store.users.some((u) => u.phone === cleanPhone)) {
    throw new Error("An account with this phone number already exists");
  }
  if (cleanEmail && store.users.some((u) => u.email === cleanEmail)) {
    throw new Error("An account with this email already exists");
  }

  const user = {
    id: `user_${store.nextUser++}`,
    name: name.trim(),
    phone: cleanPhone,
    email: cleanEmail || null,
    password,
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  return user;
}

// identifier is a phone number (09… or +2519…) or an email address
export async function verifyUser({ identifier, password }) {
  const id = identifier.trim();
  const user = id.includes("@")
    ? store.users.find((u) => u.email === id.toLowerCase() && u.password === password)
    : store.users.find((u) => u.phone === normalizePhone(id) && u.password === password);
  if (!user) throw new Error("Invalid phone number, email or password");
  return user;
}

// ---- Session (cookie holds the user id; mock only, not signed) ----------------------------
export const SESSION_COOKIE = "session";

export async function getSession() {
  const id = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const user = store.users.find((u) => u.id === id);
  return user ? { id: user.id, name: user.name, phone: user.phone, email: user.email } : null;
}
