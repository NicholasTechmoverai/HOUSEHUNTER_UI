const SITE_NAME = 'HouseHunter'
const SITE_URL = 'https://househunter.tera-in.top'
const API_URL = 'https://api.tera-in.top'
// const API_URL = 'http://localhost:8000'
const DEV_HOST = 'househunter.tera-in.top'

const DEFAULT_DESCRIPTION = 'Find, rent, and swap houses easily'
const THEME_COLOR = '#FF5733'
const BACKGROUND_COLOR = '#FFFFFF'
const FAVICON = '/f_logo.png'

export default defineNuxtConfig({
  ssr: true,
  runtimeConfig: {
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID
    }
  },
  nitro: {
    preset: 'static'
  },

  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    'nuxt-schema-org',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap'
  ],

  pwa: {
    registerType: 'autoUpdate',

    manifest: {
      name: SITE_NAME,
      short_name: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      start_url: '/',
      display: 'standalone',
      theme_color: THEME_COLOR,
      background_color: BACKGROUND_COLOR,
      icons: [
        {
          src: '/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },

    workbox: {
      navigateFallback: '/'
    },

    devOptions: {
      enabled: true
    }
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },

    head: {
      script: [
        {
          src: 'https://accounts.google.com/gsi/client',
          async: true,
          defer: true
        }
      ],
      title: `${SITE_NAME} – Discover Properties`,
      meta: [
        { name: 'description', content: DEFAULT_DESCRIPTION },
        { name: 'theme-color', content: THEME_COLOR }
      ],
      link: [
        { rel: 'canonical', href: SITE_URL },
        { rel: 'icon', type: 'image/png', href: FAVICON }
      ]
    }
  },

  vite: {
    server: {
      allowedHosts: [
        DEV_HOST,
        'localhost',
        '127.0.0.1',
        'househunter.tera-in.top',
        'www.househunter.tera-in.top',
        'api.tera-in.top'
      ]
    }
  },

  nitro: {
    routeRules: {
      '/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    }
  },

  components: {
    global: true,
    dirs: [
      { path: '~/components/apartments', pathPrefix: false },
      { path: '~/components/property', pathPrefix: false },
      { path: '~/components/rentals', pathPrefix: false },
      // { path: '~/components/swaps', pathPrefix: false },
      { path: '~/components/user', pathPrefix: false },
      { path: '~/components/common', pathPrefix: false },
      { path: '~/components/auth', pathPrefix: false }
    ]
  },

  css: ['~/assets/css/main.css',
    'leaflet/dist/leaflet.css'
  ],

  robots: {
    userAgent: '*',
    disallow: '',
    sitemap: `${SITE_URL}/sitemap.xml`
  },

  sitemap: {
    hostname: SITE_URL,
    gzip: true,
    changefreq: 'weekly',
    priority: 0.8,
    trailingSlash: true,
    routes: async (): Promise<string[]> => {
      try {
        const properties: Array<{ slug: string }> = await $fetch(`${API_URL}/properties`)
        return properties.map(p => `/properties/${p.slug}`)
      } catch (error) {
        console.error('Failed to fetch dynamic sitemap routes:', error)
        return []
      }
    }
  },

  schemaOrg: {
    host: SITE_URL,
    defaults: {
      website: {
        name: SITE_NAME,
        url: SITE_URL
      }
    }
  }
})