<script setup lang="ts">
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from '@vue-leaflet/vue-leaflet'

interface PriceData {
    currency: string
    value: number
    period?: string
    display: string
}

interface PropertyLocation {
    lat: number
    long: number
}

interface Property {
    id: string
    lat: number
    long: number
    image: string
    price: PriceData
    deposit: PriceData
    title: string
    bedrooms: number
    area: {
        value: number
        unit: string
        display: string
    }
    location: string
    amenities: string[]
    description?: string
    contact?: string
    available: string
    rating: number
    status: string
}

interface MapLayer {
    name: string
    url: string
    attribution: string
}

interface StatusOption {
    value: string
    label: string
    color: string
    darkColor: string
}

const { $leaflet } = useNuxtApp()

const isReady = ref(false)
const showList = ref(false)
const hoveredPropertyId = ref<string | null>(null)
const selectedStatus = ref<string>('all')
const selectedMapLayer = ref<string>('Street Map')

const center = ref<[number, number]>([-1.286389, 36.817223])
const zoom = ref(13)
const houseIconUrl = 'https://cdn-icons-png.flaticon.com/512/619/619153.png'

const mapLayers: MapLayer[] = [
    {
        name: 'Street Map',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap contributors'
    },
    {
        name: 'Satellite',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri, Maxar, Earthstar Geographics'
    }
]

const statusOptions: StatusOption[] = [
    { value: 'all', label: 'All Properties', color: 'bg-gray-600', darkColor: 'dark:bg-gray-700' },
    { value: 'A', label: 'High Value', color: 'bg-emerald-600', darkColor: 'dark:bg-emerald-700' },
    { value: 'B', label: 'Standard', color: 'bg-gray-500', darkColor: 'dark:bg-gray-600' },
    { value: 'C', label: 'Luxury', color: 'bg-purple-600', darkColor: 'dark:bg-purple-700' },
    { value: 'D', label: 'Premium', color: 'bg-orange-600', darkColor: 'dark:bg-orange-700' },
    { value: 'E', label: 'Economy', color: 'bg-red-600', darkColor: 'dark:bg-red-700' }
]

interface FocusMapData {
  country?: string
  city?: string
}

const props = withDefaults(defineProps<{
  heatMaps?: Property[]
  asInput?: boolean
  propertyLocation?: PropertyLocation
  focusMapData?: FocusMapData
}>(), {
  heatMaps: () => [],
  asInput: false,
  propertyLocation: () => ({ lat: 0, long: 0 }),
  focusMapData: () => ({})
})

const emit = defineEmits(['save-location'])

const onMapClick = (event: any) => {
    if (!props.asInput) return

    const { lat, lng } = event.latlng
    emit('save-location', { lat, long: lng })
}

const filteredProperties = computed(() => {
    if (!props.heatMaps?.length) return []

    if (selectedStatus.value === 'all') return props.heatMaps

    return props.heatMaps.filter(property =>
        property.status === selectedStatus.value
    )
})

const switchMapLayer = (layerName: string) => {
    selectedMapLayer.value = layerName
}

const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0]
}

