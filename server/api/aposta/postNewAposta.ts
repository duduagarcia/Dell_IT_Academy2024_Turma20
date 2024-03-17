import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const body = await readBody(event);

  const { data, error } = await supabase
    .from("aposta")
    .insert([
      {
        id_edicao: body.edicao_id,
        cpf: body.cpf,
        numbers: body.numbers,
        name: body.name,
      },
    ])
    .select("*");

  let status = 200;

  if (error) {
    status = 500;
  }

  return { status: status };
});
