import { ImageResponse } from "next/og";

// The favicon, generated. (If you already have src/app/favicon.ico you can keep both.)
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#b4441c",
          color: "#ffffff",
          fontSize: 22,
          fontWeight: 700,
          borderRadius: 6,
        }}
      >
        A
      </div>
    ),
    { ...size }
  );
}
