<template>
  <div class="min-h-screen ">
    <div class="sticky top-0 z-20 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="relative group">
              <UAvatar :src="user.profile_picture" :alt="user.name" size="lg"
                class="ring-2 ring-gray-200 dark:ring-gray-700 cursor-pointer" @click="openProfileUpload" />
              <div v-if="edit"
                class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                @click="openProfileUpload">
                <UIcon name="i-heroicons-camera" class="w-5 h-5 text-white" />
              </div>
            </div>

            <div>
              <div class="flex items-center gap-2">
                <!-- Name (editable when in edit mode) -->
                <div v-if="edit" class="flex items-center gap-2">
                  <UInput v-model="user.name" placeholder="Your name" size="sm" class="w-48" />
                  <UButton icon="i-heroicons-check" color="green" variant="ghost" size="xs" @click="saveName" />
                </div>
                <h1 v-else class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ user.name }}
                </h1>

                <UBadge :label="user.account.currentAccount" color="primary" variant="subtle" size="xs" />
              </div>

              <!-- Username and Public ID -->
              <div class="flex items-center gap-2 mt-1">
                <!-- Username (editable when in edit mode) -->
                <div v-if="edit" class="flex items-center gap-1">
                  <span class="text-sm text-gray-500 dark:text-gray-400">@</span>
                  <UInput v-model="user.userName" placeholder="username" size="xs" class="w-32" />
                  <UButton icon="i-heroicons-check" color="green" variant="ghost" size="2xs" @click="saveUsername" />
                </div>
                <p v-else class="text-sm text-gray-600 dark:text-gray-400">@{{ user.userName }}</p>

                <span class="text-gray-400">•</span>

                <!-- Public ID with Copy -->
                <div class="flex items-center gap-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">ID:</span>
                  <code
                    class="text-xs font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                    {{ user.publicId }}
                  </code>
                  <UButton icon="i-heroicons-document-duplicate" color="gray" variant="ghost" size="2xs"
                    @click="copyPublicId" />
                </div>

                <!-- Share Profile -->
                <UDropdown :items="shareOptions" :popper="{ placement: 'bottom-start' }">
                  <UButton icon="i-heroicons-share" color="gray" variant="ghost" size="2xs" label="Share"
                    class="hidden sm:inline-flex" />
                  <UButton icon="i-heroicons-share" color="gray" variant="ghost" size="2xs" class="sm:hidden" />
                </UDropdown>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UButton icon="i-heroicons-bell" color="neutral" variant="ghost" size="sm" :badge="unreadNotifications"
              :ui="{ badge: { color: 'primary' } }" />

            <UDropdownMenu v-if="user.account.availableAccounts.length > 1" :items="accountDropdownItems"
              :popper="{ placement: 'bottom-end' }">
              <UButton icon="i-heroicons-switch-horizontal" color="neutral" variant="ghost" size="sm"
                class="hidden sm:flex" trailing-icon="i-heroicons-chevron-down">
                Switch
              </UButton>
              <UButton icon="i-heroicons-switch-horizontal" color="gray" variant="ghost" size="sm" class="sm:hidden" />
            </UDropdownMenu>

            <!-- Edit/Save Toggle -->
            <UButton :icon="edit ? 'i-heroicons-check' : 'i-heroicons-pencil-square'" :color="edit ? 'primary' : 'gray'"
              variant="ghost" size="sm" :label="edit ? 'Save' : 'Edit'" class="hidden sm:inline-flex"
              @click="toggleEdit" />
            <UButton :icon="edit ? 'i-heroicons-check' : 'i-heroicons-pencil-square'" :color="edit ? 'primary' : 'gray'"
              variant="ghost" size="sm" class="sm:hidden" @click="toggleEdit" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">

          <UPageCard spotlight>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</p>
            <div class="flex items-center gap-2">
              <UBadge :label="user.status" :color="getStatusColor(user.status)" size="sm" />
            </div>
          </UPageCard>


          <UPageCard spotlight>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member Since</p>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 ">
              {{ formatDate(user.created_at, 'short') }}
            </p>
          </UPageCard>

          <UPageCard spotlight>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Properties</p>
            <p class="text-lg font-semibold text-gray-900 dark:text-gray-100 ">
              {{ userStats.properties }}
            </p>
          </UPageCard>

          <UPageCard spotlight>

            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ratings</p>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-star" class="w-4 h-4 text-yellow-500 fill-current" />
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ userStats.rating }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                ({{ userStats.reviews }} reviews)
              </span>
            </div>
          </UPageCard>

          <UPageCard spotlight>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Response Rate</p>
            <div class="flex items-center gap-2 mt-2">
              <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full bg-green-500 rounded-full" :style="{ width: `${userStats.responseRate}%` }" />
              </div>
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ userStats.responseRate }}%
              </span>
            </div>
          </UPageCard>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column (2/3) -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Bio Section -->
            <ProfileSection title="Bio" icon="i-heroicons-user" :is-editing="editingSection === 'bio' || edit"
              @edit="editingSection = 'bio'" @save="saveSection('bio')" @cancel="editingSection = null">
              <template #default>
                <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {{ user.bio || 'No bio added yet. Tell others about yourself.' }}
                </p>
              </template>
              <template #editing>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">About you</label>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ user.bio?.length || 0 }}/500</span>
                  </div>
                  <UTextarea v-model="user.bio" autoresize :rows="3" placeholder="Tell us about yourself..."
                    class="w-full text-sm" />
                </div>
              </template>
            </ProfileSection>

            <!-- Contact & Professional -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileSection title="Contact" icon="i-heroicons-envelope"
                :is-editing="editingSection === 'contact' || edit" @edit="editingSection = 'contact'"
                @save="saveSection('contact')" @cancel="editingSection = null">
                <template #default>
                  <div class="space-y-4">
                    <div>
                      <label class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Email</label>
                      <div class="flex items-center justify-between">
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user.email.email }}</p>
                        <UBadge :label="user.email.email_verified ? 'Verified' : 'Unverified'"
                          :color="user.email.email_verified ? 'success' : 'warning'" variant="subtle" size="xs" />
                      </div>
                    </div>

                    <div v-if="user.phone_number.phone_number">
                      <label class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Phone</label>
                      <div class="flex items-center justify-between">
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {{ user.phone_number.phone_country_code }} {{ user.phone_number.phone_number }}
                        </p>
                        <UBadge :label="user.phone_number.phone_verified ? 'Verified' : 'Unverified'"
                          :color="user.phone_number.phone_verified ? 'success' : 'warning'" variant="subtle" size="xs" />
                      </div>
                    </div>
                  </div>
                </template>
                <template #editing>
                  <div class="space-y-4">
                    <UInput v-model="user.email.email" label="Email" placeholder="your@email.com" type="email"
                      size="sm" />
                    <div class="flex items-center gap-2">
                      <UCheckbox v-model="user.email.email_verified" size="xs" />
                      <span class="text-xs text-gray-600 dark:text-gray-400">Mark as verified</span>
                    </div>

                    <div class="flex gap-2">
                      <USelect v-model="user.phone_number.phone_country_code" label="Phone Code" :options="countryCodes"
                        size="sm" class="w-28" />
                      <UInput v-model="user.phone_number.phone_number" label="Phone Number" placeholder="123456789"
                        type="tel" size="sm" class="flex-1" />
                    </div>
                    <div class="flex items-center gap-2">
                      <UCheckbox v-model="user.phone_number.phone_verified" size="xs" />
                      <span class="text-xs text-gray-600 dark:text-gray-400">Mark as verified</span>
                    </div>
                  </div>
                </template>
              </ProfileSection>

              <ProfileSection title="Professional" icon="i-heroicons-briefcase"
                :is-editing="editingSection === 'professional' || edit" @edit="editingSection = 'professional'"
                @save="saveSection('professional')" @cancel="editingSection = null">
                <template #default>
                  <div class="space-y-3">
                    <div v-for="(value, key) in professionalFields" :key="key">
                      <label class="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">{{ key.replace('_',
                        ' ') }}</label>
                      <p v-if="value" class="text-sm text-gray-900 dark:text-gray-100 mt-0.5">{{ value }}</p>
                      <p v-else class="text-sm text-gray-500 dark:text-gray-400 italic mt-0.5">Not specified</p>
                    </div>
                  </div>
                </template>
                <template #editing>
                  <div class="space-y-3">
                    <UInput v-model="user.occupation" label="Occupation" placeholder="Your occupation" size="sm" />
                    <UInput v-model="user.company" label="Company" placeholder="Company name" size="sm" />
                    <UInput v-model="user.job_title" label="Job Title" placeholder="Your title" size="sm" />
                    <UInput v-model="user.industry" label="Industry" placeholder="Industry" size="sm" />
                    <UInput v-model="user.website" label="Website" placeholder="https://example.com" type="url"
                      size="sm" />
                  </div>
                </template>
              </ProfileSection>
            </div>

            <!-- Location Section -->
            <ProfileSection title="Location" icon="i-heroicons-map-pin"
              :is-editing="editingSection === 'location' || edit" @edit="editingSection = 'location'"
              @save="saveSection('location')" @cancel="editingSection = null">
              <template #default>
                <div class="space-y-2">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Address</label>
                      <p class="text-sm text-gray-900 dark:text-gray-100">{{ user.location.address }}</p>
                    </div>
                    <div>
                      <label class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">City</label>
                      <p class="text-sm text-gray-900 dark:text-gray-100">{{ user.location.city }}</p>
                    </div>
                    <div>
                      <label class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">County</label>
                      <p class="text-sm text-gray-900 dark:text-gray-100">{{ user.location.county }}</p>
                    </div>
                    <div>
                      <label class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Country</label>
                      <p class="text-sm text-gray-900 dark:text-gray-100">{{ user.location.country }}</p>
                    </div>
                  </div>
                </div>
              </template>
              <template #editing>
                <div class="space-y-3">
                  <UInput v-model="user.location.address" label="Address" placeholder="123 Main Street" size="sm" />
                  <UInput v-model="user.location.city" label="City" placeholder="City" size="sm" />
                  <UInput v-model="user.location.county" label="County" placeholder="County" size="sm" />
                  <UInput v-model="user.location.country" label="Country" placeholder="Country" size="sm" />
                </div>
              </template>
            </ProfileSection>
          </div>

          <!-- Right Column (1/3) -->
          <div class="space-y-6">
            <!-- Personal Details -->
            <ProfileSection title="Personal" icon="i-heroicons-user-circle"
              :is-editing="editingSection === 'personal' || edit" @edit="editingSection = 'personal'"
              @save="saveSection('personal')" @cancel="editingSection = null">
              <template #default>
                <div class="space-y-3">
                  <div>
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Date of Birth</label>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(user.date_of_birth, 'long') }}</p>
                  </div>
                  <div>
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Gender</label>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ user.gender || 'Not specified' }}</p>
                  </div>
                  <div>
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Locale</label>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ user.locale }}</p>
                  </div>
                  <div>
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Currency</label>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ user.currency }}</p>
                  </div>
                </div>
              </template>
              <template #editing>
                <div class="space-y-3">
                  <UInput v-model="user.date_of_birth" label="Date of Birth" type="date" size="sm" />
                  <USelect v-model="user.gender" label="Gender" :options="genderOptions" placeholder="Select gender"
                    size="sm" />
                  <USelect v-model="user.locale" label="Locale" :options="localeOptions" placeholder="Select locale"
                    size="sm" />
                  <USelect v-model="user.currency" label="Currency" :options="currencyOptions"
                    placeholder="Select currency" size="sm" />
                </div>
              </template>
            </ProfileSection>

      
            <!-- Available Accounts -->
            <div v-if="user.account.availableAccounts.length > 0" class="space-y-3">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <UIcon name="i-heroicons-wallet" class="w-4 h-4" />
                Available Accounts
              </h3>
              <div class="space-y-2">
                <UCard v-for="account in user.account.availableAccounts" :key="account.id"
                  class="cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                  @click="switchAccount(account.id)">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <UIcon name="i-heroicons-briefcase" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ account.name }}</p>
                        <div class="flex items-center gap-1 mt-0.5">
                          <UBadge :label="account.status" :color="getStatusColor(account.status)" variant="subtle"
                            size="xs" />
                          <UBadge v-if="account.verified" label="Verified" color="green" variant="subtle" size="xs" />
                        </div>
                      </div>
                    </div>
                    <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-gray-400" />
                  </div>
                </UCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Global Save Button -->
    <Transition name="slide-up">
      <div v-if="edit && editingSection === null"
        class="fixed inset-x-0 bottom-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
        <div class="container mx-auto px-4 py-4">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Unsaved Changes</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Review all changes before saving
              </p>
            </div>
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <UButton color="gray" variant="outline" @click="cancelAll" class="flex-1 sm:flex-none" size="sm">
                Discard All
              </UButton>
              <UButton color="primary" @click="saveAll" :loading="saving" class="flex-1 sm:flex-none" size="sm">
                Save All Changes
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Profile Picture Upload Modal -->
    <UModal v-model:open="showProfileUpload">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Update Profile Picture</h3>
              <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" @click="showProfileUpload = false" />
            </div>
          </template>

          <div class="space-y-4">
            <div class="flex flex-col items-center">
              <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                <img :src="profilePicturePreview || user.profile_picture" alt="Profile preview"
                  class="w-full h-full object-cover" />
              </div>

              <div class="mt-4 flex gap-2">
                <UButton icon="i-heroicons-arrow-up-tray" color="primary" @click="triggerFileInput">
                  Upload Photo
                </UButton>
                <UButton icon="i-heroicons-trash" color="red" variant="outline" @click="removeProfilePicture"
                  :disabled="!user.profile_picture">
                  Remove
                </UButton>
              </div>

              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleProfilePictureUpload" />
            </div>
          </div>
        </UCard>
      </template>

    </UModal>
  </div>
