<template>
  <div class="min-h-screen">
    <!-- Header - Always visible -->
    <div class=" top-0 z-50 backdrop-blur-md  border-b border-gray-200/50 dark:border-gray-800/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
          <div class="flex items-start sm:items-center gap-3 sm:gap-4 w-full sm:flex-1 min-w-0">
            <div class="relative shrink-0">
              <UAvatar :src="user?.profile_picture" :alt="user?.name" size="3xl"
                class="ring-2 ring-white dark:ring-gray-800 shadow-lg cursor-pointer transition-transform hover:scale-105 w-16 h-16 sm:w-20 sm:h-20"
                @click="edit && openProfileUpload" />
              <div v-if="edit"
                class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                @click="openProfileUpload">
                <UIcon name="i-heroicons-camera" class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <div v-if="edit" class="flex items-center gap-2 sm:gap-3 w-full">
                  <UInput v-model="user.display_name" placeholder="Your display name"
                    class="flex-1 min-w-0 text-lg sm:text-2xl" :ui="{ wrapper: 'w-full', base: 'font-bold' }" />
                  <UButton icon="i-heroicons-check" color="emerald" variant="ghost" size="xs sm:sm"
                    @click="saveDisplayName" />
                </div>
                <h1 v-else class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {{ user?.display_name || 'Your Name' }}
                </h1>

                <div class="flex flex-wrap gap-2">
                  <UBadge v-if="user?.status" :label="user.status" :color="getStatusColor(user.status)" variant="soft"
                    size="xs" />
                  <UBadge v-if="user?.account?.currentAccount" :label="user.account.currentAccount" color="primary"
                    variant="soft" size="xs" />
                </div>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2 sm:gap-4 text-sm">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-at-symbol" class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                  <div v-if="edit" class="flex items-center gap-1 sm:gap-2">
                    <UInput v-model="user.username" placeholder="username" size="xs" class="w-50 sm:w-40" />
                    <UButton icon="i-heroicons-check" color="success" variant="ghost" size="md" @click="saveUsername" />
                  </div>
                  <span v-else class="text-gray-600 dark:text-gray-300 truncate text-xs sm:text-sm">
                    {{ user?.username || 'username' }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-envelope" class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                  <div v-if="edit" class="flex items-center gap-1 sm:gap-2">
                    <UButton :label="`change email`" icon="i-lucide-lock" size="sm" variant="outline" color="neutral" />
                  </div>
                  <div v-else class="flex items-center gap-1 sm:gap-2">
                    <span
                      class="text-gray-600 dark:text-gray-300 truncate max-w-[120px] sm:max-w-[180px] text-xs sm:text-sm">
                      {{ user?.email?.email }}
                    </span>
                    <UBadge v-if="user?.email?.email_verified" label="✓" color="primary" variant="soft" size="xs" />
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-finger-print" class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                  <code class="text-xs font-mono text-gray-700 dark:text-gray-300 truncate max-w-[100px] sm:max-w-none">
                {{ user?.public_id }}
              </code>
                  <UButton icon="i-heroicons-clipboard-document" color="neutral" variant="ghost" size="md"
                    @click="copyUserId" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end sm:justify-start gap-2 sm:gap-3 w-full sm:w-auto">
            <UButton icon="i-heroicons-share" color="gray" variant="ghost" size="xs sm:sm"
              :label="useScreenSize().isDesktop ? 'Share' : undefined" @click="shareProfile" />

            <UButton :icon="edit ? 'i-heroicons-check-circle' : 'i-heroicons-pencil-square'"
              :color="edit ? 'netral' : 'primary'" :variant="edit ? 'solid' : 'ghost'" size="xs"
              :label="useScreenSize().isDesktop ? (edit ? 'Done' : 'Edit') : undefined" @click="toggleEdit" />
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
              {{ user?.created_at ? formatDate(user.created_at) : 'Join now!' }}
            </p>
          </div>
        </UPageCard>

        <UPageCard spotlight class="h-full">
          <div class="text-center p-3">
            <UIcon name="i-heroicons-clock" class="w-7 h-7 text-blue-500 mx-auto mb-2" />
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Last Active</p>
            <p class="text-base font-semibold text-gray-900 dark:text-white">
              {{ user?.last_active ? 'Recent' : 'Just now!' }}
            </p>
          </div>
        </UPageCard>

        <UPageCard spotlight class="h-full">
          <div class="text-center p-3">
            <UIcon name="i-heroicons-globe-alt" class="w-7 h-7 text-emerald-500 mx-auto mb-2" />
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Locale</p>
            <div v-if="edit" class="mt-2">
              <USelect v-model="user.locale" :items="['en-KE', 'en-US', 'en-GB', 'sw-KE']" size="xs" class="text-sm" />
            </div>
            <p v-else class="text-base font-semibold text-gray-900 dark:text-white">
              {{ user?.locale || 'Set your locale' }}
            </p>
          </div>
        </UPageCard>

        <UPageCard spotlight class="h-full">
          <div class="text-center p-3">
            <UIcon name="i-heroicons-currency-dollar" class="w-7 h-7 text-amber-500 mx-auto mb-2" />
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Currency</p>
            <div v-if="edit" class="mt-2">
              <USelectMenu v-model="user.currency" :items="allowed_currencies" valueKey="value" size="xs"
                class="w-30 text-sm" />
            </div>
            <p v-else class="text-base font-semibold text-gray-900 dark:text-white">
              {{ user?.currency || 'Set currency' }}
            </p>
          </div>
        </UPageCard>

        <UPageCard spotlight class="h-full">
          <div class="text-center p-3">
            <UIcon name="i-heroicons-user-group" class="w-7 h-7 text-purple-500 mx-auto mb-2" />
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Account Type</p>
            <p class="text-base font-semibold text-gray-900 dark:text-white">
              {{ user?.account?.currentAccount }}
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
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-user-circle" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <h2 class="text-xl font-semibold text-gray-900 dark:text-white">About You</h2>
                </div>
                <UButton v-if="!edit" icon="i-heroicons-pencil" color="gray" variant="ghost" size="sm"
                  @click="startEdit('bio')" />
              </div>
            </template>

            <div v-if="!edit || editingSection !== 'bio'">
              <p v-if="user?.bio" class="text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ user.bio }}
              </p>
              <div v-else class="text-center py-8">
                <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-500 dark:text-gray-400 mb-3">Your bio is empty</p>
                <p class="text-sm text-gray-400 dark:text-gray-500 mb-4">Tell others about yourself to make your profile
                  stand out
                </p>
                <UButton icon="i-heroicons-plus" color="primary" variant="ghost" @click="startEdit('bio')">
                  Add Bio
                </UButton>
              </div>
            </div>

            <div v-else class="space-y-4 w-full">
              <UTextarea v-model="user.bio" placeholder="Share something interesting about yourself..." autoresize
                :rows="4" class="w-full" />
              <div class="flex justify-end gap-3 ">
                <UButton label="Cancel" variant="ghost" @click="cancelEdit" />
                <UButton label="Save Bio" color="primary" @click="saveSection('bio')" />
              </div>
            </div>
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
                    <UBadge v-if="user?.phone_number?.phone_verified" label="Verified" color="emerald" variant="soft"
                      size="xs" />
                  </div>
                  <div v-if="user?.phone_number?.number" class="flex items-center gap-2">
                    <UIcon name="i-heroicons-device-phone-mobile" class="w-4 h-4 text-gray-400" />
                    <p class="text-gray-900 dark:text-white">{{ user.phone_number.country_code }} {{
                      user.phone_number.number }}
                    </p>
                  </div>
                  <div v-else
                    class="text-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    <UIcon name="i-heroicons-phone" class="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p class="text-gray-500 dark:text-gray-400 mb-2">No phone number added</p>
                    <p class="text-xs text-gray-400 dark:text-gray-500 mb-3">Add your phone for better security</p>
                    <UButton v-if="edit" icon="i-heroicons-plus" color="primary" variant="ghost" size="sm"
                      @click="focusPhoneField = true">
                      Add Phone
                    </UButton>
                  </div>
                </div>

                <div v-if="edit || focusPhoneField"
                  class="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                  <div class="flex gap-3">
                    <USelectMenu v-model="user.phone_number.country_code" arrow :items="allowed_country_codes"
                      labelKey="dialCode" valueKey="dialCode" key="id" class="w-28" size="sm">
                      <template #leading="{ modelValue }">
                        <span v-if="modelValue">
                          {{
                            allowed_country_codes.find(c => c.dialCode === modelValue)?.emoji || ""
                          }}
                        </span>
                      </template>
                    </USelectMenu>


                    <UInput v-model="user.phone_number.number" placeholder="Phone number" size="sm" class="flex-1" />
                  </div>
                  <div class="flex items-center gap-3">
                    <UCheckbox v-model="user.phone_number.phone_verified" />
                    <span class="text-sm text-gray-600 dark:text-gray-400">Mark as verified</span>
                  </div>
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

              <div v-if="hasProfessionalInfo" class="space-y-5">
                <div v-for="field in professionalFields" :key="field.key">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ field.label }}</p>
                  <p v-if="field.value" class="text-gray-900 dark:text-white">{{ field.value }}</p>
                  <p v-else class="text-gray-500 dark:text-gray-400 italic text-sm">Not specified</p>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <UIcon name="i-heroicons-briefcase" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p class="text-gray-500 dark:text-gray-400 mb-3">No professional info</p>
                <p class="text-sm text-gray-400 dark:text-gray-500 mb-4">Complete your professional profile</p>
                <UButton v-if="edit" icon="i-heroicons-plus" color="primary" variant="ghost"
                  @click="showProfessionalForm = true">
                  Add Info
                </UButton>
              </div>

              <div v-if="edit || showProfessionalForm"
                class="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <UInput v-model="user.occupation" label="Occupation" placeholder="e.g., Software Engineer" size="sm" />
                <UInput v-model="user.company" label="Company" placeholder="Company name" size="sm" />
                <UInput v-model="user.website" label="Website" placeholder="https://example.com" size="sm" />
              </div>
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

            <div v-if="hasLocationInfo" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div v-for="field in locationFields" :key="field.key">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ field.label }}</p>
                <p v-if="field.value" class="text-gray-900 dark:text-white">{{ field.value }}</p>
                <p v-else class="text-gray-500 dark:text-gray-400 italic text-sm">Not specified</p>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <UIcon name="i-heroicons-map" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400 mb-3">No location info</p>
              <p class="text-sm text-gray-400 dark:text-gray-500 mb-4">Add your location for better recommendations</p>
              <UButton v-if="edit" icon="i-heroicons-plus" color="primary" variant="ghost"
                @click="showLocationForm = true">
                Add Location
              </UButton>
            </div>

            <div v-if="edit || showLocationForm"
              class="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <UInput v-model="user.location.city" label="City" placeholder="e.g., Nairobi" size="sm" />
              <UInput v-model="user.location.country" label="Country" placeholder="e.g., Kenya" size="sm" />
              <UInput v-model="user.location.address" label="Address" placeholder="Full address" size="sm" />
            </div>
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
                  <p v-if="user?.date_of_birth" class="text-gray-900 dark:text-white">{{ formatDate(user.date_of_birth)
                  }}</p>
                  <p v-else class="text-gray-500 dark:text-gray-400 italic">Not set yet</p>
                </div>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</p>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-user-circle" class="w-4 h-4 text-gray-400" />
                  <p v-if="user?.gender" class="text-gray-900 dark:text-white">{{allowed_genders.find(g => g.value ===
                    user.gender)?.label || 'Not specified'}}</p>
                  <p v-else class="text-gray-500 dark:text-gray-400 italic">Not specified</p>
                </div>
              </div>

              <div v-if="edit" class="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <UInput v-model="user.date_of_birth" type="date" label="Date of Birth" size="sm" />
                <USelect option-key="label" value-key="value" v-model="user.gender" :items="allowed_genders"
                  placeholder="Select gender" size="sm" />
              </div>
            </div>
          </UPageCard>

          <div>
            <ScrollerPropertyList :items="userRentalProperties" :total="userRentalProperties.length" :loading="false"
              @load-more="fetchlistings" />
          </div>

          <!-- Quick Actions -->
          <UPageCard spotlight>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
            </template>

            <div class="space-y-3">
              <UButton icon="i-heroicons-document-duplicate" variant="ghost" class="w-full justify-start"
                @click="copyUserId">
                <span class="truncate">Copy User ID</span>
              </UButton>
              <UButton icon="i-heroicons-link" variant="ghost" class="w-full justify-start" @click="copyProfileLink">
                <span class="truncate">Copy Profile Link</span>
              </UButton>
              <UButton icon="i-heroicons-qr-code" variant="ghost" class="w-full justify-start" @click="showQRCode">
                <span class="truncate">Show QR Code</span>
              </UButton>
              <UButton icon="i-heroicons-share" variant="ghost" class="w-full justify-start" @click="shareProfile">
                <span class="truncate">Share Profile</span>
              </UButton>
            </div>
          </UPageCard>

          <!-- Profile Completion -->
          <UPageCard spotlight v-if="!edit && profileCompletion < 100">
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Profile Completion</h3>
              </div>
            </template>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ profileCompletion }}%
                  complete</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ completedFields }}/{{ totalFields }}
                  fields</span>
              </div>
              <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                  :style="{ width: `${profileCompletion}%` }" />
              </div>
              <UButton icon="i-heroicons-pencil" color="primary" variant="ghost" class="w-full" @click="toggleEdit">
                Complete Your Profile
              </UButton>
            </div>
          </UPageCard>
        </div>
      </div>
    </div>

    <!-- Global Save Banner -->
    <Transition enter-active-class="transition-transform duration-300" enter-from-class="translate-y-full"
      leave-active-class="transition-transform duration-300" leave-to-class="translate-y-full">
      <div v-if="edit && !editingSection"
        class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 max-w-lg w-full px-4">
        <div
          class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-4 w-full">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p class="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Unsaved Changes</p>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Save or discard your changes</p>
              </div>
            </div>
            <div class="flex gap-2 w-full sm:w-auto">
              <UButton label="Discard" variant="ghost" size="sm" class="flex-1 sm:flex-none" @click="cancelEdit" />
              <UButton label="Save All" color="primary" size="sm" class="flex-1 sm:flex-none" :loading="saving"
                @click="saveAll" />
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Profile Picture Modal -->
    <UModal v-model:open="showProfileModal" :ui="{ container: 'items-center justify-center px-4' }">
      <template #content>

        <UCard :ui="{
          base: 'relative overflow-hidden w-full max-w-md',
          ring: 'ring-0',
          rounded: 'rounded-2xl',
          shadow: 'shadow-2xl'
        }">

          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Update Profile Picture</h3>
              <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" @click="showProfileModal = false" />
            </div>
          </template>

          <div class="flex flex-col items-center space-y-6">
            <div class="relative">
              <div class="w-40 h-40 rounded-2xl overflow-hidden shadow-lg ring-2 ring-white dark:ring-gray-800">
                <img :src="profilePreview || user?.profile_picture" alt="Preview" class="w-full h-full object-cover" />
              </div>
              <div class="absolute -bottom-3 -right-3">
                <label class="cursor-pointer">
                  <div
                    class="p-3 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors">
                    <UIcon name="i-heroicons-camera" class="w-5 h-5" />
                  </div>
                  <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
                </label>
              </div>
            </div>

            <div class="flex gap-3 flex-wrap justify-center">
              <UButton icon="i-heroicons-photo" @click="triggerFileInput">
                Choose Photo
              </UButton>
              <UButton icon="i-heroicons-trash" color="red" variant="outline" :disabled="!user?.profile_picture"
                @click="removeProfilePicture">
                Remove
              </UButton>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface LocationData {
  country: string
  county: string
  state?: string
  city: string
  address: string
  coordinates?: {
    lat: number
    long: number
  }
}

