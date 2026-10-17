import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  nome: z.string().trim().min(2).max(70),
  comentario: z.string().trim().min(15).max(1200),
  estrelas: z.number().int().min(1).max(5),
  website: z.string().max(200).optional(),
});

function dbSettings() {
  const url = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) throw new Error("Serviço de avaliações ainda não configurado.");
  return { url: url.replace(/\/$/, ""), key };
}

export const listReviews = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const {url,key}=dbSettings();
    const res = await fetch(url + "/rest/v1/avaliacoes?select=id,nome,comentario,estrelas,created_at&aprovado=eq.true&order=created_at.desc&limit=24", {
      headers: { apikey:key, Authorization:"Bearer "+key },
    });
    if (!res.ok) throw new Error("Não foi possível consultar as avaliações.");
    return (await res.json()) as Array<{id:string;nome:string;comentario:string;estrelas:number;created_at:string}>;
  } catch { return []; }
});

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({data}) => {
    if (data.website) return {success:true};
    const {url,key}=dbSettings();
    const res = await fetch(url+"/rest/v1/avaliacoes", {
      method:"POST",
      headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json",Prefer:"return=minimal"},
      body:JSON.stringify({nome:data.nome,comentario:data.comentario,estrelas:data.estrelas,aprovado:false}),
    });
    if (!res.ok) throw new Error("Não foi possível enviar. Tente novamente.");
    return {success:true};
  });
