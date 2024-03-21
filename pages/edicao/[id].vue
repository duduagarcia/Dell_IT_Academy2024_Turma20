<!-- Página de uma determinada Edição -->
<script setup>
const route = useRoute();
const toast = useToast();

function goBackHome() {
  navigateTo("/");
}

// Pegando todas as apostas da Edição
let allApostas = await useFetch("/api/aposta/getAll", {
  method: "POST",
  body: JSON.stringify({ edicao_id: route.params.id }),
});
allApostas = allApostas.data.value.apostas;

// Pegando os dados da edição atual, serve para verificar o status da edição
let current_edicao = await useFetch("/api/edicao/getCurrentEdicao", {
  method: "POST",
  body: JSON.stringify({ id: route.params.id }),
});
current_edicao = current_edicao.data.value.edicao[0];

// Caso seja verdade que a edição tenha terminado, fazemos as seguintes operações
let apostasWinners = [];
const numbers_wCount = ref([]);
if (current_edicao.finished == true) {
  // Pegamos as apostas vencedoras
  const { data } = await useFetch("/api/aposta/getWinners", {
    method: "POST",
    body: JSON.stringify({ ids_apostas: current_edicao.winners }),
  });

  // Ordenamos as apostas por ordem alfabética no vetor para visualização na tabela
  apostasWinners = data.value.apostas;
  apostasWinners.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  // Pegamos todos os números escolhidos em TODAS as apostas da edição para posteriormente percorrer e contar a frequência de cada número
  let numbers = [];
  allApostas.forEach((aposta) => {
    aposta.numbers.forEach((number) => {
      if (!numbers.includes(number)) {
        numbers.push(number);

        numbers_wCount.value.push({
          number: number,
          count: 1,
        });
      }
    });
  });

  // Percorrendo todos os números escolhidos e contando a frequência de cada um
  numbers_wCount.value.forEach((number) => {
    let count = 0;
    allApostas.forEach((aposta) => {
      if (aposta.numbers.includes(number.number)) {
        count++;
      }
    });

    number.count = count;
  });

  console.log("numbers_wCount", numbers_wCount.value);
}

// Template para as colunas da tabela de TODAS as apostas feitas
const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Nome",
  },
  {
    key: "cpf",
    label: "CPF",
  },
  {
    key: "numbers",
    label: "Números",
  },
];

// Template das colunas de freqência de números
const columns_numberFrequency = [
  {
    key: "number",
    label: "Número",
  },
  {
    key: "count",
    label: "Frequência",
  },
];

function criarAposta() {
  navigateTo(`/edicao/${route.params.id}/apostas/criar`);
}

// Função que atualiza a edição para a fase de sorteio
async function redirectToSorteio() {
  const { data } = await useFetch("/api/edicao/startSorteio", {
    method: "POST",
    body: JSON.stringify({ id: route.params.id }),
  });

  if (data.value.status === 200) {
    toast.add({
      title: "Sucesso!",
      description: "Fase de sorteio iniciado com sucesso",
      color: "green",
    });
  } else {
    toast.add({
      title: "ERRO!",
      description: "Não foi possível iniciar o sorteio",
      color: "red",
    });
    navigateTo(`/edicao/${route.params.id}/sorteio`);
  }
}

// Função chamada ao clicar no botão de iniciar sorteio
function iniciarSorteio() {
  // Caso a edição não tenha nenhuma aposta, bloqueamos o usuário de inicair o sorteio e o alertamos
  if (allApostas.length === 0 || allApostas === undefined) {
    toast.add({
      title: "ERRO!",
      description: "Não é possível iniciar o sorteio sem apostas cadastradas",
      color: "red",
    });
    return;
  }

  // Caso a edição já tenha sido iniciada, redirecionamos o usuário para a página de sorteio
  if (current_edicao.started_drawn == true) {
    redirectToSorteio();
  } else {
    // Caso a edição ainda não tenha sido iniciada, mostramos um alerta para o usuário confirmar se deseja iniciar o sorteio
    toast.add({
      title: "Atenção",
      actions,
      description:
        "Deseja iniciar o sorteio? uma vez com o sorteio iniciado não será mais possível cadastrar apostas",
    });
  }
}

// Objeto para o popup de confirmação de início de sorteio
const actions = ref([
  {
    label: "Confirmar",
    click: () => redirectToSorteio(),
  },
  {
    label: "Cancelar",
    click: () => {},
  },
]);

// Função chamada ao clicar em uma aposta vencedora para premiação
function selectWinner(row) {
  console.log("row", row);
  navigateTo(`/edicao/${route.params.id}/apostas/${row.id}/premiacao`);
}
</script>

<template>
  <UContainer class="flex p-8 gap-3 flex-col">
    <h1 class="my-7 text-2xl">Edição n° {{ route.params.id }}</h1>
    <div v-if="current_edicao.finished == true" class="mb-5">
      <p class="mb-4">Lista de números sorteados</p>
      <div class="flex gap-4 flex-wrap">
        <UBadge
          color="primary"
          variant="subtle"
          size="lg"
          v-for="(sequence, index) in current_edicao.drawn_numbers"
          :key="index"
          >{{ sequence }}</UBadge
        >
      </div>
      <p class="my-4">
        Quantidade de rodadas do sorteio realizadas:
        {{ current_edicao.drawn_numbers.length - 5 }}
      </p>
      <p class="my-4">
        Quantidade de apostas vencedoras:
        {{ current_edicao.winners.length }}
      </p>
      <br />
      <p class="text-lg">Vencedores</p>
      <UTable
        :rows="apostasWinners"
        :columns="columns"
        v-if="apostasWinners.length > 0"
        @select="selectWinner"
      />
      <p class="font-bold" v-else>
        Não houve vencedores nessa edição do sorteio!
      </p>
      <br />
      <p class="text-lg">Frequência dos números escolhidos</p>
      <UTable :rows="numbers_wCount" :columns="columns_numberFrequency" />
    </div>

    <div v-else-if="current_edicao.finished == false">
      <p>Apostas registradas até o momento</p>
      <UTable :rows="allApostas" :columns="columns" />
    </div>
    <div class="flex gap-2 my-3">
      <UButton
        class="correction_button"
        variant="link"
        label="Voltar"
        @click="goBackHome"
      />
      <UButton
        class="correction_button"
        variant="outline"
        label="Criar aposta"
        @click="criarAposta"
        :class="current_edicao.started_drawn ? 'disable' : ''"
      />
      <UButton
        class="correction_button"
        variant="solid"
        label="Iniciar sorteio"
        @click="iniciarSorteio"
        :class="current_edicao.finished ? 'disable' : ''"
      />
    </div>
  </UContainer>
</template>

<style scoped>
/* facing a problem with NuxtUI button's size, so added this class to fix it */
.correction_button {
  width: max-content;
  padding: 12px;
}

.disable {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
