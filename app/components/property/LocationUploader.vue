<template>
  <UCard class="max-w-6xl mx-auto m-2" :ui="{ 
    body: { padding: 'p-6' },
    ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
    shadow: 'shadow-sm'
  }">
    <div class="flex flex-col lg:flex-row gap-8">
      
      <!-- Left Panel: Form -->
      <div class="flex-1 space-y-6">
        <div>
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Property Location</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Fill in the details or click the map to pinpoint the location.</p>
        </div>

        <!-- Form Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Country" name="country">
            <UInput 
              v-model="locationForm.country" 
              icon="i-heroicons-globe-americas" 
              placeholder="Enter country"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            />
          </UFormGroup>
          
          <UFormGroup label="State / Province" name="state">
            <UInput 
              v-model="locationForm.state" 
              icon="i-heroicons-building-office" 
              placeholder="Enter state or province"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            />
          </UFormGroup>
          
          <UFormGroup label="City / Town" name="city">
            <UInput 
              v-model="locationForm.city" 
              icon="i-heroicons-building-library" 
              placeholder="Enter city or town"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            />
          </UFormGroup>
          
          <UFormGroup label="Street Address" name="address">
            <UInput 
              v-model="locationForm.address" 
              icon="i-heroicons-map-pin" 
              placeholder="Enter street address"
              :ui="{ icon: { trailing: { pointer: '' } } }"
            />
          </UFormGroup>
        </div>

        <!-- GPS Coordinates Display -->
        <UCard class="bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">GPS Coordinates</span>
              <p v-if="selectedCoordinates.lat" class="font-mono text-sm text-primary-600 dark:text-primary-400">
                {{ selectedCoordinates.lat.toFixed(6) }}, {{ selectedCoordinates.long.toFixed(6) }}
              </p>
              <p v-else class="text-sm text-gray-400 dark:text-gray-500 italic">No location selected on map</p>
            </div>
            <UIcon 
              v-if="selectedCoordinates.lat" 
              name="i-heroicons-check-circle" 
              class="text-green-500 dark:text-green-400 w-6 h-6 flex-shrink-0" 
            />
          </div>
        </UCard>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-2">
          <UButton 
            color="primary" 
            block 
            class="flex-1" 
            @click="saveLocation" 
            :disabled="!isFormValid"
            icon="i-heroicons-map-pin"
            :ui="{ rounded: 'rounded-lg' }"
          >
            Save Property Location
          </UButton>
          <UButton 
            color="gray" 
            variant="soft" 
            @click="resetForm"
            icon="i-heroicons-arrow-path"
            :ui="{ rounded: 'rounded-lg' }"
          >
            Reset
          </UButton>
        </div>
      </div>

      <!-- Right Panel: Map -->
      <div class="flex-1 space-y-4">
        <!-- Map Container -->
        <div class="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
          <DeMap 
            :as-input="true" 
            :property-location="selectedCoordinates"
            @save-location="updateCoordinates"
          />
        </div>

        <!-- Recent Selections -->
        <div v-if="locationHistory.length > 0" class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Selections</span>
            <UBadge color="gray" variant="soft" size="xs">
              {{ locationHistory.length }}
            </UBadge>
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="(loc, i) in locationHistory" 
              :key="i"
              @click="restoreLocation(loc)"
              size="xs"
              color="gray"
              variant="outline"
              icon="i-heroicons-map-pin"
              :ui="{ rounded: 'rounded-full', padding: { xs: 'px-3 py-1' } }"
            >
              {{ loc.lat.toFixed(3) }}, {{ loc.long.toFixed(3) }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
const locationForm = reactive({
  country: '',
  state: '',
  city: '',
  address: ''
})

const selectedCoordinates = reactive({
  lat: 0,
  long: 0
})
const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const locationHistory = ref<Array<{ lat: number; long: number }>>([])

const updateCoordinates = (coords: { lat: number; long: number }) => {
  selectedCoordinates.lat = coords.lat
  selectedCoordinates.long = coords.long

  if (!locationHistory.value.find(h => 
    Math.abs(h.lat - coords.lat) < 0.0001 && 
    Math.abs(h.long - coords.long) < 0.0001
  )) {
    locationHistory.value.unshift({ ...coords })
    if (locationHistory.value.length > 4) {
      locationHistory.value = locationHistory.value.slice(0, 4)
    }
  }
}

const restoreLocation = (loc: { lat: number; long: number }) => {
  selectedCoordinates.lat = loc.lat
  selectedCoordinates.long = loc.long
}

const isFormValid = computed(() => {
  return selectedCoordinates.lat !== 0 && 
         locationForm.city.trim() !== '' && 
         locationForm.address.trim() !== ''
})

const saveLocation = () => {
  const finalData = {
    ...locationForm,
    coordinates: { ...selectedCoordinates }
  }
  console.log('Saving location data:', finalData)
    emit('update:modelValue', { ...finalData })

}

const resetForm = () => {
  selectedCoordinates.lat = 0
  selectedCoordinates.long = 0
  locationHistory.value = []
  Object.keys(locationForm).forEach(key => {
    locationForm[key as keyof typeof locationForm] = ''
  })
}
</script>