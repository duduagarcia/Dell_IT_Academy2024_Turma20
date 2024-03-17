import { serverSupabaseClient } from "#supabase/server";

// Simple API route that returns all editions on supabase postgres
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  const { data } = await client.from("edicao").select("*");

  return { edicoes: data };
});
