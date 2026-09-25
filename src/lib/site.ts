import { getEnv } from "@/lib/env";

/**
 * Situs boleh diindeks mesin pencari? Tidak untuk staging/localhost — konvensi platform:
 * staging memakai subdomain `*.staging.<domain>` (CLAUDE.md §2), jadi host yang mengandung
 * label `staging` atau localhost/IP loopback otomatis `noindex` + robots Disallow.
 */
export function isIndexable(siteUrl: string): boolean {
  let host: string;
  try {
    host = new URL(siteUrl).hostname.toLowerCase();
  } catch {
    return false;
  }
  if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]") return false;
  return !host.split(".").includes("staging");
}

export function siteUrl(): string {
  return getEnv().SITE_URL;
}
