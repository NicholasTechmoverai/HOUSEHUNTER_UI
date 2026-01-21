<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-8 space-y-6">
       <div>
      <NavigationBreadCrumb />
    </div>

    <div
      class="relative overflow-hidden border-0  bg-linear-to-br from-brand-start/30 via-brand-middle to-brand-end  p-5 md:p-8 lg:p-10 mb-8 shadow-2xl ring-1 ring-white/20">
      <div class="absolute top-0 right-0 -mt-8 -mr-8 opacity-15 transition-transform duration-700 hover:scale-110">
        <UIcon name="i-heroicons-home-modern" class="h-48 w-48 lg:h-64 lg:w-64 text-white" />
      </div>

      <div class="relative z-10">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div class="space-y-6 max-w-2xl">
            <div>
              <h1
                class="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Create a Rental & <br class="hidden sm:block" />
                <span class="text-emerald-200">Join Thousands</span>
              </h1>
              <p class="mt-4 text-base md:text-lg lg:text-xl text-emerald-50 font-medium leading-relaxed opacity-90">
                Reach unlimited users, maximize your earnings, and connect with ideal tenants in our verified
                marketplace.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-x-4 gap-y-3">
              <div class="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                <UIcon name="i-heroicons-users" class="h-4 w-4 text-emerald-200" />
                <span class="text-xs md:text-sm text-white font-semibold">10k+ Tenants</span>
              </div>
              <div class="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                <UIcon name="i-heroicons-currency-dollar" class="h-4 w-4 text-emerald-200" />
                <span class="text-xs md:text-sm text-white font-semibold">95% Success</span>
              </div>
              <div
                class="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                <UIcon name="i-heroicons-shield-check" class="h-4 w-4 text-emerald-200" />
                <span class="text-xs md:text-sm text-white font-semibold">Verified</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-end">

            <div
              class="flex-1 lg:flex-none bg-gray-950/20 backdrop-blur-xl rounded-2xl p-5 border border-white/20 min-w-[260px]">
              <div class="flex items-center justify-between mb-3">
                <p class="text-xs font-bold uppercase tracking-widest text-emerald-100/80">Listing Progress</p>
                <span class="text-xl font-black text-white">{{ progress.percent }}%</span>
              </div>
              <UProgress v-model="progress.percent" color="success" size="md" :ui="{
                background: 'bg-white/20',
                progress: { color: 'text-white' }
              }" class="mb-3 h-2.5" />

              <div class="flex items-center justify-between text-[11px] md:text-xs text-emerald-50/70 font-medium">
                <span>{{ progress.completed }} of {{ progress.total }} steps</span>
                <span v-if="progress.percent === 100" class="flex items-center gap-1">
                  <UIcon name="i-heroicons-check-badge" /> Ready to post
                </span>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2">
              <UButton color="white" variant="soft" size="md" icon="i-heroicons-question-mark-circle"
                class="font-bold rounded-xl" />
              <UDropdownMenu :items="prefItems">
                <UButton color="white" variant="white" size="md" icon="i-lucide-settings" label="Settings"
                  class="font-bold rounded-xl shadow-lg" />
              </UDropdownMenu>
            </div>

          </div>
        </div>
      </div>
    </div>

    <UAccordion v-model="openItems" :items="accordionItems" :type="allowMultiple ? 'multiple' : 'single'"
      variant="soft">
      <template #default="{ item, open }">
        <div class="flex items-center justify-between w-full py-2">
          <div class="flex items-center gap-3">
            <UIcon v-if="item.isDone" :name="item.isDone ? 'i-heroicons-check-circle-20-solid' : 'item.icon'"
              class="h-5 w-5" :class="item.isDone ? 'text-emerald-500' : 'text-gray-400'" />
            <span
              :class="[item.isDone ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-gray-700 dark:text-gray-200']">
              {{ item.label }}
            </span>
          </div>
          <UIcon :name="open ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" class="h-4 w-4 text-gray-400" />
        </div>
      </template>

      <template #content="{ item }">
        <div
          :class="[item.isDone ? 'border-l-2 border-emerald-500 ml-2 pl-6' : 'ml-2 pl-6 border-l-2 border-gray-100 dark:border-gray-800']">
          <component :is="item.component" v-bind="item.props" class="w-full py-4" />
        </div>
      </template>
    </UAccordion>

    <UModal v-model:open="openModal" :prevent-close="modalType === 'reset-confirm'">
      <template #body>
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                :name="modalType === 'missing-fields' ? 'i-heroicons-clipboard-document-check' : 'i-heroicons-trash'"
                class="h-5 w-5" :class="modalType === 'missing-fields' ? 'text-primary-500' : 'text-red-500'" />
              <span class="font-bold text-lg">
                {{ modalType === 'missing-fields' ? `Listing Progress (${progress.percent}%)` : 'Discard Progress?' }}
              </span>
            </div>
          </template>

          <div v-if="modalType === 'missing-fields'" class="space-y-4 p-2">
            <div v-if="missingRequired.length" class="space-y-2">
              <p class="text-sm font-bold text-red-600 dark:text-red-400 uppercase">Required to post</p>
              <div class="grid grid-cols-1 gap-1">
                <div v-for="f in missingRequired" :key="f"
                  class="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/10 rounded-lg">
                  <span class="text-sm font-medium">{{ f }}</span>
                  <UButton size="xs" color="red" variant="ghost" @click="goToSection(f)">Fix</UButton>
                </div>
              </div>
            </div>

            <div v-if="missingOptional.length" class="space-y-2">
              <p class="text-sm font-bold text-gray-500 uppercase">Recommended</p>
              <div class="grid grid-cols-1 gap-1">
                <div v-for="f in missingOptional" :key="f"
                  class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span class="text-sm">{{ f }}</span>
                  <UButton size="xs" color="neutral" variant="ghost" @click="goToSection(f)">Add</UButton>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="p-2">
            <p class="text-gray-600 dark:text-gray-400 italic">
              This will clear all data you've entered in this session. This cannot be undone.
            </p>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton variant="ghost" color="neutral" @click="closeModal">Cancel</UButton>
              <UButton v-if="modalType === 'missing-fields'" color="primary" :disabled="missingRequired.length > 0"
                :loading="isLoading" @click="proceedAnyway">
                Post Anyway
              </UButton>
              <UButton v-else color="red" @click="confirmReset">Confirm Discard</UButton>
            </div>
          </template>
        </UCard>
      </template>

    </UModal>

    <Transition name="fade-up">
      <div v-if="ongoingCreate.hasUnsavedChanges"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div
          class="bg-gray-900 dark:bg-gray-800 rounded-2xl shadow-2xl p-4 flex items-center justify-between border border-white/10">
          <div class="flex items-center gap-3 pl-2">
            <div class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span class="text-white text-sm font-medium">Draft Unsaved</span>
          </div>
          <div class="flex gap-2">
            <UButton size="sm" variant="ghost" color="neutral" @click="showResetConfirm">Discard</UButton>
            <UButton size="sm" color="primary" :loading="isLoading" class="px-6" @click="saveAll">Post</UButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>


