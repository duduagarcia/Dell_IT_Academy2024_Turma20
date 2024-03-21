import { serverSupabaseClient } from "#supabase/server";

// Rota que atualiza o estado da Edição para iniciado o sorteio
export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const body = await readBody(event);

  const { data, error } = await supabase
    .from("edicao")
    .update({
      started_drawn: true,
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
