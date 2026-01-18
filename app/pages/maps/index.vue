<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute } from '#imports'
import DeMap from '~/components/property/DeMap.vue'


const route = useRoute()

const lat = computed(() => Number(route.query.lat) || 0)
const long = computed(() => Number(route.query.long) || 0)
const heatMaps = ref<any[]>([])


let mapSocket: ReturnType<typeof useSocket> | null = null


function emitMap(event: string, payload?: any) {
  if (!mapSocket) {
    console.warn('⚠️ Socket not initialized yet')
    return
  }

  if (mapSocket.connected) {
    mapSocket.emit(event, payload)
  } else {
    mapSocket.once('connect', () => {
      mapSocket?.emit(event, payload)
    })
  }
}


const onHeatMapsUpdate = (data: any) => {
  console.log('🔥 heat map update', data)
  heatMaps.value = [data.heat_maps.rentals]
}

onMounted(() => {
  mapSocket = useSocket('map')

  mapSocket.on('connect', () => {
    console.log('✅ Map socket connected')

    emitMap('get_heat_maps', {
      latitude: lat.value,
      longitude: long.value
    })
  })

  mapSocket.on('live_on_map_heatmaps', onHeatMapsUpdate)

  mapSocket.on('reconnect', () => {
    console.log('🔄 Map socket reconnected')
    emitMap('get_heat_maps', {
      latitude: lat.value,
      longitude: long.value
    })
  })
})

onBeforeUnmount(() => {
  if (!mapSocket) return
  mapSocket.off('connect')
  mapSocket.off('reconnect')
  mapSocket.off('live_on_map_heatmaps:update', onHeatMapsUpdate)
})
</script>

<template>
  <div class="border h-full w-full">
    <DeMap :heat-maps="heatMaps" />
  </div>
</template>
