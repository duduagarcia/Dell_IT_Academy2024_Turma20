import { serverSupabaseClient } from "#supabase/server";

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
