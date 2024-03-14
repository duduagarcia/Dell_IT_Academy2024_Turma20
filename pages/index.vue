<script setup>
const userMain = useMainStore();
const { user } = storeToRefs(userMain);

console.log(user.value);
</script>

<template>
  <div>
    <h1>Hello world</h1>
    <UAvatar
      src="https://avatars.githubusercontent.com/u/739984?v=4"
      alt="Avatar"
    />
  </div>
</template>
