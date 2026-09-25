import Link from "next/link";
import { brand } from "@/config/brand";
import { nav } from "@/config/content";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import type { ThemePref } from "@/lib/theme";

export function SiteHeader({ theme }: { theme: ThemePref }) {
  return (
    <header className="sticky top-0 z-50 px-4 pt-3">
      <div className="surface mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 rounded-2xl px-3 shadow-sm sm:px-4">
        <Link href="/" className="flex min-h-11 items-center gap-2.5 rounded-lg font-heading text-lg font-semibold">
          <BrandMark />
          <span>{brand.name}</span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle initial={theme} />
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/contact">Konsultasi</Link>
          </Button>
          {/* Menu mobile tanpa JS: <details> dapat dioperasikan keyboard & pembaca layar. */}
          <details className="group relative md:hidden">
            <summary className="inline-flex size-11 list-none items-center justify-center rounded-full hover:bg-muted [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Buka menu</span>
              <span aria-hidden="true" className="flex w-5 flex-col gap-1.5">
                <span className="h-0.5 w-full rounded bg-foreground transition-transform duration-200 group-open:translate-y-2 group-open:rotate-45" />
                <span className="h-0.5 w-full rounded bg-foreground transition-opacity duration-200 group-open:opacity-0" />
                <span className="h-0.5 w-full rounded bg-foreground transition-transform duration-200 group-open:-translate-y-2 group-open:-rotate-45" />
              </span>
            </summary>
            <nav aria-label="Navigasi mobile" className="surface absolute right-0 mt-3 w-56 rounded-2xl p-2 shadow-lg">
              <ul>
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="flex min-h-11 items-center rounded-lg px-3 font-medium hover:bg-muted">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