interface Account {
  id: string
  name: string
  verified: boolean
  status: string
}

interface UserAccount {
  currentAccount: string
  availableAccounts: Account[]
}
interface Email {
  email: string
  email_verified: boolean
}

interface Phone {
  phone_country_code: string
  phone_number: string
  phone_verified: boolean
}
interface User {
  account: UserAccount
  name: string
  profile_picture: string
  userName: string
  publicId: string
  email: Email
  phone_number: Phone
  location: LocationData
  currency: string
  locale: string
  bio: string
  occupation: string
  company: string
  job_title: string
  industry: string
  website: string
  status: 'active' | 'inactive' | 'pending' | 'verified' | 'premium'
  date_of_birth: string
  gender: string
  created_at: string
  last_active: string
  verification_level: 'basic' | 'verified' | 'premium'
}

const userStore = useUserStore()

const user = ref<User | null>(null)
const edit = ref(false)
const editingSection = ref<string | null>(null)
const saving = ref(false)
const showProfileModal = ref(false)
const profilePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement>()
const focusPhoneField = ref(false)
const showProfessionalForm = ref(false)
const showLocationForm = ref(false)
const allowed_country_codes = ref([])
const allowed_genders = ref([])
const allowed_currencies = ref([])
const storeUser = computed(() => userStore.userprofile)
const userRentalProperties = ref([])
const listing_loading = ref<boolean>(false)
watch(
  () => userStore.userprofile,
  (val) => {
    user.value = val ? { ...toRaw(val) } : null
  },
  { immediate: true }
)

