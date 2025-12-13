

<template>
  <UContainer class="py-8">
    <h1 class="text-3xl font-bold mb-6">Apartments</h1>

    <div v-if="pending" class="text-gray-500">Loading apartments...</div>

    <div v-else class="grid gap-4">
      <ApartmentCard v-for="apartment in apartments" :key="apartment.id" :apartment="apartment" />
    </div>
    </UContainer>
    <ApartmentCard />
</template>

<script setup lang="ts">

const { get } = useApi()
const { apartmentData: apartments, apartmentLoading } = await useAsyncData('apartment', () => get('/apartments'))
const { trendingData: trending, trendingLoading } = await useAsyncData('trending', () => get('/trending'))
const { previewData: preview , previewLoading } = await useAsyncData('preview', () => get('/preview'))
const { interactiveData: interactive , interactiveLoading } = await useAsyncData('interactive', () => post('/interactive'))
const { searchedData: searched , searchedLoading } = await useAsyncData('searched', () => get('/searched'))

// const mm = useApi().post('/multimedia')

</script>
  