import { useEffect, useRef, useState } from "react";

interface Opts {
  /** número de slides lógicos (sem contar as duplicatas) */
  itemCount: number;
  intervalMs: number;
  /** espaçamento entre cards em px (deve bater com o gap do flex) */
  gap?: number;
}

/**
 * Carrossel horizontal infinito e sem costura.
 * Renderiza os slides duplicados ([...items, ...items]) no componente.
 * Quando o autoplay (ou a seta →) chega na cópia do primeiro slide,
 * ele rola suavemente até lá e, ao finalizar, reposiciona o scroll
 * instantaneamente para o slide real equivalente — sem movimento visível.
 */
export function useInfiniteCarousel({ itemCount, intervalMs, gap = 16 }: Opts) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const wrappingRef = useRef(false);

  const getStep = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.querySelector<HTMLElement>("[data-card]");
    return card ? card.offsetWidth + gap : track.clientWidth * 0.85;
  };

  // largura de um "conjunto" em termos de scroll = clone do slide 0
  const getSetWidth = () => itemCount * getStep();

  const updateStart = () => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
  };

  const next = () => {
    const track = trackRef.current;
    if (!track || wrappingRef.current) return;
    const step = getStep();
    const setWidth = getSetWidth();
    const target = track.scrollLeft + step;

    if (target >= setWidth - 1) {
      // chegou na região das cópias: rola suavemente até o clone do slide 0
      // e, assim que o scroll ATINGE o destino, reposiciona instantaneamente
      // para o slide 0 real (mesma imagem → movimento invisível, sem rewind).
      wrappingRef.current = true;
      track.scrollTo({ left: target, behavior: "smooth" });

      let frames = 0;
      const poll = () => {
        const t = trackRef.current;
        if (!t) {
          wrappingRef.current = false;
          return;
        }
        frames += 1;
        const cur = t.scrollLeft;
        if (cur >= target - 2 || frames > 120) {
          // reset instantâneo (behavior instant ignora qualquer scroll-behavior CSS)
          t.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
          wrappingRef.current = false;
          updateStart();
          return;
        }
        requestAnimationFrame(poll);
      };
      requestAnimationFrame(poll);
    } else {
      track.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  const prev = () => {
    const track = trackRef.current;
    if (!track || wrappingRef.current) return;
    if (track.scrollLeft <= 4) return; // início: não volta (loop só p/ frente)
    const step = getStep();
    track.scrollBy({ left: -step, behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateStart();

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

    const id = window.setInterval(() => {
      if (paused || wrappingRef.current) return;
      next();
    }, intervalMs);

    track.addEventListener("scroll", updateStart, { passive: true });
    window.addEventListener("resize", updateStart);

    return () => {
      clearInterval(id);
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
      track.removeEventListener("scroll", updateStart);
      window.removeEventListener("resize", updateStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { trackRef, next, prev, atStart };
}
