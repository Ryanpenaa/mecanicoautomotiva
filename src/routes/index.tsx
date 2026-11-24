import { createFileRoute } from "@tanstack/react-router";
import mockupMecanico from "@/assets/mockup-mecanico-fast.avif.asset.json";
import demo1 from "@/assets/opt/m1.webp";
import demo2 from "@/assets/opt/m2.webp";
import demo3 from "@/assets/opt/m3.webp";
import demo4 from "@/assets/opt/m4.webp";
import demo5 from "@/assets/opt/m5.webp";
import demo6 from "@/assets/opt/m6.webp";
import demo7 from "@/assets/opt/m7.webp";
import demo8 from "@/assets/opt/m8.webp";
import demo9 from "@/assets/opt/m9.webp";
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
import { buildVegaCheckoutUrl } from "@/lib/tracking";

const BonusCarousel = lazy(() =>
import("@/components/landing/BonusCarousel").then((m) => ({ default: m.BonusCarousel })),
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
ChevronLeft,
ChevronRight,
Pause,
Play,
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
{ rel: "preload", as: "image", href: mockupMecanico.url, fetchPriority: "high" },
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

const PAGINAS_DEMO = [
  { imagem: demo1, titulo: "Sistema de freios" },
  { imagem: demo2, titulo: "Sistema de arrefecimento" },
  { imagem: demo3, titulo: "Revisão preventiva e óleo" },
  { imagem: demo4, titulo: "Checklist de revisão" },
  { imagem: demo5, titulo: "Diagnóstico de defeitos" },
  { imagem: demo6, titulo: "Ferramentas do mecânico" },
  { imagem: demo7, titulo: "Preços de serviços" },
  { imagem: demo8, titulo: "Códigos de erro OBD2" },
  { imagem: demo9, titulo: "Injeção eletrônica" },
];

function DemonstracaoMateriais() {
  const [pagina, setPagina] = useState(0);
  const [reproduzindo, setReproduzindo] = useState(true);
  const total = PAGINAS_DEMO.length;

  useEffect(() => {
    if (!reproduzindo) return;
    const timer = window.setInterval(() => setPagina((atual) => (atual + 1) % total), 3500);
    return () => window.clearInterval(timer);
  }, [reproduzindo, total]);

  const mudarPagina = (direcao: number) => {
    setPagina((atual) => (atual + direcao + total) % total);
    setReproduzindo(false);
  };

  const paginaAtual = PAGINAS_DEMO[pagina] ?? PAGINAS_DEMO[0];
  if (!paginaAtual) return null;

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-white shadow-xl">
      <div className="border-b border-border bg-slate-950 px-4 py-4 text-center text-white sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">Prévia real dos materiais</p>
        <h3 className="mt-1 text-xl font-extrabold sm:text-2xl">Folheie o conteúdo por dentro</h3>
      </div>
      <div className="relative flex min-h-[350px] items-center justify-center bg-slate-100 px-7 py-5 sm:min-h-[500px] sm:px-12">
        <div className="relative w-full max-w-[340px]">
          <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-xl bg-slate-300 shadow-md" aria-hidden="true" />
          <img
            key={pagina}
            src={paginaAtual.imagem}
            alt={`Página de demonstração: ${paginaAtual.titulo}`}
            width={1024}
            height={1536}
            loading="lazy"
            fetchPriority="low"
            decoding="async"
            className="relative block aspect-[2/3] w-full rounded-xl border border-slate-200 bg-white object-contain shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
          />
        </div>
        <button type="button" onClick={() => mudarPagina(-1)} aria-label="Página anterior" className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-slate-900 shadow-md transition hover:scale-105 sm:left-5"><ChevronLeft className="h-6 w-6" /></button>
        <button type="button" onClick={() => mudarPagina(1)} aria-label="Próxima página" className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-slate-900 shadow-md transition hover:scale-105 sm:right-5"><ChevronRight className="h-6 w-6" /></button>
        <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/85 px-3 py-1 text-xs font-bold text-white">{pagina + 1} / {total}</span>
      </div>
      <div className="flex flex-col items-center gap-3 px-4 py-4 sm:px-6">
        <p aria-live="polite" className="text-center text-sm font-bold text-slate-900 sm:text-base">{paginaAtual.titulo}</p>
        <div className="flex w-full items-center justify-center gap-1.5" aria-label="Progresso da demonstração">
          {PAGINAS_DEMO.map((item, indice) => (
            <button
              key={item.titulo}
              type="button"
              aria-label={`Ver página ${indice + 1}: ${item.titulo}`}
              aria-current={indice === pagina ? "step" : undefined}
              onClick={() => { setPagina(indice); setReproduzindo(false); }}
              className={`h-2 rounded-full transition-all ${indice === pagina ? "w-7 bg-primary" : "w-2 bg-slate-300 hover:bg-slate-400"}`}
            />
          ))}
        </div>
        <button type="button" onClick={() => setReproduzindo((ativo) => !ativo)} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
          {reproduzindo ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {reproduzindo ? "Pausar apresentação" : "Reproduzir apresentação"}
        </button>
        <p className="text-center text-xs text-slate-500">Prévia ilustrativa de páginas selecionadas; os materiais completos variam conforme o plano escolhido.</p>
      </div>
    </div>
  );
}

function Index() {
const upsell = useUpsell();

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
        <img src={mockupMecanico.url} alt="Formação Mecânico Automotivo 2.0: plataforma, aulas, materiais e certificado" width={1254} height={1254} loading="eager" decoding="async" fetchPriority="high" className="w-full max-w-[500px] rounded-2xl object-contain shadow-xl" />
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
    <div className="grid w-full grid-cols-2 gap-2.5 sm:gap-4" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
      {BENEFICIOS.map((b) => {
        const Icon = ICONS[b.icone] ?? Wrench;
        return (
          <article key={b.titulo} className="surface-card flex min-w-0 flex-col items-center p-3 text-center sm:p-5">
            <div className="gradient-primary mb-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:mb-4">
              <Icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="text-base font-bold leading-snug sm:text-lg">{b.titulo}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{b.texto}</p>
          </article>
        );
      })}
    </div>
  </Section>

  {/* 3 — DEMONSTRAÇÃO AUTOMÁTICA COM PÁGINAS REAIS DO MATERIAL */}
  <Section eyebrow="Veja antes de começar" title="Conheça os materiais por dentro, página por página" subtitle="Uma prévia visual do conteúdo da formação, com exemplos reais que você pode explorar.">
    <DeferredContent placeholderHeight={480}>
      <DemonstracaoMateriais />
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
    className="[&_header>p]:font-semibold [&_header>p]:text-primary"
    eyebrow="Planos"
    title="Escolha como quer começar"
    subtitle="Pagamento único"
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
        <p className="mt-2 text-xs font-medium text-muted-foreground">Pagamento único • Acesso vitalício</p>
        <ul className="mt-6 grid gap-3">
          {PLANOS.profissional.itens.filter((item) => item !== "Bônus" && item !== "5 Apostilas complementares").map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm font-semibold">
              <BadgeCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-2xl border border-primary/40 bg-primary/5 p-4 sm:p-5">
          <h4 className="flex items-center gap-2 text-base font-extrabold text-primary">
            <Sparkles className="h-5 w-5 shrink-0" aria-hidden="true" />
            10 bônus exclusivos inclusos
          </h4>
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3">
            {BONUS_DO_PLANO.map((titulo) => (
              <li key={titulo} className="flex items-start gap-1.5 text-xs leading-snug sm:text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{titulo}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5 rounded-xl bg-surface-2 px-4 py-3 text-center text-sm font-semibold">
          Tudo isso por apenas {PLANOS.profissional.preco}
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
      <div className="surface-card flex flex-col items-center justify-center p-5 text-center sm:p-6">
        <img
          src="/selo-garantia-7-dias.svg"
          alt="Selo dourado de garantia de 7 dias"
          width={180}
          height={180}
          loading="lazy"
          decoding="async"
          className="mb-3 h-32 w-32 object-contain drop-shadow-lg sm:h-40 sm:w-40"
        />
        <h3 className="text-xl font-extrabold uppercase sm:text-2xl">
          {GARANTIA.titulo}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{GARANTIA.texto}</p>
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
