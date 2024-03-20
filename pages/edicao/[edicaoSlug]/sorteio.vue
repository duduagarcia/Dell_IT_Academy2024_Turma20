<script setup>
const toast = useToast();
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

const drawn_numbers = ref([]);
const winners = ref([]);
const rounds = ref(0);

function start() {
  if (drawn_numbers.value.length == 0) {
    for (let i = 0; i < 5; i++) {
      drawn_numbers.value.push(Math.floor(Math.random() * 50) + 1);
    }
  } else if (rounds.value <= 25) {
    drawn_numbers.value.push(Math.floor(Math.random() * 50) + 1);
  }

  for (let i = 0; i < apostas.length; i++) {
    const numbers = apostas[i].numbers;

    let hits = 0;
    for (let j = 0; j < drawn_numbers.value.length; j++) {
      if (numbers.includes(drawn_numbers.value[j])) {
        hits++;
      }
    }

    if (hits === 5) {
      winners.value.push(apostas[i]);
    }
  }

  if (winners.value.length > 0) {
    console.log(winners.value);
    toast.add({
      title: "Sorteio finalizado",
      description: "Há vencedores para premiar!",
      color: "green",
    });
    saveDataOnBD();
  } else {
    if (rounds.value <= 25) {
      rounds.value++;
      start();
    } else {
      toast.add({
        title: "Sorteio finalizado",
        description: "Não há vencedores para premiar!",
        color: "yellow",
      });
      saveDataOnBD();
    }
  }
}

const disableBtn = ref(true);
async function saveDataOnBD() {
  const { data } = await useFetch("/api/edicao/sorteio", {
    method: "POST",
    body: JSON.stringify({
      id: route.params.edicaoSlug,
      winners: winners.value,
      numbers: drawn_numbers.value,
    }),
  });

  if (data.value.status == 200) {
    disableBtn.value = false;
  }
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
      <h2 class="text-4xl mb-6">Números sorteado</h2>
      <div class="mb-5">
        <UKbd
          v-for="(number, index) in drawn_numbers"
          :key="index"
          class="mt-2 mb-2 mr-2"
          size="md"
          >{{ number }}</UKbd
        >
      </div>
      <UButton
        v-if="disableBtn"
        class="correction_button mr-5"
        variant="solid"
        label="Iniciar Sorteio"
        @click="start"
      />
    </div>
    <h2 class="text-4xl mb-6">Todas as apostas</h2>
    <UTable :rows="apostas" :columns="columns" />
  </UContainer>
</template>
