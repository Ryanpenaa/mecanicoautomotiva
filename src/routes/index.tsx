import { createFileRoute } from "@tanstack/react-router";
import {
Accordion,
AccordionContent,
AccordionItem,
AccordionTrigger,
} from "@/components/ui/accordion";
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Section, CtaButton } from "@/components/landing/ui-bits";
import { UpsellModal, useUpsell } from "@/components/landing/UpsellModal";
import { trackInitiateCheckout, trackSelectPlan, trackViewPlans } from "@/lib/meta-pixel";
import { buildVegaCheckoutUrl, trackFunnelEvent } from "@/lib/tracking";

const BonusCarousel = lazy(() =>
import("@/components/landing/BonusCarousel").then((m) => ({ default: m.BonusCarousel })),
);
const MaterialApoio = lazy(() =>
import("@/components/landing/MaterialApoio").then((m) => ({ default: m.MaterialApoio })),
);
const ProvaSocial = lazy(() =>
import("@/components/landing/ProvaSocial").then((m) => ({ default: m.ProvaSocial })),
);
const SecaoProfissional = lazy(() =>
import("@/components/landing/SecaoProfissional").then((m) => ({ default: m.SecaoProfissional })),
);

import {
BONUS,
BENEFICIOS,
CTA_FINAL,
FAQ,
GARANTIA,
INSTRUTOR,
PLANOS,
PRODUTO,
PROFISSIONAL,
} from "@/config/oferta";

import {
BadgeCheck,
Check,
ChevronRight,
Clock,
Gauge,
Infinity as InfinityIcon,
ListChecks,
Monitor,
PlayCircle,
ShieldCheck,
Smartphone,
Sparkles,
Wrench,
X,
} from "lucide-react";

const ICONS: Record<string, typeof Wrench> = {
video: PlayCircle,
list: ListChecks,
wrench: Wrench,
infinity: InfinityIcon,
devices: Monitor,
badge: BadgeCheck,
};

const BONUS_DO_PLANO = [
"Apostila Completa de Mecânica Automotiva",
"Tabela de Torques e Especificações",
"Checklist de Revisão Preventiva",
"Guia de Diagnóstico de Defeitos",
"Manual de Ferramentas do Mecânico",
"Guia de Preços de Serviços",
"Manual de Códigos de Erro OBD2",
"Guia de Injeção Eletrônica",
"Manual de Freios e Suspensão",
"Guia para Conseguir os Primeiros Clientes"
];

const TITLE = "Formação Mecânico Automotivo — Curso Online do Zero";
const DESC =
"Aprenda mecânica automotiva do zero com mais de 80 aulas em vídeo, acesso vitalício e certificado no Plano Profissional. A partir de R$10,00.";

export const Route = createFileRoute("/")({
head: () => ({
meta: [
{ title: TITLE },
{ name: "description", content: DESC },
{ property: "og:title", content: TITLE },
{ property: "og:description", content: DESC },
{ property: "og:type", content: "website" },
{ name: "twitter:card", content: "summary_large_image" },
],
links: [
{ rel: "preload", as: "image", href: "/mockup-mecanico.png", fetchPriority: "high" },
],
}),
component: Index,
});

const URGENCY_STORAGE_KEY = "mecanico_offer_deadline";
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

