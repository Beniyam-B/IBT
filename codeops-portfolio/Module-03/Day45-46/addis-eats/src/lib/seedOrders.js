import { AREAS } from "./areas";

// Demo orders, only used when SEED_DEMO_DATA=true. Deterministic (a fixed seed), so the charts
// look the same on every start. Ages run from 2 hours to about 13 days.
const NAMES = ["Abebe Kebede", "Tigist Alemu", "Dawit Mekonnen", "Selam Tesfaye", "Hana Girma", "Yonas Bekele", "Marta Haile", "Kaleb Assefa"];

export function makeDemoOrders({ dishes, userId, count = 45, now = Date.now() }) {
  let seed = 20260101;
  const random = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const pick = (list) => list[Math.floor(random() * list.length)];

  const orders = [];
  for (let i = 0; i < count; i++) {
    const items = [];
    const wanted = 1 + Math.floor(random() * 3);
    for (let j = 0; j < wanted; j++) {
      const dish = pick(dishes);
      const dishId = `dish_${dish.id}`;
      if (!items.some((l) => l.dishId === dishId)) {
        items.push({ dishId, name: dish.name, price: dish.price, quantity: 1 + Math.floor(random() * 3) });
      }
    }
    const ageMs = (2 + random() * 13 * 24) * 3_600_000;
    orders.push({
      name: pick(NAMES),
      phone: "0911000000",
      area: pick(AREAS),
      items,
      total: items.reduce((sum, l) => sum + l.price * l.quantity, 0),
      currency: "ETB",
      status: random() < 0.1 ? "CANCELLED" : "PENDING", // old PENDING orders read as DELIVERED
      userId,
      createdAt: new Date(now - ageMs).toISOString(),
    });
  }
  return orders.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}
