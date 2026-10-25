import { LoadingRegion, SkeletonBox, SkeletonRows } from "@/components/Skeleton";

// Shown while the orders are being fetched: a header and five rows the same height as the real
// table rows. (Also covers /orders/[id] unless that folder has its own loading.js; it does.)
export default function Loading() {
  return (
    <main>
      <LoadingRegion label="Loading your orders">
        <div style={{ marginBottom: "1.5rem", display: "grid", gap: "0.5rem" }}>
          <SkeletonBox height={34} width="14rem" />
          <SkeletonBox height={18} width="9rem" />
        </div>
        <SkeletonRows count={5} height={46} />
      </LoadingRegion>
    </main>
  );
}
