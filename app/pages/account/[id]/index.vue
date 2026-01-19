<template>
  <div class="min-h-screen">
    <!-- Header - Always visible -->
    <div class="top-0 z-50 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
          <div class="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:flex-1 min-w-0">
            <div class="relative shrink-0">
              <UAvatar 
                :src="profileData?.profile_picture" 
                :alt="profileData?.name" 
                size="3xl"
                class="ring-2 ring-white dark:ring-gray-800 shadow-lg w-16 h-16 sm:w-20 sm:h-20"
              />
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h1 class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {{ profileData?.display_name || profileData?.name || 'Not Provided' }}
                </h1>

                <div class="flex flex-wrap gap-2">
                  <UBadge 
                    v-if="profileData?.status" 
                    :label="profileData.status" 
                    :color="getStatusColor(profileData.status)" 
                    variant="soft"
                    size="xs" 
                  />
                  <UBadge 
                    v-if="profileData?.account?.currentAccount" 
                    :label="profileData.account.currentAccount" 
                    color="primary"
                    variant="soft" 
                    size="xs" 
                  />
                </div>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2 sm:gap-4 text-sm">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-at-symbol" class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                  <span class="text-gray-600 dark:text-gray-300 truncate text-xs sm:text-sm">
                    @{{ profileData?.username || 'Not Provided' }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-envelope" class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                  <div class="flex items-center gap-1 sm:gap-2">
                    <span class="text-gray-600 dark:text-gray-300 truncate max-w-[120px] sm:max-w-[180px] text-xs sm:text-sm">
                      {{ profileData?.email?.email || profileData?.email || 'Not Provided' }}
                    </span>
                    <UBadge 
                      v-if="profileData?.email?.email_verified || profileData?.is_verified" 
                      label="✓" 
                      color="primary" 
                      variant="soft" 
                      size="xs" 
                    />
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-finger-print" class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                  <code class="text-xs font-mono text-gray-700 dark:text-gray-300 truncate max-w-[100px] sm:max-w-none">
                    {{ profileData?.public_id || profileData?.id || 'Not Provided' }}
                  </code>
                  <UButton 
                    icon="i-heroicons-clipboard-document" 
                    color="neutral" 
                    variant="ghost" 
                    size="md"
                    @click="copyUserId" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end sm:justify-start gap-2 sm:gap-3 w-full sm:w-auto">
            <UButton 
              icon="i-heroicons-share" 
              color="gray" 
              variant="ghost" 
              size="xs sm:sm"
              :label="useScreenSize().isDesktop ? 'Share' : undefined" 
              @click="shareProfile" 
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Grid - Responsive -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        <UPageCard spotlight class="h-full">
          <div class="text-center p-3">
            <UIcon name="i-heroicons-calendar" class="w-7 h-7 text-primary-500 mx-auto mb-2" />
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Member Since</p>
            <p class="text-base font-semibold text-gray-900 dark:text-white">
              {{ profileData?.created_at ? formatDate(profileData.created_at) : 'Not Provided' }}
            </p>
          </div>
        </UPageCard>

        <UPageCard spotlight class="h-full">
          <div class="text-center p-3">
            <UIcon name="i-heroicons-clock" class="w-7 h-7 text-blue-500 mx-auto mb-2" />
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Last Active</p>
            <p class="text-base font-semibold text-gray-900 dark:text-white">
              {{ profileData?.last_active ? 'Recent' : 'Not Available' }}
            </p>
          </div>
        </UPageCard>

        <UPageCard spotlight class="h-full">
          <div class="text-center p-3">
            <UIcon name="i-heroicons-globe-alt" class="w-7 h-7 text-emerald-500 mx-auto mb-2" />
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Locale</p>
            <p class="text-base font-semibold text-gray-900 dark:text-white">
              {{ profileData?.locale || 'Not Provided' }}
            </p>
          </div>
        </UPageCard>

        <UPageCard spotlight class="h-full">
          <div class="text-center p-3">
            <UIcon name="i-heroicons-currency-dollar" class="w-7 h-7 text-amber-500 mx-auto mb-2" />
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Currency</p>
            <p class="text-base font-semibold text-gray-900 dark:text-white">
              {{ profileData?.currency || 'Not Provided' }}
            </p>
          </div>
        </UPageCard>

        <UPageCard spotlight class="h-full">
          <div class="text-center p-3">
            <UIcon name="i-heroicons-user-group" class="w-7 h-7 text-purple-500 mx-auto mb-2" />
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Account Type</p>
            <p class="text-base font-semibold text-gray-900 dark:text-white">
              {{ profileData?.account?.currentAccount || 'Not Provided' }}
            </p>
          </div>
        </UPageCard>
      </div>

      <!-- Profile Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Bio Section -->
          <UPageCard spotlight>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-user-circle" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">About</h2>
              </div>
            </template>

            <p v-if="profileData?.bio" class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ profileData.bio }}
            </p>
            <p v-else class="text-gray-500 dark:text-gray-400 italic">No bio provided</p>
          </UPageCard>

          <!-- Contact & Professional -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Contact -->
            <UPageCard spotlight>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-phone" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Contact</h2>
                </div>
              </template>

              <div class="space-y-6">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</p>
                    <UBadge 
                      v-if="profileData?.phone_number?.phone_verified" 
                      label="Verified" 
                      color="emerald" 
                      variant="soft"
                      size="xs" 
                    />
                  </div>
                  <div v-if="profileData?.phone_number?.number" class="flex items-center gap-2">
                    <UIcon name="i-heroicons-device-phone-mobile" class="w-4 h-4 text-gray-400" />
                    <p class="text-gray-900 dark:text-white">
                      {{ profileData.phone_number.country_code }} {{ profileData.phone_number.number }}
                    </p>
                  </div>
                  <p v-else class="text-gray-500 dark:text-gray-400 italic">No phone number provided</p>
                </div>
              </div>
            </UPageCard>

            <!-- Professional -->
            <UPageCard spotlight>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-briefcase" class="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Professional</h2>
                </div>
              </template>

              <div v-if="profileData?.occupation || profileData?.company || profileData?.website" class="space-y-5">
                <div v-if="profileData?.occupation">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Occupation</p>
                  <p class="text-gray-900 dark:text-white">{{ profileData.occupation }}</p>
                </div>
                <div v-if="profileData?.company">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</p>
                  <p class="text-gray-900 dark:text-white">{{ profileData.company }}</p>
                </div>
                <div v-if="profileData?.website">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</p>
                  <a 
                    :href="profileData.website" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {{ profileData.website }}
                  </a>
                </div>
              </div>
              <p v-else class="text-gray-500 dark:text-gray-400 italic">No professional information provided</p>
            </UPageCard>
          </div>

          <!-- Location -->
          <UPageCard spotlight>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Location</h2>
              </div>
            </template>

            <div v-if="profileData?.location?.city || profileData?.location?.country || profileData?.location?.address" 
                 class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div v-if="profileData?.location?.city">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</p>
                <p class="text-gray-900 dark:text-white">{{ profileData.location.city }}</p>
              </div>
              <div v-if="profileData?.location?.country">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</p>
                <p class="text-gray-900 dark:text-white">{{ profileData.location.country }}</p>
              </div>
              <div v-if="profileData?.location?.address" class="sm:col-span-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</p>
                <p class="text-gray-900 dark:text-white">{{ profileData.location.address }}</p>
              </div>
            </div>
            <p v-else class="text-gray-500 dark:text-gray-400 italic">No location information provided</p>
          </UPageCard>
        </div>

        <!-- Right Column -->
        <div class="space-y-8">
          <!-- Personal Details -->
          <UPageCard spotlight>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-user" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Personal Details</h2>
              </div>
            </template>

            <div class="space-y-6">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</p>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-cake" class="w-4 h-4 text-gray-400" />
                  <p v-if="profileData?.date_of_birth" class="text-gray-900 dark:text-white">
                    {{ formatDate(profileData.date_of_birth) }}
                  </p>
                  <p v-else class="text-gray-500 dark:text-gray-400 italic">Not provided</p>
                </div>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</p>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-user-circle" class="w-4 h-4 text-gray-400" />
                  <p v-if="profileData?.gender" class="text-gray-900 dark:text-white">{{ profileData.gender }}</p>
                  <p v-else class="text-gray-500 dark:text-gray-400 italic">Not provided</p>
                </div>
              </div>
            </div>
          </UPageCard>

          <!-- Quick Actions -->
          <UPageCard spotlight>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
            </template>

            <div class="space-y-3">
              <UButton 
                icon="i-heroicons-clipboard-document" 
                variant="ghost" 
                class="w-full justify-start" 
                @click="copyUserId"
              >
                <span class="truncate">Copy User ID</span>
              </UButton>
              <UButton 
                icon="i-heroicons-link" 
                variant="ghost" 
                class="w-full justify-start" 
                @click="copyProfileLink"
              >
                <span class="truncate">Copy Profile Link</span>
              </UButton>
              <UButton 
                icon="i-heroicons-share" 
                variant="ghost" 
                class="w-full justify-start" 
                @click="shareProfile"
              >
                <span class="truncate">Share Profile</span>
              </UButton>
            </div>
          </UPageCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import { useEndpoints } from '~/composables/useEndpoints'
