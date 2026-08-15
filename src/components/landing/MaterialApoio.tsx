import m1 from "@/assets/material/m1.png.asset.json";
import m2 from "@/assets/material/m2.png.asset.json";
import m3 from "@/assets/material/m3.png.asset.json";
import m4 from "@/assets/material/m4.png.asset.json";
import m5 from "@/assets/material/m5.png.asset.json";
import m6 from "@/assets/material/m6.png.asset.json";
import m7 from "@/assets/material/m7.png.asset.json";
import m8 from "@/assets/material/m8.png.asset.json";
import m9 from "@/assets/material/m9.png.asset.json";

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

export function MaterialApoio() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {MATERIAL.map((m, i) => (
        <figure
          key={m.titulo}
          className="surface-card overflow-hidden rounded-2xl p-2"
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
  );
}
