<script setup>
const route = useRoute();

function goBackHome() {
  navigateTo("/");
}

const { data } = await useFetch("/api/aposta/getAll", {
  method: "POST",
  body: JSON.stringify({ edicao_id: route.params.id }),
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

function criarAposta() {
  navigateTo(`/edicao/${route.params.id}/apostas/criar`);
}

function iniciarSorteio() {
  navigateTo(`/edicao/${route.params.id}/sorteio`);
}
</script>

<template>
  <UContainer class="h-screen flex p-8 gap-3 flex-col">
    <h1 class="my-7 text-2xl">Edição n° {{ route.params.id }}</h1>
    <p>Lista de apostas até o momento</p>
    <UTable :rows="data.apostas" :columns="columns" />
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
      />
      <UButton
        class="correction_button"
        variant="solid"
        label="Iniciar sorteio"
        @click="iniciarSorteio"
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
</style>
