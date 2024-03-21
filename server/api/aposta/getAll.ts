import { serverSupabaseClient } from "#supabase/server";

// Rota da API que retorna todas as apostas relacionadas com uma edição
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const body = await readBody(event);

  const { data } = await client
    .from("aposta")
    .select("*")
    .eq("id_edicao", body.edicao_id);

  console.log(data);

  return { apostas: data };
});
