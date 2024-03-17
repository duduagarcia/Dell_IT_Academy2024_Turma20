// Definig a vue store with pinia
// Stores are a way to share state between components in a reactive way without passing props down the component tree
import { defineStore } from "pinia";

export const useMainStore = defineStore("user", () => {
  // Here we define a reactive variable to store the current edition for example (we can also define functions as well)
  const currentEdicao = ref(null);

  return {
    currentEdicao,
  };
});
