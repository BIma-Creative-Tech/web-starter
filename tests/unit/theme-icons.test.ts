import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ICON_NAMES, ICON_STYLES } from "@/components/icon-names";
import { brandCssVariables, parseThemePref } from "@/lib/theme";

describe("brandCssVariables", () => {
  const tokens = { background: "#FFFFFF", primaryForeground: "#000" } as never;
  it("memetakan token ke CSS variables per mode", () => {
    const vars = brandCssVariables({ light: tokens, dark: tokens }, "1rem");
    expect(vars["--radius"]).toBe("1rem");
    expect(vars["--brand-light-primary-foreground"]).toBe("#000");
    expect(vars["--brand-dark-background"]).toBe("#FFFFFF");
  });
  it("menolak nilai yang bisa menyuntik CSS", () => {
    const bad = { background: "red; } body { display:none" } as never;
    expect(() => brandCssVariables({ light: bad, dark: bad }, "1rem")).toThrow();
    expect(() => brandCssVariables({ light: tokens, dark: tokens }, "1rem;x")).toThrow();
  });
  it("parseThemePref", () => {
    expect(parseThemePref("dark")).toBe("dark");
    expect(parseThemePref("evil")).toBe("system");
    expect(parseThemePref(undefined)).toBe("system");
  });
});

describe("ICON_NAMES / subset iconsax", () => {
  it("semua ikon ada di set GRATIS iconsax (manifest paket)", () => {
    const manifest = JSON.parse(readFileSync("node_modules/iconsax/dist/manifest.json", "utf8")) as Record<string, unknown>;
    const missing = ICON_NAMES.filter((n) => !(n in manifest));
    expect(missing).toEqual([]);
  });

  it("src/generated/iconsax-icons.json sinkron dengan ICON_NAMES × ICON_STYLES (jalankan `npm run icons`)", () => {
    const subset = JSON.parse(readFileSync("src/generated/iconsax-icons.json", "utf8")) as Record<string, Record<string, string>>;
    expect(Object.keys(subset).sort()).toEqual([...ICON_NAMES].sort());
    for (const name of ICON_NAMES) {
      expect(Object.keys(subset[name] ?? {}).sort()).toEqual([...ICON_STYLES].sort());
      for (const style of ICON_STYLES) expect(subset[name]?.[style]).toMatch(/^<svg[\s>]/);
    }
  });
});
