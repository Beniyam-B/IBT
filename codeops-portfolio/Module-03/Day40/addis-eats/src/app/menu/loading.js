import styles from "./menu.module.css";

export default function Loading() {
  return (
    <ul className={styles.dishList} aria-busy="true" aria-label="Loading menu">
      {[1, 2, 3].map((n) => (
        <li key={n} className={`${styles.dishCard} ${styles.skeleton}`}>
          <div className={styles.skeletonImage} />
          <div className={styles.cardBody}>
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine} />
          </div>
        </li>
      ))}
    </ul>
  );
}
