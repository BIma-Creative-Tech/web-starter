/**
 * ============================================================================
 *  BRAND CONFIG — SATU-SATUNYA tempat mengubah identitas website per client.
 *  (nama, warna → CSS variables, font, radius, preset gaya, kontak, SEO)
 *  Copy/teks halaman ada di src/config/content.ts.
 *  Desain default dipilih dengan skill ui-ux-pro-max — lihat docs/design.md.
 * ============================================================================
 */
import { DM_Sans, Space_Grotesk } from "next/font/google";

/**
 * Font: next/font mengunduh file font saat BUILD dan menyajikannya dari origin sendiri
 * (tanpa request ke Google saat runtime → cocok dengan CSP `font-src 'self'`).
 * Ganti font: ubah import + pemanggilan di bawah (harus literal, aturan next/font).
 * Nama `variable` JANGAN diubah (dipakai globals.css).
 */
export const fontHeading = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-brand-heading",
});
export const fontBody = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-brand-body",
});

/** Token warna semantik. Setiap pasangan teks/latar harus kontras ≥ 4.5:1 (cek docs/design.md). */
export type ColorTokens = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
};

/** Preset gaya permukaan kartu/header: "glass" = frosted glass, "solid" = kartu padat. */
export type StylePreset = "glass" | "solid";

export const brand = {
  name: "Arunika Studio",
  shortName: "Arunika",
  /** Satu kalimat untuk hero/OG image. */
  tagline: "Website modern yang cepat, aman, dan siap mendatangkan pelanggan.",
  lang: "id",
  locale: "id-ID",
  ogLocale: "id_ID",

  stylePreset: "glass" as StylePreset,
  /** Radius dasar (kartu/tombol diturunkan dari sini). */
  radius: "0.875rem",

  colors: {
    light: {
      background: "#F8FAFC",
      foreground: "#1E293B",
      card: "#FFFFFF",
      cardForeground: "#1E293B",
      primary: "#2563EB",
      primaryForeground: "#FFFFFF",
      secondary: "#E9EFF8",
      secondaryForeground: "#1E293B",
      accent: "#EA580C",
      accentForeground: "#000000",
      muted: "#E9EFF8",
      mutedForeground: "#475569",
      border: "#E2E8F0",
      input: "#CBD5E1",
      ring: "#2563EB",
      destructive: "#DC2626",
    },
    dark: {
      background: "#0B1120",
      foreground: "#E2E8F0",
      card: "#111A2E",
      cardForeground: "#E2E8F0",
      primary: "#60A5FA",
      primaryForeground: "#0B1120",
      secondary: "#1E293B",
      secondaryForeground: "#E2E8F0",
      accent: "#FB923C",
      accentForeground: "#0B1120",
      muted: "#1E293B",
      mutedForeground: "#94A3B8",
      border: "#1E293B",
      input: "#334155",
      ring: "#60A5FA",
      destructive: "#F87171",
    },
  } satisfies { light: ColorTokens; dark: ColorTokens },

  contact: {
    /** Penerima pesan form kontak & tautan mailto. */
    email: "halo@example.com",
    phone: "+62 21 0000 0000",
    /** Nomor WhatsApp format internasional tanpa + (kosongkan bila tidak ada). */
    whatsapp: "6281200000000",
    address: "Jl. Contoh No. 1, Jakarta, Indonesia",
    hours: "Senin–Jumat, 09.00–17.00 WIB",
  },

  seo: {
    title: "Arunika Studio — Website Modern untuk Bisnis Anda",
    description:
      "Kami membangun website yang cepat, aman, dan mudah dikelola untuk UMKM hingga korporasi di Indonesia.",
    keywords: ["jasa pembuatan website", "website bisnis", "desain web", "Next.js", "Indonesia"],
  },
} as const;

export type Brand = typeof brand;
