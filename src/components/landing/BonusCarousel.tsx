import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileText, Table, CheckSquare, Search, Wrench, DollarSign, Cpu, Gauge, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import b1 from "@/assets/bonus/b1.webp.asset.json";
import b2 from "@/assets/bonus/b2.webp.asset.json";
import b3 from "@/assets/bonus/b3.webp.asset.json";
import b4 from "@/assets/bonus/b4.webp.asset.json";
import b5 from "@/assets/bonus/b5.webp.asset.json";
import b6 from "@/assets/bonus/b6.webp.asset.json";
import b7 from "@/assets/bonus/b7.webp.asset.json";
import b8 from "@/assets/bonus/b8.webp.asset.json";
import b9 from "@/assets/bonus/b9.webp.asset.json";
import b10 from "@/assets/bonus/b10.webp.asset.json";

const IMGS: Record<string, string> = {
  "1": b1.url, "2": b2.url, "3": b3.url, "4": b4.url, "5": b5.url,
  "6": b6.url, "7": b7.url, "8": b8.url, "9": b9.url, "10": b10.url,
};

const BONUSES = [
  { id: "1", titulo: "Apostila Completa de Mecânica Automotiva", descricao: "Material de apoio para acompanhar as aulas, revisar os principais conceitos e consultar o conteúdo durante seus estudos.", icon: FileText },
  { id: "2", titulo: "Tabela de Torques e Especificações", descricao: "Material de consulta rápida com informações técnicas para facilitar seus estudos e consultas durante os procedimentos.", icon: Table },
  { id: "3", titulo: "Checklist de Revisão Preventiva", descricao: "Uma lista prática para organizar os principais pontos que devem ser observados em uma revisão preventiva.", icon: CheckSquare },
  { id: "4", titulo: "Guia de Diagnóstico de Defeitos", descricao: "Material de consulta para ajudar a organizar o raciocínio durante a identificação de possíveis problemas automotivos.", icon: Search },
  { id: "5", titulo: "Manual de Ferramentas do Mecânico", descricao: "Conheça as principais ferramentas utilizadas na mecânica automotiva e entenda a função de cada uma.", icon: Wrench },
  { id: "6", titulo: "Guia de Preços de Serviços", descricao: "Material de referência para entender como organizar e estruturar a precificação de serviços automotivos.", icon: DollarSign },
  { id: "7", titulo: "Manual de Códigos de Erro OBD2", descricao: "Material de consulta para compreender melhor os códigos de falha identificados através do sistema OBD2.", icon: Gauge },
  { id: "8", titulo: "Guia de Injeção Eletrônica", descricao: "Material complementar para aprofundar seus conhecimentos sobre os principais conceitos da injeção eletrônica automotiva.", icon: Cpu },
  { id: "9", titulo: "Manual de Freios e Suspensão", descricao: "Material de apoio com conceitos relacionados aos principais componentes dos sistemas de freios e suspensão.", icon: Settings },
  { id: "10", titulo: "Guia para Conseguir os Primeiros Clientes", descricao: "Orientações práticas para quem deseja começar a buscar oportunidades e transformar o conhecimento adquirido em prestação de serviços.", icon: Users, destaque: true },
];

export function BonusCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
        
        if (isAtEnd) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: clientWidth, behavior: "smooth" });
        }
      }
    }, 5000); // 5 seconds interval

    return () => clearInterval(interval);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = window.innerWidth < 640 ? clientWidth : clientWidth / 3;
      const scrollTo = direction === "left" ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: scrollTo, behavior: "smooth" });
    }
  };


  return (
    <div className="relative py-14 sm:py-20 overflow-hidden">
      <div className="mb-8 text-center px-4 relative z-10">
        <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4">
          EXCLUSIVO DO PLANO PROFISSIONAL
        </span>
        <h2 className="text-3xl font-bold uppercase sm:text-4xl text-balance max-w-4xl mx-auto leading-tight">
          E você ainda leva 10 bônus para complementar sua formação
        </h2>
        <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
          Materiais práticos para estudar, consultar e aplicar seus conhecimentos durante sua jornada na mecânica automotiva.
        </p>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-primary uppercase tracking-widest animate-pulse">
          <span className="hidden sm:inline">← Deslize para conhecer os bônus →</span>
          <span className="sm:hidden">Deslize para o lado →</span>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl group">
        {/* Navigation Arrows (Visible on Desktop and Tablet) */}
        <button 
          onClick={() => scroll("left")}
          className="absolute -left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-surface border border-border shadow-lg transition-all hover:scale-110 active:scale-95 text-primary opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={() => scroll("right")}
          className="absolute -right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-surface border border-border shadow-lg transition-all hover:scale-110 active:scale-95 text-primary opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Próximo"
        >
          <ChevronRight className="h-6 w-6" />
        </button>


        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-4 sm:px-10 lg:px-20 pb-10"
          onScroll={() => {
             if (scrollRef.current) {
               const index = Math.round(scrollRef.current.scrollLeft / (scrollRef.current.clientWidth - (window.innerWidth < 640 ? 0 : 100)));
               if (index !== activeIndex) setActiveIndex(index);
             }
          }}
        >
          {BONUSES.map((b, i) => (
            <div 
              key={i} 
              className="min-w-[88vw] sm:min-w-[calc(50%-1.5rem)] lg:min-w-[calc(33.333%-1.5rem)] snap-center flex flex-col transition-all duration-300"
            >
              <article className={cn(
                "flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300",
                b.destaque ? "bg-card border-primary/50 shadow-lg hover:-translate-y-1 hover:shadow-xl" :
                "bg-card border-border hover:border-primary/40 hover:shadow-md hover:-translate-y-1"
              )}>
                {/* Mockup Area */}
                <img
                  src={IMGS[b.id]}
                  alt={b.titulo}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="block w-full h-auto transition-transform duration-500 hover:scale-[1.02]"
                />

                {/* Content Area */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <span className="text-[10px] font-black tracking-widest text-primary uppercase">BÔNUS {b.id.padStart(2, '0')}</span>
                  <h3 className="font-display text-lg font-extrabold uppercase leading-tight mt-1 text-foreground">
                    {b.titulo}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {b.descricao}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination Indicators */}
      <div className="flex justify-center gap-2 sm:mt-4">
        {BONUSES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
               if (scrollRef.current) {
                 const cardWidth = scrollRef.current.clientWidth - (window.innerWidth < 640 ? 0 : 100);
                 scrollRef.current.scrollTo({ left: i * cardWidth, behavior: "smooth" });
               }
            }}
            className={cn(
              "h-1.5 transition-all duration-300 rounded-full", 
              activeIndex === i ? "bg-primary w-8" : "bg-border w-2 hover:bg-primary/40"
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
