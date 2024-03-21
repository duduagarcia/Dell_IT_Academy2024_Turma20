import { serverSupabaseClient } from "#supabase/server";

// Rota que pega a Edição atual selecionada pelo usuário
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const body = await readBody(event);

  const { data } = await client.from("edicao").select("*").eq("id", body.id);

  console.log(data);

  return { edicao: data };
});
