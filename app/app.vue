<script setup>
useSeo()
const layout = 'default'
const toaster = { position: 'top-center' }

</script>

<template>
    <NuxtLayout :name="layout" :toaster="toaster">
      <NuxtPage />
    </NuxtLayout>
</template>
