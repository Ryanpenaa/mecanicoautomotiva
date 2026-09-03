import { CtaButton, Section } from "./ui-bits";
import { PROFISSIONAL, PRODUTO } from "@/config/oferta";

export function SecaoProfissional() {
  return (
    <Section
      eyebrow={PROFISSIONAL.titulo}
      title={PROFISSIONAL.subheadline}
      subtitle={PROFISSIONAL.descricao}
    >
      <div className="mx-auto max-w-4xl">
        <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <img
            src={PROFISSIONAL.imagem}
            alt={PROFISSIONAL.alt}
            width={1491}
            height={1055}
            loading="lazy"
            decoding="async"
            className="h-auto w-full"
          />
        </div>
        <div className="mt-8 text-center">
          <CtaButton href="#planos">{PRODUTO.ctaPrincipal}</CtaButton>
          <p className="mt-3 text-sm text-muted-foreground">
            {PRODUTO.microtexto}
          </p>
        </div>
      </div>
    </Section>
  );
}
