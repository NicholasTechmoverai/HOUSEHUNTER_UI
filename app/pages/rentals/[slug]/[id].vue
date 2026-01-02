<template>
  <div>
  <div class="m-3 space-y-2 flex-col md:fl">
    <NavigationBreadCrumb />
    <SearchCard />
  </div>  </div>
</template>

<script setup lang="ts">
definePageMeta({
  breadcrumb: (route) => ({
    label: `${route.params.slug} ${route.params.id}`,
    icon: 'i-lucide-home'
  })
})
</script>

<style>

</style>