onMounted(async () => {
  userStore.fetch_user_profile()
  fetchlistings({offset:0,limit:10})

  const gendersRes = await load_genders()
  allowed_genders.value = gendersRes?.data || []
})

const fetchlistings = async ({ offset, limit }) => {
  listing_loading.value = true
  // const res = await userStore.fetch_user_listings({ offset, limit })
  try {
    const res = await userStore.fetch_user_listings()
    userRentalProperties.value.push(...res.data.rentals)
  } catch (err) {
    console.error(err)
    userRentalProperties.value = []
  } finally {
    listing_loading.value = false
  }
}


// Computed properties
const hasProfessionalInfo = computed(() => {
  return !!(user.value?.occupation || user.value?.company || user.value?.job_title ||
    user.value?.industry || user.value?.website)
})

const hasLocationInfo = computed(() => {
  return !!(user.value?.location?.city || user.value?.location?.country ||
    user.value?.location?.address || user.value?.current_city || user.value?.current_country)
})

const professionalFields = computed(() => [
  { key: 'occupation', label: 'Occupation', value: user.value?.occupation },
  { key: 'company', label: 'Company', value: user.value?.company },
  { key: 'job_title', label: 'Job Title', value: user.value?.job_title },
  { key: 'industry', label: 'Industry', value: user.value?.industry },
  { key: 'website', label: 'Website', value: user.value?.website }
].filter(field => field.value || edit.value))

