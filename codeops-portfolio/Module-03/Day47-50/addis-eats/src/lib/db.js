/**
 * Data layer for Addis Eats (server only).
 *  - Menu (dishes): read from a public JSON API (with an offline copy as a fallback).
 *  - Users and orders: in-memory mock store until a real database exists.
 */
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { findDishImage } from "./images";
import fallbackDishes from "./dishes.fallback.json";
import { paginate, sortOrders } from "./orderTable";
import { makeDemoOrders } from "./seedOrders";
import { loadInto, saveFrom } from "./persist";

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
    findMany: async () => {
      await loadInto(store);
      return store.orders.map(withStatus);
    },
  },
  user: {
    findMany: async () => {
      await loadInto(store);
      return store.users.map(publicUser);
    },
    findUnique: async ({ where }) => {
      await loadInto(store);
      const user = store.users.find((u) => (where.phone ? u.phone === where.phone : u.email === where.email));
      return user ? publicUser(user) : null;
    },
  },
};

export async function getDish(id) {
  return (await loadDishes()).find((d) => d.id === id) || null;
}

async function findUserByIdImpl(userId) {
  const user = store.users.find((u) => u.id === userId);
  return user ? publicUser(user) : null;
}

// ---- Users and orders (in memory) -------------------------------------------------------
// Kept on globalThis so the data survives hot reloads and is shared by every route bundle.
// Resets when the server restarts.
const g = globalThis;
g.__addisEats ??= { users: [], orders: [], nextUser: 101, nextOrder: 101 };
const store = g.__addisEats;
store.sessions ??= new Map(); // token -> { userId, expiresAt }

// One staff account so the /kitchen route can be tried: phone 0900000000, password staff123.
// (Demo credentials for a mock store. Real staff accounts would be created by an admin.)
if (!store.users.some((u) => u.role === "staff")) {
  store.users.push({
    id: `user_${store.nextUser++}`,
    name: "Kitchen Staff",
    phone: "0900000000",
    email: null,
    role: "staff",
    passwordHash: bcrypt.hashSync("staff123", 10),
    createdAt: new Date().toISOString(),
  });
}

const DEMO_CUSTOMERS = [
  { name: "Abebe", phone: "0911111111", email: "abebe@example.com", password: "user123" },
  { name: "Kebede", phone: "0911222333", email: "kebede@example.com", password: "user123" },
  { name: "Almaz", phone: "0911333444", email: "almaz@example.com", password: "user123" },
];

for (const demo of DEMO_CUSTOMERS) {
  const phone = normalizePhone(demo.phone);
  const email = demo.email.trim().toLowerCase();
  if (!store.users.some((u) => u.phone === phone || (u.email && u.email === email))) {
    store.users.push({
      id: `user_${store.nextUser++}`,
      name: demo.name,
      phone,
      email,
      role: "customer",
      passwordHash: bcrypt.hashSync(demo.password, 10),
      createdAt: new Date().toISOString(),
    });
  }
}

// Optional demo data, off by default. With SEED_DEMO_DATA=true, a "Demo Customer" (phone
// 0911000000, password demo123) gets 45 orders over the last two weeks, so the dashboard and the
// paged table have something to show. Never switch this on for real users.
if (process.env.SEED_DEMO_DATA === "true" && !store.seeded) {
  store.seeded = true;
  const demoUser = {
    id: `user_${store.nextUser++}`,
    name: "Demo Customer",
    phone: "0911000000",
    email: null,
    role: "customer",
    passwordHash: bcrypt.hashSync("demo123", 10),
    createdAt: new Date().toISOString(),
  };
  store.users.push(demoUser);
  for (const order of makeDemoOrders({ dishes: fallbackDishes, userId: demoUser.id })) {
    store.orders.push({ id: `ord_${store.nextOrder++}`, ...order });
  }
  console.warn("[db] SEED_DEMO_DATA is on: 45 demo orders loaded for Demo Customer (0911000000 / demo123)");
}

// Never hand the hash to the rest of the app.
const publicUser = ({ passwordHash, ...user }) => user;

// Demo "kitchen": an order moves on by itself, so a polling screen has something to show.
// (A real system would update the status when the kitchen does.) Times are in milliseconds.
// Staff can also push an order to the next step by hand (see advanceStatus).
const STAGES = [
  ["PENDING", 0],
  ["PREPARING", 20_000],
  ["ON THE WAY", 50_000],
  ["DELIVERED", 90_000],
];
export const STAGE_NAMES = STAGES.map(([name]) => name);

