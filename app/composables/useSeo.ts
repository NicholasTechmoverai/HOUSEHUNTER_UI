// composables/useSeo.ts
import { useRoute, useHead, useAppConfig } from '#imports'

interface SEOOptions {
  title?: string
  description?: string
  image?: string
}

export const useSeo = ({ title, description, image }: SEOOptions = {}) => {
  const config = useAppConfig()
  const route = useRoute()

  const seoTitle = title ? `${title} - ${config.site.name}` : config.site.name
  const seoDescription = description || config.site.description
  const seoImage = image || config.site.defaultImage
  const canonical = `${config.site.url.replace(/\/$/, '')}${route.fullPath}`

  useHead({
    title: seoTitle,
    htmlAttrs: { lang: config.site.locale || 'en' },
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: seoDescription },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      // Open Graph
      { property: 'og:title', content: seoTitle },
      { property: 'og:description', content: seoDescription },
      { property: 'og:image', content: seoImage },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonical },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seoTitle },
      { name: 'twitter:description', content: seoDescription },
      { name: 'twitter:image', content: seoImage }
    ],
    link: [
      { rel: 'canonical', href: canonical },
      { rel: 'icon', href: config.site.favicon },
      { rel: 'apple-touch-icon', href: '/icons/icon-192.png' }
    ]
  })
}
