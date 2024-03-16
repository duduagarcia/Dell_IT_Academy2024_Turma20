import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);

  const { data, error } = await supabase
    .from("edicao")
    .insert([{ finished: false, winners: [], drawn_numbers: [] }])
    .select("*");

  const edicao = data[0];

  let status = 200;

  if (error) {
    status = 500;
  }

  return { status: status, edicao: edicao };
});
