/**
 * Proteksi CSRF untuk Route Handler POST (CLAUDE.md §3.6; tidak ada Server Action di template ini).
 * Browser modern selalu mengirim header Origin pada POST. Diterima hanya bila Origin sama dengan
 * origin SITE_URL atau dengan host request itu sendiri (X-Forwarded-Host dari Traefik / Host).
 * Origin tidak ada → ditolak (fail-closed).
 */
export function isSameOriginRequest(headers: Headers, siteUrl: string): boolean {
  const origin = headers.get("origin");
  if (!origin || origin === "null") return false;
  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }
  try {
    if (originUrl.origin === new URL(siteUrl).origin) return true;
  } catch {
    // SITE_URL divalidasi saat boot; abaikan.
  }
  const host = (headers.get("x-forwarded-host") ?? headers.get("host") ?? "").split(",")[0]?.trim().toLowerCase();
  return !!host && originUrl.host.toLowerCase() === host;
}

/** Tipe body yang diterima /api/contact. text/plain & tipe lain ditolak (415). */
export type BodyKind = "json" | "multipart";

export function bodyKind(headers: Headers): BodyKind | null {
  const ct = (headers.get("content-type") ?? "").toLowerCase();
  if (ct.startsWith("application/json")) return "json";
  if (ct.startsWith("multipart/form-data")) return "multipart";
  return null;
}
