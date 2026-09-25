import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { brand, fontBody, fontHeading } from "@/config/brand";
import { IconsaxLoader } from "@/components/iconsax-loader";
import { ScrollEnhancer } from "@/components/scroll-enhancer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getEnv } from "@/lib/env";
import { isIndexable } from "@/lib/site";
import { brandCssVariables, parseThemePref, THEME_COOKIE } from "@/lib/theme";
import { cn } from "@/lib/utils";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { SITE_URL } = getEnv();
  const indexable = isIndexable(SITE_URL);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: brand.seo.title, template: `%s | ${brand.name}` },
    description: brand.seo.description,
    keywords: [...brand.seo.keywords],
    applicationName: brand.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: brand.name,
      locale: brand.ogLocale,
      title: brand.seo.title,
      description: brand.seo.description,
      url: "/",
    },
    twitter: { card: "summary_large_image", title: brand.seo.title, description: brand.seo.description },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: brand.colors.light.background },
    { media: "(prefers-color-scheme: dark)", color: brand.colors.dark.background },
  ],
};

const cssVars = brandCssVariables(brand.colors, brand.radius);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Render dinamis per request agar nonce CSP bisa diterapkan (docs CSP §Forcing dynamic rendering).
  await connection();
  const theme = parseThemePref((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <html
      lang={brand.lang}
      data-theme={theme === "system" ? undefined : theme}
      className={cn(fontHeading.variable, fontBody.variable)}
      style={cssVars as React.CSSProperties}
      suppressHydrationWarning
    >
      <body data-style={brand.stylePreset} className="min-h-dvh">
        <a
          href="#konten"
          className="sr-only z-100 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Lewati ke konten utama
        </a>
        <SiteHeader theme={theme} />
        <main id="konten">{children}</main>
        <SiteFooter />
        {/* Pulau client tanpa UI: ikon & animasi scroll, keduanya mulai saat idle. */}
        <IconsaxLoader />
        <ScrollEnhancer />
      </body>
    </html>
  );
}