const locationFields = computed(() => [
  { key: 'city', label: 'City', value: user.value?.location?.city || user.value?.current_city },
  { key: 'country', label: 'Country', value: user.value?.location?.country || user.value?.current_country },
  { key: 'county', label: 'County/State', value: user.value?.location?.county },
  { key: 'address', label: 'Address', value: user.value?.location?.address }
])

const profileCompletion = computed(() => {
  const fields = [
    user.value?.display_name,
    user.value?.username,
    user.value?.bio,
    user.value?.phone_number?.number,
    user.value?.occupation,
    user.value?.company,
    user.value?.date_of_birth,
    user.value?.gender,
    user.value?.location?.city,
    user.value?.location?.country
  ]

  const completed = fields.filter(Boolean).length
  const total = fields.length
  return Math.round((completed / total) * 100)
})

const completedFields = computed(() => {
  const fields = [
    user.value?.display_name,
    user.value?.username,
    user.value?.bio,
    user.value?.phone_number?.number,
    user.value?.occupation,
    user.value?.company,
    user.value?.date_of_birth,
    user.value?.gender,
    user.value?.location?.city,
    user.value?.location?.country
  ]
  return fields.filter(Boolean).length
})

const totalFields = computed(() => 10) // Total fields we're tracking

// Methods
const toggleEdit = async () => {
  edit.value = !edit.value
  editingSection.value = null
  focusPhoneField.value = false
  showProfessionalForm.value = false
  showLocationForm.value = false
  if (edit.value) {
    const countriesRes = await load_country_codes()
    allowed_country_codes.value = countriesRes.data || []

    const currenciesRes = await load_currencies()
    allowed_currencies.value = currenciesRes.data || []
  } else {
    saveAll()
    allowed_currencies.value = []
    allowed_country_codes.value = []
  }
}

