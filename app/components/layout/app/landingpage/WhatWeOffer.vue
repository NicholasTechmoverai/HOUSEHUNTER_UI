<template>
  <UContainer class="py-8">
    <!-- Page Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Create Something Amazing
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Select what you'd like to create. Manage properties, accounts, or services with our easy-to-use tools.
      </p>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Rental Property -->
      <UCard 
        class="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
        @click="navigateTo('/create/rental')"
      >
        <div class="flex flex-col items-center text-center p-6">
          <div class="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl mb-6 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
            <UIcon name="i-heroicons-home-modern" class="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Rental Property
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            List your property for rent. Reach thousands of potential tenants.
          </p>
          <div class="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400 mt-4">
            <span class="text-sm font-medium">Create Rental</span>
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </UCard>

      <!-- Apartment -->
      <UCard 
        class="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
        @click="navigateTo('/create/apartment')"
      >
        <div class="flex flex-col items-center text-center p-6">
          <div class="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl mb-6 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
            <UIcon name="i-heroicons-building-office-2" class="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Apartment
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Create apartment listings with multiple units and shared amenities.
          </p>
          <div class="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400 mt-4">
            <span class="text-sm font-medium">Create Apartment</span>
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </UCard>

      <!-- Property Swap -->
      <UCard 
        class="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
        @click="navigateTo('/create/swap')"
      >
        <div class="flex flex-col items-center text-center p-6">
          <div class="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl mb-6 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
            <UIcon name="i-heroicons-arrows-right-left" class="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Property Swap
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Exchange properties with others. Find your perfect swap match.
          </p>
          <div class="flex items-center justify-center space-x-2 text-purple-600 dark:text-purple-400 mt-4">
            <span class="text-sm font-medium">Create Swap</span>
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </UCard>

      <!-- House Agent Account -->
      <UCard 
        class="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
        @click="navigateTo('/create/agent')"
      >
        <div class="flex flex-col items-center text-center p-6">
          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-2xl mb-6 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition-colors">
            <UIcon name="i-heroicons-user-group" class="w-12 h-12 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            House Agent Account
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Professional agent account to manage multiple properties and clients.
          </p>
          <div class="flex items-center justify-center space-x-2 text-amber-600 dark:text-amber-400 mt-4">
            <span class="text-sm font-medium">Create Agent Account</span>
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </UCard>

      <!-- Landlord Account -->
      <UCard 
        class="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
        @click="navigateTo('/create/landlord')"
      >
        <div class="flex flex-col items-center text-center p-6">
          <div class="p-4 bg-rose-50 dark:bg-rose-900/30 rounded-2xl mb-6 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/50 transition-colors">
            <UIcon name="i-heroicons-building-library" class="w-12 h-12 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Landlord Account
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Manage your properties, tenants, and rental income all in one place.
          </p>
          <div class="flex items-center justify-center space-x-2 text-rose-600 dark:text-rose-400 mt-4">
            <span class="text-sm font-medium">Create Landlord Account</span>
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </UCard>

      <!-- Caretaker Account -->
      <UCard 
        class="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
        @click="navigateTo('/create/caretaker')"
      >
        <div class="flex flex-col items-center text-center p-6">
          <div class="p-4 bg-teal-50 dark:bg-teal-900/30 rounded-2xl mb-6 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50 transition-colors">
            <UIcon name="i-heroicons-wrench-screwdriver" class="w-12 h-12 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Caretaker Account
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Manage property maintenance, repairs, and tenant requests efficiently.
          </p>
          <div class="flex items-center justify-center space-x-2 text-teal-600 dark:text-teal-400 mt-4">
            <span class="text-sm font-medium">Create Caretaker Account</span>
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </UCard>

      <!-- Commercial Property -->
      <UCard 
        class="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
        @click="navigateTo('/create/commercial')"
      >
        <div class="flex flex-col items-center text-center p-6">
          <div class="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl mb-6 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
            <UIcon name="i-heroicons-building-storefront" class="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Commercial Property
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            List offices, retail spaces, warehouses, and other commercial properties.
          </p>
          <div class="flex items-center justify-center space-x-2 text-indigo-600 dark:text-indigo-400 mt-4">
            <span class="text-sm font-medium">Create Commercial Listing</span>
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </UCard>

      <!-- Vacation Rental -->
      <UCard 
        class="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
        @click="navigateTo('/create/vacation')"
      >
        <div class="flex flex-col items-center text-center p-6">
          <div class="p-4 bg-pink-50 dark:bg-pink-900/30 rounded-2xl mb-6 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/50 transition-colors">
            <UIcon name="i-heroicons-sun" class="w-12 h-12 text-pink-600 dark:text-pink-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Vacation Rental
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            List your property for short-term vacation stays and holiday rentals.
          </p>
          <div class="flex items-center justify-center space-x-2 text-pink-600 dark:text-pink-400 mt-4">
            <span class="text-sm font-medium">Create Vacation Rental</span>
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </UCard>

      <!-- Room Share -->
      <UCard 
        class="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
        @click="navigateTo('/create/room')"
      >
        <div class="flex flex-col items-center text-center p-6">
          <div class="p-4 bg-cyan-50 dark:bg-cyan-900/30 rounded-2xl mb-6 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50 transition-colors">
            <UIcon name="i-heroicons-door-open" class="w-12 h-12 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Room Share
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Rent out individual rooms in your home or find roommates to share costs.
          </p>
          <div class="flex items-center justify-center space-x-2 text-cyan-600 dark:text-cyan-400 mt-4">
            <span class="text-sm font-medium">Create Room Listing</span>
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick Stats Section -->
    <div class="mt-16">
      <div class="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Why Create With Us?
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Verified Profiles</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">All accounts are verified for security</p>
          </div>
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full mb-4">
              <UIcon name="i-heroicons-clock" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Quick Setup</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">Get started in less than 5 minutes</p>
          </div>
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">24/7 Support</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">Our team is always here to help</p>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="mt-16">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Frequently Asked Questions
      </h2>
      <div class="max-w-3xl mx-auto space-y-4">
        <UAccordion :items="faqItems" :ui="{ wrapper: 'border-b border-gray-200 dark:border-gray-700' }">
          <template #default="{ item, open }">
            <UButton color="gray" variant="ghost" class="p-4 w-full justify-between">
              <span class="text-left font-medium">{{ item.label }}</span>
              <UIcon 
                name="i-heroicons-chevron-down" 
                class="w-5 h-5 transition-transform duration-200"
                :class="[open ? 'transform rotate-180' : '']" 
              />
            </UButton>
          </template>
          <template #content="{ item }">
            <div class="p-4 pt-0 text-gray-600 dark:text-gray-300">
              {{ item.content }}
            </div>
          </template>
        </UAccordion>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
