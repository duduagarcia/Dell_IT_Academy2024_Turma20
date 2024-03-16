<script setup>
const userMain = useMainStore();
const { currentEdicao } = storeToRefs(userMain);
const route = useRoute();

console.log("current edição ", currentEdicao.value);

function goBackHome() {
  currentEdicao.value = null;
  navigateTo("/");
}
</script>

<template>
  <UContainer class="h-screen flex p-8 gap-3 flex-col">
    <h1>Edição</h1>
    <p>id: {{ route.params.id }}</p>
    <UButton class="correction_button" label="Voltar" @click="goBackHome" />
  </UContainer>
</template>

<style scoped>
.correction_button {
  width: max-content;
  padding: 12px;
}
</style>
