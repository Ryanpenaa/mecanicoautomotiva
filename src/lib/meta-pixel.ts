type MetaEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    fbq?: (
      action: "track" | "trackCustom",
      eventName: string,
      params?: MetaEventParams,
    ) => void;
  }
}

const CURRENCY = "BRL";
const PRODUCT_NAME = "Formação Mecânico Automotivo";

type PlanId = "basico" | "upsell_profissional" | "profissional";

const PLAN_NAMES: Record<PlanId, string> = {
  basico: "Plano Básico",
  upsell_profissional: "Plano Profissional - Oferta Especial",
  profissional: "Plano Profissional",
};

function sendMetaEvent(
  action: "track" | "trackCustom",
  eventName: string,
  params: MetaEventParams,
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq(action, eventName, params);
}

export function trackViewPlans(position: "hero" | "cta_final") {
  sendMetaEvent("trackCustom", "view_plans", {
    content_name: PRODUCT_NAME,
    cta_position: position,
  });
}

export function trackSelectPlan(plan: PlanId, value: number, position: string) {
  sendMetaEvent("trackCustom", "select_plan", {
    content_name: PLAN_NAMES[plan],
    content_type: "product",
    content_ids: plan,
    value,
    currency: CURRENCY,
    cta_position: position,
  });
}

export function trackUpsellView() {
  sendMetaEvent("track", "ViewContent", {
    content_name: PLAN_NAMES.upsell_profissional,
    content_type: "product",
    content_ids: "upsell_profissional",
    value: 18.9,
    currency: CURRENCY,
  });
}

export function trackInitiateCheckout(plan: PlanId, value: number) {
  sendMetaEvent("track", "InitiateCheckout", {
    content_name: PLAN_NAMES[plan],
    content_type: "product",
    content_ids: plan,
    num_items: 1,
    value,
    currency: CURRENCY,
  });
}
