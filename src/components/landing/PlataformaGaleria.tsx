import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import p1 from "@/assets/plataforma/p1.png.asset.json";
import p2 from "@/assets/plataforma/p2.png.asset.json";
import p3 from "@/assets/plataforma/p3.png.asset.json";
import p4 from "@/assets/plataforma/p4.png.asset.json";
import p5 from "@/assets/plataforma/p5.png.asset.json";

const TELAS = [
  { url: p1.url, titulo: "Área de membros com seus módulos e progresso" },
  { url: p2.url, titulo: "Aula 12 — Troca de óleo e filtro" },
  { url: p3.url, titulo: "Aula 21 — Sistema de arrefecimento" },
  { url: p4.url, titulo: "Aula 18 — Inspeção do sistema de freios" },
  { url: p5.url, titulo: "Aula 34 — Teste de bateria com multímetro" },
];

export function PlataformaGaleria() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const step = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.querySelector<HTMLElement>("[data-card]");
    return card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
  };

  const scrollByCard = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * step(), behavior: "smooth" });
  };

  const updateArrows = () => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateArrows();

    let paused = false;
    const onEnter = () => (paused = true);
    const onLeave = () => (paused = false);
    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);
    track.addEventListener("touchstart", onEnter, { passive: true });
    track.addEventListener("touchend", () => {
      paused = true;
      setTimeout(() => (paused = false), 3500);
    });

    const id = setInterval(() => {
      if (paused) return;
      const reachedEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      if (reachedEnd) track.scrollTo({ left: 0, behavior: "smooth" });
      else track.scrollBy({ left: step(), behavior: "smooth" });
    }, 3000);

    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    return () => {
      clearInterval(id);
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
      track.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {TELAS.map((t, i) => (
          <figure
            key={t.titulo}
            data-card
            className="surface-card w-[85vw] shrink-0 snap-center overflow-hidden rounded-2xl p-2 sm:w-[520px]"
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
        onClick={() => scrollByCard(-1)}
        aria-label="Anterior"
        className={`absolute top-1/2 left-0 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-white/90 shadow-md backdrop-blur transition-opacity ${
          atStart ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Próximo"
        className={`absolute top-1/2 right-0 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-white/90 shadow-md backdrop-blur transition-opacity ${
          atEnd ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