</template>

<script setup lang="ts">
// Interfaces
interface Email {
  email: string
  email_verified: boolean
}

interface Phone {
  phone_country_code: string
  phone_number: string
  phone_verified: boolean
}

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

interface UserStats {
  properties: number
  rating: number
  reviews: number
  responseRate: number
  totalViews: number
  responseTime: string
}

interface SecuritySettings {
  twoFactor: boolean
  loginAlerts: boolean
  sessionTimeout: number
  trustedDevices: string[]
}

interface ShareOption {
  label: string
  icon: string
  click: () => void
}

// Reusable Profile Section Component
const ProfileSection = defineComponent({
  props: {
    title: String,
    icon: String,
    isEditing: Boolean
  },
  emits: ['edit', 'save', 'cancel'],
  setup(props, { emit, slots }) {
    return () => h(UCard, {
      class: 'border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors'
    }, {
      header: () => h('div', { class: 'flex items-center justify-between' }, [
        h('div', { class: 'flex items-center gap-2' }, [
          h(UIcon, { name: props.icon, class: 'w-5 h-5 text-gray-500 dark:text-gray-400' }),
          h('h3', { class: 'text-lg font-semibold text-gray-900 dark:text-gray-100' }, props.title)
        ]),
        !props.isEditing ? h(UButton, {
          icon: 'i-heroicons-pencil-square',
          color: 'gray',
          variant: 'ghost',
          size: 'xs',
          class: 'text-xs',
          onClick: () => emit('edit')
        }, 'Edit') : h('div', { class: 'flex gap-2' }, [
          h(UButton, {
            icon: 'i-heroicons-x-mark',
            color: 'gray',
            variant: 'outline',
            size: 'xs',
            onClick: () => emit('cancel')
          }, 'Cancel'),
          h(UButton, {
            icon: 'i-heroicons-check',
            color: 'primary',
            size: 'xs',
            onClick: () => emit('save')
          }, 'Save')
        ])
      ]),
      default: () => props.isEditing
        ? slots.editing?.()
        : slots.default?.()
    })
  }
})

