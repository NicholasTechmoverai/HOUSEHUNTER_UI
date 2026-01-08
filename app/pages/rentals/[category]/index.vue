<script setup lang="ts">
const { get } = useApi()
const endpoints = useEndpoints()
const route = useRoute()

// category from URL param
const category = computed(() => route.params.category as string)

useSeo({
  title: `${category.value.replaceAll('_', ' ')} modern rentals`,
  description: 'Browse available rentals and find your next home.',
})

const {
  data: allRentals,
  pending: allLoading,
  error: allError,
  refresh: refreshAll,
} = await useAsyncData(
  () => `all-rentals-${category.value}`,
  () => get(endpoints.rental.list, { category: category.value }),
  {
    watch: [category],
  }
)
</script>



<template>
  <div class="space-y-12">
      <div class="m-3 space-y-2 flex-col md:fl">
      <NavigationBreadCrumb />
      <SearchCard />
    </div>
    <!-- All Rentals Section -->
    <section>
      <UContainer class="py-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          All Rentals
        </h2>

        <!-- Loading -->
        <div v-if="allLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <RentalCardSkeleton v-for="n in 8" :key="n" />
        </div>

        <!-- Error -->
        <div v-else-if="allError" class="text-center py-16">
          <UIcon
            name="i-heroicons-exclamation-circle"
            class="h-12 w-12 text-red-500 mx-auto"
          />
          <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Failed to load rentals
          </h3>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Please try again.
          </p>
          <UButton class="mt-6" variant="outline" @click="refreshAll">
            Retry
          </UButton>
        </div>

        <!-- Empty -->
        <div
          v-else-if="!allRentals?.data?.length"
          class="text-center py-20 px-4"
        >
          <UIcon
            name="i-heroicons-home"
            class="h-14 w-14 text-gray-400 mx-auto"
          />
          <h3 class="mt-4 text-xl font-bold text-gray-900 dark:text-white">
            No Rentals Available
          </h3>
          <p class="mt-2 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Be the first to list your property and start earning today.
          </p>
          <UButton
            to="/rentals/create"
            size="lg"
            icon="i-heroicons-plus"
            class="mt-6"
          >
            List a Rental
          </UButton>
        </div>

        <!-- Data -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        >
          <RentalCard
            v-for="rental in allRentals.data"
            :key="rental.id"
            :rental="rental"
            class="transition-transform hover:-translate-y-1"
          />
        </div>
      </UContainer>
    </section>
  </div>
</template>

<style scoped>
section {
  transition: opacity 0.3s ease;
}
</style>
