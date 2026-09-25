import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";

// Dibuat saat build (statis) dari brand config — tanpa env runtime.
export const alt = brand.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const c = brand.colors.light;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: `linear-gradient(135deg, ${c.background} 0%, ${c.muted} 100%)`,
          color: c.foreground,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${c.primary}, ${c.accent})`,
              color: c.primaryForeground,
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            {brand.shortName.charAt(0)}
          </div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{brand.name}</div>
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.15, maxWidth: 980 }}>{brand.tagline}</div>
        <div style={{ display: "flex", height: 12, width: 320, borderRadius: 6, background: `linear-gradient(90deg, ${c.primary}, ${c.accent})` }} />
      </div>
    ),
    size,
  );
}
