// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
    },
  },
});
