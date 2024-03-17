import { serverSupabaseClient } from "#supabase/server";

// API route that returns all apostas with a given edicao_id from supabase postgres
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const body = await readBody(event);

  const { data } = await client.from("edicao").select("*").eq("id", body.id);

  console.log(data);

  return { edicao: data };
});
