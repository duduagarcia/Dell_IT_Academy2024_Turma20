<script setup>
const route = useRoute();
console.log("id: ", route.params.id);

function goBackHome() {
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
