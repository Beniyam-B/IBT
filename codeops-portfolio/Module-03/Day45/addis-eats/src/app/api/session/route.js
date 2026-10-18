import { getSession } from "@/lib/session";

// GET /api/session - who is signed in? (reads the cookie, so it is always dynamic)
export async function GET() {
  const user = await getSession();
  return Response.json({ user });
}