// State
const edit = ref(false)
const editingSection = ref<string | null>(null)
const saving = ref(false)
const showProfileUpload = ref(false)
const showSecurityModal = ref(false)
const profilePicturePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement>()
const unreadNotifications = ref(3)

// User Data with enhanced fields
const user = ref<User>({
  account: {
    currentAccount: 'user',
    availableAccounts: [
      { id: '1', name: 'Business Account', verified: true, status: 'active' },
      { id: '2', name: 'Agent Account', verified: false, status: 'pending' },
      { id: '3', name: 'Property Manager', verified: true, status: 'active' }
    ]
  },
  name: 'John Doe',
  profile_picture: 'https://github.com/benjamincanac.png',
  userName: 'johndoe',
  publicId: 'USR-7A9B2C4D',
  email: {
    email: 'john.doe@example.com',
    email_verified: true
  },
  phone_number: {
    phone_country_code: '+254',
    phone_number: '74567890',
    phone_verified: true
  },
  location: {
    country: 'Kenya',
    county: 'Nairobi County',
    state: 'Nairobi',
    city: 'Nairobi',
    address: '123 Main Street, Westlands',
    coordinates: { lat: -1.2921, long: 36.8219 }
  },
  currency: 'KES',
  locale: 'en-KE',
  bio: 'Real estate professional with 10+ years experience specializing in luxury properties and commercial real estate. Passionate about helping clients find their dream homes.',
  occupation: 'Real Estate Agent',
  company: 'Prime Properties Ltd',
  job_title: 'Senior Agent & Property Consultant',
  industry: 'Real Estate & Property Management',
  website: 'https://johndoe.properties',
  status: 'premium',
  date_of_birth: '1985-06-15',
  gender: 'Male',
  created_at: '2022-01-15T10:30:00Z',
  last_active: new Date().toISOString(),
  verification_level: 'premium'
})

