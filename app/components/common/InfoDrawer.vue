<template>
  <div>
    <!-- Loading State -->
    <div v-if="pending" class="p-8 text-center">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400">Loading information...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-8 text-center">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-400 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400 mb-2">Failed to load information</p>
      <UButton color="gray" variant="ghost" @click="refresh()" size="sm">
        Try Again
      </UButton>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-2">
          <UIcon :name="data?.icon" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ data?.title }}</h2>
        </div>
        <UButton 
          icon="i-lucide-x" 
          color="gray" 
          variant="ghost" 
          size="sm"
          @click="$emit('close')" 
        />
      </div>

      <!-- Content -->
      <div class="space-y-4 p-4">
        <!-- Description -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">What is this?</h3>
          <p class="text-gray-600 dark:text-gray-300">{{ data?.info?.what }}</p>
        </div>

        <!-- Features -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">Features</h3>
          <ul class="space-y-2">
            <li 
              v-for="(feature, index) in data?.info?.features" 
              :key="index" 
              class="flex items-start gap-2"
            >
              <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span class="text-gray-600 dark:text-gray-300">{{ feature }}</span>
            </li>
          </ul>
        </div>

        <!-- Requirements -->
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">Requirements</h3>
          <ul class="space-y-2">
            <li 
              v-for="(req, index) in data?.info?.requirements" 
              :key="index" 
              class="flex items-start gap-2"
            >
              <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span class="text-gray-600 dark:text-gray-300">{{ req }}</span>
            </li>
          </ul>
        </div>

        <!-- Setup Time -->
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 class="font-medium text-gray-900 dark:text-white mb-2">Estimated Setup Time</h3>
          <p class="text-gray-600 dark:text-gray-300">{{ data?.info?.setupTime }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="data?.link" class="p-4 border-t border-gray-100 dark:border-gray-800">
        <UButton 
          color="primary" 
          block
          :to="data.link"
          @click="$emit('close')"
        >
          Create {{ data.title }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InfoItem } from '~/types/info'

interface Props {
  infoName?: string
  item?: InfoItem
}

interface Emits {
  (event: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  infoName: undefined,
  item: undefined
})

const emit = defineEmits<Emits>()

// If item is passed directly, use it
// Otherwise fetch by infoName
const {
  data,
  pending,
  error,
  refresh
} = await useAsyncData<InfoItem>(
  `info-${props.infoName || 'item'}`,
  () => {
    if (props.item) {
      // If item is passed directly, return it
      return Promise.resolve(props.item)
    }
    
    if (props.infoName) {
      // Fetch from API
      return $fetch(`/api/info/${props.infoName}`)
    }
    
    // Fallback: return empty object
    return Promise.resolve(null)
  },
  {
    // Don't fetch if we have the item passed directly
    immediate: !props.item,
    // Cache for 5 minutes
    maxAge: 300
  }
)

// SEO
const seoTitle = computed(() => data.value?.title ? `${data.value.title} Information` : 'Info')
useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: computed(() => data.value?.info?.what || '')
})

// Watch for prop changes to refetch
watch(() => props.infoName, (newName) => {
  if (newName && !props.item) {
    refresh()
  }
})
</script>