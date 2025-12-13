<template>
  <!-- Apartments Section -->
  <UContainer class="py-8">
    <h1 class="text-3xl font-bold mb-6">Apartments</h1>

    <!-- Skeleton while loading -->
    <div v-if="apartmentLoading" class="space-y-4">
      <div class="flex items-center gap-4" v-for="n in 4" :key="n">
        <USkeleton class="h-12 w-12 rounded-full" />
        <div class="grid gap-2">
          <USkeleton class="h-4 w-[250px]" />
          <USkeleton class="h-4 w-[200px]" />
        </div>
      </div>
    </div>

    <!-- Actual content -->
    <div v-else class="grid gap-4">
      <ApartmentCard
        v-for="apartment in apartments"
        :key="apartment.id"
        :apartment="apartment"
      />
    </div>
  </UContainer>

  <!-- Rentals Section -->
  <UContainer class="py-8">
    <h1 class="text-3xl font-bold mb-6">Rentals</h1>

    <!-- Skeleton while loading -->
    <div v-if="rentalsLoading" class="space-y-4">
      <div class="flex items-center gap-4" v-for="n in 4" :key="n">
        <USkeleton class="h-12 w-12 rounded-full" />
        <div class="grid gap-2">
          <USkeleton class="h-4 w-[250px]" />
          <USkeleton class="h-4 w-[200px]" />
        </div>
      </div>
    </div>

    <!-- Actual content -->
    <div v-else class="grid gap-4">
      <RentalCard
        v-for="rental in rentals"
        :key="rental.id"
        :rental="rental"
      />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const { get, post } = useApi()

const { data: apartments, pending: apartmentLoading } = await useAsyncData(
  'apartment',
  () => get('/apartments')
)

const { data: rentals, pending: rentalsLoading } = await useAsyncData(
  'rentals',
  () => get('/rentals')
)

const { data: swaps, pending: swapsLoading } = await useAsyncData(
  'swaps',
  () => get('/swaps')
)
// … etc
</script>
