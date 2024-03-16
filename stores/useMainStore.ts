import { defineStore } from "pinia";

export const useMainStore = defineStore("user", () => {
  const currentEdicao = ref(null);

  return {
    currentEdicao,
  };
});
