import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const body = await readBody(event);

  const winners = [];
  body.winners.forEach((winner) => {
    winners.push(winner.id);
  });

  console.log(body);

  const { data, error } = await supabase
    .from("edicao")
    .update({
      winners: winners,
      status: body.status,
      drawn_numbers: body.numbers,
    })
    .eq("id", body.id)
    .select();

  console.log(data, error);

  let status = 200;

  if (error) {
    status = 500;
  }

  return { status: status };
});