const createCustomIcon = (property: Property, isHovered: boolean) => {
    if (!$leaflet) return undefined

    const statusInfo = getStatusInfo(property.status)
    const isFiltered = selectedStatus.value !== 'all' && property.status !== selectedStatus.value

    return $leaflet.divIcon({
        className: 'property-marker',
        html: `
      <div class="relative group cursor-pointer">
        <div class="
          flex items-center gap-1
          rounded-md shadow-sm
          ${statusInfo.color} ${statusInfo.darkColor}
          ${isHovered ? 'scale-110 ring-2 ring-white dark:ring-gray-800' : ''}
          ${isFiltered ? 'opacity-50 grayscale' : ''}
          transition-all duration-200
          w-30 h-10 overflow-hidden
        ">
          <img
            src="${property.image}"
            alt="${property.title}"
            class="w-4 h-full object-cover border-r border-white dark:border-gray-700"
          />
          <div class="text-white px-2 py-1">
            <p class="text-[8px]">
              ${property.price.value.toLocaleString()} ${property.price.currency}
              <br/>
              ⭐${property.rating?.toFixed(1) || 'N/A'}
            </p>
          </div>
        </div>
        
        <div class="
          absolute left-1/2 top-full mt-1
          -translate-x-1/2
          w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl
          opacity-0 group-hover:opacity-100
          pointer-events-none transition-opacity duration-200
          z-[9999]
          border border-gray-200 dark:border-gray-700
        ">
          <img src="${property.image}" alt="${property.title}" class="w-full h-20 object-cover rounded-t-lg"/>
          <div class="p-2 text-xs text-gray-700 dark:text-gray-200">
            <div class="flex justify-between items-center mb-1">
              <span class="font-semibold truncate">${property.title}</span>
              <span class="${statusInfo.color} ${statusInfo.darkColor} text-white px-2 py-0.5 rounded text-[10px] ml-2">
                ${statusInfo.label}
              </span>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-[10px] truncate">${property.location}</p>
            <div class="mt-2 space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Price:</span>
                <span class="font-semibold">${property.price.display}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Deposit:</span>
                <span class="font-semibold text-emerald-600 dark:text-emerald-400">${property.deposit.display}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">Available:</span>
                <span class="font-semibold">${property.available}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
        iconSize: [110, 34],
        iconAnchor: [55, 34]
    })
}

onMounted(() => {
    isReady.value = true
})

const focusMap = async (focusData: FocusMapData) => {
  if (!focusData.country && !focusData.city) return
  
  try {
    let result
    
    if (focusData.city) {
      // Try to geocode city within country
      result = await geocodeLocation({
        city: focusData.city,
        country: focusData.country
      })
      
      console.log("focusing results::",result)
      if (result) {
        center.value = [result.lat, result.lng]
        zoom.value = focusData.city ? 12 : 6 // Higher zoom for cities
        
        // if (result.boundingbox) {
        //   const bounds = $leaflet.latLngBounds(
        //     [$leaflet.latLng(result.boundingbox[0], result.boundingbox[2]), // SW
        //      $leaflet.latLng(result.boundingbox[1], result.boundingbox[3])] // NE
        //   )
          
        //   // Get map instance and fit bounds
        //   const map = $refs.map?.leafletObject
        //   if (map) {
        //     map.fitBounds(bounds, { padding: [50, 50] })
        //   }
        // }
      }
    } else if (focusData.country) {
      // Geocode country only
      result = await getCountryBounds(focusData.country)
      
      if (result) {
        center.value = [result.lat, result.lng]
        zoom.value = 5 // Country-level zoom
        
        if (result.boundingbox) {
          const bounds = $leaflet.latLngBounds(
            [$leaflet.latLng(result.boundingbox[0], result.boundingbox[2]),
             $leaflet.latLng(result.boundingbox[1], result.boundingbox[3])]
          )
          
          const map = $refs.map?.leafletObject
          if (map) {
            map.fitBounds(bounds, { padding: [50, 50] })
          }
        }
      }
    }
    
    // Show notification
    if (result) {
      useToast().add({
        title: 'Map Focused',
        description: `Centered on ${focusData.city ? focusData.city + ', ' : ''}${focusData.country || ''}`,
        icon: 'i-heroicons-map-pin',
        color: 'green'
      })
    } else {
      useToast().add({
        title: 'Location Not Found',
        description: `Could not find ${focusData.city ? focusData.city + ', ' : ''}${focusData.country || ''}`,
        icon: 'i-heroicons-exclamation-triangle',
        color: 'orange'
      })
    }
  } catch (error) {
    console.error('Failed to focus map:', error)
    useToast().add({
      title: 'Geocoding Error',
      description: 'Failed to locate the specified area',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  }
}

const watchFocusData = async (focus: FocusMapData) => {
  if (!focus || (!focus.country && !focus.city)) return
  
  // Debounce to avoid multiple rapid calls
  if (focusDebounceTimer.value) {
    clearTimeout(focusDebounceTimer.value)
  }
  
  focusDebounceTimer.value = setTimeout(async () => {
    await focusMap(focus)
  }, 500)
}

const focusDebounceTimer = ref<NodeJS.Timeout | null>(null)


watch(
  () => props.focusMapData,
  (newFocus) => {
    watchFocusData(newFocus || {})
  },
  { deep: true, immediate: true }
)

// Clean up
onBeforeUnmount(() => {
  if (focusDebounceTimer.value) {
    clearTimeout(focusDebounceTimer.value)
  }
})

// Add manual focus method
const focusOnLocation = async (country?: string, city?: string) => {
  await focusMap({ country, city })
}

</script>

<template>
    <client-only>
        <UCard class="w-full" >
            <div class="p-4 space-y-4">
                <!-- Controls -->
                <div  class="flex flex-wrap gap-3 items-center justify-between">
                    <!-- Status Filter -->
                    <div v-if="heatMaps.length > 0" class="flex items-center gap-2">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
                        <div class="flex flex-wrap gap-2">
                            <UButton
                                v-for="option in statusOptions"
                                :key="option.value"
                                @click="selectedStatus = option.value"
                                :variant="selectedStatus === option.value ? 'solid' : 'outline'"
                                :color="option.value === 'all' ? 'gray' : option.value.toLowerCase()"
                                size="xs"
                                class="whitespace-nowrap"
                            >
                                {{ option.label }}
                            </UButton>
                        </div>
                    </div>

                    <!-- Map Layer Switcher -->
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Map View:</span>
                        <div class="flex gap-2">
                            <UButton
                                v-for="layer in mapLayers"
                                :key="layer.name"
                                @click="switchMapLayer(layer.name)"
                                :variant="selectedMapLayer === layer.name ? 'solid' : 'outline'"
                                color="primary"
                                size="xs"
                            >
                                {{ layer.name }}
                            </UButton>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Map Container -->
            <div class="w-full h-[65vh] relative">
                <div v-if="!isReady" class="flex items-center justify-center bg-gray-50 dark:bg-gray-950 z-999!">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>

                <!-- Map -->
                <LMap
                    v-else
                    :zoom="zoom"
                    :center="center"
                    :use-global-leaflet="false"
                    class="h-full w-full scale-z-100 z-60!"
                    @click="onMapClick"
                >
                    <!-- Street Map Layer -->
                    <LTileLayer
                        v-if="selectedMapLayer === 'Street Map'"
                        :url="mapLayers[0].url"
                        :attribution="mapLayers[0].attribution"
                        layer-type="base"
                    />

                    <!-- Satellite Layer -->
                    <LTileLayer
                        v-if="selectedMapLayer === 'Satellite'"
                        :url="mapLayers[1].url"
                        :attribution="mapLayers[1].attribution"
                        layer-type="base"
                    />

                    <LMarker v-if="asInput && propertyLocation?.lat" :lat-lng="[propertyLocation.lat, propertyLocation.long]">
                        <LIcon :icon-url="houseIconUrl" :icon-size="[35, 35]" :icon-anchor="[17, 35]" />
                    </LMarker>

                    <!-- Property Markers -->
                    <LMarker
                        v-for="property in filteredProperties"
                        :key="property.id"
                        :lat-lng="[property.lat, property.long]"
                        :icon="createCustomIcon(property, hoveredPropertyId === property.id)"
                        @mouseover="hoveredPropertyId = property.id"
                        @mouseout="hoveredPropertyId = null"
                    >
                        <LPopup>
                            <div class="property-popup w-72">
                                <!-- Property Image -->
                                <div class="relative h-40 w-full overflow-hidden rounded-t-lg">
                                    <img :src="property.image" :alt="property.title" class="w-full h-full object-cover">
                                    <div class="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-bold">
                                        {{ property.bedrooms }} BR
                                    </div>
                                </div>

                                <!-- Property Details -->
                                <div class="p-3 space-y-3 dark:bg-gray-800">
                                    <!-- Title and Status -->
                                    <div class="flex justify-between items-start">
                                        <h3 class="text-base font-bold text-gray-800 dark:text-gray-100 line-clamp-1">
                                            {{ property.title }}
                                        </h3>
                                        <UBadge
                                            :color="property?.status?.toLowerCase()"
                                            variant="solid"
                                            size="xs"
                                        >
                                            {{ getStatusInfo(property.status).label }}
                                        </UBadge>
                                    </div>

                                    <!-- Pricing Info -->
                                    <div class="space-y-2">
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-600 dark:text-gray-400 text-sm">Monthly:</span>
                                            <span class="font-bold text-primary-600 dark:text-primary-400">{{ property.price.display }}</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-600 dark:text-gray-400 text-sm">Deposit:</span>
                                            <span class="font-semibold">{{ property.deposit.display }}</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="text-gray-600 dark:text-gray-400 text-sm">Available:</span>
                                            <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ property.available }}</span>
                                        </div>
                                    </div>

                                    <!-- Location and Amenities -->
                                    <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-xs mb-3">
                                            <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                                            <span class="truncate">{{ property.location }}</span>
                                            <UIcon name="i-heroicons-arrows-pointing-out" class="w-4 h-4" />
                                            <span>{{ property.area.display }}</span>
                                        </div>

                                        <div class="flex flex-wrap gap-1">
                                            <UBadge
                                                v-for="amenity in property.amenities.slice(0, 3)"
                                                :key="amenity"
                                                variant="subtle"
                                                color="primary"
                                                size="xs"
                                            >
                                                {{ amenity }}
                                            </UBadge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </LPopup>
                    </LMarker>
                </LMap>
            </div>

            <!-- Property Summary List -->
            <div v-if="showList && filteredProperties.length > 0" class="p-4 border-t border-gray-200 dark:border-gray-800">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="font-bold text-gray-800 dark:text-gray-100">Properties ({{ filteredProperties.length }})</h3>
                    <UButton
                        @click="showList = false"
                        variant="ghost"
                        color="gray"
                        size="xs"
                        icon="i-heroicons-x-mark"
                    >
                        Hide List
                    </UButton>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2  gap-3">
                    <UCard
                        v-for="property in filteredProperties"
                        :key="property.id"
                        class="hover:shadow-md transition-all duration-200 cursor-pointer"
                        :class="hoveredPropertyId === property.id ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''"
                        @mouseover="hoveredPropertyId = property.id"
                        @mouseout="hoveredPropertyId = null"
                        :ui="{ body: { padding: 'p-3' } }"
                    >
                        <div class="flex items-start gap-3">
                            <!-- Property Thumbnail -->
                            <div class="relative flex-shrink-0">
                                <img :src="property.image" :alt="property.title" class="w-16 h-16 object-cover rounded-lg" />
                                <span
                                    :class="[
                                        getStatusInfo(property.status).color,
                                        getStatusInfo(property.status).darkColor,
                                        'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800'
                                    ]"
                                />
                            </div>

                            <!-- Property Info -->
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2 mb-1">
                                    <h4 class="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
                                        {{ property.title }}
                                    </h4>
                                </div>
                                <p class="text-primary-600 dark:text-primary-400 font-bold text-sm mb-1">
                                    {{ property.price.display }}
                                </p>
                                <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <UIcon name="i-heroicons-map-pin" class="w-3 h-3 flex-shrink-0" />
                                    <span class="truncate">{{ property.location }}</span>
                                    <UIcon name="i-heroicons-star" class="w-3 h-3 flex-shrink-0" />
                                    <span>{{ property.rating?.toFixed(1) || 'N/A' }}</span>
                                </div>
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>

            <!-- Show List Button -->
            <div v-if="!showList && filteredProperties.length > 0" class="p-4 border-t border-gray-200 dark:border-gray-800 text-center">
                <UButton
                    @click="showList = true"
                    variant="solid"
                    color="primary"
                    icon="i-heroicons-list-bullet"
                >
                    Show Property List ({{ filteredProperties.length }})
                </UButton>
            </div>
        </UCard>
    </client-only>
</template>

