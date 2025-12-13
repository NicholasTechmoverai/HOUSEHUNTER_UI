

<template>
    <UContainer class="py-8">
    <h1 class="text-3xl font-bold mb-6">Rentals</h1>

    <div v-if="pending" class="text-gray-500">Loading rentals...</div>

    <div v-else class="grid gap-4">
      <RentalCard v-for="rental in rentals" :key="rental.id" :rental="rental" />
    </div>
    <RentalCard/>
  </UContainer>
</template>

<script setup lang="ts">
const { get } = useApi()
const { rentalsData: rentals, rentalsLoading } = await useAsyncData('rentals', () => get('/rentals'))
const { trendingData: trending, trendingLoading } = await useAsyncData('trending', () => get('/trending'))
const { previewData: preview , previewLoading } = await useAsyncData('preview', () => get('/preview'))
const { interactiveData: interactive , interactiveLoading } = await useAsyncData('interactive', () => post('/interactive'))
const { searchedData: searched , searchedLoading } = await useAsyncData('searched', () => get('/searched'))

// const mm = useApi().post('/multimedia')

</script>
  