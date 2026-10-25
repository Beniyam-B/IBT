import { AREAS } from "./areas";
import { dayLabel } from "./format";

// Shape the data on the SERVER so only a few summarised rows cross into the chart (a client
// component). Plain arrays of plain objects: nothing a chart cannot receive.

// Revenue per delivery area, largest first (a bar chart answers "which is largest?").
// Cancelled orders earn nothing. An order with no area (placed through the API) is "Not given".
export function revenueByArea(orders) {
  const totals = new Map(AREAS.map((area) => [area, 0]));
  let notGiven = 0;
  let hasNotGiven = false;
  for (const order of orders) {
    if (order.status === "CANCELLED") continue;
    const amount = Number(order.total) || 0;
    if (AREAS.includes(order.area)) totals.set(order.area, totals.get(order.area) + amount);
    else {
      notGiven += amount;
      hasNotGiven = true;
    }
  }
  const rows = [...totals].map(([area, revenue]) => ({ area, revenue }));
  if (hasNotGiven) rows.push({ area: "Not given", revenue: notGiven });
  return rows.sort((a, b) => b.revenue - a.revenue || a.area.localeCompare(b.area));
}

// Orders placed per day for the last `days` days (UTC), oldest first. Days with no orders are
// kept as zero, so the line is honest about quiet days instead of skipping them.
export function ordersPerDay(orders, days = 14, now = new Date()) {
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const buckets = [];
  for (let i = days - 1; i >= 0; i--) {
    buckets.push({ date: new Date(end - i * 86_400_000).toISOString().slice(0, 10), orders: 0 });
  }
  const index = new Map(buckets.map((b, i) => [b.date, i]));
  for (const order of orders) {
    const slot = index.get(String(order.createdAt).slice(0, 10));
    if (slot !== undefined) buckets[slot].orders += 1;
  }
  return buckets.map((b) => ({ ...b, label: dayLabel(b.date) }));
}
