import { useState } from "react";
import { Play } from "lucide-react";
import { CtaButton, Section } from "./ui-bits";
import { PRODUTO, VIDEO_DEMO } from "@/config/oferta";

export function ComoAdquirirVideo() {
  const [active, setActive] = useState(false);

  return (
    <Section
      eyebrow={VIDEO_DEMO.titulo}
      title={VIDEO_DEMO.subheadline}
      subtitle={VIDEO_DEMO.descricao}
    >
      <div className="mx-auto max-w-4xl">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black shadow-2xl">
          {!active ? (
            <button
              type="button"
              onClick={() => setActive(true)}
              className="group absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-surface-2 to-black text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              aria-label="Assistir vídeo demonstrativo do curso"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-white shadow-lg ring-4 ring-primary/20 transition-transform group-hover:scale-110 group-active:scale-95 sm:h-20 sm:w-20">
                <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
              </span>
              <span className="mt-4 max-w-[80%] text-sm font-semibold text-white/90 sm:text-base">
                Clique para assistir
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                O vídeo será carregado após o seu clique
              </span>
            </button>
          ) : (
            <iframe
              src={`https://drive.google.com/file/d/${VIDEO_DEMO.driveId}/preview`}
              title="Vídeo demonstrativo do curso"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          )}
        </div>
        <div className="mt-8 text-center">
          <CtaButton href="#planos">{PRODUTO.ctaPrincipal}</CtaButton>
          <p className="mt-3 text-sm text-muted-foreground">
            {PRODUTO.microtexto}
          </p>
        </div>
      </div>
    </Section>
  );
}
