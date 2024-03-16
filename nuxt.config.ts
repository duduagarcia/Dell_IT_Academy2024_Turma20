// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxtjs/supabase",
  ],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
    },
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
  },
  css: ["@/assets/css/main.css"],
});
