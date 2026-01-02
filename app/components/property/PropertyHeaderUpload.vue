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
            <div>
              <h1 class="text-lg font-bold text-gray-900 dark:text-white">Property Details</h1>
              <div class="flex items-center gap-2 mt-1">
                <UBadge :color="statusColor" variant="subtle" size="xs">
                  {{ statusText }}
                </UBadge>
                <span class="text-xs text-gray-500">
                  Last updated: {{ formatDate(modelValue?.lastUpdated) }}
                </span>
              </div>
            </div>
          </div>
          <UBadge v-if="isFormValid" color="green" variant="subtle" size="xs">Ready to Save</UBadge>
        </div>
      </template>

      <div class="space-y-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Property Title <span class="text-red-500">*</span>
          </label>
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs text-gray-500">Make it descriptive and appealing</span>
            <span v-if="formData?.title" class="text-[10px] font-mono text-primary-500 truncate max-w-[200px]">
              "{{ formData?.title }}"
            </span>
          </div>
          <UInput v-model="formData.title" placeholder="e.g., Modern Downtown Apartment"
            icon="i-heroicons-pencil-square" size="lg" class="w-full" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category <span class="text-red-500">*</span>
            </label>
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs text-gray-500">Select property type</span>
              <span class="text-[10px] uppercase text-gray-400">{{ formData?.category?.label || 'Not set' }}</span>
            </div>
            <USelectMenu v-model="formData.category" :items="categories" value-key="value"
              option-key="label" placeholder="Select Type" size="lg" class="min-w-20 w-full" />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Year Built
            </label>
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs text-gray-500">Construction year</span>
              <span v-if="formData?.year_built" class="text-[10px] text-primary-500">{{ formData?.year_built }}</span>
            </div>
            <UInput v-model="formData.year_built" type="number" placeholder="2024" size="lg" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Detailed Description <span class="text-red-500">*</span>
          </label>
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs text-gray-500">Describe features and amenities</span>
            <span class="text-[10px] text-gray-400">{{ formData?.description?.length || 0 }} chars</span>
          </div>
          <UTextarea v-model="formData.description" autoresize :rows="4"
            placeholder="Describe features, amenities, and local highlights..." class="w-full" />
        </div>

        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Specifications
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
            <div class="space-y-2">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Lot Size (sq ft)
              </label>
              <UInput v-model="formData.lot_size" type="number" placeholder="0" variant="none"
                class="bg-white dark:bg-gray-800 rounded-md w-full" />
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Floor Level
              </label>
              <UInput v-model="formData.floor_number" type="number" placeholder="0" variant="none"
                class="bg-white dark:bg-gray-800 rounded-md w-full" />
            </div>

            <div class="space-y-2">
              <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">
                Theme Color
              </label>
              <div class="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-md w-full">
                <input v-model="formData.theme_color" type="color"
                  class="w-6 h-6 rounded cursor-pointer border-none bg-transparent flex-shrink-0" />
                <span class="text-xs font-mono text-gray-700 dark:text-gray-300 truncate">
                  {{ formData?.theme_color || '#FFFFFF' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Profile Image
          </label>
          <div class="flex items-center gap-4">
            <div
              class="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all"
              @click="$refs.profileUpload.click()">
              <UAvatar v-if="formData?.profile_picture" :src="formData?.profile_picture" size="md" />
              <UIcon v-else name="i-heroicons-photo" class="w-6 h-6 text-gray-400" />
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ formData?.profile_picture ? 'Change Photo' : 'Upload Property Photo' }}
              </span>
            </div>
            <input ref="profileUpload" type="file" accept="image/*" class="hidden" @change="handleProfileUpload" />
          </div>
        </div>
      </div>

      <template #footer>
        <div
          class="flex flex-col sm:flex-row gap-3 sticky bottom-0 left-0 right-0 backdrop-blur-2xl bg-white/50 dark:bg-gray-900/50  border-t border-gray-200 dark:border-gray-800 p-4 shadow-lg">
          <UButton color="gray" variant="soft" icon="i-heroicons-trash" @click="resetForm" class="w-full sm:w-auto">
            Clear All
          </UButton>
          <UButton color="primary" block class="flex-1" :loading="isSubmitting" :disabled="!isFormValid"
            icon="i-heroicons-check-circle" @click="submitProperty">
            Save Property Details
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { get } = useApi()
const toast = useToast()
const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'reset'): void
  (e: 'save'): void
}>()

const categories = ref([])

const loadingCategories = ref(false)
const fetchCategories = async () => {
  loadingCategories.value = true
  const res = await get(useEndpoints().utilities.propertyCategories)
  if (!res.success) {
    toast.add({
      title: res.message || 'failed getting categories',
      color: "error"
    }

    )
  }
  categories.value = res.data
  loadingCategories.value = false
}

const profileUpload = ref<HTMLInputElement>()
const isSubmitting = ref(false)

// Use computed with getter/setter for proper two-way binding
const formData = computed({
  get: () => props.modelValue?.data,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const statusText = computed(() => {
  switch (props.modelValue?.status) {
    case 'draft': return 'Draft'
    case 'saved': return 'Saved'
    case 'synced': return 'Synced'
    case 'error': return 'Error'
    default: return 'Draft'
  }
})

const statusColor = computed(() => {
  switch (props.modelValue?.status) {
    case 'draft': return 'gray'
    case 'saved': return 'blue'
    case 'synced': return 'green'
    case 'error': return 'red'
    default: return 'gray'
  }
})

const formatDate = (dateString: string) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const isFormValid = computed(() => {
  return formData.value?.title?.trim() !== '' &&
    formData.value?.description?.trim() !== '' &&
    formData.value?.category !== ''
})

const handleProfileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.size > 5 * 1024 * 1024) {
      useToast().add({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        color: 'red'
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value = {
        ...formData.value,
        profile_picture: e.target?.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}

const submitProperty = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true

  try {
    // Prepare data with cleaned up values
    const updatedData = {
      ...formData.value,
      year_built: formData.value.year_built || undefined,
      lot_size: formData.value.lot_size || undefined,
      floor_number: formData.value.floor_number || undefined
    }

    formData.value = updatedData
    emit('save')

  } catch (error) {
    useToast().add({
      title: 'Error',
      description: 'Failed to save property. Please try again.',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = {
    title: '',
    category: 'rental',
    description: '',
    profile_picture: 'mmmmmmmmm',
    theme_color: '#FFFFFF',
    year_built: null,
    lot_size: null,
    floor_number: null
  }
}
console.log("received props:", props.modelValue)

onMounted(() => {
  console.log("received props:", props.modelValue)
  fetchCategories()
})
</script>