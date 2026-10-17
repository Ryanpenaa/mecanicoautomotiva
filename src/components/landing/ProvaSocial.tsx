import { useEffect, useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { listReviews, submitReview } from "@/lib/reviews";

type Review = { id:string; nome:string; comentario:string; estrelas:number; created_at:string };

export function ProvaSocial() {
  const [reviews,setReviews]=useState<Review[]>([]);
  const [nome,setNome]=useState("");
  const [comentario,setComentario]=useState("");
  const [estrelas,setEstrelas]=useState(5);
  const [website,setWebsite]=useState("");
  const [sending,setSending]=useState(false);
  const [success,setSuccess]=useState(false);
  const [error,setError]=useState("");

  useEffect(()=>{let mounted=true; listReviews().then(r=>{if(mounted)setReviews(r)}).catch(()=>{}); return ()=>{mounted=false}},[]);
  const handleSubmit=async (e:FormEvent)=>{
    e.preventDefault();setError("");setSending(true);
    try {
      await submitReview({data:{nome,comentario,estrelas,website}});
      setSuccess(true);setNome("");setComentario("");setEstrelas(5);
    } catch(err) {setError(err instanceof Error?err.message:"Não foi possível enviar sua avaliação.");}
    finally {setSending(false)}
  };
  return <div className="mx-auto max-w-5xl space-y-8">
    {reviews.length>0 ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((r)=><article key={r.id} className="surface-card rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-lg font-bold text-primary">{r.nome.charAt(0).toUpperCase()}</div>
          <div><p className="font-bold">{r.nome}</p><p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("pt-BR")}</p></div>
        </div>
        <div className="my-3 flex gap-1" aria-label={r.estrelas+" de 5 estrelas"}>{Array.from({length:5},(_,i)=><Star key={i} className={"h-4 w-4 "+(i<r.estrelas?"fill-amber-400 text-amber-400":"text-muted-foreground/30")}/>)}</div>
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{r.comentario}</p>
      </article>)}
    </div> : <p className="text-center text-sm text-muted-foreground">Ainda não há avaliações publicadas. Sua opinião pode ser a primeira!</p>}
    <form onSubmit={handleSubmit} className="surface-card mx-auto max-w-xl space-y-4 rounded-2xl p-5 sm:p-7">
      <h3 className="text-xl font-bold">Deixe sua avaliação</h3>
      <p className="text-sm text-muted-foreground">Seu comentário será analisado antes de aparecer no site. Esta seção é independente do Google Avaliações.</p>
      <label className="block text-sm font-semibold">Seu nome<input autoComplete="name" required minLength={2} maxLength={70} value={nome} onChange={e=>setNome(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-foreground" placeholder="Como gostaria de aparecer" /></label>
      <div><p className="mb-2 text-sm font-semibold">Sua nota</p><div className="flex gap-2">{Array.from({length:5},(_,i)=><button key={i} type="button" onClick={()=>setEstrelas(i+1)} aria-label={(i+1)+" estrelas"} aria-pressed={estrelas===i+1}><Star className={"h-8 w-8 "+(i<estrelas?"fill-amber-400 text-amber-400":"text-muted-foreground/40")}/></button>)}</div></div>
      <label className="block text-sm font-semibold">Seu comentário<textarea required minLength={15} maxLength={1200} rows={4} value={comentario} onChange={e=>setComentario(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-foreground" placeholder="Conte sua experiência com a formação" /></label>
      <div className="hidden" aria-hidden="true"><label>Site<input tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></label></div>
      {error&&<p role="alert" className="text-sm text-red-600">{error}</p>}
      {success&&<p role="status" className="text-sm text-green-600">Avaliação recebida! Ela será analisada antes de ser publicada.</p>}
      <button disabled={sending} type="submit" className="w-full rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground disabled:opacity-50">{sending?"Enviando...":"Enviar avaliação"}</button>
    </form>
  </div>;
}
