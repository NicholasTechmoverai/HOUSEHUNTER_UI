<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

interface LocationData {
  ipInfo: {
    country: string
    city: string
    region: string
    latitude: number
    longitude: number
    ip_address: string
  }
  suggestedCountry: string
  suggestedRegion: string
  isKenyanUser: boolean
}

interface ValidationResult {
  isValid: boolean
  message: string
}

const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', "Murang'a",
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
]

const userStore = useUserStore()
const route = useRoute()
const toast = useToast()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const country = ref('')
const state = ref('')
const agreeToTerms = ref(false)

const loading = ref(false)
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)
const countries = ref<string[]>([])
const states = ref<string[]>([])
const locationData = ref<LocationData | null>(null)

const formSubmitted = ref(false)
const passwordError = ref('')
const confirmPasswordError = ref('')
const termsError = ref('')

const referralInfo = computed(() => ({
  utm_source: route.query.utm_source ? String(route.query.utm_source) : '',
  utm_medium: route.query.utm_medium ? String(route.query.utm_medium) : '',
  referral_code: route.query.ref_code ? String(route.query.ref_code) : ''
}))

const validatePasswordField = () => {
  const pass = password.value
  passwordError.value = ''

  if (!pass) return

  if (pass.length < 8) {
    passwordError.value = 'Must be at least 8 characters'
    return false
  }
  if (!/[A-Z]/.test(pass)) {
    passwordError.value = 'Must contain uppercase letter'
    return false
  }
  if (!/[a-z]/.test(pass)) {
    passwordError.value = 'Must contain lowercase letter'
    return false
  }
  if (!/[0-9]/.test(pass)) {
    passwordError.value = 'Must contain a number'
    return false
  }

  return true
}

const validateConfirmPasswordField = () => {
  confirmPasswordError.value = ''

  if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
    return false
  }

  return true
}

const validateTermsField = () => {
  termsError.value = agreeToTerms.value ? '' : 'You must agree to the Terms & Conditions'
  return agreeToTerms.value
}

const validateForm = (): ValidationResult => {
  passwordError.value = ''
  confirmPasswordError.value = ''
  termsError.value = ''

  if (!fullName.value.trim()) return { isValid: false, message: 'Full name is required' }
  if (!email.value.trim()) return { isValid: false, message: 'Email is required' }
  if (!country.value) return { isValid: false, message: 'Country is required' }

  if (!password.value) return { isValid: false, message: 'Password is required' }
  if (!validatePasswordField()) {
    return { isValid: false, message: passwordError.value }
  }

  if (!confirmPassword.value) return { isValid: false, message: 'Please confirm your password' }
  if (!validateConfirmPasswordField()) {
    return { isValid: false, message: confirmPasswordError.value }
  }

  if (!validateTermsField()) {
    return { isValid: false, message: termsError.value }
  }

  return { isValid: true }
}

const fetchCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
    const data = await response.json()
    countries.value = data.map((c: any) => c.name.common).sort()
  } catch {
    countries.value = ['Kenya', 'United States', 'United Kingdom', 'Canada', 'South Africa', 'Nigeria']
  }
}

const updateStatesForCountry = (selectedCountry: string) => {
  states.value = []
  state.value = ''

  if (!selectedCountry) return

  const countryLower = selectedCountry.toLowerCase()

  if (countryLower === 'kenya') {
    states.value = [...KENYA_COUNTIES]
  } else if (countryLower === 'united states') {
    states.value = [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
      'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana',
      'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
      'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
      'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
      'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
      'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ]
  } else if (countryLower === 'canada') {
    states.value = ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
      'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
      'Prince Edward Island', 'Quebec', 'Saskatchewan']
  } else if (countryLower === 'united kingdom') {
    states.value = ['England', 'Scotland', 'Wales', 'Northern Ireland']
  } else {
    states.value = []
  }
}

const initializeUserLocation = async () => {
  try {
    locationData.value = await fetchUserLocation()

    if (!locationData.value?.suggestedCountry || !countries.value.length) return

    const detectedCountry = locationData.value.suggestedCountry
    const matchingCountry = countries.value.find(
      c => c.toLowerCase() === detectedCountry.toLowerCase()
    )

    if (matchingCountry) {
      country.value = matchingCountry
      updateStatesForCountry(country.value)
    }
  } catch (error) {
    console.warn('Location detection failed:', error)
  }
}

