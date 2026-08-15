import { ChevronLeft, ChevronRight } from "lucide-react";
import p1 from "@/assets/plataforma/p1.png.asset.json";
import p2 from "@/assets/plataforma/p2.png.asset.json";
import p3 from "@/assets/plataforma/p3.png.asset.json";
import p4 from "@/assets/plataforma/p4.png.asset.json";
import p5 from "@/assets/plataforma/p5.png.asset.json";
import { useInfiniteCarousel } from "./useInfiniteCarousel";

const TELAS = [
  { url: p1.url, titulo: "Área de membros com seus módulos e progresso" },
  { url: p2.url, titulo: "Aula 12 — Troca de óleo e filtro" },
  { url: p3.url, titulo: "Aula 21 — Sistema de arrefecimento" },
  { url: p4.url, titulo: "Aula 18 — Inspeção do sistema de freios" },
  { url: p5.url, titulo: "Aula 34 — Teste de bateria com multímetro" },
];

// duplica para permitir o loop infinito sem costura
const LOOP = [...TELAS, ...TELAS];

export function PlataformaGaleria() {
  const { trackRef, next, prev, atStart } = useInfiniteCarousel({
    itemCount: TELAS.length,
    intervalMs: 3000,
  });

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="hide-scrollbar flex snap-x snap-mandatory snap-start gap-4 overflow-x-auto pb-2"
      >
        {LOOP.map((t, i) => (
          <figure
            key={i}
            data-card
            className="surface-card snap-start w-[85vw] shrink-0 overflow-hidden rounded-2xl p-2 sm:w-[520px]"
          >
            <img
              src={t.url}
              alt={`Plataforma da Formação Mecânico Automotivo — ${t.titulo}`}
              width={1672}
              height={941}
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={i === 0 ? "high" : "low"}
              className="w-full rounded-xl border border-border"
            />
            <figcaption className="px-2 py-3 text-sm font-semibold text-muted-foreground">
              {t.titulo}
            </figcaption>
          </figure>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Anterior"
        className={`absolute top-1/2 left-0 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-white/90 shadow-md backdrop-blur transition-opacity ${
          atStart ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Próximo"
        className="absolute top-1/2 right-0 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-white/90 shadow-md backdrop-blur transition-opacity opacity-100"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
