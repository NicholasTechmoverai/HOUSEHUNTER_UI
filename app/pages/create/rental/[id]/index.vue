<template>
  <div>
    <h3>Edit Rental {{ route.params.id }}</h3>

    <pre>
{{ rentalStore.ongoingCreate }}
    </pre>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import { useEndpoints } from '~/composables/useEndpoints'
import { useSeo } from '~/composables/useSeo'
import { useUserStore } from '~/stores/user'

const route = useRoute()
const { post } = useApi()
const endpoints = useEndpoints()
const rentalStore = useRentalStore()
const userStore = useUserStore()

onMounted(() => {
  useSeo({
    title: 'Edit Rental - ' + route.params.id,
    description: 'Edit your rental property details',
    image: undefined
  })
})

// Only run on client side after hydration
const {
  pending,
  error,
  refresh,
  data: rentalData
} = await useLazyAsyncData(
  () => `rental_for_edit_${route.params.id}`,
  async () => {
    // Wait for user to be hydrated/authenticated
    if (!userStore.isAuthenticated) {
      throw new Error('User not authenticated')
    }
    return await rentalStore.fetchRentalByIdForEdit(route.params.id as string)
  },
  {
    watch: [() => route.params.id],
    server: false, // This is key: don't run on server
    immediate: false // Don't run immediately
  }
)

// Trigger the fetch when user is authenticated
watch(() => userStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    refresh()
  }
})

// Also trigger on mount if already authenticated
onMounted(() => {
  if (userStore.isAuthenticated) {
    refresh()
  }
})
</script>

<style scoped>
pre {
  background: #565252;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
</style>
