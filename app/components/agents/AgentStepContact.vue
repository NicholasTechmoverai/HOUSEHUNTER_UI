<script setup lang="ts">
const phone = ref('')
const countryCodes = ref([
  { value: '+254', label: '+254 (KE)' },
  { value: '+255', label: '+255 (TZ)' },
  { value: '+256', label: '+256 (UG)' }
])
const selectedCountryCode = ref(countryCodes.value[0].value)

const socialMediaLinks = ref({
  facebook: '',
  twitter: '',
  linkedin: '',
  instagram: ''
})

const phoneFields = ref({
  office: '',
  mobile: '',
  whatsapp: ''
})
</script>

<template>
  <div class="space-y-8">
    <!-- Phone Numbers Section -->
    <div>
      <UCard class="border">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-phone" class="w-5 h-5 text-primary" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Phone Numbers</h3>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Add your business contact numbers</p>
        </template>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Office Phone -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              <UIcon name="i-heroicons-building-office" class="w-4 h-4 inline mr-1" />
              Office Phone Number
            </label>
            <UFieldGroup class="flex gap-2">
              <USelectMenu 
                v-model="selectedCountryCode" 
                :items="countryCodes"
                :ui="{ width: 'w-32' }"
                size="md"
                placeholder="Code"
                class="flex-shrink-0"
              />
              <UInput 
                v-model="phoneFields.office" 
                placeholder="Enter office phone number"
                size="md"
                :ui="{ base: 'flex-1' }"
              />
            </UFieldGroup>
          </div>

          <!-- Mobile Phone -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              <UIcon name="i-heroicons-device-phone-mobile" class="w-4 h-4 inline mr-1" />
              Mobile Phone Number
            </label>
            <UFieldGroup class="flex gap-2">
              <USelectMenu 
                v-model="selectedCountryCode" 
                :items="countryCodes"
                :ui="{ width: 'w-32' }"
                size="md"
                placeholder="Code"
                class="flex-shrink-0"
              />
              <UInput 
                v-model="phoneFields.mobile" 
                placeholder="Enter mobile number"
                size="md"
                :ui="{ base: 'flex-1' }"
              />
            </UFieldGroup>
          </div>

          <!-- WhatsApp Phone -->
          <div class="space-y-2 lg:col-span-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="w-4 h-4 inline mr-1" />
              WhatsApp Phone Number
            </label>
            <UFieldGroup class="flex gap-2">
              <USelectMenu 
                v-model="selectedCountryCode" 
                :items="countryCodes"
                :ui="{ width: 'w-32' }"
                size="md"
                placeholder="Code"
                class="flex-shrink-0"
              />
              <UInput 
                v-model="phoneFields.whatsapp" 
                placeholder="Enter WhatsApp number"
                size="md"
                :ui="{ base: 'flex-1' }"
              />
            </UFieldGroup>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Customers will be able to contact you directly via WhatsApp
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Email & Website Section -->
    <div>
      <UCard class="border">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-globe-alt" class="w-5 h-5 text-primary" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Email & Website</h3>
          </div>
        </template>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Primary Email -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <UInput 
              color="neutral" 
              disabled 
              variant="outline" 
              placeholder="email@example.com"
              size="md"
              icon="i-heroicons-envelope"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400">Primary email cannot be changed</p>
          </div>

          <!-- Secondary Email -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Secondary Email Address</label>
            <UInput 
              color="neutral" 
              variant="outline" 
              placeholder="secondary@example.com"
              size="md"
              icon="i-heroicons-envelope"
            />
          </div>

          <!-- Website -->
          <div class="space-y-2 lg:col-span-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
            <UFieldGroup class="flex gap-2">
              <UBadge 
                color="primary" 
                variant="solid" 
                size="lg" 
                label="https://"
                class="px-4 py-2 flex items-center gap-1"
              >
                <UIcon name="i-heroicons-lock-closed" class="w-4 h-4" />
              </UBadge>
              <UInput 
                color="neutral" 
                variant="outline" 
                placeholder="www.example.com"
                size="md"
                :ui="{ base: 'flex-1' }"
              />
            </UFieldGroup>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Social Media Links -->
    <div>
      <UCard class="border">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-share" class="w-5 h-5 text-primary" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Social Media Links</h3>
            </div>
            <UBadge color="gray" variant="soft" size="sm">
              Optional
            </UBadge>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect your social media profiles</p>
        </template>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Facebook -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <UIcon name="i-simple-icons-facebook" class="w-5 h-5 text-blue-600" />
              Facebook
            </label>
            <UInput 
              v-model="socialMediaLinks.facebook" 
              color="neutral" 
              variant="outline" 
              placeholder="https://facebook.com/username"
              size="md"
              icon="i-heroicons-link"
            />
          </div>

          <!-- Twitter -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <UIcon name="i-simple-icons-x" class="w-5 h-5 text-gray-900 dark:text-white" />
              Twitter
            </label>
            <UInput 
              v-model="socialMediaLinks.twitter" 
              color="neutral" 
              variant="outline" 
              placeholder="https://twitter.com/username"
              size="md"
              icon="i-heroicons-link"
            />
          </div>

          <!-- LinkedIn -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <UIcon name="i-simple-icons-linkedin" class="w-5 h-5 text-blue-700" />
              LinkedIn
            </label>
            <UInput 
              v-model="socialMediaLinks.linkedin" 
              color="neutral" 
              variant="outline" 
              placeholder="https://linkedin.com/in/username"
              size="md"
              icon="i-heroicons-link"
            />
          </div>

          <!-- Instagram -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <UIcon name="i-simple-icons-instagram" class="w-5 h-5 text-pink-600" />
              Instagram
            </label>
            <UInput 
              v-model="socialMediaLinks.instagram" 
              color="neutral" 
              variant="outline" 
              placeholder="https://instagram.com/username"
              size="md"
              icon="i-heroicons-link"
            />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton color="primary" size="md" icon="i-heroicons-check">
              Save Changes
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles for better spacing and visual hierarchy */
:deep(.u-card) {
  transition: all 0.2s ease;
}

:deep(.u-card:hover) {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>