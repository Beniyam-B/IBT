const cell = (value) => {
  let s = String(value ?? "");
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(rows, columns = Object.keys(rows[0] ?? {})) {
  return [columns, ...rows.map((row) => columns.map((c) => row[c]))]
    .map((line) => line.map(cell).join(","))
    .join("\r\n");
}

export function download(text, filename) {
  const blob = new Blob(["\uFEFF", text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}