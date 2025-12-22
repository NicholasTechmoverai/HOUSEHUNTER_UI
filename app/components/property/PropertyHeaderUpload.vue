<template>
  <div class="p-2 md:p-6 max-w-5xl mx-auto">
    <UCard :ui="{ 
      base: 'overflow-hidden border-none sm:border border-gray-200 dark:border-gray-800',
      body: { padding: 'p-4 md:p-6' },
      header: { padding: 'px-4 py-3' }
    }">
      
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <UIcon name="i-heroicons-home-modern" class="w-5 h-5 text-primary-600" />
            </div>
            <h1 class="text-lg font-bold text-gray-900 dark:text-white">Property Details</h1>
          </div>
          <UBadge v-if="isFormValid" color="green" variant="subtle" size="xs">Ready to Save</UBadge>
        </div>
      </template>

      <div class="space-y-6">
        
        <!-- Property Title -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Property Title <span class="text-red-500">*</span>
          </label>
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs text-gray-500">Make it descriptive and appealing</span>
            <span v-if="propertyData.title" class="text-[10px] font-mono text-primary-500 truncate max-w-[200px]">
              "{{ propertyData.title }}"
            </span>
          </div>
          <UInput 
            v-model="propertyData.title" 
            placeholder="e.g., Modern Downtown Apartment"
            icon="i-heroicons-pencil-square"
            size="lg"
            class="w-full"
          />
        </div>

        <!-- Category & Year Built -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category <span class="text-red-500">*</span>
            </label>
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs text-gray-500">Select property type</span>
              <span class="text-[10px] uppercase text-gray-400">{{ propertyData.category || 'Not set' }}</span>
            </div>
            <USelectMenu
              v-model="propertyData.category"
              :items="categories"
              placeholder="Select Type"
              size="lg"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Year Built
            </label>
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs text-gray-500">Construction year</span>
              <span v-if="propertyData.year_built" class="text-[10px] text-primary-500">{{ propertyData.year_built }}</span>
            </div>
            <UInput v-model="propertyData.year_built" type="number" placeholder="2024" size="lg" />
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Detailed Description <span class="text-red-500">*</span>
          </label>
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs text-gray-500">Describe features and amenities</span>
            <span class="text-[10px] text-gray-400">{{ propertyData.description?.length || 0 }} chars</span>
          </div>
          <UTextarea 
            v-model="propertyData.description" 
            autoresize 
            :rows="4" 
            placeholder="Describe features, amenities, and local highlights..." 
            class="w-full"
          />
        </div>

        <!-- Specifications Grid -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Specifications
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
            <!-- Lot Size -->
            <div class="space-y-2">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Lot Size (sq ft)
              </label>
              <UInput 
                v-model="propertyData.lot_size" 
                type="number" 
                placeholder="0" 
                variant="none" 
                class="bg-white dark:bg-gray-800 rounded-md w-full"
              />
            </div>

            <!-- Floor Level -->
            <div class="space-y-2">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Floor Level
              </label>
              <UInput 
                v-model="propertyData.floor_number" 
                type="number" 
                placeholder="0" 
                variant="none" 
                class="bg-white dark:bg-gray-800 rounded-md w-full"
              />
            </div>

            <!-- Theme Color -->
            <div class="space-y-2">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Theme Color
              </label>
              <div class="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-md w-full">
                <input 
                  v-model="propertyData.theme_color" 
                  type="color" 
                  class="w-6 h-6 rounded cursor-pointer border-none bg-transparent flex-shrink-0"
                />
                <span class="text-xs font-mono text-gray-700 dark:text-gray-300 truncate">
                  {{ propertyData.theme_color }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Image -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Profile Image
          </label>
          <div class="flex items-center gap-4">
            <div 
              class="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all"
              @click="$refs.profileUpload.click()"
            >
              <UAvatar 
                v-if="propertyData.profile_picture" 
                :src="propertyData.profile_picture" 
                size="md" 
              />
              <UIcon v-else name="i-heroicons-photo" class="w-6 h-6 text-gray-400" />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ propertyData.profile_picture ? 'Change Photo' : 'Upload Property Photo' }}
              </span>
            </div>
            <input ref="profileUpload" type="file" accept="image/*" class="hidden" @change="handleProfileUpload" />
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <template #footer>
        <div class="flex flex-col sm:flex-row gap-3">
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-trash"
            @click="resetForm"
            class="w-full sm:w-auto"
          >
            Clear All
          </UButton>
          <UButton
            color="primary"
            block
            class="flex-1"
            :loading="isSubmitting"
            :disabled="!isFormValid"
            icon="i-heroicons-check-circle"
            @click="submitProperty"
          >
            Save Property Details
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>


<script setup lang="ts">
interface PropertyData {
  title: string
  category: string
  description: string
  profile_picture: string
  theme_color: string
  year_built: number | null
  lot_size: number | null
  floor_number: number | null
}

const propertyData = ref<PropertyData>({
  title: '',
  category: '',
  description: '',
  profile_picture: '',
  theme_color: '#FFFFFF',
  year_built: null,
  lot_size: null,
  floor_number: null
})

const categories = [
  "apartment",
  "rental"
]

const suggestedColors = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#8B5CF6', // Violet
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#84CC16', // Lime
  '#FFFFFF', // White
  '#1F2937'  // Gray-800
]

const profileUpload = ref<HTMLInputElement>()
const showPreview = ref(false)
const isSubmitting = ref(false)

const isFormValid = computed(() => {
  return propertyData.value.title.trim() !== '' && 
         propertyData.value.description.trim() !== '' && 
         propertyData.value.category !== ''
})

const handleProfileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.size > 5 * 1024 * 1024) {
      useToast().add({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'red'
      })
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      propertyData.value.profile_picture = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const formatKey = (key: string) => {
  return key.replace(/_/g, ' ')
}

const formatValue = (value: any) => {
  if (value === null || value === undefined || value === '') return 'Not set'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) return `${value.length} items`
  return value.toString()
}

const submitProperty = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  
  try {
    // Prepare data
    const dataToSubmit = {
      ...propertyData.value,
      // Clean up empty values
      year_built: propertyData.value.year_built || undefined,
      lot_size: propertyData.value.lot_size || undefined,
      floor_number: propertyData.value.floor_number || undefined
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Property saved:', dataToSubmit)
    
    useToast().add({
      title: 'Success!',
      description: 'Property details saved successfully.',
      icon: 'i-heroicons-check-badge',
      color: 'green',
      timeout: 3000
    })
    
    // Reset form
    resetForm()
    
  } catch (error) {
    useToast().add({
      title: 'Error',
      description: 'Failed to save property. Please try again.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  propertyData.value = {
    title: '',
    category: '',
    description: '',
    profile_picture: '',
    theme_color: '#FFFFFF',
    year_built: null,
    lot_size: null,
    floor_number: null
  }
  showPreview.value = false
}
</script>

<style scoped>
/* Improve mobile responsiveness */
/* @media (max-width: 768px) {
  :deep(.u-card) {
    @apply -mx-2;
  }
} */
</style>