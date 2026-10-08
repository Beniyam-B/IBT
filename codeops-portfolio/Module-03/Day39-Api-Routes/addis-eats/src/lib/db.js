/**
 * In-memory mock database and helper utilities for Addis Eats.
 * Provides data access functions for dishes, orders, users, and session management.
 */

// Mock dish records
const mockDishes = [
  {
    id: "dish_1",
    name: "Doro Wat",
    description: "Traditional spicy chicken stew served with injera and boiled egg.",
    price: 350,
    currency: "ETB",
    category: "Main",
    available: true,
    image: "/images/Doro%20Wat.jpg",         // dish_1
  },
  {
    id: "dish_2",
    name: "Beyaynetu",
    description: "Assorted vegan fasting dishes served on injera.",
    price: 220,
    currency: "ETB",
    category: "Vegetarian",
    available: true,
    image: "/images/Beyaynetu.jpg",          // dish_2
  },
  {
    id: "dish_3",
    name: "Kitfo",
    description: "Minced beef seasoned with mitmita and niter kibbeh.",
    price: 400,
    currency: "ETB",
    category: "Main",
    available: true,
    image: "/images/Kitfo.jpg",              // dish_3
  },
  {
    id: "dish_4",
    name: "Shiro Tegabeno",
    description: "Rich chickpea flour stew served bubbling hot in a clay pot.",
    price: 180,
    currency: "ETB",
    category: "Vegetarian",
    available: true,
    image: "/images/Shiro%20Tegabeno.jpg",   // dish_4
  },
];

// In-memory orders store
const mockOrders = [];

// In-memory users store
const mockUsers = [];

// Mock authenticated user session (kept as a seeded user so checkout
// still works before login/register are wired up; loginUser() below
// will replace this once real auth is in place)
let mockSessionUser = {
  id: "user_addis_101",
  name: "Abebe Bikila",
  email: "abebe@example.com",
};

/**
 * ORM-style database query interface
 */
export const db = {
  dish: {
    findMany: async () => [...mockDishes],
    findUnique: async ({ where }) =>
      mockDishes.find((d) => d.id === where.id) || null,
  },
  order: {
    findMany: async () => [...mockOrders],
  },
  user: {
    findMany: async () => [...mockUsers],
    findUnique: async ({ where }) =>
      mockUsers.find((u) => u.email === where.email) || null,
  },
};

/**
 * Fetch a single dish by ID
 */
export async function getDish(id) {
  const dish = mockDishes.find((d) => d.id === id);
  return dish || null;
}

/**
 * Create a new order in memory
 */
export async function createOrder(data) {
  const newOrder = {
    id: `ord_${Math.floor(100 + Math.random() * 900)}`,
    ...data,
    status: "PENDING",
    userId: mockSessionUser?.id ?? null,
    createdAt: new Date().toISOString(),
  };

  mockOrders.push(newOrder);
  return newOrder;
}

/**
 * Retrieve a specific order by ID
 */
export async function getOrder(id) {
  const order = mockOrders.find((o) => o.id === id);
  return order || null;
}

/**
 * Mark an order as cancelled
 */
export async function markCancelled(id) {
  const order = mockOrders.find((o) => o.id === id);
  if (!order) {
    throw new Error("Order not found");
  }

  order.status = "CANCELLED";
  order.updatedAt = new Date().toISOString();
  return order;
}

/**
 * Register a new user
 * NOTE: password is stored in plain text only because this is a
 * temporary in-memory mock store. The moment this moves to a real
 * database, passwords must be hashed (e.g. with bcrypt) before storage.
 */
export async function registerUser({ name, email, password }) {
  const existing = mockUsers.find((u) => u.email === email);
  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const newUser = {
    id: `user_${Math.floor(100 + Math.random() * 900)}`,
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  mockUsers.push(newUser);
  return newUser;
}

/**
 * Log in an existing user
 */
export async function loginUser({ email, password }) {
  const user = mockUsers.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error("Invalid email or password");
  }
  mockSessionUser = user;
  return user;
}

/**
 * Read current authenticated user session
 */
export async function getSession() {
  return mockSessionUser;
}