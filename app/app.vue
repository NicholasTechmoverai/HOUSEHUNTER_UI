<script setup>
useSeo()
const layout = 'default'
const toaster = { position: 'top-center' }

const brandGradient = 'linear-gradient(90deg, var(--color-brand-start) 0%, var(--color-brand-middle) 50%, var(--color-brand-end) 100%)'
const myFunction = () => 150

const loadingOptions = {
  throttle: 0,
  duration: 2500,
  estimatedProgress: myFunction,
  color: brandGradient,
  height: 2
}

const isLoading = ref(false)
const { pending } = useNuxtApp()

watch(pending, (newVal) => {
  isLoading.value = newVal
})
</script>

<template>
  <NuxtLoadingIndicator v-bind="loadingOptions" class="!fixed !top-0 !left-0 !right-0 !z-[9999]" />
  
  <NuxtLayout :name="layout" :toaster="toaster">
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* For smooth animation */
.nuxt-loading-indicator {
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Optional: Add fade transition */
.nuxt-loading-indicator {
  transition: opacity 0.3s ease;
}
</style>