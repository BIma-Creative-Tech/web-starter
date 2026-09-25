"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { THEME_COOKIE, type ThemePref } from "@/lib/theme";

const NEXT: Record<ThemePref, ThemePref> = { system: "light", light: "dark", dark: "system" };
const LABEL: Record<ThemePref, string> = {
  system: "Tema: ikuti sistem",
  light: "Tema: terang",
  dark: "Tema: gelap",
};

/**
 * Siklus tema sistem → terang → gelap. Disimpan di cookie (dibaca server di layout → tanpa
 * kedip saat reload) dan diterapkan langsung via <html data-theme>. Tanpa inline script.
 */
export function ThemeToggle({ initial }: { initial: ThemePref }) {
  const [pref, setPref] = useState<ThemePref>(initial);

  function cycle() {
    const next = NEXT[pref];
    setPref(next);
    const root = document.documentElement;
    if (next === "system") {
      delete root.dataset.theme;
      document.cookie = `${THEME_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    } else {
      root.dataset.theme = next;
      const secure = location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `${THEME_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
    }
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className="inline-flex size-11 items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-muted"
      aria-label={`${LABEL[pref]}. Klik untuk mengganti.`}
      title={LABEL[pref]}
    >
      {pref === "dark" ? (
        <Icon name="moon" size={20} />
      ) : pref === "light" ? (
        <Icon name="sun" size={20} />
      ) : (
        <span className="relative inline-flex size-5">
          <Icon name="sun" size={20} className="absolute inset-0 [clip-path:inset(0_50%_0_0)]" />
          <Icon name="moon" size={20} className="absolute inset-0 [clip-path:inset(0_0_0_50%)]" />
        </span>
      )}
    </button>
  );
}
