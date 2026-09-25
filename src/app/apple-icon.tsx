import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          background: `linear-gradient(135deg, ${c.primary}, ${c.accent})`,
          color: c.primaryForeground,
          fontSize: 110,
          fontWeight: 700,
        }}
      >
        {brand.shortName.charAt(0)}
      </div>
    ),
    size,
  );
}
