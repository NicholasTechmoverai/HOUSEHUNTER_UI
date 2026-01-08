<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  // Property Sections
  {
    label: 'Rentals',
    to: '/rentals',
    icon: 'i-lucide-home',
    badge: 'New',
    active: route.path.startsWith('/rentals')
  },
  {
    label: 'Apartments',
    to: '/apartments',
    icon: 'i-lucide-building',
    active: route.path.startsWith('/apartments')
  },
  {
    label: 'Swaps',
    to: '/swaps',
    icon: 'i-lucide-refresh-cw',
    badge: 'New',
    active: route.path.startsWith('/swaps')
  },

  // Divider (optional)
  { type: 'divider' },

  // Actions
  {
    label: 'Create Listing',
    to: '/create',
    icon: 'i-lucide-plus-square',
    variant: 'primary' as const,
    active: route.path.startsWith('/create')
  },

  // Information
  {
    label: 'About',
    to: '/about',
    icon: 'i-lucide-info',
    active: route.path.startsWith('/about')
  },

  // User
  // {
  //   label: 'My Account',
  //   to: '/account',
  //   icon: 'i-lucide-user',
  //   active: route.path.startsWith('/account')
  // }
])
</script>

<template>
  <UHeader>
    <template #title>
      <NuxtLink to="/">
        <AppLogo class="w-auto shrink-0" />
      </NuxtLink>
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <LoggedIcon />

      </UTooltip>
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
    </template>
  </UHeader>
</template>
