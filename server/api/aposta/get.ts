import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  //   const body = await readBody(event);
  //   console.log("body", body);

  const { data } = await client.from("aposta").select("*");

  return { libraries: data };
});
