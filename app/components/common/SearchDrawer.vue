<template>
  <div class="h-full px-2 pt-4 flex flex-col bg-white dark:bg-gray-900">
    <!-- Search Input -->
    <div class="border-b border-gray-100 dark:border-gray-800">
      <UInput
        ref="searchInput"
        v-model="searchQuery"
        :loading="loading"
        placeholder="Search anything..."
        color="primary" variant="ghost" :highlight=false
        size="lg"
        autocomplete="off"
        class="w-full outline-0 border-0 rounded-[20px]"
        :ui="{
          base: 'h-12',
          rounded: 'rounded-full'
        }"
        @keydown.enter="handleSearch"
      >
        <template #leading>
          <UIcon
            :name="loading ? 'i-lucide-loader-2' : 'i-lucide-search'"
            :class="['w-5 h-5', loading ? 'animate-spin text-primary-500' : 'text-gray-400']"
          />
        </template>

        <template #trailing>
          <UButton
            v-if="searchQuery"
            icon="i-lucide-x"
            color="gray"
            variant="ghost"
            size="sm"
            @click="clearSearch"
          />
        </template>
      </UInput>
    </div>

    <!-- Content Area -->
    <div class="flex-1 overflow-y-auto p-4">
      <!-- Recent Searches -->
      <div v-if="recentSearches.length > 0" class="mb-6">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent</h3>
          <UButton
            size="xs"
            variant="ghost"
            color="gray"
            @click="clearHistory"
          >
            Clear
          </UButton>
        </div>
        
        <div class="space-y-2">
          <UButton
            v-for="item in recentSearches"
            :key="item.id"
            variant="ghost"
            block
            class="justify-start hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="selectSearch(item.query)"
          >
            <UIcon name="i-lucide-history" class="w-4 h-4 text-gray-400 mr-3" />
            <span class="text-sm">{{ item.query }}</span>
          </UButton>
        </div>
      </div>

      <!-- Suggestions -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Suggestions</h3>
        <div class="grid grid-cols-2 gap-2">
          <UButton
            v-for="suggestion in filteredSuggestions"
            :key="suggestion"
            variant="soft"
            color="primary"
            class="justify-start"
            @click="selectSearch(suggestion)"
          >
            {{ suggestion }}
          </UButton>
        </div>
      </div>

      <!-- Categories -->
      <div>
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Categories</h3>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="category in categories"
            :key="category"
            variant="subtle"
            class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="selectCategory(category)"
          >
            {{ category }}
          </UBadge>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-100 dark:border-gray-800">
      <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div class="flex items-center gap-2">
          <UKbd>↑↓</UKbd>
          <span>Navigate</span>
        </div>
        <div class="flex items-center gap-2">
          <UKbd>Enter</UKbd>
          <span>Search</span>
        </div>
        <div class="flex items-center gap-2">
          <UKbd>Esc</UKbd>
          <span>Close</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface SearchItem {
  id: number
  query: string
  timestamp: number
}

interface Props {
  initialQuery?: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits(['search', 'close', 'update:searchQuery'])

// Refs
const searchInput = ref<HTMLInputElement>()
const searchQuery = ref(props.initialQuery || '')
const loading = ref(false)

// Data
const recentSearches = ref<SearchItem[]>([
  { id: 1, query: 'Modern Villa Westlands', timestamp: Date.now() - 3600000 },
  { id: 2, query: 'Studio Apartment Nairobi', timestamp: Date.now() - 7200000 },
  { id: 3, query: 'Luxury Penthouse', timestamp: Date.now() - 86400000 }
])

const allSuggestions = [
  'Beachfront Properties',
  'Commercial Office Space',
  'Student Apartments',
  'Gated Community',
  'Short Term Rentals',
  'Luxury Villas',
  'Affordable Housing',
  'Serviced Apartments'
]

const categories = [
  'Apartments',
  'Houses',
  'Commercial',
  'Land',
  'Rental',
  'Sale'
]

// Computed
const filteredSuggestions = computed(() => {
  if (!searchQuery.value) return allSuggestions.slice(0, 4)
  
  return allSuggestions
    .filter(s => s.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .slice(0, 6)
})

// Methods
const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  
  loading.value = true
  
  // Add to recent searches
  addToHistory(searchQuery.value)
  
  // Emit search event
  emit('search', searchQuery.value)
  
  // Simulate loading
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const selectSearch = (query: string) => {
  searchQuery.value = query
  handleSearch()
}

const selectCategory = (category: string) => {
  searchQuery.value = `${category} in Nairobi`
  handleSearch()
}

const clearSearch = () => {
  searchQuery.value = ''
}

const addToHistory = (query: string) => {
  // Remove if already exists
  recentSearches.value = recentSearches.value.filter(item => item.query !== query)
  
  // Add to beginning
  recentSearches.value.unshift({
    id: Date.now(),
    query,
    timestamp: Date.now()
  })
  
  // Keep only 5 items
  if (recentSearches.value.length > 5) {
    recentSearches.value = recentSearches.value.slice(0, 5)
  }
}

const clearHistory = () => {
  recentSearches.value = []
}

// Focus input on mount
onMounted(() => {
  nextTick(() => {
    if (searchInput.value?.$el) {
      searchInput.value.$el.querySelector('input')?.focus()
    }
  })
})

// Watch for search query changes
watch(searchQuery, (value) => {
  emit('update:searchQuery', value)
})
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #374151;
}
</style>