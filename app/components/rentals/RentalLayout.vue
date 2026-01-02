<template>
  <div class="space-y-12">
    <!-- Trending Rentals Section -->
    <!-- <section>
      <UContainer class="py-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Trending Now</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">Most popular rentals this week</p>
          </div>
          <UButton
            v-if="trendingRentals?.length"
            to="/rentals"
            variant="ghost"
            color="gray"
            trailing-icon="i-heroicons-arrow-right-20-solid"
          >
            View All
          </UButton>
        </div>

        <div v-if="trendingLoading" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <RentalCardSkeleton v-for="n in 4" :key="n" />
          </div>
        </div>

        <div v-else-if="trendingError" class="text-center py-12">
          <UIcon name="i-heroicons-exclamation-triangle" class="h-12 w-12 text-amber-500 mx-auto" />
          <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Unable to load trending rentals</h3>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{{ trendingError.message }}</p>
          <UButton class="mt-4" @click="refreshTrending()" variant="outline">
            Try Again
          </UButton>
        </div>

        <div v-else-if="!trendingRentals?.length" class="text-center py-12">
          <UIcon name="i-heroicons-magnifying-glass" class="h-12 w-12 text-gray-400 mx-auto" />
          <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No trending rentals found</h3>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Check back later for new additions</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <RentalCard 
            v-for="rental in trendingRentals" 
            :key="`trending-${rental.id}`" 
            :rental="rental" 
            badge="Trending"
          />
        </div>
      </UContainer>
    </section> -->

    <!-- Featured Rentals Section -->
    <!-- <section class="bg-gray-50 dark:bg-gray-900/50">
      <UContainer class="py-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Rentals</h2>
        
        <div v-if="featuredLoading" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RentalCardSkeleton v-for="n in 3" :key="n" />
          </div>
        </div>

        <div v-else-if="featuredError" class="text-center py-12">
          <UIcon name="i-heroicons-exclamation-circle" class="h-12 w-12 text-red-500 mx-auto" />
          <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Error loading featured rentals</h3>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{{ featuredError.message }}</p>
        </div>

        <div v-else-if="!featuredRentals?.length" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">No featured rentals available</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RentalCard 
            v-for="rental in featuredRentals" 
            :key="`featured-${rental.id}`" 
            :rental="rental"
            badge="Featured"
          />
        </div>
      </UContainer>
    </section> -->

    <!-- Interactive Rentals Section -->
    <!-- <section>
      <UContainer class="py-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Interactive Experiences</h2>
        
        <div v-if="interactiveLoading" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RentalCardSkeleton v-for="n in 3" :key="n" />
          </div>
        </div>

        <div v-else-if="interactiveError" class="text-center py-8">
          <p class="text-red-600 dark:text-red-400">Failed to load interactive rentals</p>
        </div>

        <div v-else-if="!interactiveRentals?.length" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">No interactive rentals available</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RentalCard 
            v-for="rental in interactiveRentals" 
            :key="`interactive-${rental.id}`" 
            :rental="rental"
            badge="Interactive"
          />
        </div>
      </UContainer>
    </section> -->

    <!-- All Rentals Section -->
    <section>
      <UContainer class="py-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Rentals</h2>
        <div v-if="allLoading" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <RentalCardSkeleton v-for="n in 8" :key="n" />
          </div>
        </div>

        <div class="text-center py-8">
          <p class="text-red-600 dark:text-red-400">Failed to load rentals</p>
          <UButton class="mt-4" @click="refreshAll()" variant="outline">
            Retry
          </UButton>
        </div>

        <div v-if="!allRentals.data?.length" class="text-center py-16 px-4">
          <div class="max-w-sm mx-auto">
            <div class="relative w-20 h-20 mx-auto mb-6">
              <div
                class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl rotate-6">
              </div>
              <UIcon name="i-heroicons-home"
                class="relative h-12 w-12 text-gray-400/80 dark:text-gray-500 mx-auto flex items-center justify-center" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Rentals Available
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-xs mx-auto">
              Be the first to list your property and start earning.
            </p>
            <UButton to="/rentals/create" variant="solid" size="lg" icon="i-heroicons-plus"
              class="font-semibold px-8 hover:shadow-lg transition-shadow">
              List a Rental
            </UButton>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <RentalCard v-for="rental in allRentals.data" :key="`all-${rental.id}`" :rental="rental"
            class="transform transition-transform hover:-translate-y-1 duration-300" />
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()
const endpoints = useEndpoints()

// SEO Configuration
useSeo({
  title: 'Discover Amazing Rentals',
  description: 'Browse trending, featured, and interactive rentals for your next experience.',
  ogImage: '/images/rentals-og.jpg',
  twitterCard: 'summary_large_image'
})

// Data fetching with proper variable names
// const { 
//   data: trendingRentals, 
//   pending: trendingLoading, 
//   error: trendingError, 
//   refresh: refreshTrending 
// } = await useAsyncData(
//   'trending-rentals', 
//   () => get(endpoints.rental.listTrending)
// )

// const { 
//   data: featuredRentals, 
//   pending: featuredLoading, 
//   error: featuredError, 
//   refresh: refreshFeatured 
// } = await useAsyncData(
//   'featured-rentals', 
//   () => get(endpoints.rental.featured)
// )

// const { 
//   data: interactiveRentals, 
//   pending: interactiveLoading, 
//   error: interactiveError, 
//   refresh: refreshInteractive 
// } = await useAsyncData(
//   'interactive-rentals', 
//   () => get(endpoints.rental.listInteractive)
// )

const {
  data: allRentals,
  pending: allLoading,
  error: allError,
  refresh: refreshAll
} = await useAsyncData(
  'all-rentals',
  () => get(endpoints.rental.list)
)

// Optionally, refresh all data
const refreshAllData = async () => {
  await Promise.all([
    // refreshTrending(),
    // refreshFeatured(),
    // refreshInteractive(),
    refreshAll()
  ])
}

// Auto-refresh trending data every 5 minutes
onMounted(() => {
  setInterval(() => {
    // refreshTrending()
  }, 5 * 60 * 1000)
})
</script>

<style scoped>
/* Smooth transitions for better UX */
section {
  transition: all 0.3s ease;
}
</style>