const SITE_NAME = 'HouseHunter'
const SITE_URL = 'https://househunter.com'
const API_URL = 'https://api.househunter.com'
const DEFAULT_DESCRIPTION = 'Explore and list amazing real estate properties worldwide.'
const THEME_COLOR = '#FF5733'
const FAVICON = '/f_logo.png'

export default defineNuxtConfig({
  ssr: true,

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    'nuxt-schema-org',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap'
  ],
  components: {
    global: true,
    dirs: [
      { path: '~/components/apartments', pathPrefix: false },
      { path: '~/components/rentals', pathPrefix: false },
      { path: '~/components/swaps', pathPrefix: false },
      { path: '~/components/user', pathPrefix: false },
      { path: '~/components/common', pathPrefix: false },
    ]
  },
  css: ['~/assets/css/main.css'],

  devtools: { enabled: true },

  app: {
    head: {
      title: `${SITE_NAME} - Discover Properties`,
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
      } catch (err) {
        console.error('Failed to fetch dynamic routes for sitemap:', err)
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
  },

})
