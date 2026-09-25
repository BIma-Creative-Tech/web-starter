import { createRateLimiter } from "@/lib/rate-limit";

/** Singleton per proses (1 container = 1 proses). Nilai konservatif untuk form kontak. */
export const perIpLimiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000, maxKeys: 5_000 });
/** Batas global — melindungi kuota SMTP bila ada serangan dari banyak IP. */
export const globalLimiter = createRateLimiter({ limit: 100, windowMs: 60 * 60_000, maxKeys: 1 });