<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import { useEndpoints } from '~/composables/useEndpoints'
import { useSeo } from '~/composables/useSeo'
import { useUserStore } from '~/stores/user'

const route = useRoute()
const { post } = useApi()
const endpoints = useEndpoints()
const rentalStore = useRentalStore()
const { ongoingCreate } = storeToRefs(rentalStore)

const userStore = useUserStore()

onMounted(() => {
  useSeo({
    title: 'Edit Rental - ' + route.params.id,
    description: 'Edit your rental property details',
    image: undefined
  })
})

// Only run on client side after hydration
const {
  pending,
  error,
  refresh,
  data: rentalData
} = await useLazyAsyncData(
  () => `rental_for_edit_${route.params.id}`,
  async () => {
    // Wait for user to be hydrated/authenticated
    if (!userStore.isAuthenticated) {
      throw new Error('User not authenticated')
    }
    return await rentalStore.fetchRentalByIdForEdit(route.params.id as string)
  },
  {
    watch: [() => route.params.id],
    server: false, // This is key: don't run on server
    immediate: false // Don't run immediately
  }
)

// Trigger the fetch when user is authenticated
watch(() => userStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    refresh()
  }
})





const toast = useToast()

// State Management
const openModal = ref(false)
const modalType = ref<'missing-fields' | 'reset-confirm'>('missing-fields')
const missingRequired = ref<string[]>([])
const missingOptional = ref<string[]>([])
const completionPercentage = ref(0)
const isLoading = ref(false)
const allowMultiple = ref(false)
const openItems = ref('0')

// --- Actions ---

const closeModal = () => {
  openModal.value = false
}

const showResetConfirm = () => {
  modalType.value = 'reset-confirm'
  openModal.value = true
}

const confirmReset = () => {
  rentalStore.resetOngoingCreate()
  closeModal()
}

const proceedAnyway = async () => {
  closeModal()
  isLoading.value = true
  try {
    await rentalStore.persistOngoingCreate()
  } finally {
    isLoading.value = false
  }
}

const saveAll = async () => {
  const report = await rentalStore.checkAllRequiredData()

  if (report.isComplete) {
    isLoading.value = true
    try {
      const res = await rentalStore.persistOngoingCreate()
      if (res.success) {
        toast.add({
          title: "Post created successfull",
          color: 'success'
        })
      } else {
        toast.add({
          title: res.message,
          color: 'error'
        })
      }

    } finally {
      isLoading.value = false
    }
  } else {
    missingRequired.value = report.required
    missingOptional.value = report.optional
    completionPercentage.value = report.completionPercentage
    modalType.value = 'missing-fields'
    openModal.value = true
  }
}

const goToSection = (sectionName: string) => {
  const index = accordionItems.value.findIndex(item =>
    item.label.toLowerCase().includes(sectionName.toLowerCase().split(':')[0])
  )
  if (index !== -1) {
    openItems.value = index.toString()
  }
  closeModal()
}

// --- Helpers ---

const hasSectionData = (key: keyof typeof ongoingCreate.value) => {
  const val = ongoingCreate.value[key]
  if (Array.isArray(val)) return val.length > 0
  if (val && typeof val === 'object') return Object.keys(val).length > 0
  return !!val
}

