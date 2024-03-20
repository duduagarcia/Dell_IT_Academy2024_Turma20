<script setup>
import { ref } from "vue";

const route = useRoute();
const toast = useToast();

function goBackHome() {
  navigateTo("/");
}

let allApostas = await useFetch("/api/aposta/getAll", {
  method: "POST",
  body: JSON.stringify({ edicao_id: route.params.id }),
});

allApostas = allApostas.data.value.apostas;

console.log("all apostas", allApostas);

let current_edicao = await useFetch("/api/edicao/getCurrentEdicao", {
  method: "POST",
  body: JSON.stringify({ id: route.params.id }),
});

current_edicao = current_edicao.data.value.edicao[0];

console.log("current_edicao", current_edicao);
let apostasWinners = [];
const numbers_wCount = ref([]);

if (current_edicao.finished == true) {
  const { data } = await useFetch("/api/aposta/getWinners", {
    method: "POST",
    body: JSON.stringify({ ids_apostas: current_edicao.winners }),
  });

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

  // No momento pegamos apenas as apostas vencedoreas, devo pegar todas as apostas do sorteio
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
  }

  navigateTo(`/edicao/${route.params.id}/sorteio`);
}

function iniciarSorteio() {
  if (allApostas.length === 0 || allApostas === undefined) {
    toast.add({
      title: "ERRO!",
      description: "Não é possível iniciar o sorteio sem apostas cadastradas",
      color: "red",
    });
    return;
  }

  if (current_edicao.started_drawn == true) {
    redirectToSorteio();
  } else {
    toast.add({
      title: "Atenção",
      actions,
      description:
        "Deseja iniciar o sorteio? uma vez com o sorteio iniciado não será mais possível cadastrar apostas",
    });
  }
}

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
        {{ current_edicao.drawn_numbers.length }}
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
