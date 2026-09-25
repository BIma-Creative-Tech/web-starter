import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  it("mengizinkan sampai limit lalu menolak dengan Retry-After", () => {
    let t = 1_000_000;
    const rl = createRateLimiter({ limit: 3, windowMs: 60_000, now: () => t });
    expect(rl.check("1.2.3.4")).toEqual({ allowed: true, remaining: 2, retryAfterSeconds: 0 });
    rl.check("1.2.3.4");
    expect(rl.check("1.2.3.4").allowed).toBe(true);
    const denied = rl.check("1.2.3.4");
    expect(denied.allowed).toBe(false);
    expect(denied.retryAfterSeconds).toBe(60);
    t += 30_000;
    expect(rl.check("1.2.3.4").retryAfterSeconds).toBe(30);
  });

  it("kunci terpisah per IP", () => {
    const rl = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(rl.check("a").allowed).toBe(true);
    expect(rl.check("b").allowed).toBe(true);
    expect(rl.check("a").allowed).toBe(false);
  });

  it("jendela di-reset setelah windowMs", () => {
    let t = 0;
    const rl = createRateLimiter({ limit: 1, windowMs: 1000, now: () => t });
    rl.check("a");
    expect(rl.check("a").allowed).toBe(false);
    t = 1000;
    expect(rl.check("a").allowed).toBe(true);
  });

  it("jumlah kunci dibatasi maxKeys (anti kehabisan memori)", () => {
    const t = 0;
    const rl = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 100, now: () => t });
    for (let i = 0; i < 1000; i++) rl.check(`ip-${i}`);
    expect(rl.size()).toBeLessThanOrEqual(100);
  });

  it("menolak opsi tidak valid", () => {
    expect(() => createRateLimiter({ limit: 0, windowMs: 1000 })).toThrow();
  });
});
