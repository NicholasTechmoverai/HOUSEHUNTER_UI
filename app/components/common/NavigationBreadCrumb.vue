<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'

const items = ref<BreadcrumbItem[]>([
  {
    label: 'Docs',
    icon: 'i-lucide-book-open',
    to: '/docs'
  },
  {
    label: 'Components',
    icon: 'i-lucide-box',
    to: '/docs/components'
  },
  {
    label: 'Breadcrumb',
    icon: 'i-lucide-link',
    to: '/docs/components/breadcrumb'
  }
])
</script>

<template>
  <UBreadcrumb :items="items" />
</template>