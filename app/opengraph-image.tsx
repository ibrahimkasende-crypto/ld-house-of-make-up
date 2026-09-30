import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#241A14",
          color: "#F6F1E9",
          padding: "72px",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#C9AD7C" }}>LD HOUSE OF MAKE UP</div>
        <div style={{ fontSize: 76, lineHeight: 1.05, marginTop: 18 }}>Votre beauté.</div>
        <div style={{ fontSize: 76, lineHeight: 1.05, fontStyle: "italic", color: "#C9AD7C" }}>Votre signature.</div>
      </div>
    ),
    size,
  );
}
