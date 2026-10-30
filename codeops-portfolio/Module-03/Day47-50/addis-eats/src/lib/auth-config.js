// Shared by the proxy (middleware), the session helper and the actions.
export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // seconds: 7 days

// In production the secret MUST come from the environment. The fallback exists only so
// `npm run dev` works with no setup. It is public in the repo, so never rely on it live.
export const SESSION_SECRET = process.env.SESSION_SECRET || "dev-session-secret-change-me";

if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  console.warn("[auth] SESSION_SECRET is not set: sessions are signed with a public default.");
}