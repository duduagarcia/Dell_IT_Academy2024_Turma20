<script setup>
const userMain = useMainStore();
const { user } = storeToRefs(userMain);

const { data } = await useFetch("/api/edicao/getAll");

const edicoes = [];

data.value.edicoes.forEach((edicao) => {
  edicoes.push({
    id: edicao.id,
    created_at: formatDate(edicao.created_at),
    finished: edicao.finished ? "Finalizado" : "Em andamento",
    winners: edicao.winners.length,
    drawn_numbers: edicao.drawn_numbers.length,
  });
});

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "created_at",
    label: "Criado em",
  },
  {
    key: "finished",
    label: "Status",
  },
  {
    key: "winners",
    label: "Vencedores",
  },
  {
    key: "drawn_numbers",
    label: "Números Sorteados",
  },
];

async function createNewEdition() {
  console.log("createNewEdition");

  const { data } = await useFetch("/api/edicao/postNewEdicao", {
    method: "POST",
  });

  if (data.value.status === 200) {
    console.log("Edição criada com sucesso");
    const id = data.value.edicao.id;
    navigateTo(`/edicao/${id}`);
  } else {
    console.log("Erro ao criar edição");
  }
}
</script>

<template>
  <UContainer class="h-screen flex justify-center p-8 gap-3 flex-col">
    <h1 class="text-3xl">Programa IT Academy #20 - Eduardo Amengual Garcia</h1>
    <br />
    <UTable :rows="edicoes" :columns="columns" />
    <br />
    <UButton
      @click="createNewEdition"
      size="md"
      label="Criar nova edição"
      :block="false"
    />
  </UContainer>
</template>
