import { ImageResponse } from "next/og";
import { getDish } from "@/lib/db";

// One tailored 1200 x 630 card per dish, drawn on the server. Nobody opens a design tool.
export const alt = "A dish on the Addis Eats menu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  const name = dish ? dish.name : "Addis Eats";
  const line = dish ? `${dish.price} ${dish.currency}` : "Ethiopian comfort food";

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
        <div style={{ display: "flex", fontSize: 36, opacity: 0.8 }}>Addis Eats</div>
        <div style={{ display: "flex", fontSize: 104, fontWeight: 700, marginTop: 20 }}>{name}</div>
        <div style={{ display: "flex", fontSize: 56, marginTop: 20 }}>{line}</div>
      </div>
    ),
    { ...size }
  );
}
