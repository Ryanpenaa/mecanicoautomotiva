import { ChevronLeft, ChevronRight } from "lucide-react";
import pv1Asset from "@/assets/prova1.webp.asset.json";
import pv2Asset from "@/assets/prova2.webp.asset.json";
import pv3Asset from "@/assets/prova3.webp.asset.json";
import pv4Asset from "@/assets/prova4.webp.asset.json";
import { useInfiniteCarousel } from "./useInfiniteCarousel";

const PROVAS = [
  { url: pv1, alt: "Mensagem de aluno elogiando o conteúdo direto do curso" },
  { url: pv2, alt: "Mensagem de aluno que já trabalha na área e se organizou melhor" },
  { url: pv3, alt: "Mensagem de aluno elogiando certificado, bônus e apostila" },
  { url: pv4, alt: "Mensagem de aluno que passou a economizar na manutenção do carro" },
];

const LOOP = [...PROVAS, ...PROVAS];

export function ProvaSocial() {
  const { trackRef, next, prev } = useInfiniteCarousel({
    itemCount: PROVAS.length,
    intervalMs: 3000,
  });

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="hide-scrollbar flex gap-4 overflow-x-auto px-[11vw] pb-2 sm:px-[calc(50%-160px)]"
      >
        {LOOP.map((p, i) => (
          <figure
            key={i}
            data-card
            className="surface-card w-[78vw] max-w-[320px] shrink-0 overflow-hidden rounded-2xl p-2 sm:w-[320px]"
          >
            <img
              src={p.url}
              alt={p.alt}
              width={720}
              height={1497}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="w-full rounded-xl border border-border"
            />
          </figure>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Anterior"
        className="absolute top-1/2 left-1 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-white/90 shadow-md backdrop-blur"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Próximo"
        className="absolute top-1/2 right-1 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-white/90 shadow-md backdrop-blur"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
