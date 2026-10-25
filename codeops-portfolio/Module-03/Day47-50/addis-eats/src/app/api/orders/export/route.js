import { getOrdersFor } from "@/lib/db";
import { getSession } from "@/lib/session";
import { toCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSession();
  if (!user) return new Response("Not signed in", { status: 401 });

  const result = await getOrdersFor(user.id, { sort: "date", dir: "desc", page: 1, pageSize: 100000 });
  const rows = result.rows ?? result;
  const columns = ["order", "placed_at_utc", "name", "area", "notes", "items", "total_etb", "status"];
  const csv = toCsv(
    rows.map((o) => ({
      order: o.id,
      placed_at_utc: o.createdAt,
      name: o.name ?? "",
      area: o.area ?? "",
      notes: o.notes ?? "",
      items: (o.items ?? []).reduce((n, i) => n + (i.quantity ?? 1), 0),
      total_etb: o.total,
      status: o.status,
    })),
    columns
  );
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="addis-eats-orders.csv"',
      "Cache-Control": "no-store",
    },
  });
}