import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// SITE_URL dibaca saat request (bukan saat build) → satu image untuk semua domain.
export const dynamic = "force-dynamic";

const ROUTES = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return ROUTES.map((r) => ({
    url: `${base}${r.path === "/" ? "" : r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
