<template>
  <UCard class="max-w-6xl mx-auto m-1 sm:m-2" :ui="{ body: { padding: 'p-0' } }">
    <!-- Header - Compact -->
    <div
      class="sticky top-0 z-20 bg-white dark:bg-gray-900 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center justify-between">
        <div class="min-w-0">
          <h2 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 truncate">Property Pricing</h2>
          <p class="text-xs sm:text-sm text-gray-500 truncate">Set rent price and included amenities</p>
        </div>
        <div class="hidden sm:block">
          <UButton color="primary" @click="savePricing" :disabled="!isFormValid" :loading="isSaving" size="sm"
            icon="i-heroicons-check">
            Save
          </UButton>
        </div>
      </div>
    </div>

    <!-- Main Content - Compact spacing -->
    <div class="p-3 sm:p-4 space-y-4 sm:space-y-6">
      <!-- Rent Details - Compact -->
      <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Rent Details</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs sm:text-sm font-medium">Payment Period</label>
            <USelect v-model="priceForm.period" :items="periodOptions" size="sm" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-xs sm:text-sm font-medium">Currency</label>
            <USelect v-model="priceForm.currency" :items="currencyOptions" size="sm" />
          </div>
          <div class="space-y-1.5">
            <label class="block text-xs sm:text-sm font-medium">Rent Amount <span class="text-red-500">*</span></label>
            <UInput v-model="priceForm.amount" type="number" min="0" placeholder="3000" size="sm">
              <template #trailing>
                <span class="text-xs sm:text-sm font-medium px-1 sm:px-2">{{ priceForm.currency }}</span>
              </template>
            </UInput>
          </div>
        </div>
      </div>

      <!-- Security Deposit - Compact -->
      <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Security Deposit</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div class="space-y-1.5">
            <label class="block text-xs sm:text-sm font-medium">Deposit Amount</label>
            <UInput v-model="priceForm.depositAmount" type="number" placeholder="0.00" size="sm">
              <template #trailing>
                <span class="text-xs sm:text-sm font-medium px-1 sm:px-2">{{ priceForm.currency }}</span>
              </template>
            </UInput>
          </div>
          <div class="space-y-1.5">
            <label class="block text-xs sm:text-sm font-medium">Discount</label>
            <UInput v-model="priceForm.discount" type="number" placeholder="0.00" size="sm"/>     
                            <span v-if="priceform?.discount" class="text-xs sm:text-sm font-medium px-1 sm:px-2">{{ priceForm?.discount/priceForm?.amount *100 }}</span>
        
          </div>
        </div>
      </div>

      <!-- Basic Amenities (Pre-added) -->
      <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="mb-3">
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Basic Amenities</h3>
          <p class="text-xs text-gray-500 mt-1">Check if included in rent, or enter additional cost</p>
        </div>

        <div class="space-y-2">
          <div v-for="fee in basicAmenities" :key="fee.id"
            class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0 flex-1">
                <div
                  class="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <UIcon :name="fee.icon" class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div class="min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ fee.name }}</h4>
                  <p class="text-xs text-gray-500 truncate">{{ fee.description }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 flex-shrink-0">
                <div class="flex flex-col items-end">
                  <USwitch v-model="fee.is_included" @change="toggleAmenityInclusion(fee)" size="sm"
                    :ui="{ container: 'h-5 w-9' }" />
                  <span class="text-[10px] text-gray-500 mt-1">
                    {{ fee.is_included ? 'In Rent' : 'Own Pay' }}
                  </span>
                </div>

                <div v-if="!fee.is_included" class="w-20">
                  <UInput v-model="fee.amount" type="number" placeholder="0.00" size="xs" class="text-xs">
                    <template #trailing>
                      <span class="text-[10px] px-0.5">{{ priceForm.currency }}</span>
                    </template>
                  </UInput>
                  <div class="text-[9px] text-gray-400 mt-0.5">per {{ units.billing }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Fees & Amenities -->
      <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div class="mb-3">
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Additional Fees & Amenities</h3>
          <p class="text-xs text-gray-500 mt-1">Add extra fees or amenities not listed above</p>
        </div>

        <!-- Quick Add Common Items -->
        <div class="mb-4">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Add</h4>
          <div class="flex flex-wrap gap-2">
            <UButton v-for="item in additionalItems" :key="item.id" size="xs" variant="soft"
              @click="addAdditionalItem(item)" class="flex items-center gap-1">
              <UIcon :name="item.icon" class="w-3 h-3" />
              {{ item.name }}
            </UButton>
          </div>
        </div>

        <!-- Additional Fees List -->
        <div v-if="additionalFees.length > 0" class="space-y-3">
          <div v-for="(fee, index) in additionalFees" :key="fee.id"
            class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded-md bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <UIcon :name="getItemIcon(fee.name)" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div class="min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ fee.name || `Extra Fee
                    #${index
                    + 1}` }}</h4>
                  <p v-if="fee.description" class="text-xs text-gray-500 truncate">{{ fee.description }}</p>
                </div>
              </div>
              <UButton color="red" variant="ghost" size="xs" @click="removeAdditionalFee(fee.id)"
                icon="i-heroicons-trash" />
            </div>

            <div class="space-y-3">
              <UInput v-model="fee.name" placeholder="Name (e.g., Maintenance, Gym, etc.)" size="xs" class="text-sm"
                icon="i-heroicons-tag" />

              <UInput v-model="fee.description" placeholder="Description (optional)" size="xs" class="text-sm"
                icon="i-heroicons-document-text" />

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- Included/Not Included Toggle -->
                <div class="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                  <div class="flex items-center gap-2">
                    <UIcon :name="fee.is_included ? 'i-heroicons-check-circle' : 'i-heroicons-currency-dollar'"
                      :class="['w-4 h-4', fee.is_included ? 'text-green-500' : 'text-gray-500']" />
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {{ fee.is_included ? 'In Rent' : 'Additional Cost' }}
                    </span>
                  </div>
                  <USwitch v-model="fee.is_included" @change="toggleFeeInclusion(fee)" size="sm"
                    :ui="{ container: 'h-5 w-9' }" />
                </div>

                <!-- Amount Input (shown when not included) -->
                <div v-if="!fee.is_included" class="flex gap-2">
                  <UInput v-model="fee.amount" type="number" placeholder="0.00" size="xs" class="text-sm flex-1"
                    icon="i-heroicons-banknotes">
                    <template #trailing>
                      <span class="text-xs px-1">{{ priceForm.currency }}</span>
                    </template>
                  </UInput>
                </div>
              </div>

              <!-- Included indicator -->
              <div v-if="fee.is_included"
                class="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span class="text-xs text-emerald-700 dark:text-emerald-300">
                  Included in rent at no extra cost
                </span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <div
            class="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-2">
            <UIcon name="i-heroicons-plus-circle" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <p class="text-sm text-gray-500">No additional fees added</p>
          <p class="text-xs text-gray-400 mt-1">Use "Quick Add" buttons to add amenities</p>
        </div>

        <!-- Add Custom Button -->
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <UButton @click="addCustomFee" variant="outline" size="sm" class="w-full justify-center"
            icon="i-heroicons-plus">
            Add Custom Fee or Amenity
          </UButton>
        </div>
      </div>
    </div>

    <!-- Mobile Save Button -->
    <div class="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-3">
      <div class="flex items-center justify-between gap-2">
        <UButton color="gray" variant="soft" size="sm" @click="resetForm" class="flex-1 sm:flex-none">
          Reset
        </UButton>
        <UButton color="primary" @click="savePricing" :disabled="!isFormValid" :loading="isSaving"
          class="flex-1 sm:flex-none">
          <template #leading>
            <UIcon name="i-heroicons-check" class="w-4 h-4" />
          </template>
          Save Pricing
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

interface ExtraFee {
  id: string
  name: string
  code: string
  is_included: boolean
  description: string
  amount: number | null
  icon?: string
}

interface CommonItem {
  id: string
  name: string
  description: string
  icon: string
  code: string
}

interface PropertyPrice {
  amount: number | null
  discount: number | null
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually'
  currency: string
  depositAmount: number | null
  depositType: 'One month rent' | 'Two months rent' | 'Fixed amount' | 'Negotiable'
  isRefundable: boolean
  minRentPeriod: number
  utilitiesIncluded: boolean
  cleaningFee: number | string
  serviceFee: number | string
  extraFees: ExtraFee[]
}


const props = defineProps<{
  modelValue: PropertyPrice
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PropertyPrice): void
  (e: 'save'): void
  (e: 'reset'): void
}>()

const priceForm = computed<PropertyPrice>({
  get: () => props.modelValue.data,
  set: (data) =>
    emit('update:modelValue', data)
})

const toast = useToast()
const isSaving = ref(false)

const periodOptions = ['monthly', 'weekly', 'daily', 'quarterly', 'annually']
const currencyOptions = ['USD', 'EUR', 'GBP', 'KES', 'NGN', 'ZAR']
const depositTypeOptions = ['One month rent', 'Two months rent', 'Fixed amount', 'Negotiable']

// Basic amenities that are pre-added by default
const basicAmenities = computed<ExtraFee[]>(() => [
  {
    id: 'water',
    name: 'Water',
    code: 'water',
    is_included: true,
    description: 'Water supply and usage',
    amount: null,
    icon: 'i-heroicons-beaker'
  },
  {
    id: 'electricity',
    name: 'Electricity',
    code: 'electricity',
    is_included: true,
    description: 'Power supply and consumption',
    amount: null,
    icon: 'i-heroicons-bolt'
  },
  {
    id: 'wifi',
    name: 'WiFi',
    code: 'wifi',
    is_included: true,
    description: 'Internet connectivity',
    amount: null,
    icon: 'i-heroicons-wifi'
  },
  {
    id: 'gas',
    name: 'Gas',
    code: 'gas',
    is_included: false,
    description: 'Cooking gas supply',
    amount: null,
    icon: 'i-heroicons-fire'
  }
])

// Additional items that can be added
const additionalItems: CommonItem[] = [
  {
    id: 'parking',
    name: 'Parking',
    description: 'Car parking space',
    icon: 'i-heroicons-truck',
    code: 'parking'
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    description: 'Cleaning service',
    icon: 'i-heroicons-broom',
    code: 'cleaning'
  },
  {
    id: 'gym',
    name: 'Gym',
    description: 'Fitness center access',
    icon: 'i-heroicons-user-group',
    code: 'gym'
  },
  {
    id: 'pool',
    name: 'Pool',
    description: 'Swimming pool access',
    icon: 'i-heroicons-beaker',
    code: 'pool'
  },
  {
    id: 'security',
    name: 'Security',
    description: '24/7 security service',
    icon: 'i-heroicons-shield-check',
    code: 'security'
  },
  {
    id: 'laundry',
    name: 'Laundry',
    description: 'Laundry facilities',
    icon: 'i-heroicons-sparkles',
    code: 'laundry'
  }
]

// Additional fees (user-added)
const additionalFees = computed(() =>
  priceForm.value.extraFees.filter(fee =>
    !basicAmenities.value.some(basic => basic.code === fee.code)
  )
)

const units = computed(() => ({
  billing: priceForm.value.period.replace('ly', '') || 'month'
}))

const isFormValid = computed(() => Number(priceForm.value.amount) > 0)

const getItemIcon = (name: string) => {
  const allItems = [...basicAmenities.value, ...additionalItems]
  const item = allItems.find(item =>
    item.name.toLowerCase() === name.toLowerCase() ||
    item.id.toLowerCase() === name.toLowerCase()
  )
  return item?.icon || 'i-heroicons-receipt-percent'
}

const toggleAmenityInclusion = (fee: ExtraFee) => {
  if (fee.is_included) {
    fee.amount = null
  }
}

const addAdditionalItem = (item: CommonItem) => {
  // Check if already exists
  const existingFee = priceForm.value.extraFees.find(fee => fee.code === item.code)

  if (existingFee) {
    toast.add({
      title: 'Already added',
      description: `${item.name} is already in the list`,
      color: 'warning',
      timeout: 2000
    })
    return
  }

  priceForm.value.extraFees.push({
    id: uuidv4(),
    name: item.name,
    code: item.code,
    is_included: false,
    description: item.description,
    amount: null
  })

  toast.add({
    title: 'Added',
    description: `${item.name} added to additional fees`,
    color: 'success',
    timeout: 1500
  })
}

const toggleFeeInclusion = (fee: ExtraFee) => {
  if (fee.is_included) {
    fee.amount = null
  }
}

const addCustomFee = () => {
  priceForm.value.extraFees.push({
    id: uuidv4(),
    name: '',
    code: '',
    is_included: false,
    description: '',
    amount: null
  })
}

const removeAdditionalFee = (id: string) => {
  priceForm.value.extraFees = priceForm.value.extraFees.filter(f => f.id !== id)
}

const resetForm = () => {
  // Reset only additional fees, keep basic amenities
  priceForm.value.extraFees = [...basicAmenities.value]
  emit('reset')
}

const savePricing = async () => {
  if (!isFormValid.value) {
    toast.add({
      title: 'Enter rent amount',
      color: 'error',
      timeout: 2000
    })
    return
  }

  isSaving.value = true

  // Ensure basic amenities are always in extraFees
  const basicAmenityCodes = basicAmenities.value.map(a => a.code)
  const existingBasicAmenities = priceForm.value.extraFees.filter(fee =>
    basicAmenityCodes.includes(fee.code)
  )

  // Add any missing basic amenities
  basicAmenities.value.forEach(basic => {
    if (!existingBasicAmenities.some(fee => fee.code === basic.code)) {
      priceForm.value.extraFees.push({ ...basic })
    }
  })

  // Auto-generate codes for additional fees that don't have them
  priceForm.value.extraFees.forEach(fee => {
    if (!fee.code && fee.name) {
      fee.code = fee.name.toLowerCase().replace(/\s+/g, '_')
    }
    // Ensure amount is empty string when included
    if (fee.is_included && fee.amount !== null) {
      fee.amount = null
    }
  })

  await new Promise(r => setTimeout(r, 500))

  emit('save')
  toast.add({
    title: 'Pricing saved',
    color: 'info',
    timeout: 2000
  })
  isSaving.value = false
}

onMounted(() => {
  // Initialize with basic amenities if empty
  if (priceForm.value.extraFees.length === 0) {
    priceForm.value.extraFees = [...basicAmenities.value]
  } else {
    // Ensure basic amenities are present
    const basicAmenityCodes = basicAmenities.value.map(a => a.code)
    basicAmenities.value.forEach(basic => {
      if (!priceForm.value.extraFees.some(fee => fee.code === basic.code)) {
        priceForm.value.extraFees.push({ ...basic })
      }
    })
  }

  // Initialize default values if not set
  if (!priceForm.value.minRentPeriod) {
    priceForm.value.minRentPeriod = 1
  }
  if (!priceForm.value.isRefundable) {
    priceForm.value.isRefundable = true
  }
  if (priceForm.value.utilitiesIncluded === undefined) {
    priceForm.value.utilitiesIncluded = false
  }
})


watch(
  priceForm,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
  { deep: true, immediate: true }
)
</script>

