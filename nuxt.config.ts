// Main nuxt configuration file
// Here we define the modules and plugins we want to use in our app
// Also we define the global css file we want to use
// And the configuration for the supabase module
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