// User Stats
const userStats = ref<UserStats>({
  properties: 24,
  rating: 4.8,
  reviews: 128,
  responseRate: 95,
  totalViews: 2456,
  responseTime: '< 2 hours'
})

// Security Settings
const securitySettings = ref<SecuritySettings>({
  twoFactor: true,
  loginAlerts: true,
  sessionTimeout: 24,
  trustedDevices: ['iPhone 13', 'MacBook Pro', 'iPad Air']
})


// Options for dropdowns
const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say']
const localeOptions = ['en-KE', 'en-US', 'en-GB', 'sw-KE']
const currencyOptions = ['KES', 'USD', 'EUR', 'GBP']
const countryCodes = ['+1', '+44', '+254', '+255', '+256']


const userStore = useUserStore()

onMounted(async () => {
await useAsyncData('user_profile', () =>
  userStore.fetch_user_profile()
)

await useAsyncData('user_listings', () =>
  userStore.fetch_user_listings()
)
})

// Share Options
const shareOptions = [[
  {
    label: 'Copy Profile Link',
    icon: 'i-heroicons-link',
    click: () => copyProfileLink()
  },
  {
    label: 'Share via WhatsApp',
    icon: 'i-heroicons-chat-bubble-left-right',
    click: () => shareViaWhatsApp()
  },
  {
    label: 'Share via Email',
    icon: 'i-heroicons-envelope',
    click: () => shareViaEmail()
  }
]]
const addAccount = () => {
  // Implement add account logic
  useToast().add({
    title: 'Add Account',
    description: 'This feature is coming soon',
    icon: 'i-heroicons-clock',
    color: 'info'
  })
}
// Account Dropdown Items
const accountDropdownItems = ref([
  [
    ...user.value.account.availableAccounts.map(account => ({
      label: account.name,
      icon: 'i-heroicons-briefcase',
      badge: {
        label: account.verified ? 'Verified' : 'Pending',
        color: account.verified ? 'green' : 'yellow'
      },
      click: () => switchAccount(account.id)
    }))
  ],
  [
    { divider: true }
  ],
  [
    {
      label: 'Add Account',
      icon: 'i-heroicons-plus',
      click: addAccount
    }
  ]
])


