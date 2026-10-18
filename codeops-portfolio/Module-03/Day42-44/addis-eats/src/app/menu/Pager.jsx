import Link from "next/link";
import styles from "./menu.module.css";

// Previous / next links. Plain links, no directive: the server renders it with the first page
// (so it works without JavaScript and crawlers can reach page 2), and the client reuses it.
export default function Pager({ page, totalPages, query = {} }) {
  if (totalPages <= 1) return null;

  const href = (n) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) if (value) params.set(key, value);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `/menu?${qs}` : "/menu";
  };

  return (
    <nav className={styles.pager} aria-label="Pages">
      {page > 1 ? (
        <Link href={href(page - 1)} className={styles.pagerLink}>← Previous</Link>
      ) : (
        <span className={styles.pagerOff}>← Previous</span>
      )}
      <span>Page {page} of {totalPages}</span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className={styles.pagerLink}>Next →</Link>
      ) : (
        <span className={styles.pagerOff}>Next →</span>
      )}
    </nav>
  );
}
