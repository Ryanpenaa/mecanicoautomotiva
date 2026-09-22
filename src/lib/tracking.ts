export type TrackingSession = {
  tracking_id: string;
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

function readStoredSession(): TrackingSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TrackingSession;
  } catch {
    return null;
  }
}

function writeStoredSession(session: TrackingSession) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Tracking must never block checkout/navigation if storage is unavailable.
  }
}

export function initializeTracking(): TrackingSession | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const incomingFbclid = getQueryValue(params, "fbclid");
  const previous = readStoredSession();

  // A new Meta click in the same tab starts a new attribution session.
  const isNewAdClick =
    Boolean(incomingFbclid) &&
    Boolean(previous?.fbclid) &&
    incomingFbclid !== previous?.fbclid;

  const base = isNewAdClick ? null : previous;
  const now = Date.now();

  const session: TrackingSession = {
    tracking_id: base?.tracking_id ?? createTrackingId(),
    landing_ts: base?.landing_ts ?? now,
    fbclid: incomingFbclid ?? base?.fbclid ?? null,
    fbp: readCookie("_fbp") ?? base?.fbp ?? null,
    fbc: readCookie("_fbc") ?? base?.fbc ?? null,
    utm_source:
      getQueryValue(params, "utm_source") ?? base?.utm_source ?? null,
    utm_medium:
      getQueryValue(params, "utm_medium") ?? base?.utm_medium ?? null,
    utm_campaign:
      getQueryValue(params, "utm_campaign") ?? base?.utm_campaign ?? null,
    utm_content:
      getQueryValue(params, "utm_content") ?? base?.utm_content ?? null,
    utm_term: getQueryValue(params, "utm_term") ?? base?.utm_term ?? null,
    user_agent: window.navigator.userAgent,
    landing_url: base?.landing_url ?? window.location.href,
    referrer: base?.referrer ?? (document.referrer || null),
  };

  writeStoredSession(session);
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
