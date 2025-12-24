<template>
  <UCard class="max-w-6xl mx-auto m-2 " :ui="{ body: { padding: 'p-0' } }">
    <div class="sticky top-0 z-20 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800 rounded-t-lg">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Property Pricing</h2>
          <p class="text-sm text-gray-500">Configure the rental pricing details for your property</p>
        </div>
        <div class="hidden md:block">
          <UButton color="primary" @click="savePricing" :disabled="!isFormValid" :loading="isSaving" icon="i-heroicons-check">
            Save Changes
          </UButton>
        </div>
      </div>
    </div>

    <div class="p-2 space-y-6 relative">
      <!-- <div class="0 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <span class="text-xs font-bold text-gray-400 uppercase mb-2 block">Quick Navigation</span>
        <UTree 
          :items="pageSteps" 
          :ui="{ label: 'cursor-pointer hover:text-primary-500' }"
          @select="handleTreeSelect"
        />
      </div> -->

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-6">
          <UCard id="section-price">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5 text-primary-500" />
                <h3 class="font-semibold">Rental Price</h3>
              </div>
            </template>
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium">Payment Period <span class="text-red-500">*</span></label>
                  <USelect v-model="priceForm.period" :items="periodOptions" />
                </div>
                <div class="space-y-2">
                  <label class="block text-sm font-medium">Currency</label>
                  <USelect v-model="priceForm.currency" :items="currencyOptions" />
                </div>
              </div>
              <div class="flex flex-col md:flex-row gap-2">
                <div class="flex-1 space-y-2">
                  <label class="block text-sm font-medium">Amount <span class="text-red-500">*</span></label>
                  <UInput v-model="priceForm.amount" type="number" min="0" step="0.01" placeholder="3000">
                    <template #trailing><span class="text-sm px-2">{{ priceForm.currency }}</span></template>
                  </UInput>
                </div>
                <div class="flex-1 space-y-2">
                  <label class="block text-sm font-medium">Min. Rent Period</label>
                  <UInput v-model="priceForm.minRentPeriod" type="number" min="1">
                    <template #trailing><span class="text-sm px-2">{{ units.minRent }}</span></template>
                  </UInput>
                </div>
              </div>
            </div>
          </UCard>

          <UCard id="section-deposit">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-emerald-500" />
                <h3 class="font-semibold">Security Deposit</h3>
              </div>
            </template>
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium">Deposit Amount</label>
                <UInput v-model="priceForm.depositAmount" type="number" placeholder="0.00">
                  <template #trailing><span class="px-2">{{ priceForm.currency }}</span></template>
                </UInput>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium">Deposit Type</label>
                <USelect v-model="priceForm.depositType" :items="depositTypeOptions" />
              </div>
              <div class="flex items-center justify-between pt-2">
                <label class="text-sm font-medium">Refundable?</label>
                <UToggle v-model="priceForm.isRefundable" />
              </div>
            </div>
          </UCard>
        </div>

        <div class="space-y-6">
          <UCard id="section-charges">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-plus-circle" class="w-5 h-5 text-purple-500" />
                <h3 class="font-semibold">Additional Charges</h3>
              </div>
            </template>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium">Utilities Included?</label>
                <UToggle v-model="priceForm.utilitiesIncluded" />
              </div>
              <div v-if="!priceForm.utilitiesIncluded" class="space-y-4 pl-4 border-l-2 border-gray-200" id="section-utilities">
                <div v-for="u in utilities" :key="u.id" class="space-y-2">
                  <label class="block text-sm font-medium">{{ u.label }}</label>
                  <UInput v-model="priceForm[u.key]" type="number">
                    <template #trailing><span class="text-xs px-2">/{{ units.billing }}</span></template>
                  </UInput>
                </div>
              </div>
              <div id="section-fees" class="space-y-4 pt-4 border-t">
                <div class="flex items-center justify-between">
                  <h4 class="font-medium">Extra Fees</h4>
                  <UButton size="xs" variant="soft" @click="addExtraFee" icon="i-heroicons-plus">Add Fee</UButton>
                </div>
                <div v-for="(fee, index) in priceForm.extraFees" :key="fee.id" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-bold text-gray-400">#{{ index + 1 }}</span>
                    <UButton color="red" variant="ghost" size="xs" @click="removeExtraFee(fee.id)" icon="i-heroicons-trash" />
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <UInput v-model="fee.description" placeholder="Label" />
                    <UInput v-model="fee.amount" type="number" placeholder="0.00" />
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <div id="section-summary" class="sticky bottom-0 left-0 right-0 backdrop-blur-2xl bg-white/50 dark:bg-gray-900/50  border-t border-gray-200 dark:border-gray-800 p-4 shadow-lg">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div class="flex flex-wrap gap-3">
            <div v-for="item in summaryItems" :key="item.label" class="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <UIcon :name="item.icon" :class="['w-4 h-4', item.color]" />
              <div>
                <div class="text-[10px] uppercase font-bold text-gray-400">{{ item.label }}</div>
                <div class="text-sm font-bold">{{ item.value }}</div>
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <UButton color="gray" variant="soft" @click="resetForm">Reset</UButton>
            <UButton color="primary" @click="savePricing" :disabled="!isFormValid" :loading="isSaving">Save Details</UButton>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const isSaving = ref(false)
