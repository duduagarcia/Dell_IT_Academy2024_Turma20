<script setup>
const route = useRoute();
console.log("id: ", route.params.id);
</script>

<template>
  <div>
    <h1>Edição</h1>
    <p>id: {{ route.params.id }}</p>
  </div>
</template>
