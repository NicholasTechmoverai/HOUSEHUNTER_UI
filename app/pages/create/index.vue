<template>
  <div class="p-4">
    <div>
      <NavigationBreadCrumb />
    </div>
    <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
      Create New
    </h1>

    <div class="space-y-2 max-w-md">
      <UPageCard v-for="item in createOptions" :key="item.link" :spotlight="true" :spotlight-color="item.badgeColor"
        class="p-0!  m-2!">
        <div class="flex items-center  transition-colors">
          <UIcon :name="item.icon" class="w-5 h-5 mr-3 text-gray-700 dark:text-gray-300" />
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-900 dark:text-white">{{ item.title }}</span>
              <UBadge v-if="item.badge" :color="item.badgeColor" size="xs">{{ item.badge }}</UBadge>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ item.description }}</div>
          </div>
          <div class="flex items-center gap-2">
            <button @click="openInfoDrawer(item.type)" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="More information">
              <UIcon name="i-heroicons-information-circle"
                class="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
            <NuxtLink :to="item.link">
              <UIcon name="i-heroicons-chevron-right"
                class="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </NuxtLink>
          </div>
        </div>
      </UPageCard>

    </div>

    <UDrawer :direction="screen.isMobile.value ? 'bottom' : 'right'" :inset="screen.isMobile.value ? false : true"
      v-model:open="isDrawerOpen" :ui="{
        overlay: { background: 'bg-gray-900/80 backdrop-blur-sm' },
        wrapper: 'h-[85vh] rounded-b-3xl overflow-hidden min-w-sm',
        container: 'bg-white dark:bg-gray-900',
        transition: {
          enterActiveClass: 'transition-all duration-500 ease-out',
          leaveActiveClass: 'transition-all duration-300 ease-in',
          enterFromClass: 'opacity-0 -translate-y-10 scale-95',
          leaveToClass: 'opacity-0 -translate-y-10 scale-95'
        }
      }">
      <template #content>
        <InfoDrawer :item="currentItem" @close="isDrawerOpen = false" />
      </template>

    </UDrawer>

  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const screen = useScreenSize()


const isDrawerOpen = ref(false)
const currentItem = ref(null)

