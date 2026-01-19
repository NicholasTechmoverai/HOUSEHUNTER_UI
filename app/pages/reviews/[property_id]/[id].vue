<template>
  <div>
    <div> {{ property_id }}-{{ id }}</div>
    
  </div>
</template>

<script lang="ts" setup>
 const route = useRoute()
 const property_id = route.params.property_id
 const id = route.params.id
</script>

<style>

</style>