const startEdit = (section: string) => {
  edit.value = true
  editingSection.value = section

}

const cancelEdit = () => {
  edit.value = false
  editingSection.value = null
  focusPhoneField.value = false
  showProfessionalForm.value = false
  showLocationForm.value = false
  useToast().add({
    title: 'Changes discarded',
    icon: 'i-heroicons-x-circle',
    color: 'gray'
  })

}

const saveDisplayName = () => {
  useToast().add({
    title: 'Display name updated',
    icon: 'i-heroicons-check-circle',
    color: 'emerald'
  })
}

const saveUsername = () => {
  useToast().add({
    title: 'Username updated',
    icon: 'i-heroicons-check-circle',
    color: 'emerald'
  })
}

const saveSection = async (section: string) => {
  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 500))

  editingSection.value = null
  saving.value = false

  useToast().add({
    title: `${section} updated`,
    icon: 'i-heroicons-check-circle',
    color: 'emerald'
  })
}

const saveAll = async () => {
  saving.value = true
  await userStore.updateUserProfile(user.value)

  edit.value = false
  editingSection.value = null
  focusPhoneField.value = false
  showProfessionalForm.value = false
  showLocationForm.value = false
  saving.value = false

  useToast().add({
    title: 'Profile updated successfully',
    description: 'All changes have been saved',
    icon: 'i-heroicons-check-badge',
    color: 'primary'
  })
}

