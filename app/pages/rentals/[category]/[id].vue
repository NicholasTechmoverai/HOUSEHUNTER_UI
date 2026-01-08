<template>
  <div class="space-y-12">
    <!-- Header Section -->
    <div class="m-3 space-y-2 flex flex-col  ">
      <NavigationBreadCrumb />
      <SearchCard />
    </div>

    <!-- Main Content Section -->
    <main>
      <UContainer class="py-1">
      
        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <RentalCardSkeleton v-for="n in 8" :key="`skeleton-${n}`" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
          <UIcon name="i-heroicons-exclamation-circle" class="h-12 w-12 text-red-500 mx-auto" aria-hidden="true" />
          <h2 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Failed to load rentals
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Please try again.
          </p>
          <UButton class="mt-6" variant="outline" @click="refreshAll" aria-label="Retry loading rentals">
            Retry
          </UButton>
        </div>

        <!-- Empty State -->
        <div v-else-if="!rental?.data" class="text-center py-20 px-4">
          <UIcon name="i-heroicons-home" class="h-14 w-14 text-gray-400 mx-auto" aria-hidden="true" />
          <h2 class="mt-4 text-xl font-bold text-gray-900 dark:text-white">
            No Rentals Available
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Be the first to list your property and start earning today.
          </p>
          <UButton :to="`/rentals/${category}`" size="lg" icon="i-heroicons-plus" class="mt-6"
            aria-label="View more rentals in this category">
            View more {{ category }} rentals
          </UButton>
        </div>

        <!-- Data State -->
        <div v-else  role="list"
          aria-label="Rental listings">
          <FullInfoRentalCard
            :rental="rental.data"
            class="transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            role="listitem"
          />
        </div>
      </UContainer>
    </main>
  </div>
</template>

<style scoped>
section {
  transition: opacity 0.3s ease;
}

/* Smooth transitions for hover effects */
.transition-transform {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

<script setup lang="ts">
const { get } = useApi()
const endpoints = useEndpoints()
const route = useRoute()

const rentalId = route.params.id as string
const category = route.params.category as string

// Human-readable category
const readableCategory = category
  ?.toLowerCase()
  .replaceAll('_', ' ')
  .replace(/\b\w/g, c => c.toUpperCase())

// Fetch rental data
const {
  data: rental,
  pending: loading,
  error,
  refresh,
} = await useAsyncData(
  () => `rental-${rentalId}`,
  () => get(endpoints.rental.getById(rentalId)),
  {
    watch: [() => route.params.id],
  }
)

// Get rental title
const rentalTitle = rental.value?.data?.title || 
  rentalId.charAt(0).toUpperCase() + rentalId.slice(1)

// SEO Optimization - call inside watch or onMounted for reactivity
watch([rental, () => route.params.id], () => {
  const currentRental = rental.value
  const currentRentalId = route.params.id as string
  
  const seoTitle = currentRental?.data?.title || 
    currentRentalId.charAt(0).toUpperCase() + currentRentalId.slice(1)
  
  const seoDescription = currentRental?.data?.description?.slice(0, 120) || 
    `Browse ${readableCategory} rentals and find your next home.`
  
  const seoImage = currentRental?.data?.profile_picture
  
  useSeo({
    title: seoTitle,
    description: seoDescription,
    image: seoImage,
    ogType: 'website'
  })

  // Add meta tags for better SEO
  useHead({
    meta: [
      {
        name: 'keywords',
        content: [
          seoTitle,
          readableCategory,
          'rentals',
          'properties',
          'real estate'
        ].filter(Boolean).join(', ')
      }
    ]
  })
}, { immediate: true })

onMounted(() => {
  // Initial SEO setup
  const seoTitle = rental.value?.data?.title || rentalTitle
  const seoDescription = rental.value?.data?.description?.slice(0, 120) || 
    `Browse ${readableCategory} rentals and find your next home.`
  
  useSeo({
    title: seoTitle,
    description: seoDescription,
    image: rental.value?.data?.profile_picture,
    ogType: 'website'
  })
})
</script>