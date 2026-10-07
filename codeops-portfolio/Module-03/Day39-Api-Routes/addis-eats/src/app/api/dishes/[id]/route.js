import { getDish } from "@/lib/db";

export async function GET(request, { params }) {
  const dish = await getDish(params.id);

  if (!dish) {
    return Response.json(
      { error: "No such dish" },
      { status: 404 }
    );
  }

  return Response.json(dish);
}