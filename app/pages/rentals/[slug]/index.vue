<template>
  <div>
  <div class="m-3 space-y-2 flex-col md:fl">
    <NavigationBreadCrumb />
    <SearchCard />
  </div>  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  breadcrumb: (route) => ({
    label: `${route.params.slug}`,
    icon: 'i-lucide-home'
  })
})

</script>


<style>

</style>