/**
 * In-memory mock database for Addis Eats.
 * Separate collections for menu (dishes), users and orders, until a real database exists.
 */
import { cookies } from "next/headers";
import { findDishImage } from "./images";

// ---- Menu -----------------------------------------------------------------
const mockDishes = [
  {
    id: "dish_1",
    name: "Doro Wat",
    description: "Traditional spicy chicken stew served with injera and boiled egg.",
    price: 350,
    currency: "ETB",
    category: "Main",
    available: true,
  },
  {
    id: "dish_2",
    name: "Beyaynetu",
    description: "Assorted vegan fasting dishes served on injera.",
    price: 220,
    currency: "ETB",
    category: "Vegetarian",
    available: true,
  },
  {
    id: "dish_3",
    name: "Kitfo",
    description: "Minced beef seasoned with mitmita and niter kibbeh.",
    price: 400,
    currency: "ETB",
    category: "Main",
    available: true,
  },
  {
    id: "dish_4",
    name: "Shiro Tegabeno",
    description: "Rich chickpea flour stew served bubbling hot in a clay pot.",
    price: 180,
    currency: "ETB",
    category: "Vegetarian",
    available: true,
  },
];

// ---- Users and orders ------------------------------------------------------
// Kept on globalThis so the data survives hot reloads and is shared by every
// route bundle in the dev server. Resets when the server restarts.
const g = globalThis;
g.__addisEats ??= { users: [], orders: [], nextUser: 101, nextOrder: 101 };
const store = g.__addisEats;

// Attach the photo whose file name matches the dish name (null when there is none).
const withImage = (dish) => ({ ...dish, image: findDishImage(dish.name, dish.id) });
export const db = {
  dish: {
    findMany: async () => mockDishes.map(withImage),
    findUnique: async ({ where }) => {
      const dish = mockDishes.find((d) => d.id === where.id);
      return dish ? withImage(dish) : null;
    },
  },
  order: {
    findMany: async () => [...store.orders],
  },
  user: {
    findMany: async () => [...store.users],
    findUnique: async ({ where }) =>
      store.users.find((u) => (where.phone ? u.phone === where.phone : u.email === where.email)) || null,
  },
};

export async function getDish(id) {
  const dish = mockDishes.find((d) => d.id === id);
  return dish ? withImage(dish) : null;
}

// ---- Orders ------------------------------------------------------------------
export async function createOrder(data, userId = null) {
  const order = {
    id: `ord_${store.nextOrder++}`,
    ...data,
    status: "PENDING",
    userId,
    createdAt: new Date().toISOString(),
  };
  store.orders.push(order);
  return order;
}

export async function getOrder(id) {
  return store.orders.find((o) => o.id === id) || null;
}

export async function markCancelled(id) {
  const order = store.orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found");
  order.status = "CANCELLED";
  order.updatedAt = new Date().toISOString();
  return order;
}

// ---- Users -------------------------------------------------------------------
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

// ---- Session (cookie holds the user id; mock only, not signed) ----------------
export const SESSION_COOKIE = "session";

export async function getSession() {
  const id = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!id) return null;
  const user = store.users.find((u) => u.id === id);
  return user ? { id: user.id, name: user.name, phone: user.phone, email: user.email } : null;
}
