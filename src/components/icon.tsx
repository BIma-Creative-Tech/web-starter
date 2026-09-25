"use client";

/**
 * Wrapper React bertipe untuk web component resmi Iconsax (`iconsax@0.1.1`, MIT).
 * Registrasi & data ikon: <IconsaxLoader> (root layout) — lihat komentar di sana.
 * Atribut `pro` = ambil SVG dari registry lokal (`registerProIcons`), BUKAN ikon berbayar:
 * isinya subset ikon GRATIS dari data paket. Jangan jalankan `npx iconsax sync`.
 * Ukuran dipesan lewat wrapper ber-dimensi tetap → tidak ada layout shift (CLS).
 */
import { useSyncExternalStore } from "react";
import { getIconsReady, getIconsReadyServer, subscribeIcons } from "@/components/iconsax-registry";
import type { IconName, IconStyle } from "@/components/icon-names";
import { cn } from "@/lib/utils";

export type { IconName, IconStyle } from "@/components/icon-names";

type IconProps = {
  name: IconName;
  type?: IconStyle;
  size?: number;
  /** Default mengikuti warna teks (currentColor). */
  color?: string;
  /** Isi bila ikon bermakna (tanpa teks pendamping); kosong = dekoratif (aria-hidden). */
  label?: string;
  className?: string;
};

export function Icon({ name, type = "linear", size = 24, color = "currentColor", label, className }: IconProps) {
  const ready = useSyncExternalStore(subscribeIcons, getIconsReady, getIconsReadyServer);
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {ready ? <iconsax-icon pro="" name={name} type={type} size={String(size)} color={color} /> : null}
    </span>
  );
}
