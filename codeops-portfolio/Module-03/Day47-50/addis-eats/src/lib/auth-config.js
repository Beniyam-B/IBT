// Shared by the proxy (middleware), the session helper and the actions.
export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // seconds: 7 days
export const SESSION_SECRET = process.env.SESSION_SECRET || "dev-session-secret-change-me";
