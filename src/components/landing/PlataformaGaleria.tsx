import { ChevronLeft, ChevronRight } from "lucide-react";
import p1 from "@/assets/opt/p1.webp";
import p2 from "@/assets/opt/p2.webp";
import p3 from "@/assets/opt/p3.webp";
import p4 from "@/assets/opt/p4.webp";
import p5 from "@/assets/opt/p5.webp";
import { useInfiniteCarousel } from "./useInfiniteCarousel";

const TELAS = [
  { url: p1, titulo: "Área de membros com seus módulos e progresso" },
  { url: p2, titulo: "Aula 12 — Troca de óleo e filtro" },
  { url: p3, titulo: "Aula 21 — Sistema de arrefecimento" },
  { url: p4, titulo: "Aula 18 — Inspeção do sistema de freios" },
  { url: p5, titulo: "Aula 34 — Teste de bateria com multímetro" },
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
        className="hide-scrollbar flex gap-4 overflow-x-auto pb-2"
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
              width={1200}
              height={675}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
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
