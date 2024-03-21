import { serverSupabaseClient } from "#supabase/server";

// Rota da API que atualiza a edição após o sorteio
export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const body = await readBody(event);

  // Pegamos apenas os ids das apostas vencedoras para salvar no campo winners da tabela de Edicoes
  const winners = [];
  body.winners.forEach((winner) => {
    winners.push(winner.id);
  });

  console.log(body);

  const { data, error } = await supabase
    .from("edicao")
    .update({
      winners: winners,
      drawn_numbers: body.numbers,
      finished: true,
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
