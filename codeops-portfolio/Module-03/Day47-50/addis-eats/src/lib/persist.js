// Shared storage for the mock users and orders.
//
// Why this exists: on Vercel the app runs on several server instances, and each one has its own
// memory. An account created on instance A did not exist on instance B, so register and login
// looked broken. With Upstash Redis configured, every instance reads and writes ONE shared copy.
//
// Locally, Redis is often absent, but the app still needs its mock data to survive a route
// reload or a server restart. The file-backed fallback keeps the same in-memory model working
// without requiring external services.
import fs from "node:fs/promises";
import path from "node:path";
import { Redis } from "@upstash/redis";

// Vercel's Upstash integration names them KV_REST_API_*; upstash.com names them UPSTASH_REDIS_REST_*.
const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

// Change the version (v1 -> v2) to start again from a fresh seed.
const KEY = "addis-eats:store:v1";
const FILE_STORE_PATH = process.env.ADDIS_EATS_STORE_PATH || path.join(process.cwd(), ".data", "addis-eats-store.json");

export const persistenceEnabled = true;

const snapshot = (store) => ({
  users: store.users,
  orders: store.orders,
  nextUser: store.nextUser,
  nextOrder: store.nextOrder,
});

async function writeFileStore(store) {
  await fs.mkdir(path.dirname(FILE_STORE_PATH), { recursive: true });
  await fs.writeFile(FILE_STORE_PATH, JSON.stringify(snapshot(store), null, 2), "utf8");
}

async function readFileStore() {
  try {
    const raw = await fs.readFile(FILE_STORE_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Replace this instance's data with the shared copy. If there is no Redis, fall back to a local
// JSON file so data survives route reloads and dev-server restarts.
export async function loadInto(store) {
  if (redis) {
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
      return;
    } catch (error) {
      console.error(`[persist] could not read shared storage (${error.message}); falling back to local file`);
    }
  }

  try {
    const saved = await readFileStore();
    if (!saved) {
      await writeFileStore(store);
      return;
    }
    store.users = saved.users ?? [];
    store.orders = saved.orders ?? [];
    store.nextUser = saved.nextUser ?? store.nextUser ?? 101;
    store.nextOrder = saved.nextOrder ?? store.nextOrder ?? 101;
  } catch (error) {
    console.error(`[persist] could not read local storage (${error.message}); using this instance's memory`);
  }
}

export async function saveFrom(store) {
  if (redis) {
    try {
      await redis.set(KEY, snapshot(store));
      return;
    } catch (error) {
      console.error(`[persist] could not write shared storage (${error.message})`);
    }
  }

  try {
    await writeFileStore(store);
  } catch (error) {
    console.error(`[persist] could not write local storage (${error.message})`);
  }
}
