<template>
  <UCard class="max-w-6xl mx-auto m-2" :ui="{
    body: { padding: 'p-6' },
    ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
    shadow: 'shadow-sm'
  }">
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="flex-1 space-y-6">
        <div class="flex flex-row justify-between items-center">
          <div>
            <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Property Location</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Fill in the details or click the map to pinpoint the
              location.</p>
          </div>
          <UButton color="neutral" variant="soft" icon="i-heroicons-map-pin" @click="focusOnMap" />

        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Country" name="country">
            <UInput v-model="formData.country" icon="i-heroicons-globe-americas" placeholder="Enter country"
              :ui="{ icon: { trailing: { pointer: '' } } }" />
          </UFormGroup>

          <UFormGroup label="State / Province" name="state">
            <UInput v-model="formData.state" icon="i-heroicons-building-office" placeholder="Enter state or province"
              :ui="{ icon: { trailing: { pointer: '' } } }" />
          </UFormGroup>

          <UFormGroup label="City / Town" name="city">
            <UInput v-model="formData.city" icon="i-heroicons-building-library" placeholder="Enter city or town"
              :ui="{ icon: { trailing: { pointer: '' } } }" />
          </UFormGroup>

          <UFormGroup label="Street Address" name="address">
            <UInput v-model="formData.address" icon="i-heroicons-map-pin" placeholder="Enter street address"
              :ui="{ icon: { trailing: { pointer: '' } } }" />
          </UFormGroup>
        </div>

        <UCard class="bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">GPS
                Coordinates</span>
              <p v-if="formData.coordinates?.lat" class="font-mono text-sm text-primary-600 dark:text-primary-400">
                {{ formData.coordinates.lat.toFixed(6) }}, {{ formData.coordinates.long.toFixed(6) }}
              </p>
              <p v-else class="text-sm text-gray-400 dark:text-gray-500 italic">No location selected on map</p>
            </div>
            <UIcon v-if="formData.coordinates.lat" name="i-heroicons-check-circle"
              class="text-green-500 dark:text-green-400 w-6 h-6 flex-shrink-0" />
          </div>
        </UCard>

        <div class="flex gap-3 pt-2">
          <UButton color="primary" block class="flex-1" @click="saveLocation" :disabled="!isFormValid"
            icon="i-heroicons-map-pin" :ui="{ rounded: 'rounded-lg' }">
            Save Property Location
          </UButton>
          <UButton color="gray" variant="soft" @click="resetForm" icon="i-heroicons-arrow-path"
            :ui="{ rounded: 'rounded-lg' }">
            Reset
          </UButton>
        </div>
      </div>

      <div class="flex-1 space-y-4">
        <div
          class="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg relative z-0">
          <DeMap :as-input="true" :focus-map-data="focusMapData" :property-location="formData.coordinates"
            @save-location="updateCoordinates" />
        </div>

        <div v-if="locationHistory?.length > 0" class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent
              Selections</span>
            <UBadge color="gray" variant="soft" size="xs">
              {{ locationHistory.length }}
            </UBadge>
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton v-for="(loc, i) in locationHistory" :key="i" @click="restoreLocation(loc)" size="xs" color="gray"
              variant="outline" icon="i-heroicons-map-pin"
              :ui="{ rounded: 'rounded-full', padding: { xs: 'px-3 py-1' } }">
              {{ loc.lat.toFixed(3) }}, {{ loc.long.toFixed(3) }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
interface Coordinates {
  lat: number
  long: number
}

interface LocationUploadData {
  country: string
  state: string
  city: string
  address: string
  coordinates: Coordinates
}

interface ModelValue {
  data: LocationUploadData
  status?: string
  lastUpdated?: string
}

const props = defineProps<{
  modelValue: ModelValue
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value): void
  (e: 'reset'): void
  (e: 'save'): void
}>()

const defaultFormData: LocationUploadData = {
  country: '',
  state: '',
  city: '',
  address: '',
  coordinates: { lat: 0, long: 0 }
}

const locationHistory = ref<Coordinates[]>([])

const formData = computed({
  get: () => props.modelValue?.data || defaultFormData,
  set: (value: LocationUploadData) => {
    emit('update:modelValue', value)
  }
})

const focusMapData = ref({
  country: '',
  city: '',
  coordinates: null as any
})

const focusOnMap = () => {
  focusMapData.value = {
    country: formData.value.country,
    city: formData.value.city,
    coordinates: formData.value.coordinates
  }
}


const updateCoordinates = (coords: Coordinates) => {
  formData.value.coordinates = { ...coords }

  const isDuplicate = locationHistory.value.some(h =>
    Math.abs(h.lat - coords.lat) < 0.0001 &&
    Math.abs(h.long - coords.long) < 0.0001
  )

  if (!isDuplicate) {
    locationHistory.value.unshift({ ...coords })
    if (locationHistory.value.length > 4) {
      locationHistory.value = locationHistory.value.slice(0, 4)
    }
  }
}

const restoreLocation = (loc: Coordinates) => {
  formData.value.coordinates = { ...loc }
}

const isFormValid = computed(() => {
  const data = formData.value
  return data.coordinates?.lat !== 0 &&
    data.city?.trim() !== '' &&
    data.address?.trim() !== ''
})

const saveLocation = () => {
  emit('update:modelValue', formData.value)
  emit('save')
}

const resetForm = () => {
  formData.value = { ...defaultFormData }
  locationHistory.value = []
  emit('reset')
}
</script>