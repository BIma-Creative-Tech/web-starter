import Link from "next/link";
import { brand } from "@/config/brand";
import { nav } from "@/config/content";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 font-heading text-lg font-semibold">
            <BrandMark />
            <span>{brand.name}</span>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">{brand.tagline}</p>
        </div>
        <nav aria-label="Navigasi footer">
          <h2 className="mb-3 text-sm font-semibold">Menu</h2>
          <ul className="space-y-1 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center text-muted-foreground hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Kontak</h2>
          <address className="space-y-2 text-sm not-italic text-muted-foreground">
            <p>
              <a href={`mailto:${brand.contact.email}`} className="inline-flex min-h-11 items-center hover:text-foreground">
                {brand.contact.email}
              </a>
            </p>
            <p>{brand.contact.phone}</p>
            <p>{brand.contact.address}</p>
          </address>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground sm:px-6">
          © {year} {brand.name}. Hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
