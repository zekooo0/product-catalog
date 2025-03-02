import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Product Catalog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom, #1e40af, #3b82f6)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "8px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "20px",
            padding: "40px 60px",
          }}
        >
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              margin: "0 0 20px 0",
              textAlign: "center",
            }}
          >
            Product Catalog
          </h1>
          <p
            style={{
              fontSize: "32px",
              margin: "0",
              textAlign: "center",
            }}
          >
            Browse Our Complete Collection
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "24px",
            opacity: 0.8,
          }}
        >
          https://www.affiliatelist.site/
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