function currentStatus(order) {
  if (order.status === "CANCELLED") return "CANCELLED";
  const age = Date.now() - new Date(order.createdAt).getTime();
  let timerIndex = 0;
  STAGES.forEach(([, from], i) => {
    if (age >= from) timerIndex = i;
  });
  const manualIndex = order.manualStatus ? STAGE_NAMES.indexOf(order.manualStatus) : -1;
  return STAGE_NAMES[Math.max(timerIndex, manualIndex)];
}

const withStatus = (order) => ({ ...order, status: currentStatus(order) });

async function createOrderImpl(data, userId = null) {
  // Idempotent: the same key from the same person returns the order that already exists.
  // There is no await between the check and the push, so two taps cannot both get past it.
  if (data.idempotencyKey) {
    const existing = store.orders.find(
      (o) => o.userId === userId && o.idempotencyKey === data.idempotencyKey
    );
    if (existing) return withStatus(existing);
  }
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

async function getOrderImpl(id) {
  const order = store.orders.find((o) => o.id === id);
  return order ? withStatus(order) : null;
}

// The orders of ONE person, sorted and paged. The id comes from the session, never from the
// request; sort, dir and page come from the URL and are validated in orderTable.js.
// Returns { rows, total, page, pageSize, totalPages }: one page, not every order.
async function getOrdersForImpl(userId, { sort = "date", dir = "desc", page = 1, pageSize = 10 } = {}) {
  const mine = store.orders.filter((o) => o.userId === userId).map(withStatus);
  return paginate(sortOrders(mine, sort, dir), page, pageSize);
}

// Staff: move an order to the next step by hand.
async function advanceStatusImpl(id) {
  const order = store.orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found");
  const index = STAGE_NAMES.indexOf(currentStatus(order));
  if (index >= 0 && index < STAGE_NAMES.length - 1) order.manualStatus = STAGE_NAMES[index + 1];
  return withStatus(order);
}

async function markCancelledImpl(id) {
  const order = store.orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found");
  order.status = "CANCELLED";
  order.updatedAt = new Date().toISOString();
  return withStatus(order);
}

// ---- Users -----------------------------------------------------------------------------
// Phone number is the main identifier (like orders); email is optional.
// Passwords are NEVER stored: only a bcrypt hash (salted, deliberately slow).
export function normalizePhone(input) {
  const digits = String(input).replace(/[\s-]/g, "");
  return digits.startsWith("+251") ? `0${digits.slice(4)}` : digits;
}

async function registerUserImpl({ name, phone, email, password }) {
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
    role: "customer", // everybody who registers is a customer; staff are created by hand
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString(),
  };
  store.users.push(user);
  return publicUser(user);
}

// Compared against a hash even when the account does not exist, so a wrong phone number and
// a wrong password take the same time (no clue about which accounts exist).
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

// identifier is a phone number (09… or +2519…) or an email address
async function verifyUserImpl({ identifier, password }) {
  const id = identifier.trim();
  const user = id.includes("@")
    ? store.users.find((u) => u.email === id.toLowerCase())
    : store.users.find((u) => u.phone === normalizePhone(id));
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) throw new Error("Invalid phone number, email or password");
  return publicUser(user);
}

// ---- Shared storage ----------------------------------------------------------------------
// Every function that reads or changes users or orders first loads the shared copy, and the ones
// that change something save it afterwards. (No-ops when Redis is not configured.)
const synced = (fn, { write = false } = {}) => async (...args) => {
  await loadInto(store);
  const result = await fn(...args);
  if (write) await saveFrom(store);
  return result;
};

export const findUserById = synced(findUserByIdImpl);
export const getOrder = synced(getOrderImpl);
export const getOrdersFor = synced(getOrdersForImpl);
export const verifyUser = synced(verifyUserImpl);
export const createOrder = synced(createOrderImpl, { write: true });
export const advanceStatus = synced(advanceStatusImpl, { write: true });
export const markCancelled = synced(markCancelledImpl, { write: true });
export const registerUser = synced(registerUserImpl, { write: true });

// ---- Sessions (database session: the cookie holds a random token, the server holds the truth) ----
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function createSessionRecord(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  store.sessions.set(token, { userId, expiresAt: Date.now() + SESSION_TTL_MS });
  return token;
}

export async function findSessionUser(token) {
  const session = store.sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    store.sessions.delete(token);
    return null;
  }
  const user = store.users.find((u) => u.id === session.userId);
  return user ? publicUser(user) : null;
}

// Signing out deletes the record, so a copied cookie stops working immediately.
export async function deleteSessionRecord(token) {
  store.sessions.delete(token);
}