const createOptions = [
  {
    type: 'rental',
    title: 'Rental Property',
    description: 'List property for rent',
    icon: 'i-heroicons-home',
    link: '/create/rental',
    badge: 'New',
    badgeColor: 'neutral',
    info: {
      what: 'A standard residential property available for long-term lease. Perfect for homeowners looking to rent out their houses.',
      features: [
        'List property with photos and details',
        'Set rental price and terms',
        'Screen potential tenants',
        'Digital lease agreements',
        'Monthly rent collection'
      ],
      requirements: [
        'Property ownership proof',
        'Property photos (minimum 5)',
        'Valid ID document',
        'Rental price details'
      ],
      setupTime: '5-10 minutes'
    }
  },
  {
    type: 'apartment',
    title: 'Apartment',
    description: 'Create apartment listing',
    icon: 'i-heroicons-building-office',
    link: '/create/apartment',
    badge: 'Hot',
    badgeColor: 'success',
    info: {
      what: 'Individual apartment units within a larger building. Great for condo owners or property managers.',
      features: [
        'Multiple unit management',
        'Amenities listing',
        'Floor plan upload',
        'Building rules',
        'Maintenance requests'
      ],
      requirements: [
        'Unit number and details',
        'Building amenities list',
        'Floor plan (optional)',
        'Building rules'
      ],
      setupTime: '8-12 minutes'
    }
  },
  {
    type: 'swap',
    title: 'Property Swap',
    description: 'Exchange properties',
    icon: 'i-heroicons-arrows-right-left',
    link: '/create/swap',
    info: {
      what: 'Exchange your property temporarily or permanently with another property owner. No money involved.',
      features: [
        'Find swap partners',
        'Set swap duration',
        'Property comparison',
        'Secure agreement',
        'Review system'
      ],
      requirements: [
        'Current property details',
        'Desired location/type',
        'Swap duration preference',
        'Property condition photos'
      ],
      setupTime: '10-15 minutes'
    }
  },
  {
    type: 'agent',
    title: 'House Agent Account',
    description: 'Professional agent account',
    icon: 'i-heroicons-user-group',
    link: '/create/agent',
    badge: 'Popular',
    badgeColor: 'info',
    info: {
      what: 'Professional account for real estate agents to manage multiple properties and clients.',
      features: [
        'Manage multiple properties',
        'Client database',
        'Commission tracking',
        'Property analytics',
        'Professional profile'
      ],
      requirements: [
        'Real estate license',
        'Professional references',
        'Business registration',
        'Bank account details'
      ],
      setupTime: '15-20 minutes'
    }
  },
  {
    type: 'landlord',
    title: 'Landlord Account',
    description: 'Manage properties & tenants',
    icon: 'i-heroicons-building-library',
    link: '/create/landlord',
    info: {
      what: 'Comprehensive account for property owners to manage their rental properties and tenants.',
      features: [
        'Multiple property dashboard',
        'Tenant management',
        'Rent collection',
        'Expense tracking',
        'Maintenance scheduling'
      ],
      requirements: [
        'Property ownership proof',
        'Tax identification',
        'Bank account for payments',
        'Emergency contact'
      ],
      setupTime: '10-15 minutes'
    }
  },
  {
    type: 'caretaker',
    title: 'Caretaker Account',
    description: 'Property maintenance & repairs',
    icon: 'i-heroicons-wrench-screwdriver',
    link: '/create/caretaker',
    info: {
      what: 'Account for property caretakers to manage maintenance, repairs, and property upkeep.',
      features: [
        'Work order management',
        'Service scheduling',
        'Inventory tracking',
        'Client communication',
        'Invoicing and payments'
      ],
      requirements: [
        'Service certifications',
        'Business license',
        'Insurance details',
        'Service area details'
      ],
      setupTime: '10-15 minutes'
    }
  },
  {
    type: 'commercial',
    title: 'Commercial Property',
    description: 'Offices, retail spaces, warehouses',
    icon: 'i-heroicons-building-storefront',
    link: '/create/commercial',
    badge: 'New',
    badgeColor: 'primary',
    info: {
      what: 'Commercial properties including offices, retail spaces, warehouses, and industrial buildings.',
      features: [
        'Detailed floor plans',
        'Business zoning info',
        'Parking and accessibility',
        'Utility specifications',
        'Lease terms customization'
      ],
      requirements: [
        'Property zoning certificate',
        'Floor area calculations',
        'Business permits',
        'Property valuation report'
      ],
      setupTime: '15-20 minutes'
    }
  },
  {
    type: 'vacation',
    title: 'Vacation Rental',
    description: 'Short-term holiday stays',
    icon: 'i-heroicons-sun',
    link: '/create/vacation',
    badge: 'Hot',
    badgeColor: 'error',
    info: {
      what: 'Short-term rental properties for vacations, holidays, and temporary stays.',
      features: [
        'Calendar availability',
        'Instant booking',
        'Cleaning scheduling',
        'Guest communication',
        'Review management'
      ],
      requirements: [
        'High-quality property photos',
        'House rules',
        'Check-in/out instructions',
        'Amenities list'
      ],
      setupTime: '10-15 minutes'
    }
  },
  {
    type: 'room',
    title: 'Room Share',
    description: 'Rent individual rooms',
    icon: 'i-heroicons-door-open',
    link: '/create/room',
    info: {
      what: 'Rent out individual rooms within your home or find roommates to share living costs.',
      features: [
        'Room-specific listings',
        'House rules setup',
        'Shared amenities',
        'Roommate matching',
        'Shared expenses tracking'
      ],
      requirements: [
        'Room photos',
        'House rules',
        'Shared spaces details',
        'Household member info'
      ],
      setupTime: '5-10 minutes'
    }
  }
]

const openInfoDrawer = (type) => {
  currentItem.value = createOptions.find(item => item.type === type)
  isDrawerOpen.value = true

  // Update URL with query parameter
  router.replace({ query: { info: type } })
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  // Remove query parameter from URL
  router.replace({ query: {} })
}

// Watch for drawer close and remove query
watch(isDrawerOpen, (newValue) => {
  if (!newValue) {
    // Remove query parameter when drawer closes
    router.replace({ query: {} })
  }
})

// Check for info query parameter on page load
onMounted(() => {
  if (route.query.info) {
    const type = route.query.info
    const item = createOptions.find(item => item.type === type)
    if (item) {
      currentItem.value = item
      isDrawerOpen.value = true
    }
  }
})

// Watch for query changes
watch(() => route.query.info, (newType) => {
  if (newType) {
    const item = createOptions.find(item => item.type === newType)
    if (item) {
      currentItem.value = item
      isDrawerOpen.value = true
    }
  }
})
</script>