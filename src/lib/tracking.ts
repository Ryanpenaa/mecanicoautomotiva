export type TrackingSession = {
  tracking_id: string;
  visitor_id?: string;
  landing_ts: number;
  fbclid: string | null;
  fbp: string | null;
  fbc: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  user_agent: string;
  landing_url: string;
  referrer: string | null;
};

const STORAGE_KEY = "mm_tracking_session";
const TRACKING_ENDPOINT = "https://xahydzcmpikbioeyvwst.supabase.co/functions/v1/tracking-start";
const TRACKING_EVENT_ENDPOINT = "https://xahydzcmpikbioeyvwst.supabase.co/functions/v1/tracking-event";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${name}=`;
  const item = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(prefix));

  if (!item) return null;

  try {
    return decodeURIComponent(item.slice(prefix.length));
  } catch {
    return item.slice(prefix.length);
  }
}

function randomPart() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  }

  return Math.random().toString(36).slice(2, 18);
}

function createTrackingId() {
  return `trk_${Date.now().toString(36)}_${randomPart()}`;
}

function getQueryValue(params: URLSearchParams, key: string) {
  const value = params.get(key);
  return value && value.trim() ? value.trim() : null;
}

const ATTRIBUTION_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const VISITOR_STORAGE_KEY = STORAGE_KEY + "_visitor";

function readStoredSession(): TrackingSession | null {
  if (typeof window === "undefined") return null;
  try {
    // Migrate pre-existing tab-only sessions without losing their UTMs.
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as TrackingSession;
    if (
      !/^trk_[a-z0-9_]+$/i.test(session.tracking_id ?? "") ||
      !Number.isFinite(session.landing_ts) ||
      session.landing_ts > Date.now() + 600000 ||
      Date.now() - session.landing_ts > ATTRIBUTION_WINDOW_MS
    ) {
      return null;
    }
    window.localStorage.setItem(STORAGE_KEY, raw);
    return session;
  } catch {
    return null;
  }
}

function readVisitorId(previous: TrackingSession | null): string {
  try {
    const raw = window.localStorage.getItem(VISITOR_STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as { id?: string; issued_at?: number };
      if (
        /^vis_[a-z0-9_]+$/i.test(stored.id ?? "") &&
        Number.isFinite(stored.issued_at) &&
        stored.issued_at! <= Date.now() + 600000 &&
        Date.now() - stored.issued_at! <= ATTRIBUTION_WINDOW_MS
      ) {
        return stored.id!;
      }
    }
  } catch {
    // Legacy storage or restricted browsing: fall back to a known visit.
  }
  const previousId = previous?.visitor_id;
  const id = previousId && /^vis_[a-z0-9_]+$/i.test(previousId)
    ? previousId
    : "vis_" + randomPart() + "_" + randomPart();
  try {
    window.localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify({
      id,
      issued_at: previousId === id ? previous!.landing_ts : Date.now(),
    }));
  } catch {
    // Do not block checkout.
  }
  return id;
}

function writeStoredSession(session: TrackingSession) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Attribution should never block checkout.
    }
  }
}

export function initializeTracking(): TrackingSession | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const incomingFbclid = getQueryValue(params, "fbclid");
  const previous = readStoredSession();
  const visitorId = readVisitorId(previous);
  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ] as const;
  const isChangedCampaign = utmKeys.some((key) => {
    const incoming = getQueryValue(params, key);
    return incoming !== null && incoming !== previous?.[key];
  });
  const isNewAdClick =
    Boolean(incomingFbclid) && incomingFbclid !== previous?.fbclid;
  // New campaign: separate touch. Direct return: restore last touch.
  const base = isNewAdClick || isChangedCampaign ? null : previous;
  const now = Date.now();
  const fbclid = incomingFbclid ?? base?.fbclid ?? null;
  const pixelFbc = readCookie("_fbc");
  const fbcForClick =
    pixelFbc && fbclid && pixelFbc.endsWith("." + fbclid)
      ? pixelFbc
      : fbclid && /^[A-Za-z0-9._-]{8,2048}$/.test(fbclid)
        ? "fb.1." + (base?.landing_ts ?? now) + "." + fbclid
        : base?.fbc ?? null;

  const session: TrackingSession = {
    tracking_id: base?.tracking_id ?? createTrackingId(),
    visitor_id: visitorId,
    landing_ts: base?.landing_ts ?? now,
    fbclid,
    fbp: readCookie("_fbp") ?? base?.fbp ?? null,
    fbc: fbcForClick,
    utm_source: getQueryValue(params, "utm_source") ?? base?.utm_source ?? null,
    utm_medium: getQueryValue(params, "utm_medium") ?? base?.utm_medium ?? null,
    utm_campaign: getQueryValue(params, "utm_campaign") ?? base?.utm_campaign ?? null,
    utm_content: getQueryValue(params, "utm_content") ?? base?.utm_content ?? null,
    utm_term: getQueryValue(params, "utm_term") ?? base?.utm_term ?? null,
    user_agent: window.navigator.userAgent,
    landing_url: base?.landing_url ?? window.location.href,
    referrer: base?.referrer ?? (document.referrer || null),
  };
  writeStoredSession(session);
  return session;
}

export function persistTrackingSession(
  session: TrackingSession,
  options: { keepalive?: boolean } = {},
) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify(session);

  // On checkout navigation, Beacon is the most reliable non-blocking delivery.
  if (
    options.keepalive &&
    typeof navigator.sendBeacon === "function"
  ) {
    try {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(TRACKING_ENDPOINT, blob)) return;
    } catch {
      // Fall through to fetch.
    }
  }

  void fetch(TRACKING_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    credentials: "same-origin",
    keepalive: options.keepalive ?? false,
  }).catch(() => {
    // A tracking failure must never affect page rendering or checkout.
  });
}

export function captureAndPersistTracking(
  options: { keepalive?: boolean } = {},
): TrackingSession | null {
  const session = initializeTracking();
  if (session) persistTrackingSession(session, options);
  return session;
}

export function refreshTrackingSession(): TrackingSession | null {
  return initializeTracking();
}

export function getTrackingSession(): TrackingSession | null {
  if (typeof window === "undefined") return null;
  return refreshTrackingSession();
}

export function buildVegaCheckoutUrl(baseUrl: string): string {
  if (typeof window === "undefined") return baseUrl;

  const session = getTrackingSession();
  if (!session) return baseUrl;

  // Persist the freshest Meta cookies before leaving the landing page.
  persistTrackingSession(session, { keepalive: true });

  const checkoutUrl = new URL(baseUrl);

  checkoutUrl.searchParams.set("click_id", session.tracking_id);

  if (session.fbclid) {
    checkoutUrl.searchParams.set("fbclid", session.fbclid);
  }

  const utms = {
    utm_source: session.utm_source,
    utm_medium: session.utm_medium,
    utm_campaign: session.utm_campaign,
    utm_content: session.utm_content,
    utm_term: session.utm_term,
  };

  Object.entries(utms).forEach(([key, value]) => {
    if (value) checkoutUrl.searchParams.set(key, value);
  });

  return checkoutUrl.toString();
}


export type FunnelEventName =
  | "engaged_15s"
  | "scroll_50"
  | "scroll_75"
  | "view_plans"
  | "select_plan"
  | "checkout_click"
  | "video_start"
  | "video_25"
  | "video_50"
  | "video_75"
  | "video_complete";

export function trackFunnelEvent(
  eventName: FunnelEventName,
  eventKey = "",
  metadata: Record<string, string | number | boolean | null> = {},
  options: { keepalive?: boolean } = {},
) {
  if (typeof window === "undefined") return;

  const session = getTrackingSession();
  if (!session) return;

  const body = JSON.stringify({
    tracking_id: session.tracking_id,
    event_name: eventName,
    event_key: eventKey,
    metadata,
  });

  void fetch(TRACKING_EVENT_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: options.keepalive ?? false,
  }).catch(() => {
    // Behavioral analytics must never interfere with the storefront.
  });
}

export function startBehaviorTracking() {
  if (typeof window === "undefined") return () => {};

  let activeSeconds = 0;
  let plansObserver: IntersectionObserver | null = null;
  let plansRetryTimer: number | null = null;

  const activeTimer = window.setInterval(() => {
    if (document.visibilityState !== "visible") return;
    activeSeconds += 1;
    if (activeSeconds === 15) {
      trackFunnelEvent("engaged_15s");
    }
  }, 1000);

  const sentScroll = new Set<number>();
  const onScroll = () => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const percent = Math.round((window.scrollY / maxScroll) * 100);
    for (const depth of [50, 75]) {
      if (percent >= depth && !sentScroll.has(depth)) {
        sentScroll.add(depth);
        trackFunnelEvent(depth === 50 ? "scroll_50" : "scroll_75");
      }
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const observePlans = () => {
    const plans = document.getElementById("planos");
    if (!plans) {
      plansRetryTimer = window.setTimeout(observePlans, 1000);
      return;
    }

    if (!("IntersectionObserver" in window)) return;

    plansObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackFunnelEvent("view_plans", "section");
          plansObserver?.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    plansObserver.observe(plans);
  };

  observePlans();

  return () => {
    window.clearInterval(activeTimer);
    window.removeEventListener("scroll", onScroll);
    plansObserver?.disconnect();
    if (plansRetryTimer !== null) window.clearTimeout(plansRetryTimer);
  };
}
