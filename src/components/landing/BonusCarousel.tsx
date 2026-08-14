import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const BONUSES = [
  { id: "capa", titulo: "10 BÔNUS EXCLUSIVOS", descricao: "Além das 80+ aulas em vídeo, você recebe um kit de materiais para acompanhar sua formação e consultar sempre que precisar." },
  { id: "1", titulo: "Apostila Completa", descricao: "Material de apoio para acompanhar as aulas e revisar conceitos." },
  { id: "2", titulo: "Tabela de Torques", descricao: "Consulta rápida com informações técnicas essenciais." },
  { id: "3", titulo: "Checklist de Revisão", descricao: "Organize os pontos principais da revisão preventiva." },
  { id: "4", titulo: "Guia de Diagnóstico", descricao: "Ajuda a organizar o raciocínio no diagnóstico." },
  { id: "5", titulo: "Manual de Ferramentas", descricao: "Principais ferramentas e suas funções." },
  { id: "6", titulo: "Guia de Preços", descricao: "Entenda a precificação de serviços automotivos." },
  { id: "7", titulo: "Códigos de Erro OBD2", descricao: "Compreenda melhor os códigos de falha do sistema OBD2." },
  { id: "8", titulo: "Guia de Injeção", descricao: "Aprofunde seus conhecimentos em injeção eletrônica." },
  { id: "9", titulo: "Manual de Freios", descricao: "Conceitos sobre freios e suspensão." },
  { id: "10", titulo: "Primeiros Clientes", descricao: "Orientações práticas para buscar oportunidades." },
  { id: "fechamento", titulo: "Formação Completa", descricao: "Receba aulas, certificado e 10 materiais complementares por apenas R$27,90." },
];

export function BonusCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative py-10">
      <div className="mb-8 text-center px-4">
        <span className="inline-block rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase mb-4">
          EXCLUSIVO DO PLANO PROFISSIONAL
        </span>
        <h2 className="text-3xl font-bold uppercase sm:text-4xl">E você ainda leva 10 bônus para complementar sua formação</h2>
        <p className="mt-3 text-base text-muted-foreground max-w-2xl mx-auto">Materiais práticos para estudar, consultar e aplicar seus conhecimentos durante sua jornada na mecânica automotiva.</p>
        <p className="mt-6 text-sm font-semibold text-primary hidden sm:block">← Deslize para conhecer os bônus →</p>
        <p className="mt-6 text-sm font-semibold text-primary sm:hidden">Deslize para o lado →</p>
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6"
          onScroll={() => {
             if (scrollRef.current) {
               setActiveIndex(Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth));
             }
          }}
        >
          {BONUSES.map((b, i) => (
            <div key={i} className="min-w-[85vw] sm:min-w-[33%] snap-center surface-card p-6 flex flex-col items-center text-center">
              <div className="w-full h-40 bg-surface-2 rounded-xl mb-4 flex items-center justify-center text-muted-foreground border border-border border-dashed">
                [Visual do Bônus {b.id}]
              </div>
              <h3 className="text-lg font-bold uppercase">{b.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.descricao}</p>
              {b.id === "fechamento" && (
                <a href="#planos" className="mt-6 gradient-primary w-full py-3 rounded-lg font-bold text-primary-foreground">QUERO O PLANO PROFISSIONAL</a>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center gap-2 mt-4">
        {BONUSES.map((_, i) => (
          <div key={i} className={cn("h-2 w-2 rounded-full", activeIndex === i ? "bg-primary" : "bg-border")} />
        ))}
      </div>
    </div>
  );
}
