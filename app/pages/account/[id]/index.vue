<template>
  <div>
    
  </div>
</template>

<script setup>
const rentalStore = useRentalStore()

await useAsyncData('rental', () =>
  rentalStore.fetchRental(useRoute().params.id)
)
</script>

<style>

</style>