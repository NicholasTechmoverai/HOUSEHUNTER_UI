<template>
  <div>
    <div class="flex flex-row justify-between"> <UButton label="" icon="i-lucide-arrow-top" /> <p>{{ proprty_id }}</p> </div>
  </div>
</template>

<script lang="ts" setup>
    const route  = useRoute()
    const proprty_id = route.params.property_id

</script>

<style>

</style>