function UrgencyBanner() {
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60);

  useEffect(() => {
    const now = Date.now();
    let deadline = Number(window.sessionStorage.getItem(URGENCY_STORAGE_KEY));

    if (!Number.isFinite(deadline) || deadline <= 0) {
      deadline = now + FIFTEEN_MINUTES_MS;
      window.sessionStorage.setItem(URGENCY_STORAGE_KEY, String(deadline));
    }

    const update = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemainingSeconds(remaining);
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div className="border-b border-yellow-500 bg-yellow-300 px-3 py-2.5 text-center text-red-700">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 text-sm font-extrabold sm:text-base">
        <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>SÓ HOJE • CONDIÇÃO ESPECIAL</span>
        <span className="rounded-md bg-yellow-200 px-2 py-0.5 font-mono font-extrabold tabular-nums text-red-700">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

function DeferredContent({ children, placeholderHeight = 280 }: { children: ReactNode; placeholderHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: "300px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} style={!visible ? { minHeight: placeholderHeight } : undefined}>{visible ? children : null}</div>;
}

function Index() {
const upsell = useUpsell();
const videoEventsRef = useRef(new Set<string>());
const [videoReady, setVideoReady] = useState(false);

// Prioritize first paint: the hero video only starts downloading after the
// page has fully loaded (or 2.5s, whichever comes first). A lightweight
// poster frame keeps the player visually complete meanwhile.
useEffect(() => {
  let timer: number | undefined;
  const enable = () => {
    timer = window.setTimeout(() => setVideoReady(true), 1500);
  };
  if (document.readyState === "complete") {
    enable();
  } else {
    window.addEventListener("load", enable, { once: true });
    timer = window.setTimeout(() => setVideoReady(true), 2500);
  }
  return () => {
    window.removeEventListener("load", enable);
    if (timer) window.clearTimeout(timer);
  };
}, []);

const trackVideoEvent = (
  eventName: "video_start" | "video_25" | "video_50" | "video_75" | "video_complete",
  currentTime: number,
  duration: number,
) => {
  if (videoEventsRef.current.has(eventName)) return;
  videoEventsRef.current.add(eventName);
  trackFunnelEvent(eventName, "platform_demo", {
    current_time: Math.round(currentTime * 10) / 10,
    duration: Number.isFinite(duration) ? Math.round(duration * 10) / 10 : null,
  });
};

return (
<main className="min-h-screen bg-background">
<UrgencyBanner />
{/* 1 — HERO */}
<header className="hero-bg relative overflow-hidden">
<div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:py-14 lg:grid-cols-2 lg:items-center">
<div>
<span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
<Gauge className="h-3.5 w-3.5" /> Formação profissionalizante online
</span>
<h1 className="mt-5 text-center text-4xl leading-[1.05] font-extrabold text-balance uppercase sm:text-5xl lg:text-6xl">
{PRODUTO.headline}
</h1>
</div>

      <div className="relative flex justify-center items-center">
        <img src="/mockup-mecanico.png" alt="Formação Mecânico Automotivo 2.0: plataforma, aulas, materiais e certificado" width={1100} height={1100} fetchPriority="high" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/peronsa 1.png"; }} className="w-full max-w-[500px] rounded-2xl object-contain shadow-xl" />
      </div>

      <div className="text-center lg:col-span-2">
        <p className="mx-auto max-w-3xl text-base text-muted-foreground sm:text-lg">
          {PRODUTO.subheadline}
        </p>
        <div className="mt-8">
          <CtaButton href="#planos" onClick={() => trackViewPlans("hero")}>
            {PRODUTO.ctaPrincipal}
          </CtaButton>
          <p className="mt-3 text-sm text-muted-foreground">
            {PRODUTO.microtexto}
          </p>
        </div>
      </div>
    </div>
  </header>

  {/* 2 — O QUE VOCÊ VAI RECEBER */}
  <Section
    eyebrow="O que você recebe"
    title="Tudo o que você precisa para começar a entender mecânica automotiva"
  >
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {BENEFICIOS.map((b) => {
        const Icon = ICONS[b.icone] ?? Wrench;
        return (
          <article key={b.titulo} className="surface-card p-5">
            <div className="gradient-primary mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl">
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-bold">{b.titulo}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{b.texto}</p>
          </article>
        );
      })}
    </div>
  </Section>

  {/* 3 — NOSSO APLICATIVO */}
  <Section eyebrow="Conheça por dentro" title="Nosso aplicativo" subtitle="Assista à demonstração da plataforma e veja como acessar suas aulas pelo celular ou computador.">
    <DeferredContent placeholderHeight={380}>
      <div className="mx-auto max-w-[380px]">
      <div className="relative flex justify-center">
              <div className="relative aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-2xl border border-border bg-black shadow-xl sm:max-w-[390px]">
                <video
                  className="h-full w-full object-contain"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster="/acesso-poster.webp"
                  title="Veja por dentro da Formação Mecânico Automotivo"
                  onPlay={(event) => {
                    const video = event.currentTarget;
                    trackVideoEvent("video_start", video.currentTime, video.duration);
                  }}
                  onTimeUpdate={(event) => {
                    const video = event.currentTarget;
                    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
                    const progress = video.currentTime / video.duration;
                    if (progress >= 0.25) trackVideoEvent("video_25", video.currentTime, video.duration);
                    if (progress >= 0.5) trackVideoEvent("video_50", video.currentTime, video.duration);
                    if (progress >= 0.75) trackVideoEvent("video_75", video.currentTime, video.duration);
                    if (progress >= 0.98) trackVideoEvent("video_complete", video.currentTime, video.duration);
                  }}
                  onEnded={(event) => {
                    const video = event.currentTarget;
                    trackVideoEvent("video_complete", video.currentTime, video.duration);
                  }}
                >
                  {videoReady && <source src="/acesso-720.mp4" type="video/mp4" />}
                  Seu navegador não suporta a reprodução deste vídeo.
                </video>
              </div>
            </div>
      
            </div>
    </DeferredContent>
  </Section>

  {/* 4 — MATERIAL DE APOIO */}
  <Section
    eyebrow="Material de apoio"
    title="Material de apoio"
    subtitle="Guias, manuais e checklists ilustrados para consultar sempre que precisar."
  >
    <DeferredContent>
      <Suspense fallback={<div className="h-72" />}>
        <MaterialApoio />
      </Suspense>
    </DeferredContent>
  </Section>


  {/* 5.1 — CARROSSEL DE BÔNUS */}
  <DeferredContent>
      <Suspense fallback={<div className="h-72" />}>
        <BonusCarousel />
      </Suspense>
    </DeferredContent>

  {/* 8 — PLANOS */}
  <Section
    id="planos"
    eyebrow="Planos"
    title="Escolha como quer começar"
    subtitle="Dois caminhos para iniciar hoje mesmo."
  >
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Básico */}
      <article className="surface-card flex flex-col p-6">
        <h3 className="text-2xl font-bold">{PLANOS.basico.titulo}</h3>
        <p className="text-sm text-muted-foreground">
          {PLANOS.basico.subtitulo}
        </p>
        {PLANOS.basico.precoAncora && (
          <p className="mt-4 text-sm text-muted-foreground line-through">
            {PLANOS.basico.precoAncora}
          </p>
        )}
        <p className="mt-3 font-display text-5xl font-extrabold">
          {PLANOS.basico.preco}
        </p>
        <ul className="mt-6 grid gap-2.5">
          {PLANOS.basico.itens.map((i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 shrink-0 text-primary" /> {i}
            </li>
          ))}
          {PLANOS.basico.naoInclui.map((i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <X className="h-4 w-4 shrink-0" /> {i}
            </li>
          ))}
        </ul>
        <div className="mt-7 sm:mt-auto sm:pt-7">
          <CtaButton
            href={PLANOS.basico.url}
            variant="outline"
            className="w-full sm:w-full"
            onClick={(event) => {
              trackSelectPlan("basico", 10, "cards_planos");
              upsell.trigger(event);
            }}
          >
            {PLANOS.basico.cta}
          </CtaButton>
        </div>
      </article>

      {/* Profissional */}
      <article className="surface-card glow-primary relative flex flex-col border-primary/60 p-6">
        <span className="gradient-accent absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-extrabold tracking-[0.14em] text-accent-foreground uppercase">
          {PLANOS.profissional.badge}
        </span>
        <h3 className="mt-2 text-2xl font-bold">
          {PLANOS.profissional.titulo}
        </h3>
        <p className="text-sm text-muted-foreground">
          {PLANOS.profissional.subtitulo}
        </p>
        {PLANOS.profissional.precoAncora && (
          <p className="mt-4 text-sm text-muted-foreground line-through">
            {PLANOS.profissional.precoAncora}
          </p>
        )}
        <p className="mt-3 font-display text-5xl font-extrabold text-primary">
          {PLANOS.profissional.preco}
        </p>
        <ul className="mt-6 grid gap-2.5">
          {PLANOS.profissional.itens.map((i) =>
            i === "Bônus" ? (
              <li key={i} className="my-2 rounded-xl border border-primary/40 bg-primary/5 p-4">
                <h4 className="flex items-center gap-2 text-base font-extrabold uppercase text-primary">
                  <Sparkles className="h-5 w-5 shrink-0" aria-hidden="true" />
                  Bônus — {BONUS_DO_PLANO.length} inclusos
                </h4>
                <ul className="mt-4 grid gap-3">
                  {BONUS_DO_PLANO.map((titulo) => (
                    <li key={titulo} className="flex items-start gap-2 text-sm leading-relaxed">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{titulo}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={i} className="flex items-center gap-2 text-sm font-semibold">
                <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> {i}
              </li>
            ),
          )}
        </ul>
        <div className="mt-6 rounded-xl border border-primary/40 bg-surface-2 p-4 text-sm">
          <p className="font-semibold">
            Por apenas {PLANOS.profissional.diferenca} a mais você leva
            certificado, materiais de apoio, guias e bônus.
          </p>
          <p className="mt-1 text-muted-foreground">
            {PLANOS.profissional.recomendacao}
          </p>
        </div>
        <div className="mt-6">
          <CtaButton
            href={PLANOS.profissional.url}
            className="w-full sm:w-full"
            onClick={(event) => {
              event.preventDefault();
              trackSelectPlan("profissional", 27.9, "cards_planos");
              trackInitiateCheckout("profissional", 27.9);
              window.setTimeout(() => {
                window.location.href = buildVegaCheckoutUrl(PLANOS.profissional.url);
              }, 150);
            }}
          >
            {PLANOS.profissional.cta}
          </CtaButton>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {PRODUTO.microtexto}
          </p>
        </div>
      </article>
    </div>
  </Section>

  {/* 8.1 — PROVA SOCIAL */}
  <Section
    eyebrow="Prova social"
    title="O que nossos alunos estão dizendo"
    subtitle="Avaliações enviadas por visitantes e alunos, publicadas após moderação."
  >
    <DeferredContent>
      <Suspense fallback={<div className="h-72" />}>
        <ProvaSocial />
      </Suspense>
    </DeferredContent>
  </Section>

  {/* 8.2 — PROFISSIONAL */}
  <DeferredContent placeholderHeight={420}>
    <Suspense fallback={<div className="h-96" />}>
      <SecaoProfissional />
    </Suspense>
  </DeferredContent>

  {/* 9 — GARANTIA + AUTORIDADE */}
  <Section className="bg-surface/40" eyebrow="Confiança" title="Garantia e instrutor">
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="surface-card p-6">
        <ShieldCheck className="h-10 w-10 text-primary" />
        <h3 className="mt-4 text-2xl font-bold uppercase">
          {GARANTIA.titulo}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{GARANTIA.texto}</p>
      </div>

      <div className="surface-card p-6">
        <h3 className="text-2xl font-bold">{INSTRUTOR.titulo}</h3>
        <div className="mt-5 flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
          <img
            src={INSTRUTOR.foto}
            alt={`Foto de ${INSTRUTOR.nome}, instrutor da formação`}
            loading="lazy"
            decoding="async"
            width={160}
            height={160}
            className="h-32 w-32 shrink-0 rounded-full border-2 border-primary/50 object-cover object-top shadow-lg sm:h-36 sm:w-36"
          />
          <div className="min-w-0">
            <p className="text-lg font-bold">{INSTRUTOR.nome}</p>
            <p className="mt-2 text-sm text-muted-foreground">{INSTRUTOR.bio}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {INSTRUTOR.experiencia}
            </p>
            <ul className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {INSTRUTOR.selos.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-semibold text-primary"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>


  </Section>

  {/* 10 — FAQ + CTA FINAL */}
  <Section eyebrow="Dúvidas" title="Perguntas frequentes">
    <Accordion type="single" collapsible className="mx-auto max-w-3xl">
      {FAQ.map((f, i) => (
        <AccordionItem key={f.p} value={`item-${i}`}>
          <AccordionTrigger className="text-left text-base font-semibold">
            {f.p}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            {f.r}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>

    <div className="hero-bg mt-12 rounded-2xl border border-border p-8 text-center">
      <h2 className="text-3xl font-extrabold text-balance uppercase sm:text-4xl">
        {CTA_FINAL.headline}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
        {CTA_FINAL.subheadline}
      </p>
      <div className="mt-7">
        <CtaButton href="#planos" onClick={() => trackViewPlans("cta_final")}>{CTA_FINAL.cta}</CtaButton>
        <p className="mt-3 text-sm text-muted-foreground">
          {CTA_FINAL.microtexto}
        </p>
      </div>
    </div>
  </Section>

  <footer className="border-t border-border px-4 py-8 text-center text-xs text-muted-foreground">
    © {new Date().getFullYear()} {PRODUTO.nome}. Todos os direitos reservados.
  </footer>

  {/* UPSELL — exibido ao clicar no Plano Básico */}
  <UpsellModal
    open={upsell.open}
    onAccept={upsell.accept}
    onDecline={upsell.decline}
    onClose={upsell.close}
  />

</main>
  );
}
