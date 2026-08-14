import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, CtaButton } from "@/components/landing/ui-bits";
import {
  BONUS,
  BENEFICIOS,
  CTA_FINAL,
  DEPOIMENTOS,
  DESTAQUES_HERO,
  FAQ,
  GARANTIA,
  INSTRUTOR,
  JORNADA,
  MATERIAIS,
  MOTIVOS,
  PARA_QUEM,
  PLANOS,
  PRODUTO,
} from "@/config/oferta";
import heroImg from "@/assets/hero-mecanico.jpg";
import plataformaImg from "@/assets/plataforma-mockup.jpg";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  Clock,
  FileText,
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
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background pb-24 sm:pb-0">
      {/* 1 — HERO */}
      <header className="hero-bg relative overflow-hidden">
        <div className="tech-grid absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              <Gauge className="h-3.5 w-3.5" /> Formação profissionalizante online
            </span>
            <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold text-balance uppercase sm:text-5xl lg:text-6xl">
              {PRODUTO.headline}
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              {PRODUTO.subheadline}
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-2xl">
              <img
                src={plataformaImg}
                alt="Mockup da plataforma de ensino"
                width={1280}
                height={912}
                className="w-full object-cover"
              />
            </div>


            <ul className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {DESTAQUES_HERO.map((d) => (
                <li
                  key={d}
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface/70 px-3 py-2.5 text-sm font-semibold tracking-wide"
                >
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  <span className="min-w-0">{d}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <CtaButton href="#planos">{PRODUTO.ctaPrincipal}</CtaButton>
              <p className="mt-3 text-sm text-muted-foreground">
                {PRODUTO.microtexto}
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="glow-primary overflow-hidden rounded-2xl border border-border shadow-2xl">
              <img
                src={plataformaImg}
                alt="Mockup da plataforma de ensino"
                width={1280}
                height={912}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
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

      {/* 3 — PARA QUEM É */}
      <Section
        className="bg-surface/40"
        eyebrow="Para quem é"
        title="Essa formação foi feita para quem quer começar"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PARA_QUEM.map((p) => (
            <div
              key={p}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
            >
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="min-w-0 text-sm font-medium">{p}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 4 — CAMINHO DE APRENDIZADO */}
      <Section
        eyebrow="Trilha"
        title="O caminho de aprendizado"
        subtitle="Uma sequência organizada, do primeiro conceito até a aplicação prática."
      >
        <ol className="relative grid gap-4 md:grid-cols-5">
          {JORNADA.map((j) => (
            <li key={j.numero} className="surface-card p-5">
              <span className="font-display text-3xl font-extrabold text-primary">
                {j.numero}
              </span>
              <h3 className="mt-2 text-base font-bold tracking-wide uppercase">
                {j.titulo}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{j.texto}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 text-center">
          <CtaButton href="#planos" variant="outline">
            Ver os planos <ChevronRight className="ml-1 h-4 w-4" />
          </CtaButton>
        </div>
      </Section>

      {/* 5 — CONTEÚDO + MATERIAIS */}
      <Section
        className="bg-surface/40"
        eyebrow="Conteúdo e materiais"
        title="Uma formação para consultar sempre que precisar"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MATERIAIS.map((m) => (
            <div
              key={m}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            >
              <FileText className="h-5 w-5 shrink-0 text-accent" />
              <span className="min-w-0 text-sm font-semibold">{m}</span>
            </div>
          ))}
        </div>

        {BONUS.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold uppercase">
              <Sparkles className="h-5 w-5 text-accent" /> Bônus do Plano
              Profissional
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {BONUS.map((b) => (
                <div
                  key={b.titulo}
                  className="rounded-xl border border-dashed border-border bg-surface-2/60 p-4"
                >
                  <p className="text-sm font-bold">{b.titulo}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {b.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* 6 — EXPERIÊNCIA DA PLATAFORMA */}
      <Section eyebrow="Plataforma" title="Estude no seu ritmo, de onde estiver">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border">
            <img
              src={plataformaImg}
              alt="Área de membros da formação aberta em notebook e celular"
              width={1280}
              height={912}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <ul className="grid gap-3">
            {[
              { icon: Monitor, t: "Acesso 100% online" },
              { icon: Clock, t: "Acesso imediato após a compra" },
              { icon: InfinityIcon, t: "Acesso vitalício às aulas" },
              { icon: Smartphone, t: "Celular, tablet ou computador" },
            ].map(({ icon: Icon, t }) => (
              <li
                key={t}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
              >
                <Icon className="h-5 w-5 shrink-0 text-primary" />
                <span className="min-w-0 text-sm font-semibold">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 7 — POR QUE APRENDER MECÂNICA */}
      <Section
        className="bg-surface/40"
        eyebrow="Por que aprender"
        title="Uma habilidade prática pode abrir novos caminhos"
        subtitle="Entender mecânica é útil em muitas situações do dia a dia — e pode se tornar uma habilidade profissional conforme sua dedicação e prática."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MOTIVOS.map((m) => (
            <div key={m} className="surface-card flex items-start gap-3 p-5">
              <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <span className="min-w-0 text-sm">{m}</span>
            </div>
          ))}
        </div>
      </Section>

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
              {PLANOS.profissional.itens.map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-medium">
                  <Check className="h-4 w-4 shrink-0 text-primary" /> {i}
                </li>
              ))}
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
            <div className="mt-4 flex items-start gap-4">
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-xl border border-dashed border-border bg-surface-2 text-center text-[11px] text-muted-foreground">
                {INSTRUTOR.foto ? (
                  <img
                    src={INSTRUTOR.foto}
                    alt={INSTRUTOR.nome}
                    loading="lazy"
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                ) : (
                  "[ESPAÇO PARA FOTO]"
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold">{INSTRUTOR.nome}</p>
                <p className="mt-1 text-sm text-muted-foreground">{INSTRUTOR.bio}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {INSTRUTOR.experiencia}
                </p>
              </div>
            </div>
          </div>
        </div>

        {DEPOIMENTOS.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {DEPOIMENTOS.map((d) => (
              <blockquote key={d.nome} className="surface-card p-5 text-sm">
                <p>{d.texto}</p>
                <footer className="mt-3 font-semibold">{d.nome}</footer>
              </blockquote>
            ))}
          </div>
        )}
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
            <CtaButton href="#planos">{CTA_FINAL.cta}</CtaButton>
            <p className="mt-3 text-sm text-muted-foreground">
              {CTA_FINAL.microtexto}
            </p>
          </div>
        </div>
      </Section>

      <footer className="border-t border-border px-4 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {PRODUTO.nome}. Todos os direitos reservados.
      </footer>

      {/* CTA fixo mobile */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 p-3 backdrop-blur sm:hidden">
        <CtaButton href="#planos" className="w-full py-3.5 text-base">
          {PRODUTO.ctaPrincipal}
        </CtaButton>
      </div>
    </main>
  );
}
