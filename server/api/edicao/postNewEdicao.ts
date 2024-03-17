import { serverSupabaseClient } from "#supabase/server";

// API route that creates a new edition on supabase postgres
export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);

  // by default, the new edition is not finished, has no winners and no drawn numbers
  const { data, error } = await supabase
    .from("edicao")
    .insert([
      { finished: false, winners: [], drawn_numbers: [], started_drawn: false },
    ])
    .select("*");

  const edicao = data[0];

  let status = 200;

  if (error) {
    status = 500;
  }

  return { status: status, edicao: edicao };
});