// Computed
const professionalFields = computed(() => ({
  occupation: user.value.occupation,
  company: user.value.company,
  job_title: user.value.job_title,
  industry: user.value.industry,
  website: user.value.website
}))

// Methods
const toggleEdit = () => {
  edit.value = !edit.value
  if (!edit.value) {
    editingSection.value = null
    saveAll()
  }
}

const openProfileUpload = () => {
  if (edit.value) {
    showProfileUpload.value = true
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleProfilePictureUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profilePicturePreview.value = e.target?.result as string
      // In production, upload to server here
      user.value.profile_picture = profilePicturePreview.value
      showProfileUpload.value = false

      useToast().add({
        title: 'Profile picture updated',
        icon: 'i-heroicons-check-circle',
        color: 'green'
      })
    }
    reader.readAsDataURL(file)
  }
}

const removeProfilePicture = () => {
  user.value.profile_picture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.value.name}`
  showProfileUpload.value = false

  useToast().add({
    title: 'Profile picture removed',
    icon: 'i-heroicons-check-circle',
    color: 'green'
  })
}

const copyPublicId = async () => {
  try {
    await navigator.clipboard.writeText(user.value.publicId)
    useToast().add({
      title: 'Copied!',
      description: 'Public ID copied to clipboard',
      icon: 'i-heroicons-check',
      color: 'green'
    })
  } catch {
    useToast().add({
      title: 'Error',
      description: 'Failed to copy',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red'
    })
  }
}

const copyProfileLink = async () => {
  const link = `${window.location.origin}/profile/${user.value.userName}`
  try {
    await navigator.clipboard.writeText(link)
    useToast().add({
      title: 'Link copied!',
      description: 'Profile link copied to clipboard',
      icon: 'i-heroicons-check',
      color: 'green'
    })
  } catch {
    useToast().add({
      title: 'Error',
      description: 'Failed to copy link',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red'
    })
  }
}

const shareViaWhatsApp = () => {
  const text = `Check out ${user.value.name}'s profile on HouseHunter: ${window.location.origin}/profile/${user.value.userName}`
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

