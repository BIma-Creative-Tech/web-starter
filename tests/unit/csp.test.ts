import { describe, expect, it } from "vitest";
import { buildCsp, generateNonce } from "@/lib/csp";

describe("CSP", () => {
  it("nonce acak, base64, ≥128 bit", () => {
    const a = generateNonce();
    const b = generateNonce();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[A-Za-z0-9+/]{22}==$/);
  });

  it("directive persis sesuai kebijakan yang disetujui (production)", () => {
    const n = generateNonce();
    expect(buildCsp(n, false)).toBe(
      [
        "default-src 'self'",
        `script-src 'self' 'nonce-${n}' 'strict-dynamic'`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
      ].join("; "),
    );
  });

  it("script-src tanpa unsafe-inline/unsafe-eval di production; style-src tanpa nonce", () => {
    const csp = buildCsp(generateNonce(), false);
    const script = csp.split("; ").find((d) => d.startsWith("script-src"))!;
    const style = csp.split("; ").find((d) => d.startsWith("style-src"))!;
    expect(script).not.toContain("unsafe-inline");
    expect(csp).not.toContain("unsafe-eval");
    // nonce di style-src akan membuat browser mengabaikan 'unsafe-inline' (CSP3)
    expect(style).not.toContain("nonce-");
  });

  it("unsafe-eval hanya di mode dev", () => {
    expect(buildCsp(generateNonce(), true)).toContain("'unsafe-eval'");
  });

  it("menolak nonce yang bisa menyuntik directive", () => {
    expect(() => buildCsp("abc'; script-src *", false)).toThrow();
    expect(() => buildCsp("short", false)).toThrow();
  });
});
