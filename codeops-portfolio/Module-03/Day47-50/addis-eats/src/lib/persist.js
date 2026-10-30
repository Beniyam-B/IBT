// Shared storage for the mock users and orders.
//
// Why this exists: on Vercel the app runs on several server instances, and each one has its own
// memory. An account created on instance A did not exist on instance B, so register and login
// looked broken. With Upstash Redis configured, every instance reads and writes ONE shared copy.
//
// Without the environment variables (local development) nothing changes: the in-memory store
// is used exactly as before. If Redis is unreachable the app logs it and keeps going in memory.
import { Redis } from "@upstash/redis";

// Vercel's Upstash integration names them KV_REST_API_*; upstash.com names them UPSTASH_REDIS_REST_*.
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

// Change the version (v1 -> v2) to start again from a fresh seed.
const KEY = "addis-eats:store:v1";

export const persistenceEnabled = Boolean(redis);

const snapshot = (store) => ({
  users: store.users,
  orders: store.orders,
  nextUser: store.nextUser,
  nextOrder: store.nextOrder,
});

// Replace this instance's data with the shared copy. The very first time there is no shared
// copy yet, so the freshly seeded data is saved as the starting point.
export async function loadInto(store) {
  if (!redis) return;
  try {
    const saved = await redis.get(KEY);
    if (!saved) {
      await redis.set(KEY, snapshot(store));
      return;
    }
    store.users = saved.users;
    store.orders = saved.orders;
    store.nextUser = saved.nextUser;
    store.nextOrder = saved.nextOrder;
  } catch (error) {
    console.error(`[persist] could not read shared storage (${error.message}); using this instance's memory`);
  }
}

export async function saveFrom(store) {
  if (!redis) return;
  try {
    await redis.set(KEY, snapshot(store));
  } catch (error) {
    console.error(`[persist] could not write shared storage (${error.message})`);
  }
}
