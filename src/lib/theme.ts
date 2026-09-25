import type { ColorTokens } from "@/config/brand";

/** Cookie preferensi tema (fungsional, bukan pelacakan). Tidak ada = ikuti sistem. */
export const THEME_COOKIE = "theme";
export type ThemePref = "light" | "dark" | "system";

export function parseThemePref(value: string | undefined): ThemePref {
  return value === "light" || value === "dark" ? value : "system";
}

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const RADIUS = /^\d+(?:\.\d+)?(?:rem|px)$/;

/**
 * Token brand → CSS custom properties di <html style>. globals.css memetakan
 * `--brand-light-*` / `--brand-dark-*` ke token semantik (--background, --primary, …)
 * sesuai mode. Nilai divalidasi (hex/radius) agar config salah ketik gagal saat build/test.
 */
export function brandCssVariables(colors: { light: ColorTokens; dark: ColorTokens }, radius: string): Record<string, string> {
  if (!RADIUS.test(radius)) throw new Error(`radius tidak valid: ${radius}`);
  const vars: Record<string, string> = { "--radius": radius };
  for (const mode of ["light", "dark"] as const) {
    for (const [key, value] of Object.entries(colors[mode])) {
      if (!HEX.test(value)) throw new Error(`warna ${mode}.${key} harus hex: ${value}`);
      vars[`--brand-${mode}-${kebab(key)}`] = value;
    }
  }
  return vars;
}
