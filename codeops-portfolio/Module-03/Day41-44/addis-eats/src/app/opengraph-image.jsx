import { ImageResponse } from "next/og";

// Site-wide share card. Any page without its own opengraph-image uses this one.
export const alt = "Addis Eats: Ethiopian comfort food, delivered";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ImageResponse supports a small CSS subset (flexbox, no grid) and a div with more than one
// child needs display: "flex", so every div below sets it.
export default function Image() {
  return new ImageResponse(
    (
      <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "#8f3314",
        color: "#fffaf3",
      }}
    >
        <div style={{ display: "flex", fontSize: 110, fontWeight: 700 }}>Addis Eats</div>
        <div style={{ display: "flex", fontSize: 48, marginTop: 24 }}>
          Ethiopian comfort food, delivered across Addis Ababa
        </div>
      </div>
    ),
    { ...size }
  );
}
