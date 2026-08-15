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

  const scheduleAfterScroll = (track: HTMLElement, fn: () => void) => {
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      track.removeEventListener("scrollend", run as EventListener);
      fn();
    };
    track.addEventListener("scrollend", run as EventListener, { once: true });
    window.setTimeout(run, 700);
  };

  const next = () => {
    const track = trackRef.current;
    if (!track || wrappingRef.current) return;
    const step = getStep();
    const setWidth = getSetWidth();
    const target = track.scrollLeft + step;

    if (target >= setWidth - 1) {
      // chegou na região das cópias: rola suavemente e reinicia sem marcar
      wrappingRef.current = true;
      track.scrollTo({ left: target, behavior: "smooth" });
      scheduleAfterScroll(track, () => {
        const t = trackRef.current;
        if (!t) {
          wrappingRef.current = false;
          return;
        }
        t.scrollLeft = t.scrollLeft - setWidth; // instantâneo, sem animação
        wrappingRef.current = false;
        updateStart();
      });
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
      track.removeEventListener("scroll", updateArrowsSafe, ...);
      window.removeEventListener("resize", updateStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { trackRef, next, prev, atStart };
}
