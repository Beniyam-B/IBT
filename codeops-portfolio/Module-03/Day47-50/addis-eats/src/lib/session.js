import crypto from "node:crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE, SESSION_SECRET } from "./auth-config";
import { deleteSessionRecord, findUserById } from "./db";

const signPayload = (payload) => {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
};

const readPayload = (token) => {
  if (!token || typeof token !== "string") return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(encoded).digest("base64url");
  if (expected.length !== signature.length) return null;

  try {
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload?.userId || !payload?.expiresAt) return null;
    if (Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
};

// ONE helper, used the same way by pages, server actions and route handlers:
//   const user = await getSession();   // null when signed out
export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const payload = readPayload(token);
  if (!payload) return null;

  const user = await findUserById(payload.userId);
  return user
    ? { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role }
    : null;
}

export async function startSession(userId) {
  const payload = {
    userId,
    expiresAt: Date.now() + SESSION_MAX_AGE * 1000,
  };

  (await cookies()).set(SESSION_COOKIE, signPayload(payload), {
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
