/**
 * Daftar ikon Iconsax (GRATIS) yang dipakai template. Menambah ikon: tambahkan namanya di sini
 * (cari di https://iconsax.io, hanya ikon free), lalu `npm run icons` (juga otomatis saat build)
 * → src/generated/iconsax-icons.json. Hanya ikon di daftar ini yang di-bundle (±1–2 KB/ikon/gaya).
 * Divalidasi oleh tests/unit/theme-icons.test.ts.
 */
export const ICON_NAMES = [
  "3dcube",
  "chart",
  "flash-circle",
  "home-2",
  "send-2",
  "smart-home",
  "speedometer",
  "tick-circle",
  "verify",
  "warning-2",
  "arrow-right-02",
  "moon",
  "sun",
  "sms",
  "call",
  "location",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/** Gaya ikon yang di-bundle (tiap gaya menambah ukuran subset). */
export const ICON_STYLES = ["linear", "bulk", "bold"] as const;

export type IconStyle = (typeof ICON_STYLES)[number];
