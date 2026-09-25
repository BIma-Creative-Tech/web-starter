import { describe, expect, it, vi } from "vitest";

// next/font hanya bekerja di compiler Next; di unit test cukup di-stub.
vi.mock("next/font/google", () => ({
  Space_Grotesk: () => ({ variable: "v1", className: "c1", style: {} }),
  DM_Sans: () => ({ variable: "v2", className: "c2", style: {} }),
}));

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

describe("brand config — kontras WCAG AA (≥ 4.5:1)", async () => {
  const { brand } = await import("@/config/brand");
  for (const mode of ["light", "dark"] as const) {
    const c = brand.colors[mode];
    const pairs: [string, string, string][] = [
      ["foreground/background", c.foreground, c.background],
      ["cardForeground/card", c.cardForeground, c.card],
      ["mutedForeground/background", c.mutedForeground, c.background],
      ["mutedForeground/card", c.mutedForeground, c.card],
      ["mutedForeground/muted", c.mutedForeground, c.muted],
      ["primaryForeground/primary", c.primaryForeground, c.primary],
      ["primary/background", c.primary, c.background],
      ["secondaryForeground/secondary", c.secondaryForeground, c.secondary],
      ["accentForeground/accent", c.accentForeground, c.accent],
      ["destructive/background", c.destructive, c.background],
    ];
    for (const [name, fg, bg] of pairs) {
      it(`${mode}: ${name}`, () => {
        expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
