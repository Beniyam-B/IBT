import { LoadingRegion, SkeletonBox } from "@/components/Skeleton";

// The single-order screen has its own skeleton, so the table skeleton of /orders does not
// appear while one order loads.
export default function Loading() {
  return (
    <main>
      <LoadingRegion label="Loading your order">
        <div style={{ display: "grid", gap: "1rem" }}>
          <SkeletonBox height={34} width="12rem" />
          <SkeletonBox height={180} />
        </div>
      </LoadingRegion>
    </main>
  );
}