const getSectionIcon = (fieldName: string) => {
  return accordionItems.value.find(i => fieldName.includes(i.label))?.icon || 'i-heroicons-document'
}

// --- Computed ---

const accordionItems = computed(() => [
  {
    label: 'Basic Info',
    icon: 'i-heroicons-home',
    component: defineAsyncComponent(() => import('~/components/property/PropertyHeaderUpload.vue')),
    isDone: hasSectionData('headInfo'),
    props: {
      modelValue: ongoingCreate.value.headInfo,
      'onUpdate:modelValue': (v: any) => rentalStore.setHeadInfo(v),
      'onReset': () => handleReset('headInfo'),
      'onSave': () => handleHeadInfoSave()
    }
  },
  {
    label: 'Files',
    icon: 'i-heroicons-photo',
    component: defineAsyncComponent(() => import('~/components/property/FileUploader.vue')),
    isDone: hasSectionData('files'),
    props: {
      modelValue: ongoingCreate.value.files,
      'onUpdate:modelValue': (v: any) => rentalStore.addFiles(v),
      'onReset': () => handleReset('files'),
      'onSave': () => handleFilesSave()
    }
  },
  {
    label: 'Location',
    icon: 'i-heroicons-map-pin',
    component: defineAsyncComponent(() => import('~/components/property/LocationUploader.vue')),
    isDone: hasSectionData('location'),
    props: {
      modelValue: ongoingCreate.value.location,
      'onUpdate:modelValue': (v: any) => rentalStore.setLocation(v),
      'onReset': () => handleReset('location'),
      'onSave': () => handleLocationSave()
    }
  },
  {
    label: 'Amenities',
    icon: 'i-heroicons-sparkles',
    component: defineAsyncComponent(() => import('~/components/property/AmenitiesUploader.vue')),
    isDone: hasSectionData('amenities'),
    props: {
      modelValue: ongoingCreate.value.amenities,
      'onUpdate:modelValue': (v: any[]) => rentalStore.setAmenities(v),
      'onReset': () => handleReset('location'),
      'onSave': () => handleAmenitiesSave()
    }
  },
  {
    label: 'Pricing',
    icon: 'i-heroicons-currency-dollar',
    component: defineAsyncComponent(() => import('~/components/property/PriceUploader.vue')),
    isDone: hasSectionData('price'),
    props: {
      modelValue: ongoingCreate.value.price,
      'onUpdate:modelValue': (v: any[]) => rentalStore.setPrice(v),
      'onReset': () => handleReset('price'),
      'onSave': () => handlePriceSave()
    }
  },
  {
    label: 'Rules',
    icon: 'i-heroicons-document-text',
    component: defineAsyncComponent(() => import('~/components/property/RulesUploader.vue')),
    isDone: hasSectionData('rulesContent') || hasSectionData('propertyRules'),
    props: {
      modelValue: ongoingCreate.value.rules,
      mode: 'advanced',
      'onUpdate:modelValue': (v: any[]) => rentalStore.setRules(v),
      'onReset': () => handleReset('rules'),
      'onSave': () => handleRulesSave()
    }
  }
])

const handleReset = (vl) => {
  console.log("Reseting", vl)
}

const handleHeadInfoSave = () => {
  const res = rentalStore.uploadHeadInfo()
  console.log("Submit Responce", res)
}

const handleFilesSave = () => {
  const res = rentalStore.uploadFiles()
  console.log("Submit Responce", res)
}

const handleLocationSave = () => {
  const res = rentalStore.uploadLocation()
  console.log("Submit Responce", res)
}

const handleAmenitiesSave = () => {
  const res = rentalStore.uploadAmenities()
  console.log("Submit Responce", res)
}

const handlePriceSave = () => {
  const res = rentalStore.uploadPrice()
  console.log("Submit Responce", res)
}

const handleRulesSave = () => {
  const res = rentalStore.uploadRules()
  console.log("Submit Responce", res)
}


const progress = computed(() => {
  const done = accordionItems.value.filter(i => i.isDone).length
  const total = accordionItems.value.length
  return { done, total, percent: Math.round((done / total) * 100) }
})

const prefItems = computed(() => [[
  {
    label: allowMultiple.value ? 'Multiple' : 'One at a Time',
    icon: 'i-lucide-grid',
    type: 'checkbox' as const,
    checked: allowMultiple.value,
    onUpdateChecked(v: boolean) { allowMultiple.value = v }
  }
]])

// --- Watchers & Lifecycle ---

watch(ongoingCreate, () => { ongoingCreate.value.hasUnsavedChanges = true }, { deep: true })

onBeforeUnmount(async () => {
  if (ongoingCreate.value.hasUnsavedChanges) {
    const report = await rentalStore.checkAllRequiredData()
    if (report.isComplete) await rentalStore.persistOngoingCreate()
  }
})


// Also trigger on mount if already authenticated
onMounted(() => {
  if (userStore.isAuthenticated) {
    refresh()
  }
})
</script>

<style scoped>
pre {
  background: #565252;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
</style>
