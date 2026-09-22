type RuntimeEnv = Record<string, unknown> | null | undefined;

type IncomingTrackingSession = {
  tracking_id?: unknown;
  landing_ts?: unknown;
  fbclid?: unknown;
  fbp?: unknown;
  fbc?: unknown;
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_content?: unknown;
  utm_term?: unknown;
  user_agent?: unknown;
  landing_url?: unknown;
  referrer?: unknown;
};

function readEnv(env: RuntimeEnv, key: string): string | null {
  const runtimeValue =
    env && typeof env === "object" && typeof env[key] === "string"
      ? (env[key] as string)
      : null;

  if (runtimeValue) return runtimeValue;

  try {
    const processValue =
      typeof process !== "undefined" ? process.env?.[key] : undefined;
    return processValue || null;
  } catch {
    return null;
  }
}

function asNullableString(
  value: unknown,
  maxLength: number,
): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

function asTrackingId(value: unknown): string | null {
  const trackingId = asNullableString(value, 120);
  if (!trackingId) return null;

  return /^trk_[a-z0-9_]+$/i.test(trackingId) ? trackingId : null;
}

function asLandingTimestamp(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;

  const rounded = Math.round(value);
  const now = Date.now();
  const oldestAllowed = now - 1000 * 60 * 60 * 24 * 90;
  const newestAllowed = now + 1000 * 60 * 10;

  if (rounded < oldestAllowed || rounded > newestAllowed) return null;
  return rounded;
}

function getClientIp(request: Request): string | null {
  const candidates = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
  ];

  return candidates.find(Boolean)?.slice(0, 128) ?? null;
}

function json(
  payload: Record<string, unknown>,
  status = 200,
  extraHeaders: Record<string, string> = {},
) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

export async function handleTrackingRequest(
  request: Request,
  env: RuntimeEnv,
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { "cache-control": "no-store" },
    });
  }

  if (request.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405, {
      allow: "POST, OPTIONS",
    });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 24_000) {
    return json({ ok: false, error: "payload_too_large" }, 413);
  }

  let body: IncomingTrackingSession;
  try {
    body = (await request.json()) as IncomingTrackingSession;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const trackingId = asTrackingId(body.tracking_id);
  if (!trackingId) {
    return json({ ok: false, error: "invalid_tracking_id" }, 400);
  }

  const supabaseUrl = readEnv(env, "SUPABASE_URL");
  const serviceRoleKey = readEnv(env, "SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    // This endpoint is intentionally fail-open for the storefront:
    // the browser ignores this response and checkout continues normally.
    return json({ ok: false, error: "tracking_not_configured" }, 503);
  }

  const nowIso = new Date().toISOString();
  const landingTs = asLandingTimestamp(body.landing_ts);

  const record = {
    tracking_id: trackingId,
    landing_ts: landingTs,
    fbclid: asNullableString(body.fbclid, 2048),
    fbp: asNullableString(body.fbp, 512),
    fbc: asNullableString(body.fbc, 2048),
    utm_source: asNullableString(body.utm_source, 512),
    utm_medium: asNullableString(body.utm_medium, 512),
    utm_campaign: asNullableString(body.utm_campaign, 1024),
    utm_content: asNullableString(body.utm_content, 1024),
    utm_term: asNullableString(body.utm_term, 1024),
    user_agent:
      asNullableString(body.user_agent, 1500) ??
      asNullableString(request.headers.get("user-agent"), 1500),
    landing_url: asNullableString(body.landing_url, 4000),
    referrer: asNullableString(body.referrer, 4000),
    ip_address: getClientIp(request),
    last_seen_at: nowIso,
  };

  const endpoint =
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/tracking_sessions?on_conflict=tracking_id`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        "content-type": "application/json",
        prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 500);
      console.error("tracking_sessions upsert failed", response.status, detail);
      return json({ ok: false, error: "storage_failed" }, 502);
    }

    return json({ ok: true, tracking_id: trackingId });
  } catch (error) {
    console.error("tracking_sessions request failed", error);
    return json({ ok: false, error: "storage_unavailable" }, 502);
  }
}
