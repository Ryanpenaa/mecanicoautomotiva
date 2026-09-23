import bonusExclusivos from "@/assets/bonus-exclusivos.webp";

export function BonusCarousel() {
  return (
    <section className="relative py-8 sm:py-12 overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
            EXCLUSIVO DO PLANO PROFISSIONAL
          </span>

          <h2 className="text-3xl font-bold uppercase sm:text-4xl text-balance leading-tight">
            E você ainda leva bônus exclusivos para complementar sua formação
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-3xl mx-auto">
            Além da formação principal, você recebe materiais de apoio para diagnosticar melhor,
            organizar seus serviços, aplicar na prática e acelerar seus resultados na mecânica automotiva.
          </p>
        </div>

        <div className="mt-7 sm:mt-10">
          <img
            src={bonusExclusivos}
            alt="Bônus exclusivos da Formação em Mecânica Automotiva"
            width={1122}
            height={1402}
            loading="lazy"
            decoding="async"
            className="mx-auto block w-full max-w-4xl h-auto rounded-2xl border border-border shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
