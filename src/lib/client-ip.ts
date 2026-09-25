/**
 * IP klien untuk rate limit. Di belakang Traefik (satu-satunya ingress, CLAUDE.md §3.5),
 * Traefik menimpa X-Forwarded-For dari klien tak tepercaya dan menambahkan IP peer-nya;
 * entri PALING KANAN adalah yang ditambahkan proxy terdekat → itu yang dipakai (entri kiri
 * bisa dipalsukan klien bila ada proxy lain yang meneruskan header apa adanya).
 */
const IP_RE = /^[0-9a-fA-F:.]{2,45}$/;

export function clientIpFrom(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((p) => p.trim()).filter(Boolean);
    const last = parts.at(-1);
    if (last && IP_RE.test(last)) return last;
  }
  const real = headers.get("x-real-ip")?.trim();
  if (real && IP_RE.test(real)) return real;
  return "unknown";
}