const showValidation = ref(false)

const pageSteps = [
  {
    label: 'Pricing & Basic',
    id: 'section-price',
    icon: 'i-heroicons-currency-dollar',
    children: [
      { label: 'Base Amount', id: 'section-price' },
      { label: 'Payment Period', id: 'section-price' }
    ]
  },
  {
    label: 'Security Deposit',
    id: 'section-deposit',
    icon: 'i-heroicons-shield-check'
  },
  {
    label: 'Charges & Fees',
    id: 'section-charges',
    icon: 'i-heroicons-plus-circle',
    children: [
      { label: 'Utilities', id: 'section-utilities' },
      { label: 'Extra Fees', id: 'section-fees' }
    ]
  },
  {
    label: 'Final Summary',
    id: 'section-summary',
    icon: 'i-heroicons-document-text'
  }
]

const priceForm = reactive({
  amount: '',
  period: 'monthly',
  currency: 'KES',
  depositAmount: '',
  depositType: 'One month rent',
  isRefundable: true,
  minRentPeriod: 1,
  utilitiesIncluded: false,
  electricity: '',
  water: '',
  internet: '',
  cleaningFee: '',
  serviceFee: '',
  extraFees: [] as any[]
})

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    const yOffset = -100 // Account for sticky header
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

const handleTreeSelect = (item: any) => {
  if (item.id) {
    // Update URL without reloading
    router.push({ query: { open: item.id.replace('section-', '') } })
    scrollToSection(item.id)
  }
}

const periodOptions = ['daily', 'weekly', 'monthly', 'quarterly', 'annually']
const currencyOptions = ['USD', 'EUR', 'GBP', 'KES', 'NGN', 'ZAR']
const depositTypeOptions = ['One month rent', 'Two months rent', 'Fixed amount', 'Negotiable']
const utilities = [
  { id: 'electricity', label: 'Electricity', key: 'electricity' },
  { id: 'water', label: 'Water', key: 'water' },
  { id: 'internet', label: 'Internet', key: 'internet' }
]

const units = computed(() => ({
  billing: priceForm.period.replace('ly', '') || 'month',
  minRent: priceForm.minRentPeriod > 1 ? 'periods' : 'period'
}))

const isFormValid = computed(() => parseFloat(priceForm.amount) > 0)

const formatNum = (val: any) => {
  const n = parseFloat(val)
  return isNaN(n) ? '0.00' : n.toLocaleString(undefined, { minimumFractionDigits: 2 })
}

const summaryItems = computed(() => [
  { label: 'Rent', value: `${priceForm.currency} ${formatNum(priceForm.amount)}`, icon: 'i-heroicons-home', color: 'text-primary-500' },
  { label: 'Deposit', value: formatNum(priceForm.depositAmount), icon: 'i-heroicons-shield-check', color: 'text-emerald-500' }
])

const addExtraFee = () => priceForm.extraFees.push({ id: uuidv4(), description: '', amount: '' })
const removeExtraFee = (id: string) => priceForm.extraFees = priceForm.extraFees.filter(f => f.id !== id)
const resetForm = () => Object.assign(priceForm, { amount: '', extraFees: [] })

const savePricing = async () => {
  isSaving.value = true
  await new Promise(r => setTimeout(r, 800))
  emit('update:modelValue', { ...priceForm })
  toast.add({ title: 'Saved successfully', color: 'green' })
  isSaving.value = false
}

// Handle URL query on load
onMounted(() => {
  if (route.query.open) {
    setTimeout(() => scrollToSection(`section-${route.query.open}`), 500)
  }
})
</script>