import { useSeo } from '~/composables/useSeo'

const route = useRoute()
const { post } = useApi()
const endpoints = useEndpoints()

const { data: profileData, pending, error } = await useAsyncData(
  `user_profile_${route.params.id}`,
  async () => {
    const response = await post(
      endpoints.user.getById(route.params.id),
      {},
      true
    )
    return response?.success ? response.data : null
  }
)

const {
  data: userListings,
  pending: listingsPending,
  error: listingsError
} = await useAsyncData(
  `user_listings_${route.params.id}`,
  async () => {
    const response = await post(
      endpoints.user.listings(route.params.id),
      {},
      true
    )
    return response?.success ? response.data : null
  }
)


// Helper functions
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    active: 'emerald',
    inactive: 'gray',
    pending: 'amber',
    suspended: 'red',
    verified: 'blue'
  }
  return statusColors[status.toLowerCase()] || 'gray'
}

// Action handlers
const shareProfile = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url)
    .then(() => {
      // You can add a toast notification here
      console.log('Profile URL copied to clipboard')
    })
}

const copyUserId = () => {
  const userId = profileData?.value?.public_id || profileData?.value?.id
  if (userId) {
    navigator.clipboard.writeText(userId)
      .then(() => {
        // You can add a toast notification here
        console.log('User ID copied to clipboard')
      })
  }
}

const copyProfileLink = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url)
    .then(() => {
      // You can add a toast notification here
      console.log('Profile link copied to clipboard')
    })
}

// SEO
watchEffect(() => {
  if (!profileData.value) return

  useSeo({
    title: profileData.value.name || 'User Profile',
    description: profileData.value.bio || 'User profile on Real Estate Directory',
    image: profileData.value.profile_picture_thumbnail || ''
  })
})
</script>