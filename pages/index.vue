<!-- The first page of the app -->
<script setup>
// Importing and setting up the pinia store
const userMain = useMainStore();
const { currentEdicao } = storeToRefs(userMain);

const toast = useToast();

// getting all edicoes from the API
const { data } = await useFetch("/api/edicao/getAll");

// formatting the data to be displayed in the table
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

// formated columns for the table
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
  // calling the API to create a new edicao
  const { data } = await useFetch("/api/edicao/postNewEdicao", {
    method: "POST",
  });

  // if the API returns a 200 status, redirect to it's page and set the currentEdicao
  if (data.value.status === 200) {
    const id = data.value.edicao.id;
    currentEdicao.value = data.value.edicao;
    toast.add({
      title: "Edição criada com sucesso",
      description: "Agora é só apostar!",
    });
    navigateTo(`/edicao/${id}`);
  } else {
    toast.add({
      title: "Erro ao criar edição",
      description: "Tente novamente mais tarde",
      color: "red",
    });
  }
}

// function to select a row in the table and navigate to it's page
function selectRow(row) {
  currentEdicao.value = row;
  navigateTo(`/edicao/${row.id}`);
}

// setting the currentEdicao to null when the component is mounted (basic reset)
onMounted(() => {
  currentEdicao.value = null;
});
</script>

<template>
  <UContainer class="h-screen flex justify-center p-8 gap-3 flex-col">
    <h1 class="text-3xl">Programa IT Academy #20 - Eduardo Amengual Garcia</h1>
    <br />
    <UTable :rows="edicoes" :columns="columns" @select="selectRow" />
    <br />
    <UButton
      @click="createNewEdition"
      class="correction_button"
      label="Criar nova edição"
      :block="false"
    />
  </UContainer>
</template>

<style scoped>
/* facing a problem with NuxtUI button's size, so added this class to fix it */
.correction_button {
  width: max-content;
  padding: 12px;
}
</style>
