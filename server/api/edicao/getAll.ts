import { serverSupabaseClient } from "#supabase/server";

// Rota que pega todas as Edições criadas no banco de dadoss
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data } = await client.from("edicao").select("*");

  return { edicoes: data };
});