import { ref } from 'vue'

// FAQ Items
const faqItems = ref([
  {
    label: 'What information do I need to create a listing?',
    content: 'For property listings, you\'ll need photos, property details, location information, pricing, and availability. For account creation, basic personal information and verification documents are required.'
  },
  {
    label: 'Is there a fee to create listings?',
    content: 'Basic listings are free. Premium features like featured placement, professional photography, and advanced analytics are available through our paid plans.'
  },
  {
    label: 'How long does verification take?',
    content: 'Most verifications are completed within 24-48 hours. You can track your verification status in your dashboard.'
  },
  {
    label: 'Can I edit my listings after creation?',
    content: 'Yes, you can edit all your listings and account details at any time through your dashboard.'
  },
  {
    label: 'What support do you offer?',
    content: 'We offer 24/7 customer support via chat, email, and phone. We also have comprehensive guides and tutorials in our help center.'
  }
])

// Navigation function
const navigateTo = (path) => {
  // In a real Nuxt app, you would use:
  // return navigateTo(path)
  
  // For demo purposes, we'll log and show an alert
  console.log(`Navigating to: ${path}`)
  alert(`Would navigate to: ${path}\n\nIn a real application, this would open the creation form for the selected item.`)
}

// Optional: Add keyboard navigation
const handleKeyDown = (event, path) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    navigateTo(path)
  }
}
</script>

<style scoped>
/* Custom hover effects */
.group:hover .group-hover\:translate-x-1 {
  transform: translateX(4px);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Card hover shadow */
.hover\:shadow-xl:hover {
  --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

/* Dark mode adjustments */
.dark .hover\:shadow-xl:hover {
  --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
</style>