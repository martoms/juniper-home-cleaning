import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: 'Juniper Home Cleaning | Instant Estimate',
      meta: [
        {
          name: 'description',
          content:
            'Build a transparent home cleaning estimate in under a minute.',
        },
      ],
    },
  },
  typescript: {
    strict: true,
  },
})
