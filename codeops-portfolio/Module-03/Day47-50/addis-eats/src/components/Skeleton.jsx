import styles from "./Skeleton.module.css";

// Loading placeholders shaped like the real content, so the space is reserved and nothing
// jumps when the data arrives. A spinner says "something is happening"; these say what is coming.
export function SkeletonBox({ height = 40, width = "100%" }) {
  return <div className={styles.bar} style={{ height, width }} aria-hidden="true" />;
}

export function SkeletonRows({ count = 5, height = 44 }) {
  return (
    <div className={styles.stack} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBox key={i} height={height} />
      ))}
    </div>
  );
}

// Announces "Loading" to screen readers once, then the visual placeholders follow.
export function LoadingRegion({ label, children }) {
  return (
    <div role="status" aria-live="polite">
      <span className={styles.srOnly}>{label}</span>
      {children}
    </div>
  );
}
