import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileText, Table, CheckSquare, Search, Wrench, DollarSign, Cpu, Gauge, Settings, Users, ArrowRight, ShieldCheck, Clock, Infinity as InfinityIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const BONUSES = [
  { id: "capa", titulo: "10 BÔNUS EXCLUSIVOS", descricao: "Além das 80+ aulas em vídeo, você recebe um kit de materiais para acompanhar sua formação e consultar sempre que precisar.", icon: FileText, type: "intro" },
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
  { id: "fechamento", titulo: "10 bônus. Uma formação ainda mais completa.", descricao: "No Plano Profissional, você recebe as 80+ aulas da formação, certificado e os 10 materiais complementares.", type: "outro" },
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
              className={cn(
                "min-w-[88vw] sm:min-w-[calc(50%-1.5rem)] lg:min-w-[calc(33.333%-1.5rem)] snap-center flex flex-col transition-all duration-300",
                b.type === "intro" || b.type === "outro" ? "relative" : ""
              )}
            >
              <article className={cn(
                "flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300",
                b.type === "intro" ? "bg-primary text-primary-foreground border-primary shadow-xl scale-[1.02] z-10" : 
                b.type === "outro" ? "bg-surface-2 border-primary/30 shadow-lg" : 
                b.destaque ? "bg-card border-primary/50 shadow-lg hover:-translate-y-1 hover:shadow-xl" :
                "bg-card border-border hover:border-primary/40 hover:shadow-md hover:-translate-y-1"
              )}>
                {/* Mockup Area */}
                <div className={cn(
                  "relative flex aspect-video w-full items-center justify-center overflow-hidden",
                  b.type === "intro" ? "bg-primary-foreground/10" : "bg-surface-2"
                )}>
                   {/* Background Grid Pattern */}
                   <div className="tech-grid absolute inset-0 opacity-10" />
                   
                   {b.type === "intro" ? (
                      <div className="relative flex items-center justify-center">
                         <div className="absolute h-32 w-32 rounded-full bg-primary-foreground/20 blur-3xl" />
                         <div className="relative flex -space-x-8">
                            <div className="h-24 w-16 rotate-[-12deg] rounded-lg border-2 border-primary-foreground bg-primary-foreground/10 shadow-2xl backdrop-blur-sm" />
                            <div className="z-10 h-28 w-20 rounded-lg border-2 border-primary-foreground bg-primary-foreground shadow-2xl flex items-center justify-center">
                               <FileText className="h-10 w-10 text-primary" />
                            </div>
                            <div className="h-24 w-16 rotate-[12deg] rounded-lg border-2 border-primary-foreground bg-primary-foreground/10 shadow-2xl backdrop-blur-sm" />
                         </div>
                      </div>
                   ) : b.type === "outro" ? (
                      <div className="flex flex-col items-center gap-2">
                         <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
                            <ArrowRight className="h-8 w-8" />
                         </div>
                      </div>
                   ) : (
                      <div className="relative group">
                         <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                         <div className="relative h-32 w-24 rounded-lg border-2 border-border bg-card shadow-xl flex items-center justify-center overflow-hidden transition-transform group-hover:-translate-y-2">
                            <div className="absolute top-0 left-0 right-0 h-4 bg-primary/10" />
                            {b.icon && <b.icon className="h-10 w-10 text-primary" />}
                            <div className="absolute bottom-2 left-2 right-2 h-1 rounded bg-muted" />
                            <div className="absolute bottom-4 left-2 right-6 h-1 rounded bg-muted/60" />
                         </div>
                      </div>
                   )}
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col p-6">
                  {b.id !== "capa" && b.id !== "fechamento" && (
                    <span className="text-[10px] font-black tracking-widest text-primary uppercase mb-2">BÔNUS {b.id.padStart(2, '0')}</span>
                  )}
                  {b.id === "capa" && (
                    <span className="inline-flex w-fit items-center gap-1 rounded-md bg-primary-foreground px-2 py-0.5 text-[10px] font-bold text-primary uppercase mb-3">
                       INCLUSO NO PLANO PROFISSIONAL
                    </span>
                  )}
                  <h3 className={cn(
                    "font-display text-xl font-extrabold uppercase leading-tight",
                    b.type === "intro" ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {b.titulo}
                  </h3>
                  <p className={cn(
                    "mt-2 text-sm leading-relaxed",
                    b.type === "intro" ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {b.descricao}
                  </p>

                  {b.id === "fechamento" && (
                    <div className="mt-auto pt-6">
                      <div className="mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Plano Profissional</span>
                        <div className="text-3xl font-black text-primary">R$27,90</div>
                      </div>
                      <a 
                        href="#planos" 
                        className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-4 text-sm font-bold tracking-wide text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        QUERO O PLANO PROFISSIONAL
                        <ChevronRight className="h-4 w-4" />
                      </a>
                      <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> 7 dias de garantia</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Acesso imediato</span>
                        <span className="flex items-center gap-1"><InfinityIcon className="h-3 w-3" /> Vitalício</span>
                      </div>
                    </div>
                  )}
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

