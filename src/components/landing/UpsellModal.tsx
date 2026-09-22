import { useEffect, useState } from "react";
import { Check, ShieldCheck, Sparkles, X } from "lucide-react";
import { CHECKOUT, PLANOS, UPSELL } from "@/config/oferta";
import {
  trackInitiateCheckout,
  trackSelectPlan,
  trackUpsellView,
} from "@/lib/meta-pixel";
import { buildVegaCheckoutUrl } from "@/lib/tracking";

const VANTAGENS = [
  "80+ aulas em vídeo",
  "Certificado profissionalizante",
  "Acesso vitalício",
  "Materiais de apoio e guias",
  "10 bônus exclusivos",
];

type UpsellModalProps = {
  open: boolean;
  onAccept: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  onDecline: (event: React.MouseEvent) => void;
  onClose: () => void;
};

export function UpsellModal({
  open,
  onAccept,
  onDecline,
  onClose,
}: UpsellModalProps) {
  useEffect(() => {
    if (!open) return;

    trackUpsellView();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md animate-[upsell-in_0.25s_ease-out] overflow-hidden rounded-t-3xl border border-primary/40 bg-card shadow-2xl sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted-foreground transition hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="gradient-accent px-6 py-3 text-center">
          <span className="text-xs font-extrabold tracking-[0.2em] text-accent-foreground uppercase">
            {UPSELL.badge}
          </span>
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">
          <h3 className="text-center text-2xl font-extrabold text-balance uppercase">
            {UPSELL.headline}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-center text-sm text-muted-foreground">
            {UPSELL.subheadline}
          </p>

          <div className="mt-5 rounded-2xl border border-primary/40 bg-surface-2 p-5">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-base font-bold text-primary uppercase">
                {PLANOS.profissional.titulo}
              </span>
            </div>
            <div className="mt-4 flex items-end justify-center gap-3">
              <span className="text-lg text-muted-foreground line-through">
                {UPSELL.precoOriginal}
              </span>
              <span className="font-display text-5xl font-extrabold text-primary">
                {UPSELL.precoOferta}
              </span>
            </div>
            <p className="mt-1 text-center text-xs font-semibold tracking-wide text-accent uppercase">
              Economize {UPSELL.economia}
            </p>
            <ul className="mx-auto mt-4 grid max-w-xs gap-2">
              {VANTAGENS.map((vantagem) => (
                <li key={vantagem} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {vantagem}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-center text-xs font-medium text-foreground">
              {UPSELL.vantagem}
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            <a
              href={CHECKOUT.UPSELL_PRO_CHECKOUT_URL}
              onClick={onAccept}
              className="gradient-primary glow-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-center text-base font-extrabold tracking-wide text-primary-foreground uppercase transition-transform duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              {UPSELL.ctaAceitar}
            </a>
            <button
              onClick={onDecline}
              className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-surface-2 px-6 py-3.5 text-center text-sm font-semibold tracking-wide text-muted-foreground uppercase transition hover:text-foreground"
            >
              {UPSELL.ctaRecusar}
            </button>
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Garantia de 7 dias • Acesso imediato • Compra segura
          </p>
        </div>
      </div>
    </div>
  );
}

/** Gerencia a oferta exibida ao selecionar o Plano Básico. */
export function useUpsell() {
  const [open, setOpen] = useState(false);

  return {
    open,
    trigger: (event: React.MouseEvent) => {
      if (!UPSELL.ativo) {
        event.preventDefault();
        trackInitiateCheckout("basico", 10);
        window.setTimeout(() => {
          window.location.href = buildVegaCheckoutUrl(CHECKOUT.BASIC_CHECKOUT_URL);
        }, 150);
        return;
      }
      event.preventDefault();
      setOpen(true);
    },
    close: () => setOpen(false),
    accept: (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      trackSelectPlan("upsell_profissional", 18.9, "oferta_intermediaria");
      trackInitiateCheckout("upsell_profissional", 18.9);
      setOpen(false);
      window.setTimeout(() => {
        window.location.href = buildVegaCheckoutUrl(CHECKOUT.UPSELL_PRO_CHECKOUT_URL);
      }, 150);
    },
    decline: (event: React.MouseEvent) => {
      event.preventDefault();
      trackInitiateCheckout("basico", 10);
      setOpen(false);
      window.setTimeout(() => {
        window.location.href = buildVegaCheckoutUrl(CHECKOUT.BASIC_CHECKOUT_URL);
      }, 150);
    },
  };
}
