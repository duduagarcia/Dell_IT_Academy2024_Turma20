import { serverSupabaseClient } from "#supabase/server";

// Rota da API que cria uma nova edição no banco de dados
export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);

  // Por padrão, uma Edição começa com status de não finalizada, sem ganhadores, sem números sorteados e sem o sorteio iniciado
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
