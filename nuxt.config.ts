import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  srcDir: 'app/',
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
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          sizes: 'any',
          href: '/favicon.svg?v=2',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '256x256',
          href: '/favicon.png?v=2',
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico?v=2',
        },
      ],
    },
  },
  typescript: {
    strict: true,
  },
  nitro: process.env.JUNIPER_NITRO_OUTPUT_DIR
    ? {
        output: {
          dir: process.env.JUNIPER_NITRO_OUTPUT_DIR,
        },
      }
    : undefined,
})
