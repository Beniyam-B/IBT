import styles from "./table.module.css";

// Server component, real table markup: caption, scope, a row header. Used under every chart so
// the same numbers are available to anyone who cannot see (or hear) the SVG.
// `rows` are arrays of already-formatted cells; `numeric` marks the right-aligned columns.
export default function SummaryTable({ caption, head, rows, numeric = [] }) {
  return (
    <div className={styles.wrap} role="region" aria-label={caption} tabIndex={0}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            {head.map((label, i) => (
              <th key={label} scope="col" className={numeric[i] ? styles.num : undefined}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells) => (
            <tr key={cells[0]}>
              {cells.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row">{cell}</th>
                ) : (
                  <td key={i} className={numeric[i] ? styles.num : undefined}>{cell}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
