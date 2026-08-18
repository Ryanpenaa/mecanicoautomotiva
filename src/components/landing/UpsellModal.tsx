import { useState, useEffect } from "react";
import { X, Check, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { UPSELL, CHECKOUT, PLANOS } from "@/config/oferta";

const VANTAGENS = [
  "80+ aulas em vídeo",
  "Certificado profissionalizante",
  "Acesso vitalício",
  "Materiais de apoio e guias",
  "10 bônus exclusivos",
];

export function UpsellModal({
  open,
  onAccept,
  onDecline,
  onClose,
}: {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-muted-foreground transition hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Badge superior */}
        <div className="gradient-accent px-6 py-3 text-center">
          <span className="text-xs font-extrabold tracking-[0.2em] text-accent-foreground uppercase">
            {UPSELL.badge}
          </span>
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-6 py-6">
          <h3 className="text-center text-2xl font-extrabold uppercase text-balance">
            {UPSELL.headline}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-center text-sm text-muted-foreground">
            {UPSELL.subheadline}
          </p>

          {/* Card de oferta */}
          <div className="mt-5 rounded-2xl border border-primary/40 bg-surface-2 p-5">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-base font-bold uppercase text-primary">
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
            <p className="mt-1 text-center text-xs font-semibold uppercase tracking-wide text-accent">
              Economize {UPSELL.economia}
            </p>

            <ul className="mx-auto mt-4 max-w-xs grid gap-2">
              {VANTAGENS.map((v) => (
                <li key={v} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-primary" /> {v}
                </li>
              ))}
            </ul>

            <p className="mt-4 rounded-lg bg-primary/10 px-3 py-2 text-center text-xs font-medium text-foreground">
              {UPSELL.vantagem}
            </p>
          </div>

          {/* CTAs */}
          <div className="mt-5 grid gap-3">
            <a
              href={CHECKOUT.UPSELL_PRO_CHECKOUT_URL}
              onClick={onAccept}
              className="gradient-primary glow-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-center text-base font-extrabold uppercase tracking-wide text-primary-foreground transition-transform duration-200 active:scale-[0.98] hover:brightness-110"
            >
              {UPSELL.ctaAceitar}
            </a>
            <button
              onClick={onDecline}
              className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-surface-2 px-6 py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground transition hover:text-foreground"
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

/** Hook que gerencia o estado do upsell do Plano Básico. */
export function useUpsell() {
  const [open, setOpen] = useState(false);
  return {
    open,
    trigger: (e: React.MouseEvent) => {
      if (!UPSELL.ativo) return;
      e.preventDefault();
      setOpen(true);
    },
    close: () => setOpen(false),
    accept: () => setOpen(false),
    decline: (e: React.MouseEvent) => {
      e.preventDefault();
      // Fecha o modal e segue para o checkout básico
      window.location.href = CHECKOUT.BASIC_CHECKOUT_URL;
    },
  };
}
