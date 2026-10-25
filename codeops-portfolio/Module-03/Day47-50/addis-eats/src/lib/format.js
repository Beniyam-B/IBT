// One formatter for money and days, reused by chart axes, tooltips and tables (no library).
// Plain module (no directive): both server and client components import it.
const etbFormat = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
});
export const etb = (value) => etbFormat.format(Number(value) || 0);

// "2026-10-07" -> "7 Oct". Days are UTC everywhere, so the server and the browser agree.
export const dayLabel = (isoDate) =>
  new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export const dayRange = (first, last) =>
  `${dayLabel(first)} to ${new Date(`${last}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })}`;

  const whenFormat = new Intl.DateTimeFormat("en-ET", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Addis_Ababa" });
export const when = (value) => { const d = new Date(value); return Number.isNaN(d.getTime()) ? "—" : whenFormat.format(d); };

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
export function relative(value, now = Date.now()) {
  const seconds = Math.round((new Date(value).getTime() - now) / 1000);
  if (Number.isNaN(seconds)) return "—";
  for (const [unit, size] of [["day", 86400], ["hour", 3600], ["minute", 60]]) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return rtf.format(seconds, "second");
}
