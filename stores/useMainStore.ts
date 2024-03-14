import { defineStore } from "pinia";

export const useMainStore = defineStore("user", () => {
  const user = ref({ name: "Eduardo" });

  return {
    user,
  };
});
