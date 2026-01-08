<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import DeMap from '~/components/property/DeMap.vue'

const route = useRoute()

const lat = computed(() => Number(route.query.lat))
const long = computed(() => Number(route.query.long))
const heatMaps = ref([])
</script>

<template>
  <DeMap :heat-maps="heatMaps" />
</template>
