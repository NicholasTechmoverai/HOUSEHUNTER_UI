<template>
  <div class="max-w-4xl mx-auto p-2 md:p-4">
    <UCard :ui="{ body: { padding: 'p-0' } }">
      <div
        class="sticky top-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-4 border-b border-gray-200 dark:border-gray-800 rounded-t-lg flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-gray-900 dark:text-white leading-tight">Property Amenities</h2>
          <p class="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">
            {{ selectedItems.length }} Items Selected
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UButton variant="ghost" color="gray" label="reset" icon="i-heroicons-arrow-path"
            @click="isResetModalOpen = true" />
          <UButton color="primary" size="sm" :loading="isSaving" icon="i-heroicons-check-circle" @click="handleSave">
            Save
          </UButton>
        </div>
      </div>

      <div class="p-4 md:p-6 space-y-8">
        <section class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400">Library</span>
            <div class="flex gap-2 w-full sm:w-auto">
              <UInput v-model="manualName" placeholder="Other (e.g. Backyard)" size="sm" class="flex-1 sm:w-48"
                @keyup.enter="addManualAmenity" />
              <UButton size="sm" color="gray" variant="solid" @click="addManualAmenity">Add</UButton>
            </div>
          </div>

          <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            <button v-for="item in amenityLibrary" :key="item.slug" @click="toggleSelection(item)" :class="[
              'flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all',
              isItemSelected(item.slug)
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]">
              <UIcon :name="item.icon" class="w-5 h-5 mb-1" />
              <span class="text-[9px] font-bold text-center truncate w-full">{{ item.name }}</span>
            </button>
          </div>
        </section>

        <section v-if="selectedItems.length > 0" class="space-y-3">
          <div v-for="item in selectedItems" :key="item.slug"
            class="group flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div class="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 min-w-[64px]">
              <UIcon :name="item.icon" class="w-8 h-8 text-primary-500" />
              <UButton color="red" variant="ghost" icon="i-heroicons-trash" size="xs" @click="toggleSelection(item)" />
            </div>

            <div class="flex-1 space-y-4">
              <div class="flex items-center justify-between gap-4">
                <h4 class="font-bold text-sm">{{ item.name }}</h4>
                <div class="flex items-center gap-3">
                  <span class="text-[10px] font-bold uppercase"
                    :class="item.is_free ? 'text-emerald-500' : 'text-amber-500'">
                    {{ item.is_free ? 'Free' : 'Paid' }}
                  </span>
                  <USwitch v-model="item.is_free" size="sm" unchecked-icon="i-lucide-x" checked-icon="i-lucide-check"
                    default-value />
                </div>
              </div>

              <UTextarea v-model="item.description" placeholder="Specific details..." autoresize :rows="1" size="sm"
                color="gray" />
            </div>
          </div>
        </section>

        <div v-else class="text-center py-16 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
          <UIcon name="i-heroicons-plus-circle" class="w-10 h-10 text-gray-200 mb-2" />
          <p class="text-sm text-gray-400 font-medium">Select items from the library to configure</p>
        </div>
      </div>
    </UCard>

    <UModal v-model="isResetModalOpen">
      <div class="p-6">
        <h3 class="text-lg font-bold mb-2">Clear all selections?</h3>
        <p class="text-sm text-gray-500 mb-6">This will remove all currently selected and configured amenities. This
          action cannot be undone.</p>
        <div class="flex justify-end gap-3">
          <UButton color="gray" variant="ghost" @click="isResetModalOpen = false">Cancel</UButton>
          <UButton color="red" @click="confirmReset">Clear Everything</UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

interface AmenityItem {
  name: string
  slug: string
  description: string | null
  is_free: boolean
  icon: string
  sort_order: number
}

const toast = useToast()
const isSaving = ref(false)
const isResetModalOpen = ref(false)
const manualName = ref('')
const selectedItems = ref<AmenityItem[]>([])

const amenityLibrary: AmenityItem[] = [
  { name: 'WiFi', slug: 'wifi', icon: 'i-heroicons-wifi', description: '', is_free: true, sort_order: 0 },
  { name: 'Parking', slug: 'parking', icon: 'i-heroicons-truck', description: '', is_free: true, sort_order: 1 },
  { name: 'Kitchen', slug: 'kitchen', icon: 'i-heroicons-cake', description: '', is_free: true, sort_order: 2 },
  { name: 'CCTV', slug: 'cctv', icon: 'i-heroicons-video-camera', description: '', is_free: true, sort_order: 3 },
  { name: 'Pool', slug: 'pool', icon: 'i-heroicons-lifebuoy', description: '', is_free: true, sort_order: 4 },
  { name: 'Gym', slug: 'gym', icon: 'i-heroicons-heart', description: '', is_free: true, sort_order: 5 },
  { name: 'AC', slug: 'ac', icon: 'i-heroicons-sun', description: '', is_free: true, sort_order: 6 },
  { name: 'Workspace', slug: 'workspace', icon: 'i-heroicons-briefcase', description: '', is_free: true, sort_order: 7 },
]

const isItemSelected = (slug: string) => selectedItems.value.some(i => i.slug === slug)

const toggleSelection = (item: AmenityItem) => {
  const index = selectedItems.value.findIndex(i => i.slug === item.slug)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push({ ...item, is_free: true })
  }
}

const addManualAmenity = () => {
  if (!manualName.value.trim()) return
  const slug = manualName.value.toLowerCase().trim().replace(/\s+/g, '-')

  if (isItemSelected(slug)) {
    toast.add({ title: 'Already exists', color: 'red', icon: 'i-heroicons-exclamation-circle' })
    return
  }

  selectedItems.value.push({
    name: manualName.value,
    slug: slug,
    description: '',
    is_free: true,
    icon: 'i-heroicons-sparkles',
    sort_order: selectedItems.value.length
  })

  manualName.value = ''
  toast.add({ title: 'Amenity added', color: 'green', timeout: 2000 })
}

const confirmReset = () => {
  selectedItems.value = []
  isResetModalOpen.value = false
  toast.add({ title: 'Selections cleared', color: 'gray' })
}

const handleSave = async () => {
  if (selectedItems.value.length === 0) {
    toast.add({ title: 'Select at least one amenity', color: 'orange' })
    return
  }

  isSaving.value = true
  // Simulate API Call
  await new Promise(r => setTimeout(r, 1000))

  console.log('DB Payload:', JSON.parse(JSON.stringify(selectedItems.value)))

  emit('update:modelValue', selectedItems.value)


  isSaving.value = false
  toast.add({
    title: 'Amenities Saved',
    description: 'Property details updated successfully.',
    color: 'green',
    icon: 'i-heroicons-check-badge'
  })
}
</script>