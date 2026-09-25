import { brand } from "@/config/brand";
import { clientIpFrom } from "@/lib/client-ip";
import { globalLimiter, perIpLimiter } from "@/lib/contact-limiter";
import { parseContactInput } from "@/lib/contact-schema";
import { getEnv } from "@/lib/env";
import { sendContactMail } from "@/lib/mailer";
import { bodyKind, isSameOriginRequest } from "@/lib/request-guard";

/**
 * POST /api/contact — satu-satunya endpoint mutasi di template (TIDAK memakai Server Action:
 * CrowdSec AppSec CRS 920420 memblokir POST text/plain; Traefik me-rate-limit /contact & /api/contact).
 *
 * Body: application/json (fetch dari form ber-JS) atau multipart/form-data (fallback tanpa JS,
 * form HTML `enctype="multipart/form-data"`). Tipe lain → 415.
 * Respons: JSON bila `Accept: application/json`; selain itu redirect 303 ke /contact?status=…
 */
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

type Status = "sent" | "invalid" | "limited" | "error" | "disabled" | "forbidden" | "unsupported" | "too_large";

function respond(
  request: Request,
  httpStatus: number,
  body: { status: Status; fieldErrors?: Record<string, string> },
  extraHeaders: Record<string, string> = {},
): Response {
  const headers = { "Cache-Control": "no-store", ...extraHeaders };
  if ((request.headers.get("accept") ?? "").includes("application/json")) {
    return Response.json(body, { status: httpStatus, headers });
  }
  // Fallback tanpa JS: PRG (Post/Redirect/Get), path relatif → tidak bergantung Host header.
  return new Response(null, { status: 303, headers: { ...headers, Location: `/contact?status=${body.status}#form` } });
}

export async function POST(request: Request): Promise<Response> {
  const env = getEnv();
  if (!env.CONTACT_ENABLED) return respond(request, 404, { status: "disabled" });

  if (!isSameOriginRequest(request.headers, env.SITE_URL)) {
    return respond(request, 403, { status: "forbidden" });
  }

  const kind = bodyKind(request.headers);
  if (!kind) return respond(request, 415, { status: "unsupported" });

  const contentLength = request.headers.get("content-length");
  if (contentLength === null) return respond(request, 411, { status: "unsupported" });
  const declared = Number(contentLength);
  if (!Number.isFinite(declared) || declared < 0 || declared > MAX_BODY_BYTES) {
    return respond(request, 413, { status: "too_large" });
  }

  const ip = clientIpFrom(request.headers);
  const perIp = perIpLimiter.check(ip);
  if (!perIp.allowed) {
    return respond(request, 429, { status: "limited" }, { "Retry-After": String(perIp.retryAfterSeconds) });
  }
  const global = globalLimiter.check("global");
  if (!global.allowed) {
    return respond(request, 429, { status: "limited" }, { "Retry-After": String(global.retryAfterSeconds) });
  }

  let payload: unknown;
  try {
    if (kind === "json") {
      const text = await request.text();
      if (text.length > MAX_BODY_BYTES) return respond(request, 413, { status: "too_large" });
      payload = JSON.parse(text);
    } else {
      payload = await request.formData();
    }
  } catch {
    return respond(request, 422, { status: "invalid", fieldErrors: {} });
  }

  const parsed = parseContactInput(payload);
  if (!parsed.ok && parsed.spam) {
    // Honeypot terisi: balas "terkirim" agar bot tidak belajar, tapi tidak mengirim apa pun.
    return respond(request, 200, { status: "sent" });
  }
  if (!parsed.ok) {
    return respond(request, 422, { status: "invalid", fieldErrors: parsed.fieldErrors });
  }

  try {
    await sendContactMail(env, brand.contact.email, parsed.data);
  } catch (err) {
    // Tanpa PII: hanya nama error.
    console.error(`[contact] gagal kirim email: ${err instanceof Error ? err.name : "unknown"}`);
    return respond(request, 502, { status: "error" });
  }
  return respond(request, 200, { status: "sent" });
}