const handleSignUp = async () => {
  formSubmitted.value = true

  validatePasswordField()
  validateConfirmPasswordField()
  validateTermsField()

  const validation = validateForm()
  if (!validation.isValid) {
    toast.add({
      title: 'Validation Error',
      description: validation.message,
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    })
    return
  }

  loading.value = true

  try {
    const nameParts = fullName.value.trim().split(' ').filter(part => part.length > 0)
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const res = await userStore.register({
      first_name: firstName,
      last_name: lastName,
      display_name: fullName.value.trim(),
      email: email.value.trim(),
      password: password.value,
      confirm_password: confirmPassword.value,
      country: country.value,
      state: state.value || '',
      utm_source: referralInfo.value.utm_source,
      utm_medium: referralInfo.value.utm_medium,
      referral_code: referralInfo.value.referral_code,
      current_country: locationData.value?.ipInfo.country || '',
      current_city: locationData.value?.ipInfo.city || '',
      current_state: locationData.value?.ipInfo.region || '',
      latitude: locationData.value?.ipInfo.latitude || 0,
      longitude: locationData.value?.ipInfo.longitude || 0,
      ip_address: locationData.value?.ipInfo.ip_address || '',
      signup_user_agent: navigator.userAgent
    })

    if (!res?.success) {
      toast.add({
        title: 'Registration Failed',
        description: res?.message || 'Registration failed. Please try again.',
        icon: 'i-heroicons-exclamation-circle',
        color: 'error'
      })
      throw new Error(res?.message || 'Registration failed')
    }

    toast.add({
      title: 'Welcome aboard!',
      description: 'Account created successfully. Please verify your email.',
      icon: 'i-heroicons-check-circle',
      color: 'success'
    })
    if (res.redirectTo) {
      await navigateTo(res.redirectTo)
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      'Registration failed. Please try again.'

    toast.add({
      title: 'Registration Failed',
      description: errorMessage,
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const signInWithSocial = async (provider: 'google' | 'facebook') => {
    toast.add({
      title: `${provider} Sign In`,
      description: `Redirecting to ${provider}...`,
      icon: `i-simple-icons-${provider.toLowerCase()}`,
      color: 'info'
    })
    provider === 'google' ? useAuthStore().handleGoogleLogin() : useAuthStore().handleFacebookLogin()
}

watch(password, () => {
  if (formSubmitted.value) validatePasswordField()
})

watch(confirmPassword, () => {
  if (formSubmitted.value) validateConfirmPasswordField()
})

watch(agreeToTerms, () => {
  if (formSubmitted.value) validateTermsField()
})

onMounted(async () => {
  await fetchCountries()
  await initializeUserLocation()
})

watch(country, (newCountry) => {
  if (newCountry) {
    updateStatesForCountry(newCountry)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-start/5 via-brand-middle/5 to-brand-end/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-2 sm:p-4 flex items-center justify-center">
    <!-- Animated background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-brand-start/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-brand-end/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 sm:w-80 h-60 sm:h-80 bg-brand-middle/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative w-full max-w-4xl xl:max-w-5xl z-10 mx-2 sm:mx-4">
      <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl shadow-brand-start/10 dark:shadow-black/30 border border-white/40 dark:border-gray-700/50 overflow-hidden">
        <!-- Gradient accent line -->
        <div class="h-1.5 w-full bg-gradient-to-r from-brand-start via-brand-middle to-brand-end" />
        
        <div class="grid md:grid-cols-2">
          <!-- Left side - Brand/Info -->
          <div class="p-6 md:p-8 lg:p-10 bg-gradient-to-br from-brand-start/10 via-brand-middle/10 to-brand-end/10 dark:from-gray-700/50 dark:via-gray-700/30 dark:to-gray-700/50 border-r border-gray-100 dark:border-gray-700/50 hidden md:block">
            <div class="h-full flex flex-col justify-center space-y-6 md:space-y-8">
              <!-- Brand/Logo -->
              <div class="space-y-3 md:space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-brand-start to-brand-middle flex items-center justify-center shadow-lg shadow-brand-start/20">
                    <UIcon name="i-heroicons-home-modern" class="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white">HouseHunter</h2>
                    <p class="text-xs md:text-sm text-gray-600 dark:text-gray-300">Kenya</p>
                  </div>
                </div>
                
                <div class="space-y-2 md:space-y-3">
                  <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Find Your Perfect Home</h3>
                  <p class="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Join thousands of satisfied users finding their dream properties across Kenya.
                  </p>
                </div>
              </div>

              <!-- Features -->
              <div class="space-y-3 md:space-y-4">
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 md:w-8 md:h-8 bg-brand-start/10 dark:bg-brand-start/20 flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-check-circle" class="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-start dark:text-brand-middle" />
                  </div>
                  <div>
                    <p class="text-sm md:text-base font-medium text-gray-900 dark:text-white">Verified Listings</p>
                    <p class="text-xs md:text-sm text-gray-600 dark:text-gray-300">Only authentic properties</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 md:w-8 md:h-8 bg-brand-middle/10 dark:bg-brand-middle/20 flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-shield-check" class="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-middle" />
                  </div>
                  <div>
                    <p class="text-sm md:text-base font-medium text-gray-900 dark:text-white">Secure Platform</p>
                    <p class="text-xs md:text-sm text-gray-600 dark:text-gray-300">Bank-level security</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 md:w-8 md:h-8 bg-brand-end/10 dark:bg-brand-end/20 flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-user-group" class="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-end" />
                  </div>
                  <div>
                    <p class="text-sm md:text-base font-medium text-gray-900 dark:text-white">Community Trust</p>
                    <p class="text-xs md:text-sm text-gray-600 dark:text-gray-300">10,000+ happy users</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right side - Form -->
          <div class="p-4 sm:p-6 md:p-8 lg:p-10">
            <!-- Form Header -->
            <div class="mb-6 md:mb-8">
              <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2">
                Create Account
              </h1>
              <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Join HouseHunter Kenya in seconds
              </p>
            </div>

            <!-- Registration Form -->
            <form @submit.prevent="handleSignUp" class="space-y-4 md:space-y-6">
              <!-- Name & Email -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    Full Name
                    <span class="text-red-500">*</span>
                  </label>
                  <UInput 
                    v-model="fullName" 
                    :disabled="loading" 
                    placeholder="John Doe" 
                    size="md"
                    icon="i-heroicons-user"
                    :ui="{
                      padding: { md: 'px-4 py-2.5' },
                      color: {
                        gray: {
                          outline: 'dark:bg-gray-700/50 bg-gray-50 border-gray-200 dark:border-gray-600 focus:border-brand-start focus:ring-brand-start/20'
                        }
                      }
                    }"
                    class="w-full transition-all duration-200"
                  />
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    Email Address
                    <span class="text-red-500">*</span>
                  </label>
                  <UInput 
                    v-model="email" 
                    :disabled="loading" 
                    placeholder="john@example.com" 
                    size="md"
                    type="email"
                    icon="i-heroicons-envelope"
                    :ui="{
                      padding: { md: 'px-4 py-2.5' },
                      color: {
                        gray: {
                          outline: 'dark:bg-gray-700/50 bg-gray-50 border-gray-200 dark:border-gray-600 focus:border-brand-start focus:ring-brand-start/20'
                        }
                      }
                    }"
                    class="w-full transition-all duration-200"
                  />
                </div>
              </div>

              <!-- Passwords -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    Password
                    <span class="text-red-500">*</span>
                  </label>
                  <UInput 
                    v-model="password" 
                    :disabled="loading" 
                    placeholder="••••••••" 
                    :type="passwordVisible ? 'text' : 'password'"
                    size="md"
                    :ui="{
                      padding: { md: 'px-4 py-2.5' },
                      color: {
                        gray: {
                          outline: 'dark:bg-gray-700/50 bg-gray-50 border-gray-200 dark:border-gray-600 focus:border-brand-start focus:ring-brand-start/20'
                        }
                      }
                    }"
                    class="w-full transition-all duration-200"
                  >
                    <template #trailing>
                      <UButton 
                        color="gray" 
                        variant="ghost" 
                        size="xs"
                        :icon="passwordVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                        :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
                        @click="passwordVisible = !passwordVisible"
                        class="hover:bg-gray-100 dark:hover:bg-gray-700"
                      />
                    </template>
                  </UInput>
                  <div v-if="passwordError" class="text-xs text-red-500 mt-1">{{ passwordError }}</div>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    Confirm Password
                    <span class="text-red-500">*</span>
                  </label>
                  <UInput 
                    v-model="confirmPassword" 
                    :disabled="loading" 
                    placeholder="••••••••" 
                    :type="confirmPasswordVisible ? 'text' : 'password'"
                    size="md"
                    :ui="{
                      padding: { md: 'px-4 py-2.5' },
                      color: {
                        gray: {
                          outline: 'dark:bg-gray-700/50 bg-gray-50 border-gray-200 dark:border-gray-600 focus:border-brand-start focus:ring-brand-start/20'
                        }
                      }
                    }"
                    class="w-full transition-all duration-200"
                  >
                    <template #trailing>
                      <UButton 
                        color="gray" 
                        variant="ghost" 
                        size="xs"
                        :icon="confirmPasswordVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                        :aria-label="confirmPasswordVisible ? 'Hide password' : 'Show password'"
                        @click="confirmPasswordVisible = !confirmPasswordVisible"
                        class="hover:bg-gray-100 dark:hover:bg-gray-700"
                      />
                    </template>
                  </UInput>
                  <div v-if="confirmPasswordError" class="text-xs text-red-500 mt-1">{{ confirmPasswordError }}</div>
                </div>
              </div>

              <!-- Password Requirements -->
              <div class="p-3 md:p-4 bg-gradient-to-r from-brand-start/5 via-brand-middle/5 to-brand-end/5 dark:from-gray-700/30 dark:to-gray-700/50 border border-brand-start/20 dark:border-gray-600/50">
                <p class="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 md:mb-3">Password requirements:</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-2">
                  <div class="flex items-center gap-2">
                    <UIcon 
                      name="i-heroicons-check-circle" 
                      class="w-3.5 h-3.5 md:w-4 md:h-4" 
                      :class="password.length >= 8 ? 'text-brand-end' : 'text-gray-300 dark:text-gray-500'" 
                    />
                    <span class="text-xs" :class="password.length >= 8 ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'">
                      8+ characters
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <UIcon 
                      name="i-heroicons-check-circle" 
                      class="w-3.5 h-3.5 md:w-4 md:h-4" 
                      :class="/[A-Z]/.test(password) ? 'text-brand-end' : 'text-gray-300 dark:text-gray-500'" 
                    />
                    <span class="text-xs" :class="/[A-Z]/.test(password) ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'">
                      Uppercase letter
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <UIcon 
                      name="i-heroicons-check-circle" 
                      class="w-3.5 h-3.5 md:w-4 md:h-4" 
                      :class="/[a-z]/.test(password) ? 'text-brand-end' : 'text-gray-300 dark:text-gray-500'" 
                    />
                    <span class="text-xs" :class="/[a-z]/.test(password) ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'">
                      Lowercase letter
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <UIcon 
                      name="i-heroicons-check-circle" 
                      class="w-3.5 h-3.5 md:w-4 md:h-4" 
                      :class="/[0-9]/.test(password) ? 'text-brand-end' : 'text-gray-300 dark:text-gray-500'" 
                    />
                    <span class="text-xs" :class="/[0-9]/.test(password) ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'">
                      Number
                    </span>
                  </div>
                </div>
              </div>

              <!-- Location -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div class="space-y-1.5">
                  <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    Country
                    <span class="text-red-500">*</span>
                  </label>
                  <USelectMenu 
                    v-model="country" 
                    :disabled="loading" 
                    :items="countries" 
                    searchable 
                    size="md"
                    placeholder="Select country"
                    :ui="{
                      padding: { md: 'px-4 py-2.5' },
                      color: {
                        gray: {
                          outline: 'dark:bg-gray-700/50 bg-gray-50 border-gray-200 dark:border-gray-600 focus:border-brand-start focus:ring-brand-start/20'
                        }
                      }
                    }"
                    class="w-full"
                  >
                    <template #leading>
                      <UIcon name="i-heroicons-globe-alt" class="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    </template>
                  </USelectMenu>
                  
                  <div v-if="locationData?.suggestedCountry" class="flex items-center gap-1.5 text-xs text-brand-end dark:text-brand-middle mt-1.5">
                    <UIcon name="i-heroicons-map-pin" class="w-3 h-3" />
                    <span>Detected: {{ locationData.suggestedCountry }}</span>
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ country === 'Kenya' ? 'County' : 'Region' }}
                  </label>
                  <USelectMenu 
                    v-model="state" 
                    :disabled="loading || !country" 
                    :items="states" 
                    size="md"
                    :placeholder="country === 'Kenya' ? 'Select county' : 'Select region'"
                    :ui="{
                      padding: { md: 'px-4 py-2.5' },
                      color: {
                        gray: {
                          outline: 'dark:bg-gray-700/50 bg-gray-50 border-gray-200 dark:border-gray-600 focus:border-brand-start focus:ring-brand-start/20'
                        }
                      }
                    }"
                    class="w-full"
                  >
                    <template #leading>
                      <UIcon name="i-heroicons-map" class="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    </template>
                  </USelectMenu>
                </div>
              </div>

              <!-- Terms -->
              <div class="pt-1 md:pt-2">
                <UCheckbox 
                  v-model="agreeToTerms" 
                  :disabled="loading" 
                  size="md"
                  :ui="{
                    background: 'bg-white dark:bg-gray-700',
                    border: 'border-gray-300 dark:border-gray-600',
                    ring: 'focus-visible:ring-2 focus-visible:ring-brand-start focus-visible:ring-offset-2'
                  }"
                >
                  <template #label>
                    <div class="space-y-0.5 md:space-y-1">
                      <span class="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        I agree to the
                        <NuxtLink 
                          to="/terms" 
                          class="font-semibold text-brand-start hover:text-brand-end dark:text-brand-middle dark:hover:text-brand-start transition-colors hover:underline"
                          target="_blank"
                        >
                          Terms & Conditions
                        </NuxtLink>
                        and
                        <NuxtLink 
                          to="/privacy" 
                          class="font-semibold text-brand-start hover:text-brand-end dark:text-brand-middle dark:hover:text-brand-start transition-colors hover:underline"
                          target="_blank"
                        >
                          Privacy Policy
                        </NuxtLink>
                      </span>
                      <div v-if="termsError && formSubmitted" class="text-xs text-red-500">
                        {{ termsError }}
                      </div>
                    </div>
                  </template>
                </UCheckbox>
              </div>

              <!-- Submit Button -->
              <UButton 
                type="submit" 
                :loading="loading" 
                size="md"
                :ui="{
                  padding: { md: 'px-6 py-2.5' }
                }"
                class="w-full bg-gradient-to-r from-brand-start via-brand-middle to-brand-end hover:from-brand-start/90 hover:via-brand-middle/90 hover:to-brand-end/90 shadow-lg shadow-brand-start/20 hover:shadow-brand-start/30 transition-all duration-300"
              >
                <template #leading>
                  <UIcon v-if="!loading" name="i-heroicons-user-plus" class="w-4 h-4 md:w-5 md:h-5" />
                </template>
                <span class="font-semibold text-sm md:text-base">
                  {{ loading ? 'Creating Account...' : 'Create Account' }}
                </span>
              </UButton>
            </form>

            <!-- Divider -->
            <div class="relative my-4 md:my-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div class="relative flex justify-center">
                <span class="px-3 md:px-4 bg-white dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Or continue with
                </span>
              </div>
            </div>

            <!-- Social Login -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              <UButton 
                @click="signInWithSocial('google')" 
                :disabled="loading" 
                color="white" 
                variant="outline"
                size="md"
                :ui="{
                  padding: { md: 'px-4 py-2.5' }
                }"
                class="border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
              >
                <template #leading>
                  <UIcon name="i-simple-icons-google" class="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                </template>
                <span class="text-xs md:text-sm font-medium">Google</span>
              </UButton>

              <UButton 
                @click="signInWithSocial('facebook')" 
                :disabled="loading" 
                color="white" 
                variant="outline"
                size="md"
                :ui="{
                  padding: { md: 'px-4 py-2.5' }
                }"
                class="border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
              >
                <template #leading>
                  <UIcon name="i-simple-icons-facebook" class="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-500" />
                </template>
                <span class="text-xs md:text-sm font-medium">Facebook</span>
              </UButton>
            </div>

            <!-- Login Link -->
            <div class="pt-4 md:pt-6 text-center border-t border-gray-100 dark:border-gray-700/50 mt-4 md:mt-6">
              <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Already have an account?
                <NuxtLink 
                  to="/auth/login" 
                  class="font-semibold text-brand-start hover:text-brand-end dark:text-brand-middle dark:hover:text-brand-start transition-all duration-200 ml-1 hover:underline"
                >
                  Sign in here
                </NuxtLink>
              </p>
            </div>
          </div>
        </div>

        <!-- Security Footer -->
        <div class="px-4 sm:px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-brand-start/5 via-brand-middle/5 to-brand-end/5 dark:from-gray-700/30 dark:to-gray-700/20 border-t border-gray-100 dark:border-gray-700/50 text-center">
          <div class="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-1.5">
              <UIcon name="i-heroicons-lock-closed" class="w-3 h-3 text-brand-start dark:text-brand-middle" />
              <span>Your data is encrypted and secure</span>
            </div>
            <span class="hidden sm:inline">•</span>
            <span>GDPR compliant</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
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
</style>