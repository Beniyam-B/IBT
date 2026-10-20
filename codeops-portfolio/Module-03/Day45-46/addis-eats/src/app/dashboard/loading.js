import { LoadingRegion, SkeletonBox, SkeletonRows } from "@/components/Skeleton";

// Same shape as the loaded page: a heading, a chart box of the SAME fixed height (300), a table.
export default function Loading() {
  return (
    <main>
      <LoadingRegion label="Loading the dashboard">
        <div style={{ marginBottom: "1.5rem", display: "grid", gap: "0.5rem" }}>
          <SkeletonBox height={34} width="12rem" />
          <SkeletonBox height={18} width="16rem" />
        </div>
        <div style={{ display: "grid", gap: "1rem" }}>
          <SkeletonBox height={300} />
          <SkeletonRows count={4} height={40} />
        </div>
      </LoadingRegion>
    </main>
  );
}
