import { useState, type FormEvent } from "react";
import { CheckCircle2, Star } from "lucide-react";
import guilhermeFoto from "@/assets/depoimentos/guilherme.webp.asset.json";
import jenniferFoto from "@/assets/depoimentos/jennifer.webp.asset.json";
import carlosFoto from "@/assets/depoimentos/carlos.webp.asset.json";

type Review = { id:string; nome:string; comentario:string; estrelas:number; created_at:string; foto?:string };

const AVALIACOES_CLIENTES: Review[] = [
  { id: "guilherme-da-paz", nome: "Guilherme da Paz", comentario: "Curso 5 estrelas, muito bom. Voltei só para comentar porque, quando comprei, estava com muito medo de ser golpe.", estrelas: 5, created_at: "", foto: guilhermeFoto.url },
  { id: "jennifer-s-luz", nome: "Jennifer S. Luz", comentario: "Recomendo muito mesmo. Realizei o curso e peguei meu certificado.", estrelas: 5, created_at: "", foto: jenniferFoto.url },
  { id: "carlos-gomes", nome: "Carlos Gomes", comentario: "Revisei principalmente pelo material ilustrado e pelas apostilas. Muito bom o curso todo.", estrelas: 5, created_at: "", foto: carlosFoto.url },
];

export function ProvaSocial() {
  const [nome,setNome]=useState("");
  const [comentario,setComentario]=useState("");
  const [estrelas,setEstrelas]=useState<number>(0);
  const [success,setSuccess]=useState(false);
  const [error,setError]=useState("");

  const handleSubmit=(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setError("");
    if (estrelas < 1 || estrelas > 5) {
      setError("Selecione de 1 a 5 estrelas para continuar.");
      return;
    }
    // Demonstração local: nenhuma avaliação é enviada ou armazenada.
    setSuccess(true);
    setNome("");
    setComentario("");
    setEstrelas(0);
  };
  const exibidas = AVALIACOES_CLIENTES;
  return <div className="mx-auto max-w-5xl space-y-8">
    {exibidas.length>0 ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {exibidas.map((r)=><article key={r.id} className="surface-card rounded-2xl p-5">
        <div className="flex items-center gap-3">
          {r.foto ? <img src={r.foto} alt={`Foto de ${r.nome}`} width={44} height={44} loading="lazy" decoding="async" className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-primary/15" /> : <div aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-lg font-bold text-primary">{r.nome.charAt(0).toUpperCase()}</div>}
          <div><p className="font-bold">{r.nome}</p><p className="text-xs text-muted-foreground">{r.created_at ? new Date(r.created_at).toLocaleDateString("pt-BR") : "Avaliação de aluno"}</p></div>
        </div>
        <div className="my-3 flex gap-1" aria-label={r.estrelas+" de 5 estrelas"}>{Array.from({length:5},(_,i)=><Star key={i} className={"h-4 w-4 "+(i<r.estrelas?"fill-amber-400 text-amber-400":"text-muted-foreground/30")}/>)}</div>
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{r.comentario}</p>
      </article>)}
    </div> : <p className="text-center text-sm text-muted-foreground">Ainda não há avaliações publicadas. Sua opinião pode ser a primeira!</p>}
    <form onSubmit={handleSubmit} className="surface-card mx-auto max-w-xl space-y-4 rounded-2xl p-5 sm:p-7">
      <h3 className="text-xl font-bold">Deixe sua avaliação</h3>
      <p className="text-sm text-muted-foreground">Compartilhe sua opinião. Este formulário é demonstrativo: os comentários não são enviados nem armazenados.</p>
      <label className="block text-sm font-semibold">Seu nome<input autoComplete="name" required minLength={2} maxLength={70} value={nome} onChange={e=>setNome(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-foreground" placeholder="Como gostaria de aparecer" /></label>
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">Quantas estrelas você dá ao curso?</legend>
        <div className="flex items-center gap-2" role="radiogroup" aria-label="Nota do curso">
          {[1, 2, 3, 4, 5].map((nota) => (
            <button
              key={nota}
              type="button"
              role="radio"
              aria-checked={estrelas === nota}
              aria-label={`${nota} ${nota === 1 ? "estrela" : "estrelas"}`}
              onClick={() => { setEstrelas(nota); setError(""); }}
              className="rounded-lg p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Star className={`h-9 w-9 transition-colors ${nota <= estrelas ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground/50"}`} />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">{estrelas ? `${estrelas}/5` : "Selecione"}</span>
        </div>
      </fieldset>
      <label className="block text-sm font-semibold">Seu comentário<textarea required minLength={15} maxLength={1200} rows={4} value={comentario} onChange={e=>setComentario(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-foreground" placeholder="Conte sua experiência com a formação" /></label>
      {error&&<p role="alert" className="text-sm text-red-600">{error}</p>}
      {success&&<div role="status" aria-live="polite" className="flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-700 dark:text-green-300">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" />
        <div><p className="font-bold">Obrigado por avaliar!</p></div>
      </div>}
      <button type="submit" className="w-full rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground disabled:opacity-50">{"Concluir avaliação"}</button>
    </form>
  </div>;
}
