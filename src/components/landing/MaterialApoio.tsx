import { ChevronLeft, ChevronRight } from "lucide-react";
import m1 from "@/assets/material/m1.png.asset.json";
import m2 from "@/assets/material/m2.png.asset.json";
import m3 from "@/assets/material/m3.png.asset.json";
import m4 from "@/assets/material/m4.png.asset.json";
import m5 from "@/assets/material/m5.png.asset.json";
import m6 from "@/assets/material/m6.png.asset.json";
import m7 from "@/assets/material/m7.png.asset.json";
import m8 from "@/assets/material/m8.png.asset.json";
import m9 from "@/assets/material/m9.png.asset.json";
import { useInfiniteCarousel } from "./useInfiniteCarousel";

const MATERIAL = [
  { url: m1.url, titulo: "Sistema de Freios" },
  { url: m2.url, titulo: "Sistema de Arrefecimento" },
  { url: m3.url, titulo: "Revisão Preventiva e Troca de Óleo" },
  { url: m4.url, titulo: "Checklist de Revisão Preventiva" },
  { url: m5.url, titulo: "Guia de Diagnóstico de Defeitos" },
  { url: m6.url, titulo: "Manual de Ferramentas do Mecânico" },
  { url: m7.url, titulo: "Guia de Preços de Serviços" },
  { url: m8.url, titulo: "Manual de Códigos de Erro OBD2" },
  { url: m9.url, titulo: "Guia de Injeção Eletrônica" },
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
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory snap-start hide-scrollbar pb-2"
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
