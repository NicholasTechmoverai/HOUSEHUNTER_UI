// composables/useSeo.ts
import { useRoute, useHead, useAppConfig, useRuntimeConfig } from '#imports'

interface SEOOptions {
  title?: string
  description?: string
  image?: string
}

export const useSeo = ({ title, description, image }: SEOOptions = {}) => {
  const route = useRoute()
  const appConfig = useAppConfig()
  const runtimeConfig = useRuntimeConfig()

  // Base site URL
  const baseUrl = appConfig.site.url || runtimeConfig.public.siteUrl || ''

  // Fallbacks
  const defaultTitle = appConfig.site.name || 'HouseHunter'
  const defaultDescription = appConfig.site.description || 'Discover properties and connect with agents.'
  const defaultImage = appConfig.site.defaultImage || '/default-image.png'
  const favicon = appConfig.site.favicon || '/favicon.png'

  // Computed SEO fields
  const seoTitle = title ? `${title} - ${defaultTitle}` : defaultTitle
  const seoDescription = description || defaultDescription
  const seoImage = image || defaultImage
  const canonical = `${baseUrl.replace(/\/$/, '')}${route.fullPath}`

  // Apply SEO meta to the page
  useHead({
    title: seoTitle,
    htmlAttrs: { lang: 'en' },
    meta: [
      // Basic
      { name: 'description', content: seoDescription },
      { name: 'author', content: 'HouseHunter' },

      // Open Graph
      { property: 'og:title', content: seoTitle },
      { property: 'og:description', content: seoDescription },
      { property: 'og:image', content: seoImage },
      { property: 'og:url', content: canonical },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: defaultTitle },

      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seoTitle },
      { name: 'twitter:description', content: seoDescription },
      { name: 'twitter:image', content: seoImage },
      { name: 'twitter:creator', content: `@${defaultTitle}` },

      // SEO helpers
      { name: 'robots', content: 'index, follow' },
      { name: 'theme-color', content: '#ffffff' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: favicon },
      { rel: 'canonical', href: canonical },
      { rel: 'apple-touch-icon', href: favicon }
    ]
  })
}
