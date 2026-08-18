import { ChevronLeft, ChevronRight } from "lucide-react";
import m1 from "@/assets/opt/m1.webp";
import m2 from "@/assets/opt/m2.webp";
import m3 from "@/assets/opt/m3.webp";
import m4 from "@/assets/opt/m4.webp";
import m5 from "@/assets/opt/m5.webp";
import m6 from "@/assets/opt/m6.webp";
import m7 from "@/assets/opt/m7.webp";
import m8 from "@/assets/opt/m8.webp";
import m9 from "@/assets/opt/m9.webp";
import { useInfiniteCarousel } from "./useInfiniteCarousel";

const MATERIAL = [
  { url: m1, titulo: "Sistema de Freios" },
  { url: m2, titulo: "Sistema de Arrefecimento" },
  { url: m3, titulo: "Revisão Preventiva e Troca de Óleo" },
  { url: m4, titulo: "Checklist de Revisão Preventiva" },
  { url: m5, titulo: "Guia de Diagnóstico de Defeitos" },
  { url: m6, titulo: "Manual de Ferramentas do Mecânico" },
  { url: m7, titulo: "Guia de Preços de Serviços" },
  { url: m8, titulo: "Manual de Códigos de Erro OBD2" },
  { url: m9, titulo: "Guia de Injeção Eletrônica" },
];

// duplica para permitir o loop infinito sem costura
const LOOP = [...MATERIAL, ...MATERIAL];

export function MaterialApoio() {
  const { trackRef, next, prev, atStart } = useInfiniteCarousel({
    itemCount: MATERIAL.length,
    intervalMs: 2500,
  });

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar pb-2"
      >
        {LOOP.map((m, i) => (
          <figure
            key={i}
            data-card
            className="surface-card snap-start shrink-0 w-[78vw] sm:w-[320px] overflow-hidden rounded-2xl p-2"
          >
            <img
              src={m.url}
              alt={`Material de apoio: ${m.titulo}`}
              width={1024}
              height={1500}
              loading={i < 3 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={i === 0 ? "high" : "low"}
              className="w-full rounded-xl border border-border"
            />
            <figcaption className="px-2 py-3 text-sm font-bold tracking-wide uppercase">
              {m.titulo}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Setas */}
      <button
        type="button"
        onClick={prev}
        aria-label="Anterior"
        className={`absolute left-0 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-white/90 border border-border shadow-md backdrop-blur transition-opacity ${
          atStart ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Próximo"
        className="absolute right-0 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-white/90 border border-border shadow-md backdrop-blur transition-opacity opacity-100"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
