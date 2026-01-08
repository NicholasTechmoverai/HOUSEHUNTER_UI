<template>
  <div class="min-h-screen pb-24 md:pb-32">
    <UContainer class="max-w-7xl mx-auto p-0">
      <!-- Header -->
      <div id="property-header" class="pt-8 pb-6">
        <!-- Breadcrumb & Actions -->
        <div class="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div class="flex items-center gap-2 text-sm">
            <NuxtLink to="/" class="text-gray-500 dark:text-gray-400 hover:text-primary-600">Home</NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
            <NuxtLink to="/rentals" class="text-gray-500 dark:text-gray-400 hover:text-primary-600">Rentals</NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
            <span class="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{{ rental.title }}</span>
          </div>
          <div class="flex items-center gap-2">
            <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-flag" :ui="{ rounded: 'rounded-full' }">Report</UButton>
            <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-share" :ui="{ rounded: 'rounded-full' }" @click="shareProperty">Share</UButton>
            <UButton :color="isFavorite ? 'pink' : 'gray'" variant="ghost" size="sm" :icon="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" :ui="{ rounded: 'rounded-full' }" @click="toggleFavorite">{{ isFavorite ? 'Saved' : 'Save' }}</UButton>
          </div>
        </div>

        <!-- Title and Badges -->
        <div class="mb-6">
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <UBadge :style="{ backgroundColor: rental.theme_color, color: 'white' }" class="px-3 py-1.5 border-none font-semibold">{{ displayCategory }}</UBadge>
            <UBadge :color="availabilityDisplay.color" variant="subtle" class="flex items-center gap-1.5">
              <UIcon :name="availabilityDisplay.icon" class="w-4 h-4" />{{ availabilityDisplay.label }}
            </UBadge>
            <UBadge v-if="rental.is_verified" color="blue" variant="subtle" class="flex items-center gap-1.5">
              <UIcon name="i-heroicons-check-badge" class="w-4 h-4" />Verified
            </UBadge>
            <UBadge color="amber" variant="subtle" class="flex items-center gap-1.5">
              <UIcon name="i-heroicons-star" class="w-4 h-4" />{{ secondaryData.reviews.averageRating.toFixed(1) }}
              <span class="text-gray-500 text-xs">({{ secondaryData.reviews.count }})</span>
            </UBadge>
          </div>

          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">{{ rental.title }}</h1>
          
          <div class="flex flex-wrap items-center gap-2 text-gray-600 dark:text-gray-400">
            <UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
            <span>{{ rental.address }}, {{ rental.city }}, {{ rental.state }}</span>
            <span class="text-gray-400">•</span>
            <span class="text-sm">Listed {{ formatDate(rental.created_at) }}</span>
          </div>
        </div>
      </div>

      <!-- Sticky Tabs -->
      <div :class="['sticky z-40 transition-all duration-300 border-b border-gray-200 dark:border-gray-800', isSticky ? 'top-15 shadow-lg bg-white/95 dark:bg-gray-900/95' : 'top-0 md:top-6 bg-transparent']">
        <UTabs v-model="activeTab" :items="tabs" class="max-w-7xl mx-auto" />
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Gallery -->
          <section v-if="['overview', 'gallery'].includes(activeTab)" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Property Gallery</h2>
                <div class="flex items-center gap-2">
                  <UBadge color="gray" variant="subtle">{{ allImages.length }} photos</UBadge>
                  <UButton v-if="allImages.length > 5" color="gray" variant="ghost" size="sm" @click="showFullGallery = true">View all</UButton>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(img, index) in allImages.slice(0, 5)" :key="index" class="relative rounded-lg overflow-hidden cursor-pointer group h-40" @click="openModal(index)">
                  <img :src="img.url" :alt="img.caption" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <UIcon name="i-heroicons-magnifying-glass-plus" class="w-6 h-6 text-white" />
                  </div>
                </div>
                <div v-if="allImages.length > 5" class="relative rounded-lg overflow-hidden cursor-pointer group bg-gradient-to-br from-primary-500 to-primary-600 h-40" @click="showFullGallery = true">
                  <div class="h-full flex flex-col items-center justify-center text-white p-4">
                    <UIcon name="i-heroicons-photo" class="w-10 h-10 mb-2" />
                    <div class="text-2xl font-bold">+{{ allImages.length - 5 }}</div>
                    <div class="text-sm">View all photos</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Pricing -->
          <section v-if="['overview', 'pricing'].includes(activeTab)" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Pricing & Costs</h2>
                <div class="flex items-center gap-2">
                  <UBadge v-if="discountSavings" color="green" variant="subtle">{{ rental.pricing.base_price.discount }}% OFF</UBadge>
                  <UBadge color="primary" variant="subtle" class="capitalize">{{ rental.pricing.base_price.rent_frequency }}</UBadge>
                </div>
              </div>

              <div class="bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/10 dark:to-gray-900 rounded-xl p-6 mb-8 border border-primary-200 dark:border-primary-800">
                <div class="flex flex-col md:flex-row justify-between gap-6">
                  <div>
                    <div class="flex items-baseline gap-3 mb-2">
                      <h3 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">{{ formatCurrency(rental.pricing.base_price.rent) }}</h3>
                      <span class="text-lg text-gray-600 dark:text-gray-400">/month</span>
                    </div>
                    <div v-if="discountSavings" class="flex items-center gap-2">
                      <span class="text-lg font-bold text-green-600 dark:text-green-400">Save {{ formatCurrency(discountSavings) }}</span>
                      <span class="text-sm text-gray-500 dark:text-gray-400">with {{ rental.pricing.base_price.discount }}% discount</span>
                    </div>
                  </div>
                  <div class="flex flex-col gap-3">
                    <UButton color="primary" size="lg" :disabled="!rental.is_available" icon="i-heroicons-calendar-days" @click="scheduleViewing">{{ rental.is_available ? 'Book Viewing' : 'Not Available' }}</UButton>
                    <UButton variant="outline" color="gray" size="lg" :disabled="!rental.is_available" icon="i-heroicons-chat-bubble-left-right" @click="contactOwner">Message Owner</UButton>
                  </div>
                </div>
              </div>

              <div class="space-y-8">
                <div>
                  <h4 class="font-bold text-gray-800 dark:text-gray-200 text-lg mb-4">Base Price Details</h4>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Monthly Rent</p>
                      <p class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(rental.pricing.base_price.rent) }}</p>
                    </div>
                    <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Security Deposit</p>
                      <p class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(rental.pricing.base_price.deposit_amount) }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ rental.pricing.base_price.is_deposit_refundable ? 'Refundable' : 'Non-refundable' }}</p>
                    </div>
                    <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Minimum Lease</p>
                      <p class="font-bold text-gray-900 dark:text-white">{{ rental.pricing.base_price.minimum_lease_months }} months</p>
                    </div>
                    <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Frequency</p>
                      <p class="font-bold text-gray-900 dark:text-white capitalize">{{ rental.pricing.base_price.rent_frequency }}</p>
                    </div>
                  </div>
                </div>

                <!-- Utilities -->
                <div>
                  <h4 class="font-bold text-gray-800 dark:text-gray-200 text-lg mb-4">Utilities & Bills</h4>
                  <div v-if="includedUtilities.length > 0" class="mb-6">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />Included in rent
                    </p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div v-for="utility in includedUtilities" :key="utility.id" class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <div class="flex items-center gap-2 mb-2">
                          <UIcon name="i-heroicons-check" class="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span class="font-medium text-gray-800 dark:text-gray-200">{{ utility.name }}</span>
                        </div>
                        <p v-if="utility.amount" class="text-sm text-green-600 dark:text-green-400">{{ formatCurrency(utility.amount) }}</p>
                        <p v-else class="text-sm text-green-600 dark:text-green-400">Included</p>
                      </div>
                    </div>
                  </div>
                  <div v-if="excludedUtilities.length > 0">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 text-amber-500" />Paid separately
                    </p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div v-for="utility in excludedUtilities" :key="utility.id" class="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <div class="flex items-center gap-2 mb-2">
                          <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span class="font-medium text-gray-800 dark:text-gray-200">{{ utility.name }}</span>
                        </div>
                        <p v-if="utility.amount" class="text-sm text-amber-600 dark:text-amber-400">{{ formatCurrency(utility.amount) }}</p>
                        <p v-else class="text-sm text-amber-600 dark:text-amber-400">To be discussed</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Total Summary -->
                <div class="bg-gray-50 dark:bg-gray-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div class="flex justify-between items-center mb-4">
                    <h4 class="font-bold text-gray-900 dark:text-white">Monthly Cost Summary</h4>
                    <UBadge color="primary" variant="subtle">Detailed Estimate</UBadge>
                  </div>
                  <div class="space-y-3">
                    <div class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span class="text-gray-600 dark:text-gray-400">Base Rent</span>
                      <span class="font-semibold">{{ formatCurrency(rental.pricing.base_price.rent) }}</span>
                    </div>
                    <div v-if="excludedUtilities.some(u => u.amount)" class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span class="text-gray-600 dark:text-gray-400">Additional Utilities</span>
                      <span class="font-semibold">{{ formatCurrency(excludedUtilities.reduce((sum, util) => sum + (util.amount || 0), 0)) }}</span>
                    </div>
                    <div v-if="discountSavings" class="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span class="text-green-600 dark:text-green-400">Discount</span>
                      <span class="font-semibold text-green-600 dark:text-green-400">-{{ formatCurrency(discountSavings) }}</span>
                    </div>
                    <div class="flex justify-between py-3 border-t border-gray-300 dark:border-gray-600">
                      <span class="text-lg font-bold text-gray-900 dark:text-white">Estimated Total Monthly</span>
                      <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ formatCurrency(totalMonthlyCost) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Amenities -->
          <section v-if="['overview', 'amenities'].includes(activeTab)" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Amenities & Features</h2>
                <UBadge color="gray" variant="subtle">{{ rental.amenities.length }} amenities</UBadge>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div v-for="amenity in rental.amenities" :key="amenity.id" class="flex flex-col items-center p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all">
                  <div class="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 mb-3">
                    <UIcon :name="amenity.icon" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span class="font-medium text-gray-800 dark:text-gray-200 text-center">{{ amenity.name }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Description -->
          <section v-if="activeTab === 'overview'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Property Description</h2>
                <UBadge color="gray" variant="subtle">{{ rental.description.length.toLocaleString() }} characters</UBadge>
              </div>
              <div class="text-gray-700 dark:text-gray-300 leading-relaxed relative" :class="{ 'max-h-96 overflow-hidden': !isExpanded }">
                <p class="whitespace-pre-line">{{ rental.description }}</p>
                <div v-if="!isExpanded && rental.description.length > 1000" class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
              </div>
              <UButton v-if="rental.description.length > 1000" color="primary" variant="ghost" :padded="false" class="mt-4" @click="isExpanded = !isExpanded">
                {{ isExpanded ? 'Show less' : 'Read more' }}
                <UIcon :name="isExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" class="w-4 h-4 ml-1" />
              </UButton>
            </div>
          </section>

          <!-- Reviews -->
          <section v-if="activeTab === 'reviews'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Reviews & Ratings</h2>
                <div class="text-center">
                  <div class="text-3xl font-bold">{{ secondaryData.reviews.averageRating.toFixed(1) }}</div>
                  <div class="flex items-center justify-center"><span class="text-amber-500">{{ ratingDisplay.stars }}</span></div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h3 class="font-bold text-gray-900 dark:text-white mb-4">Overall Rating</h3>
                  <div class="flex items-center gap-4">
                    <div class="text-5xl font-bold">{{ secondaryData.reviews.averageRating.toFixed(1) }}</div>
                    <div class="flex-1">
                      <div class="flex mb-1"><span class="text-amber-500 text-xl">{{ ratingDisplay.stars }}</span></div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">Based on {{ secondaryData.reviews.count }} reviews</div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h3 class="font-bold text-gray-900 dark:text-white mb-4">Rating Breakdown</h3>
                  <div class="space-y-3">
                    <div v-for="(count, stars) in secondaryData.reviews.breakdown" :key="stars" class="flex items-center gap-3">
                      <div class="flex items-center gap-1 w-16">
                        <span class="text-gray-600 dark:text-gray-400">{{ stars }}</span>
                        <UIcon name="i-heroicons-star" class="w-4 h-4 text-amber-500" />
                      </div>
                      <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-500 rounded-full" :style="{ width: `${(count / secondaryData.reviews.count) * 100}%` }"></div>
                      </div>
                      <div class="w-10 text-right text-sm text-gray-600 dark:text-gray-400">{{ count }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Reviews</h3>
                <div class="space-y-4">
                  <div v-for="review in secondaryData.reviews.recent" :key="review.id" class="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-center gap-3">
                        <UAvatar :src="review.avatar" :alt="review.author" size="md" />
                        <div>
                          <h4 class="font-bold text-gray-900 dark:text-white">{{ review.author }}</h4>
                          <div class="flex items-center gap-1">
                            <span class="text-amber-500">{{ '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating) }}</span>
                            <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(review.date) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300">{{ review.comment }}</p>
                  </div>
                </div>
              </div>

              <div class="mt-8 text-center">
                <UButton color="primary" icon="i-heroicons-pencil" size="lg">Write a Review</UButton>
              </div>
            </div>
          </section>

          <!-- Location -->
          <section v-if="activeTab === 'location'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Location & Neighborhood</h2>
                <UBadge color="primary" variant="subtle">{{ rental.city }}, {{ rental.state }}</UBadge>
              </div>

              <div class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden mb-6 relative">
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <UIcon name="i-heroicons-map" class="w-16 h-16 text-gray-400 mb-4" />
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Interactive Map</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">{{ rental.address }}</p>
                  </div>
                </div>
                <div class="absolute bottom-4 left-4 px-3 py-2 rounded-lg bg-black/70">
                  <p class="text-white text-sm font-mono">{{ rental.latitude.toFixed(6) }}, {{ rental.longitude.toFixed(6) }}</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Neighborhood Scores</h3>
                  <div class="space-y-4">
                    <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div class="flex justify-between items-center mb-2">
                        <span class="font-medium text-gray-900 dark:text-white">Safety</span>
                        <span class="text-2xl font-bold text-green-600 dark:text-green-400">{{ secondaryData.neighborhoodInfo.safetyScore }}/10</span>
                      </div>
                      <UProgress :value="secondaryData.neighborhoodInfo.safetyScore * 10" color="green" />
                    </div>
                    <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div class="flex justify-between items-center mb-2">
                        <span class="font-medium text-gray-900 dark:text-white">Transit</span>
                        <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ secondaryData.neighborhoodInfo.transitScore }}/10</span>
                      </div>
                      <UProgress :value="secondaryData.neighborhoodInfo.transitScore * 10" color="blue" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Nearby Amenities</h3>
                  <div class="grid grid-cols-2 gap-3">
                    <div v-for="(amenity, index) in secondaryData.neighborhoodInfo.amenitiesNearby.slice(0, 6)" :key="index" class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ amenity }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex gap-3 mt-6">
                <UButton color="primary" icon="i-heroicons-map-pin" class="flex-1">Open in Google Maps</UButton>
                <UButton variant="outline" color="gray" icon="i-heroicons-arrow-path">Get Directions</UButton>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Sidebar -->
        <aside class="lg:col-span-1">
          <div class="sticky top-[140px] space-y-6">
            <!-- Property Stats -->
            <UCard class="border border-gray-200 dark:border-gray-800 shadow-sm">
              <template #header><h3 class="text-lg font-bold text-gray-900 dark:text-white">Property Stats</h3></template>
              <div class="space-y-4">
                <div class="p-4 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 border border-primary-200 dark:border-primary-800">
                  <p class="text-3xl font-black text-primary-600 dark:text-primary-400">{{ formatCurrency(rental.pricing.base_price.rent) }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">per {{ rental.pricing.base_price.rent_frequency }}</p>
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between items-center p-3">
                    <span class="text-gray-600 dark:text-gray-400">Property Type</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ displayCategory }}</span>
                  </div>
                  <div class="flex justify-between items-center p-3 border-t border-gray-200 dark:border-gray-800">
                    <span class="text-gray-600 dark:text-gray-400">Minimum Lease</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ rental.pricing.base_price.minimum_lease_months }} months</span>
                  </div>
                  <div class="flex justify-between items-center p-3 border-t border-gray-200 dark:border-gray-800">
                    <span class="text-gray-600 dark:text-gray-400">Deposit</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(rental.pricing.base_price.deposit_amount) }}</span>
                  </div>
                  <div class="flex justify-between items-center p-3 border-t border-gray-200 dark:border-gray-800">
                    <span class="text-gray-600 dark:text-gray-400">Available From</span>
                    <span class="font-medium text-green-600 dark:text-green-400">{{ rental.is_available ? 'Immediately' : 'Not Available' }}</span>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Owner -->
            <UCard class="border border-gray-200 dark:border-gray-800 shadow-sm">
              <template #header>
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Property Owner</h3>
                  <UBadge v-if="rental.is_verified" color="blue" variant="subtle" size="sm">Verified</UBadge>
                </div>
              </template>
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <UAvatar :src="rental.publisher.profile_picture" :alt="rental.publisher.display_name" size="lg" class="ring-2 ring-primary-100 dark:ring-primary-900" />
                  <div>
                    <h4 class="font-bold text-gray-900 dark:text-white">{{ rental.publisher.display_name }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">ID: {{ rental.publisher.public_id }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <UIcon name="i-heroicons-star" class="w-4 h-4 text-amber-500" />
                      <span class="text-sm font-semibold">{{ secondaryData.reviews.averageRating.toFixed(1) }}</span>
                      <span class="text-sm text-gray-500 dark:text-gray-400">({{ secondaryData.reviews.count }})</span>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div class="text-center"><p class="text-lg font-bold text-primary-600 dark:text-primary-400">95%</p><p class="text-xs text-gray-500 dark:text-gray-400">Response Rate</p></div>
                  <div class="text-center"><p class="text-lg font-bold text-primary-600 dark:text-primary-400">2h</p><p class="text-xs text-gray-500 dark:text-gray-400">Avg Response</p></div>
                  <div class="text-center"><p class="text-lg font-bold text-primary-600 dark:text-primary-400">{{ secondaryData.similarProperties.count }}</p><p class="text-xs text-gray-500 dark:text-gray-400">Properties</p></div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <UButton variant="outline" color="gray" icon="i-heroicons-phone">Call</UButton>
                  <UButton color="primary" icon="i-heroicons-chat-bubble-left-right">Message</UButton>
                </div>
              </div>
            </UCard>

            <!-- Similar Properties -->
            <UCard class="border border-gray-200 dark:border-gray-800 shadow-sm">
              <template #header><h3 class="text-lg font-bold text-gray-900 dark:text-white">Similar Properties</h3></template>
              <div class="space-y-4">
                <div v-for="property in similarProperties" :key="property.id" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <div class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <div class="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <UIcon name="i-heroicons-home" class="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900 dark:text-white truncate">{{ property.title }}</h4>
                    <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{{ property.beds }} bed</span><span>•</span><span>{{ formatCurrency(property.price) }}/month</span>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatDistance(property.distance) }} away</div>
                  </div>
                </div>
                <UButton block variant="ghost" color="primary" size="sm">View all {{ secondaryData.similarProperties.count }} properties</UButton>
              </div>
            </UCard>
          </div>
        </aside>
      </div>
    </UContainer>

    <!-- Floating Action Panel -->
    <div :class="['sticky bottom-0 left-0 right-0 z-100 transition-all duration-300 transform backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95', scrollPosition > 100 ? 'translate-y-0' : 'translate-y-full']">
      <UContainer class="max-w-7xl mx-auto px-4">
        <div class="py-4">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-4 flex-1 min-w-0">
              <div class="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 border-primary-200 dark:border-primary-800">
                <img :src="allImages[0]?.url" :alt="rental.title" class="w-full h-full object-cover" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-gray-900 dark:text-white truncate text-sm md:text-base">{{ rental.title }}</h3>
                <div class="flex items-center gap-3 mt-1 flex-wrap">
                  <div class="flex items-center gap-1">
                    <UIcon name="i-heroicons-star" class="w-4 h-4 text-amber-500" />
                    <span class="font-bold text-gray-900 dark:text-white text-sm">{{ secondaryData.reviews.averageRating.toFixed(1) }}</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">({{ secondaryData.reviews.count }})</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-gray-400" />
                    <span class="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">{{ rental.city }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-right hidden md:block">
                <div class="text-xl font-bold text-primary-600 dark:text-primary-400">{{ formatCurrency(rental.pricing.base_price.rent) }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">/month</div>
              </div>
              <div class="flex items-center gap-2">
                <UTooltip text="Share"><UButton color="gray" variant="ghost" size="lg" :ui="{ rounded: 'rounded-full', padding: { lg: 'p-2' } }" @click="shareProperty"><UIcon name="i-heroicons-share" class="w-5 h-5" /></UButton></UTooltip>
                <UTooltip :text="isFavorite ? 'Remove from favorites' : 'Save to favorites'"><UButton :color="isFavorite ? 'pink' : 'gray'" variant="ghost" size="lg" :ui="{ rounded: 'rounded-full', padding: { lg: 'p-2' } }" @click="toggleFavorite"><UIcon :name="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" class="w-5 h-5" /></UButton></UTooltip>
                <UButton color="primary" variant="solid" size="lg" :disabled="!rental.is_available" :ui="{ rounded: 'rounded-xl' }" @click="scheduleViewing">
                  <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 md:mr-2" />
                  <span class="hidden md:inline">Schedule Viewing</span>
                  <span class="md:hidden">Book</span>
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Image Modal -->
    <UDrawer v-model:open="isModalOpen" :direction="screen.isMobile.value ? 'bottom' : 'right'" :ui="{ width: 'w-full max-w-6xl', padding: 'p-1' }">
      <template #content>
        <div class="flex-1 p-2 w-full flex-col items-center md:py-4">
          <UCarousel ref="carousel" v-slot="{ item }" :arrows="!screen.isMobile.value" :dots="!screen.isMobile.value" :items="allImages" :prev="{ onClick: onClickPrev }" :next="{ onClick: onClickNext }" class="w-full max-w-lg min-h-[50vh] mx-auto" @select="onSelect">
            <img :src="item.url" class="max-w-full max-h-full object-contain rounded-lg bg-gray-600/25">
          </UCarousel>
          <div class="border-t mt-5 md:mt-15 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 w-full">
            <div class="flex gap-3 w-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide">
              <div v-for="(item, index) in allImages" :key="index" class="flex-shrink-0 snap-start" @click="select(index)">
                <div class="w-24 h-24 rounded-xl overflow-hidden cursor-pointer border-2 transition-all" :class="activeIndex === index ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-transparent hover:border-gray-300'">
                  <img :src="item.url" :alt="`Thumbnail ${index + 1}`" class="w-full h-full object-cover hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UDrawer>

    <!-- Full Gallery -->
    <UModal v-model:open="showFullGallery">
      <template #content>
        <div class="p-4">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">All Photos ({{ allImages.length }})</h2>
            <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-x-mark" @click="showFullGallery = false" />
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div v-for="(img, index) in allImages" :key="index" @click="openModal(index)" class="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform">
              <img :src="img.url" :alt="img.caption" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>