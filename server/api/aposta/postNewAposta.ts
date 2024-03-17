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
        number: body.number,
        name: body.name,
      },
    ])
    .select("*");

  console.log(data, error);

  let status = 200;

  if (error) {
    status = 500;
  }

  return { status: status };
});
