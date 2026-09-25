import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";

// Favicon dari brand config (PNG, dibuat saat build).
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  const c = brand.colors.light;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 16,
          background: `linear-gradient(135deg, ${c.primary}, ${c.accent})`,
          color: c.primaryForeground,
          fontSize: 40,
          fontWeight: 700,
        }}
      >
        {brand.shortName.charAt(0)}
      </div>
    ),
    size,
  );
}
