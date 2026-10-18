import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./auth-config";
import { createSessionRecord, deleteSessionRecord, findSessionUser } from "./db";

// ONE helper, used the same way by pages, server actions and route handlers:
//   const user = await getSession();   // null when signed out
export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const user = await findSessionUser(token);
  return user
    ? { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role }
    : null;
}

export async function startSession(userId) {
  const token = await createSessionRecord(userId);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, // JavaScript cannot read it (blocks a script stealing the session)
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax", // not sent on requests started by other sites
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await deleteSessionRecord(token);
  jar.delete(SESSION_COOKIE);
}