const shareViaEmail = () => {
  const subject = `${user.value.name}'s HouseHunter Profile`
  const body = `Check out ${user.value.name}'s profile: ${window.location.origin}/profile/${user.value.userName}`
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const saveName = () => {
  // API call to save name
  useToast().add({
    title: 'Name updated',
    icon: 'i-heroicons-check-circle',
    color: 'green'
  })
}

const saveUsername = () => {
  // API call to save username
  useToast().add({
    title: 'Username updated',
    icon: 'i-heroicons-check-circle',
    color: 'green'
  })
}

const saveSection = (section: string) => {
  saving.value = true
  // API call to save section
  setTimeout(() => {
    editingSection.value = null
    saving.value = false
    useToast().add({
      title: `${section.charAt(0).toUpperCase() + section.slice(1)} updated`,
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
  }, 500)
}

const saveAll = () => {
  saving.value = true
  // API call to save all changes
  setTimeout(() => {
    edit.value = false
    editingSection.value = null
    saving.value = false
    useToast().add({
      title: 'All changes saved',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
  }, 1000)
}

const cancelAll = () => {
  edit.value = false
  editingSection.value = null
  // Reset changes here if needed
  useToast().add({
    title: 'Changes discarded',
    icon: 'i-heroicons-information-circle',
    color: 'gray'
  })
}

const changePassword = () => {
  // Implement password change logic
  useToast().add({
    title: 'Password change requested',
    description: 'Check your email for instructions',
    icon: 'i-heroicons-envelope',
    color: 'blue'
  })
}

const switchAccount = (accountId: string) => {
  const account = user.value.account.availableAccounts.find(a => a.id === accountId)
  if (account) {
    user.value.account.currentAccount = account.name
    useToast().add({
      title: 'Switched account',
      description: `Now using ${account.name}`,
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
  }
}



const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
    case 'verified':
    case 'premium':
      return 'green'
    case 'pending':
      return 'yellow'
    case 'inactive':
      return 'red'
    default:
      return 'gray'
  }
}

// Helper function for different date formats
const formatDate = (dateString: string, format: 'short' | 'long' = 'long') => {
  const date = new Date(dateString)
  if (format === 'short') {
    return date.toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })
  }
  return date.toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
/* Enhanced transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Profile picture hover effect */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Smooth card hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Better focus states */
:focus-visible {
  outline: 2px solid rgba(var(--color-primary-500), 0.5);
  outline-offset: 2px;
}
</style>