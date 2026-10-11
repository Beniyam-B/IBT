import { db } from "@/lib/db";

// GET /api/dishes
export async function GET() {
  const dishes = await db.dish.findMany();
  return Response.json(dishes);
}