const shareProfile = async () => {
  const link = `${window.location.origin}/account/${user.value?.public_id}`
  await navigator.clipboard.writeText(link)
  useToast().add({
    title: 'Profile link copied',
    icon: 'i-heroicons-link',
    color: 'primary'
  })
}

const copyUserId = async () => {
  if (user.value?.public_id) {
    await navigator.clipboard.writeText(`${window.location.origin}/account/${user.value?.public_id}`)
    useToast().add({
      title: 'Profile link copied',
      icon: 'i-heroicons-clipboard-document-check',
      color: 'success'
    })
  }
}

const copyProfileLink = async () => {
  const link = `${window.location.origin}/account/${user.value?.public_id}`
  await navigator.clipboard.writeText(link)
  useToast().add({
    title: 'Profile link copied',
    icon: 'i-heroicons-link',
    color: 'emerald'
  })
}

const showQRCode = () => {
  useToast().add({
    title: 'QR Code',
    description: 'Feature coming soon',
    icon: 'i-heroicons-qr-code',
    color: 'blue'
  })
}

const openProfileUpload = () => {
  showProfileModal.value = true
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profilePreview.value = e.target?.result as string
      if (user.value) {
        user.value.profile_picture = profilePreview.value
      }
      showProfileModal.value = false

      useToast().add({
        title: 'Profile picture updated',
        icon: 'i-heroicons-check-circle',
        color: 'emerald'
      })
    }
    reader.readAsDataURL(file)
  }
}

const removeProfilePicture = () => {
  if (user.value) {
    user.value.profile_picture = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value.name)}&background=random`
    showProfileModal.value = false

    useToast().add({
      title: 'Profile picture removed',
      icon: 'i-heroicons-check-circle',
      color: 'emerald'
    })
  }
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'ACTIVE': 'emerald',
    'INACTIVE': 'red',
    'PENDING': 'amber',
    'VERIFIED': 'blue',
    'PERSONAL': 'purple'
  }
  return colors[status] || 'gray'
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Not set'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}


</script>