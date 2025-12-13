// composables/useSeo.ts
import { useRoute, useHead } from '#imports'

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
  const canonical = `${config.site.url}${route.fullPath}`

  // Basic site-wide head
  useHead({
    title: seoTitle,
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: seoDescription }
    ],
    link: [
      { rel: 'canonical', href: canonical },
      { rel: 'icon', href: config.site.favicon }
    ],
    htmlAttrs: { lang: 'en' }
  })

  // Social & SEO metadata
  useSeoMeta({
    title: seoTitle,
    description: seoDescription,
    ogTitle: seoTitle,
    ogDescription: seoDescription,
    ogImage: seoImage,
    twitterImage: seoImage,
    twitterCard: 'summary_large_image'
  })
}
