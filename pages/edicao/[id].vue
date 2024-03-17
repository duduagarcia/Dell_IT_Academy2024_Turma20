<script setup>
const route = useRoute();
const toast = useToast();

function goBackHome() {
  navigateTo("/");
}

const { data } = await useFetch("/api/aposta/getAll", {
  method: "POST",
  body: JSON.stringify({ edicao_id: route.params.id }),
});

const edicao_model = await useFetch("/api/edicao/getCurrentEdicao", {
  method: "POST",
  body: JSON.stringify({ id: route.params.id }),
});

const current_edicao = edicao_model.data.value.edicao[0];

console.log(current_edicao);

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
  if (data.value.apostas?.length === 0 || data.value.apostas === undefined) {
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
  <UContainer class="h-screen flex p-8 gap-3 flex-col">
    <h1 class="my-7 text-2xl">Edição n° {{ route.params.id }}</h1>
    <p>Apostas registradas até o momento</p>
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
