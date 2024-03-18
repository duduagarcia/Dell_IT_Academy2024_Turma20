import { serverSupabaseClient } from "#supabase/server";

// API route that returns all apostas with a given edicao_id from supabase postgres
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const body = await readBody(event);

  const ids = body.ids_apostas;

  const { data } = await client.from("aposta").select("*").in("id", ids);

  console.log(data);

  return { apostas: data };
});
