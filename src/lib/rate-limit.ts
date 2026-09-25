/**
 * Rate limiter fixed-window in-memory per kunci (IP). Cukup untuk 1 replika container per
 * website (desain plan 03); bila di-scale >1 replika, ganti dengan store bersama.
 * Memori dibatasi: entri kedaluwarsa dibersihkan, dan jumlah kunci dibatasi `maxKeys`
 * (kunci tertua dibuang) agar tidak bisa dipakai untuk menghabiskan RAM.
 */
export type RateLimitResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };

export type RateLimiterOptions = {
  limit: number;
  windowMs: number;
  maxKeys?: number;
  now?: () => number;
};

export function createRateLimiter({ limit, windowMs, maxKeys = 10_000, now = Date.now }: RateLimiterOptions) {
  if (limit < 1 || windowMs < 1) throw new Error("limit dan windowMs harus > 0");
  const hits = new Map<string, { count: number; resetAt: number }>();

  function sweep(t: number) {
    for (const [key, entry] of hits) {
      if (entry.resetAt <= t) hits.delete(key);
    }
  }

  function check(key: string): RateLimitResult {
    const t = now();
    let entry = hits.get(key);
    if (!entry || entry.resetAt <= t) {
      if (!entry && hits.size >= maxKeys) {
        sweep(t);
        // Masih penuh → buang kunci tertua (Map mempertahankan urutan penyisipan).
        while (hits.size >= maxKeys) {
          const oldest = hits.keys().next().value;
          if (oldest === undefined) break;
          hits.delete(oldest);
        }
      }
      entry = { count: 0, resetAt: t + windowMs };
      hits.delete(key);
      hits.set(key, entry);
    }
    entry.count += 1;
    const allowed = entry.count <= limit;
    return {
      allowed,
      remaining: Math.max(0, limit - entry.count),
      retryAfterSeconds: allowed ? 0 : Math.ceil((entry.resetAt - t) / 1000),
    };
  }

  return { check, size: () => hits.size, reset: () => hits.clear() };
}
