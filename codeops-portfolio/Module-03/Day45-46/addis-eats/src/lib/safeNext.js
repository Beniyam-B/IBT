// The "next" parameter says where to send someone after they sign in. It comes from the URL,
// so anyone can craft it. Only same-site paths are allowed: it must start with ONE slash.
// Rejected: https://evil.com, //evil.com (protocol-relative), /\evil.com (browsers read the
// backslash as a slash), and anything that is not a string.
export function safeNext(value, fallback = "/menu") {
  if (typeof value !== "string" || value.length === 0) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
