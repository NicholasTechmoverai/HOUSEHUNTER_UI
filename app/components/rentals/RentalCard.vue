<template>
  <UPageCard
    title="Tailwind CSS"
    description="Nuxt UI integrates with the latest Tailwind CSS v4, bringing significant improvements."
    icon="i-simple-icons-tailwindcss"
    orientation="horizontal"
    spotlight
    spotlight-color="primary"
  >
    <img
      src="/tailwindcss-v4.svg"
      alt="Tailwind CSS"
      class="w-full"
    />
  </UPageCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  rental: Record<string, any>
}>()
</script>
