<template>
  <div>
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-br from-brand-start/5 via-brand-middle/5 to-brand-end/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-brand-start/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-end/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-middle/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <UPageHero
        :ui="{ 
          container: 'relative z-10',
          title: 'text-4xl md:text-6xl font-bold bg-gradient-to-r from-brand-start via-brand-middle to-brand-end bg-clip-text text-transparent',
          description: 'text-lg md:text-xl text-gray-600 dark:text-gray-300'
        }"
        title="Find Your Perfect Home in Kenya"
        description="Discover, rent, swap, and manage properties seamlessly. HouseHunter connects you with verified listings, trusted landlords, and your dream home across Kenya."
        :links="[{
          label: 'Start Searching',
          to: '/search',
          trailingIcon: 'i-heroicons-magnifying-glass',
          size: 'xl',
          class: 'bg-gradient-to-r from-brand-start via-brand-middle to-brand-end hover:from-brand-start/90 hover:via-brand-middle/90 hover:to-brand-end/90 shadow-lg shadow-brand-start/20'
        }, {
          label: 'List Property',
          to: '/list-property',
          icon: 'i-heroicons-home',
          size: 'xl',
          color: 'neutral',
          variant: 'outline',
          class: 'border-brand-start/50 hover:border-brand-middle text-brand-start dark:text-brand-middle'
        }]"
      />
    </div>

    <!-- Features Section -->
    <UPageSection
      id="features"
      title="Your Complete Home Solution"
      description="From finding your perfect home to managing your properties, HouseHunter provides everything you need in one platform."
      :ui="{
        title: 'text-3xl md:text-4xl font-bold text-gray-900 dark:text-white',
        description: 'text-lg text-gray-600 dark:text-gray-300'
      }"
      :features="[{
        icon: 'i-heroicons-home',
        title: 'Find Perfect Houses',
        description: 'Browse thousands of verified properties with detailed photos, virtual tours, and neighborhood insights across Kenya.'
      }, {
        icon: 'i-heroicons-key',
        title: 'Rent & Manage Apartments',
        description: 'Streamline your rental process with online applications, digital contracts, and easy property management tools.'
      }, {
        icon: 'i-heroicons-arrows-right-left',
        title: 'Swap Houses',
        description: 'Exchange your current home with others. Perfect for temporary relocations, vacations, or trying out new neighborhoods.'
      }, {
        icon: 'i-heroicons-building-office',
        title: 'Property Management',
        description: 'Manage multiple properties, track rent payments, handle maintenance requests, and communicate with tenants efficiently.'
      }, {
        icon: 'i-heroicons-shield-check',
        title: 'Verified Listings',
        description: 'Every property is verified by our team to ensure authenticity, accurate pricing, and reliable landlord information.'
      }, {
        icon: 'i-heroicons-heart',
        title: 'Personalized Matches',
        description: 'Our smart algorithm learns your preferences to recommend properties that truly match your lifestyle and needs.'
      }]"
    >
      <template #features-icon="{ feature }">
        <div class="w-12 h-12 bg-gradient-to-br from-brand-start/20 via-brand-middle/20 to-brand-end/20 rounded-lg flex items-center justify-center mb-4">
          <UIcon :name="feature.icon" class="w-6 h-6 text-brand-start dark:text-brand-middle" />
        </div>
      </template>
    </UPageSection>

    <!-- How It Works -->
    <div class="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How HouseHunter Works
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Simple steps to finding, renting, or managing your perfect home
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div class="relative">
            <div class="w-16 h-16 bg-gradient-to-br from-brand-start via-brand-middle to-brand-end rounded-lg flex items-center justify-center mb-6 mx-auto shadow-lg shadow-brand-start/20">
              <span class="text-white font-bold text-xl">1</span>
            </div>
            <div class="text-center">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Search & Discover</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Use advanced filters to find properties that match your budget, location, and preferences
              </p>
            </div>
          </div>

          <div class="relative">
            <div class="absolute hidden md:block w-full h-0.5 bg-gradient-to-r from-brand-start via-brand-middle to-brand-end top-8 -left-1/2"></div>
            <div class="absolute hidden md:block w-full h-0.5 bg-gradient-to-r from-brand-start via-brand-middle to-brand-end top-8 -right-1/2"></div>
            <div class="w-16 h-16 bg-gradient-to-br from-brand-start via-brand-middle to-brand-end rounded-lg flex items-center justify-center mb-6 mx-auto shadow-lg shadow-brand-start/20">
              <span class="text-white font-bold text-xl">2</span>
            </div>
            <div class="text-center">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Connect & View</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Schedule viewings, virtual tours, and connect directly with landlords or agents
              </p>
            </div>
          </div>

          <div class="relative">
            <div class="w-16 h-16 bg-gradient-to-br from-brand-start via-brand-middle to-brand-end rounded-lg flex items-center justify-center mb-6 mx-auto shadow-lg shadow-brand-start/20">
              <span class="text-white font-bold text-xl">3</span>
            </div>
            <div class="text-center">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Move In & Manage</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Complete paperwork online, pay securely, and manage everything from your dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="py-16 bg-gradient-to-r from-brand-start/10 via-brand-middle/10 to-brand-end/10 dark:from-gray-800 dark:via-gray-700/50 dark:to-gray-800">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-start via-brand-middle to-brand-end bg-clip-text text-transparent mb-2">10,000+</div>
            <div class="text-gray-600 dark:text-gray-300">Properties Listed</div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-start via-brand-middle to-brand-end bg-clip-text text-transparent mb-2">5,000+</div>
            <div class="text-gray-600 dark:text-gray-300">Happy Renters</div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-start via-brand-middle to-brand-end bg-clip-text text-transparent mb-2">47</div>
            <div class="text-gray-600 dark:text-gray-300">Counties Covered</div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-start via-brand-middle to-brand-end bg-clip-text text-transparent mb-2">24/7</div>
            <div class="text-gray-600 dark:text-gray-300">Customer Support</div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <UPageSection>
      <UPageCTA
        title="Ready to Find Your Perfect Home?"
        description="Join thousands of Kenyans who have found their dream homes through HouseHunter. Start your journey today."
        variant="subtle"
        :ui="{
          container: 'bg-gradient-to-r from-brand-start/5 via-brand-middle/5 to-brand-end/5 dark:from-gray-800/50 dark:via-gray-700/30 dark:to-gray-800/50 border border-brand-start/20 dark:border-gray-600/50',
          title: 'text-2xl md:text-3xl font-bold text-gray-900 dark:text-white',
          description: 'text-gray-600 dark:text-gray-300'
        }"
        :links="[{
          label: 'Browse Properties',
          to: '/properties',
          trailingIcon: 'i-heroicons-arrow-right',
          class: 'bg-gradient-to-r from-brand-start via-brand-middle to-brand-end hover:from-brand-start/90 hover:via-brand-middle/90 hover:to-brand-end/90'
        }, {
          label: 'Learn More',
          to: '/about',
          icon: 'i-heroicons-information-circle',
          color: 'neutral',
          variant: 'outline',
          class: 'border-brand-start/50 text-brand-start dark:text-brand-middle hover:border-brand-middle'
        }]"
      />
    </UPageSection>

  </div>
</template>

<script setup>
// Add blob animation styles
const blobAnimation = `
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }

  .animate-blob {
    animation: blob 7s infinite;
  }

  .animation-delay-2000 {
    animation-delay: 2s;
  }

  .animation-delay-4000 {
    animation-delay: 4s;
  }
`

useHead({
  style: [{
    innerHTML: blobAnimation
  }]
})
</script>