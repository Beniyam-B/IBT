import Link from "next/link";
import styles from "./PageLinks.module.css";

// Numbered pages as real links: every page has its own URL, so the back button, middle-click
// and a crawler all work. Server component, no JavaScript. `query` keeps the sort in the URL.
function pagesToShow(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
  const list = [...wanted].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  return list.flatMap((n, i) => (i > 0 && n - list[i - 1] > 1 ? ["gap", n] : [n]));
}

export default function PageLinks({ basePath, query = {}, page, totalPages }) {
  if (totalPages <= 1) return null;

  const href = (n) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) if (value) params.set(key, value);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav className={styles.pager} aria-label="Pages">
      {page > 1 ? <Link href={href(page - 1)} className={styles.link}>← Previous</Link> : <span className={styles.off}>← Previous</span>}
      {pagesToShow(page, totalPages).map((n, i) =>
        n === "gap" ? (
          <span key={`gap-${i}`} className={styles.gap} aria-hidden="true">…</span>
        ) : n === page ? (
          <span key={n} className={styles.current} aria-current="page">{n}</span>
        ) : (
          <Link key={n} href={href(n)} className={styles.link} aria-label={`Page ${n}`}>{n}</Link>
        )
      )}
      {page < totalPages ? <Link href={href(page + 1)} className={styles.link}>Next →</Link> : <span className={styles.off}>Next →</span>}
    </nav>
  );
}
