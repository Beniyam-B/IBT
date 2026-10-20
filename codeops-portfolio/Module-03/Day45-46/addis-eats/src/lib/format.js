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
