<script setup>
const breadcrumbs = useBreadcrumbs()
</script>

<template>
    <UBreadcrumb :items="breadcrumbs">
      <template #separator>
      <span class="mx-0 text-muted">/</span>
    </template>

    <template #dropdown="{ item }">
      <UDropdownMenu :items="item.children">
        <UButton v-if="item.icon" :icon="item.icon" color="neutral" variant="link" class="p-0.5" />
      </UDropdownMenu>
    </template>
  </UBreadcrumb>
</template>
