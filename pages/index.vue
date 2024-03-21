<!-- Primeira página da aplicação -->
<script setup>
const toast = useToast();

// Pegando todas as Edições da API
const { data } = await useFetch("/api/edicao/getAll");

// Formatando as edições para a tabela
const edicoes = [];
data.value.edicoes.forEach((edicao) => {
  edicoes.push({
    id: edicao.id,
    created_at: formatDate(edicao.created_at),
    finished: edicao.finished ? "Finalizado" : "Em andamento",
    status: edicao.started_drawn ? "Sorteio" : "Apostas abertas",
    winners: edicao.winners.length,
    drawn_numbers: edicao.drawn_numbers.length,
  });
});

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}

// Template para as colunas da tabela
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
    key: "status",
    label: "Fase",
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
  // Chamando a rota da api para criar uma nova edição
  const { data } = await useFetch("/api/edicao/postNewEdicao", {
    method: "POST",
  });

  // Se ocorrer tudo bem com a criação, redireciona para a página da edição
  if (data.value.status === 200) {
    const id = data.value.edicao.id;
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

function selectRow(row) {
  navigateTo(`/edicao/${row.id}`);
}
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
.correction_button {
  width: max-content;
  padding: 12px;
}
</style>
