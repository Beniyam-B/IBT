// Sorting and paging for the order table. Pure functions: the URL decides, the server applies.
// The sort key is checked against a whitelist: it comes from the request, so it is never trusted.
export const SORT_KEYS = ["date", "total", "status"];
const STATUS_RANK = { PENDING: 0, PREPARING: 1, "ON THE WAY": 2, DELIVERED: 3, CANCELLED: 4 };
const idNumber = (order) => parseInt(String(order.id).replace(/\D/g, ""), 10) || 0;

export function sortOrders(orders, sort = "date", dir = "desc") {
  const key = SORT_KEYS.includes(sort) ? sort : "date";
  const sign = dir === "asc" ? 1 : -1;
  const value = (o) =>
    key === "total" ? Number(o.total) || 0 : key === "status" ? STATUS_RANK[o.status] ?? 99 : new Date(o.createdAt).getTime();
  return [...orders].sort((a, b) => (value(a) - value(b)) * sign || idNumber(b) - idNumber(a));
}

export function paginate(rows, page = 1, pageSize = 10) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages); // out-of-range pages are clamped
  return {
    rows: rows.slice((current - 1) * pageSize, current * pageSize),
    total: rows.length,
    page: current,
    pageSize,
    totalPages,
  };
}
