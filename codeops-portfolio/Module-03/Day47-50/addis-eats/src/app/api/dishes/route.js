import { listDishes } from "@/lib/db";

// GET /api/dishes?q=tib&category=Main&page=2&pageSize=24
// The client (SWR) calls this for search and for pages after the first.
// Response: { items, total, page, pageSize, totalPages }
export async function GET(request) {
  const params = new URL(request.url).searchParams;

  const toInt = (value, fallback) => {
    const n = parseInt(value ?? "", 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };

  const result = await listDishes({
    q: params.get("q") ?? "",
    category: params.get("category") ?? "all",
    page: toInt(params.get("page"), 1),
    pageSize: Math.min(toInt(params.get("pageSize"), 24), 50),
  });
  return Response.json(result);
}
// 