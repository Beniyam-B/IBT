import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadInto, saveFrom } from "./persist.js";

test("fallback persistence saves and reloads the mock store when Redis is unavailable", async () => {
  const tempRoot = mkdtempSync(path.join(os.tmpdir(), "addis-eats-store-"));
  const original = process.env.ADDIS_EATS_STORE_PATH;
  process.env.ADDIS_EATS_STORE_PATH = path.join(tempRoot, "store.json");

  try {
    const first = {
      users: [{ id: "u_1", name: "Almaz" }],
      orders: [{ id: "ord_1", userId: "u_1" }],
      nextUser: 2,
      nextOrder: 2,
    };

    await saveFrom(first);

    const second = { users: [], orders: [], nextUser: 1, nextOrder: 1 };
    await loadInto(second);

    assert.deepEqual(second.users, first.users);
    assert.deepEqual(second.orders, first.orders);
    assert.equal(second.nextUser, first.nextUser);
    assert.equal(second.nextOrder, first.nextOrder);
  } finally {
    if (original === undefined) {
      delete process.env.ADDIS_EATS_STORE_PATH;
    } else {
      process.env.ADDIS_EATS_STORE_PATH = original;
    }
    rmSync(tempRoot, { recursive: true, force: true });
  }
});
