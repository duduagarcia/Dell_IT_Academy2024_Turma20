<script setup>
const toast = useToast();
const route = useRoute();

console.log(route.params);
// Pegando os dados do vencedor
let winnerData = await useFetch("/api/aposta/getAll", {
  method: "POST",
  body: JSON.stringify({ edicao_id: route.params.edicaoSlug }),
});
winnerData = winnerData.data.value.apostas.filter(
  (aposta) => aposta.id == route.params.idAposta
);

// Pegando a quantidade de vencedores
let winnersAmount = await useFetch("/api/edicao/getCurrentEdicao", {
  method: "POST",
  body: JSON.stringify({ id: route.params.edicaoSlug }),
});
winnersAmount = winnersAmount.data.value.edicao[0].winners.length;

// Dividindo o prêmio igualmente entre os vencedores
const prize = 10000 / winnersAmount;

function givePrize() {
  toast.add({
    title: "Sucesso!",
    description: `Você entregou o premio de R$ ${prize} para o vencedor`,
    color: "green",
  });
}

function goBack() {
  navigateTo(`/edicao/${route.params.edicaoSlug}`);
}
</script>

<template>
  <UContainer class="h-screen p-8">
    <h1 class="text-3xl">Premiaçao da aposta {{ winnerData[0].id }}</h1>
    <br />
    <h2>
      Parabéns <b class="text-green-500">{{ winnerData[0].name }}</b
      >!
    </h2>
    <br />
    <p v-if="winnersAmount == 1">
      Parabéns! Como só você acertou o número correto, ganhou o prêmio total!
    </p>
    <p v-else>
      Parabéns! Você e mais {{ winnersAmount - 1 }} competidores ganharam, logo
      o premio de R$ 10000,00 será dividio entre {{ winnersAmount }} pessoas
    </p>
    <br />
    <UButton
      class="correction_button mr-4"
      variant="outline"
      label="Voltar"
      @click="goBack"
    />
    <UButton class="correction_button" color="primary" @click.once="givePrize"
      >Receber prêmio</UButton
    >
  </UContainer>
</template>

<style scoped>
/* facing a problem with NuxtUI button's size, so added this class to fix it */
.correction_button {
  width: max-content;
  padding: 12px;
}
</style>
