<script setup>
import { ref } from "vue";

const route = useRoute();

function goBack() {
  navigateTo(`/edicao/${route.params.edicaoSlug}`);
}

const { data } = await useFetch("/api/aposta/getAll", {
  method: "POST",
  body: JSON.stringify({ edicao_id: route.params.edicaoSlug }),
});

const apostas = [];
data.value.apostas.forEach((aposta) => {
  apostas.push(aposta);
});

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

const drawnNumbers_list = ref([]);
const winners = ref([]);

function start() {
  const numbers = [];
  for (let i = 0; i < 5; i++) {
    numbers.push(Math.floor(Math.random() * 50) + 1);
  }

  //   !! ATTENTION !!
  //    It may happen that you make several attempts at the draw and no winner comes out, if you want to force a winner and confirm that the code works, manually add the combination you want here in the position of the draw you want

  // Choose the position you want, EX: The TENTH number generated from the draw must be the ont you set here
  let position = 10;
  if (drawnNumbers_list.value.length == position - 1) {
    drawnNumbers_list.value.push([49, 36, 37, 44, 2]);
  } else {
    drawnNumbers_list.value.push(numbers);
  }

  //   Real line
  //   drawnNumbers_list.value.push(numbers);

  for (let i = drawnNumbers_list.value.length - 1; i >= 0; i--) {
    let DRAWN_NUMBERS = drawnNumbers_list.value[i];
    // console.log(`COMPARANDO COM O NÚMERO ${DRAWN_NUMBERS}`);
    for (let j = 0; j < apostas.length; j++) {
      let apostasNumbers = apostas[j].numbers;

      // Conta a quantidade de ocorrências de cada número na lista sorteada e na aposta
      const drawnCounts = countOccurrences(DRAWN_NUMBERS);
      const apostaCounts = countOccurrences(apostasNumbers);

      // Verifica se todos os números sorteados estão presentes na aposta e não excedem a quantidade de ocorrências no sorteio
      let allHits = true;
      for (const [number, count] of Object.entries(drawnCounts)) {
        if (!(number in apostaCounts) || apostaCounts[number] < count) {
          allHits = false;
          break;
        }
      }

      if (allHits) {
        winners.value.push(apostas[j]);
        // console.log(`Aposta ${j + 1} é uma ganhadora!`);
      } else {
        // console.log(`Aposta ${j + 1} é uma perdedora.`);
      }
    }
  }

  if (winners.value.length > 0) {
    console.log("Os ganhadores são: ", winners.value);
    saveDataOnBD();
  } else {
    console.log("Não houve ganhadores.");
    if (drawnNumbers_list.value.length < 25) {
      start();
    } else {
      console.log("Fim do sorteio");
      saveDataOnBD();
    }
  }
}

async function saveDataOnBD() {
  const { data } = await useFetch("/api/edicao/sorteio", {
    method: "POST",
    body: JSON.stringify({
      id: route.params.edicaoSlug,
      winners: winners.value,
      numbers: drawnNumbers_list.value,
    }),
  });

  console.log("response at the end", data.value);
}

// Função auxiliar para contar as ocorrências de cada elemento em um vetor
function countOccurrences(arr) {
  const counts = {};
  for (const num of arr) {
    counts[num] = (counts[num] || 0) + 1;
  }
  return counts;
}
</script>

<template>
  <UContainer class="flex p-8 gap-3 flex-col">
    <div class="flex items-center gap-5">
      <UButton variant="link" size="sm" @click="goBack"> Voltar </UButton>
      <h1 class="my-7 text-2xl">
        SORTEIO - Edição n° {{ route.params.edicaoSlug }}
      </h1>
    </div>
    <div class="mb-8">
      <h2 class="text-4xl mb-6">Número sorteado</h2>
      <div class="mb-5">
        <UKbd
          v-for="(number, index) in drawnNumbers_list[
            drawnNumbers_list.length - 1
          ]"
          :key="index"
          class="mr-4"
          size="md"
          >{{ number }}</UKbd
        >
      </div>
      <UButton
        class="correction_button mr-5"
        variant="solid"
        label="Iniciar Sorteio"
        @click="start"
      />
    </div>
    <p>Números sorteados anteriormente</p>
    <div class="flex gap-4 flex-wrap">
      <UBadge
        color="primary"
        variant="subtle"
        size="lg"
        v-for="(sequence, index) in drawnNumbers_list"
        :key="index"
        >{{ sequence }}</UBadge
      >
    </div>
    <br />
    <h2 class="text-4xl mb-6">Todas as apostas</h2>
    <UTable :rows="apostas" :columns="columns" />
  </UContainer>
</template>
