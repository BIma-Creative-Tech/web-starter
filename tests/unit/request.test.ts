import { describe, expect, it } from "vitest";
import { clientIpFrom } from "@/lib/client-ip";
import { bodyKind, isSameOriginRequest } from "@/lib/request-guard";
import { isIndexable } from "@/lib/site";

const h = (init: Record<string, string>) => new Headers(init);

describe("clientIpFrom", () => {
  it("pakai entri X-Forwarded-For paling kanan (ditambahkan proxy terdekat)", () => {
    expect(clientIpFrom(h({ "x-forwarded-for": "6.6.6.6, 203.0.113.9" }))).toBe("203.0.113.9");
  });
  it("fallback x-real-ip lalu 'unknown'; nilai tak valid diabaikan", () => {
    expect(clientIpFrom(h({ "x-real-ip": "2001:db8::1" }))).toBe("2001:db8::1");
    expect(clientIpFrom(h({ "x-forwarded-for": "<script>" }))).toBe("unknown");
    expect(clientIpFrom(h({}))).toBe("unknown");
  });
});

describe("isSameOriginRequest (CSRF)", () => {
  const site = "https://www.contoh.id";
  it("Origin = SITE_URL → ok", () => {
    expect(isSameOriginRequest(h({ origin: "https://www.contoh.id" }), site)).toBe(true);
  });
  it("Origin = host request (X-Forwarded-Host) → ok", () => {
    expect(isSameOriginRequest(h({ origin: "https://contoh.id", "x-forwarded-host": "contoh.id" }), site)).toBe(true);
  });
  it("Origin lain / tidak ada / null → ditolak", () => {
    expect(isSameOriginRequest(h({ origin: "https://evil.example", host: "www.contoh.id" }), site)).toBe(false);
    expect(isSameOriginRequest(h({ host: "www.contoh.id" }), site)).toBe(false);
    expect(isSameOriginRequest(h({ origin: "null", host: "www.contoh.id" }), site)).toBe(false);
  });
});

describe("bodyKind", () => {
  it("hanya JSON & multipart; text/plain ditolak", () => {
    expect(bodyKind(h({ "content-type": "application/json; charset=utf-8" }))).toBe("json");
    expect(bodyKind(h({ "content-type": "multipart/form-data; boundary=x" }))).toBe("multipart");
    expect(bodyKind(h({ "content-type": "text/plain;charset=UTF-8" }))).toBe(null);
    expect(bodyKind(h({ "content-type": "application/x-www-form-urlencoded" }))).toBe(null);
  });
});

describe("isIndexable", () => {
  it("staging & localhost tidak diindeks", () => {
    expect(isIndexable("https://starter.staging.bimacreative.tech")).toBe(false);
    expect(isIndexable("http://localhost")).toBe(false);
    expect(isIndexable("https://www.contoh.id")).toBe(true);
  });
});
