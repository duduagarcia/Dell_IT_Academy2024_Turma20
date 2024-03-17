<script setup>
const route = useRoute();

function goBack() {
  navigateTo(`/edicao/${route.params.edicaoSlug}`);
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

function start() {
  const numbers = [];
  for (let i = 0; i < 5; i++) {
    numbers.push(Math.floor(Math.random() * 100));
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
      <h2 class="text-4xl mb-6">Números sorteados</h2>
      <div class="mb-5">
        <UKbd
          v-for="(number, index) in currentDrawnNumbers"
          :key="index"
          class="mr-4"
          size="md"
          >{{ number }}</UKbd
        >
      </div>
      <UButton
        class="correction_button mr-5"
        variant="solid"
        label="Sortear número"
        @click="start"
      />
    </div>
    <p>Números sorteados anteriormente</p>
    <div class="flex gap-4 flex-wrap">
      <UBadge
        color="primary"
        variant="subtle"
        size="lg"
        v-for="(sequence, index) in currentEdicao.drawn_numbers"
        :key="index"
        >{{ sequence }}</UBadge
      >
    </div>
    <br />
    <UTable :rows="currentEdicao.apostas" :columns="columns" />
  </UContainer>
</template>
