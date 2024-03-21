import { serverSupabaseClient } from "#supabase/server";

// Rota que recebe os IDs de apostas ganhadoras de uma edição e as retorna
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const body = await readBody(event);

  const ids = body.ids_apostas;

  const { data } = await client.from("aposta").select("*").in("id", ids);

  console.log(data);

  return { apostas: data };
});
