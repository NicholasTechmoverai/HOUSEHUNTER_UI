<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

const ipInfo = ref({
  country: '',
  city: '',
  region: ''
})

const validateForm = () => {
  if (!fullName.value || !email.value || !password.value || !confirmPassword.value || !country.value) {
    return 'Please fill in all required fields'
  }
  
  const nameParts = fullName.value.trim().split(' ')
  if (nameParts.length < 2) {
    return 'Please enter your full name (first and last name)'
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    return 'Please enter a valid email address'
  }
  
  if (password.value.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  
  if (!/[A-Z]/.test(password.value)) {
    return 'Password must contain at least one uppercase letter'
  }
  
  if (!/[a-z]/.test(password.value)) {
    return 'Password must contain at least one lowercase letter'
  }
  
  if (!/\d/.test(password.value)) {
    return 'Password must contain at least one number'
  }
  
  if (password.value !== confirmPassword.value) {
    return 'Passwords do not match'
  }
  
  if (!agreeToTerms.value) {
    return 'You must agree to the Terms & Conditions'
  }
  
  return null
}

const fetchCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name')
    const data = await response.json()
    countries.value = data.map((c: any) => c.name.common).sort()
  } catch {
    countries.value = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan']
  }
}

const fetchStates = async (selectedCountry: string) => {
  states.value = []
  state.value = ''
  
  if (!selectedCountry) return
  
  try {
    if (selectedCountry === 'United States') {
      const response = await fetch('https://api.census.gov/data/2010/dec/sf1?get=NAME&for=state:*')
      const data = await response.json()
      states.value = data.slice(1).map((state: any[]) => state[0]).sort()
    } else if (selectedCountry === 'Canada') {
      states.value = ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 
                     'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan']
    } else if (selectedCountry === 'United Kingdom') {
      states.value = ['England', 'Scotland', 'Wales', 'Northern Ireland']
    } else if (selectedCountry === 'Australia') {
      states.value = ['New South Wales', 'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia']
    } else {
      states.value = ['Select a state/region']
    }
  } catch {
    states.value = ['Select a state/region']
  }
}

const getUserLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    ipInfo.value = {
      country: data.country_name,
      city: data.city,
      region: data.region
    }
    
    if (data.country_name && countries.value.includes(data.country_name)) {
      country.value = data.country_name
      await fetchStates(data.country_name)
      
      if (data.region && states.value.includes(data.region)) {
        state.value = data.region
      }
    }
  } catch {
    ipInfo.value = { country: '', city: '', region: '' }
  }
}

const handleSignUp = async () => {
  const error = validateForm()
  if (error) {
    useToast().add({
      title: 'Validation Error',
      description: error,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
    return
  }

  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    useToast().add({
      title: 'Registration Successful',
      description: 'Your account has been created!',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
    
    navigateTo('/auth/verify-email')
  } catch {
    useToast().add({
      title: 'Registration Failed',
      description: 'Please try again later.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

const signInWithGoogle = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    useToast().add({
      title: 'Google Sign Up',
      description: 'Redirecting to Google...',
      icon: 'i-simple-icons-google',
      color: 'blue'
    })
  } catch {
    useToast().add({
      title: 'Google Sign Up Failed',
      description: 'Please try again.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

const signInWithFacebook = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    useToast().add({
      title: 'Facebook Sign Up',
      description: 'Redirecting to Facebook...',
      icon: 'i-simple-icons-facebook',
      color: 'blue'
    })
  } catch {
    useToast().add({
      title: 'Facebook Sign Up Failed',
      description: 'Please try again.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchCountries()
  await getUserLocation()
})

watch(country, (newCountry) => {
  if (newCountry) {
    fetchStates(newCountry)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-3 flex items-center justify-center">
    <div class="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/20 border border-white/20 dark:border-slate-800/50 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 w-full" />
      
      <div class="p-2 md:pd-6 lg:p-8 space-y-8">
        <div class="text-center space-y-4">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-20" />
            <div class="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
              <UIcon name="i-heroicons-user-plus" class="w-10 h-10 text-white" />
            </div>
          </div>
          <div class="space-y-2">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Join our community today
            </p>
          </div>
        </div>

        <form @submit.prevent="handleSignUp" class="w-full gap-3 flex flex-col">
          <UFormGroup label="Full Name" required>
            <UInput
              v-model="fullName"
              :disabled="loading"
              trailing-icon="i-heroicons-user"
              placeholder="John Doe"
              size="lg"
              class="rounded-xl w-full"
            />
          </UFormGroup>

          <UFormGroup label="Email Address" required>
            <UInput
              v-model="email"
              :disabled="loading"
              trailing-icon="i-heroicons-envelope"
              placeholder="you@example.com"
              size="lg"
              type="email"
              class="rounded-xl w-full"
            />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-3">
            <UFormGroup label="Password" required>
              <UInput
                v-model="password"
                :disabled="loading"
                :type="passwordVisible ? 'text' : 'password'"
                :trailing-icon="passwordVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                placeholder="Password"
                size="lg"
                class="rounded-xl"
                @trailing-click="passwordVisible = !passwordVisible"
              />
            </UFormGroup>

            <UFormGroup label="Confirm Password" required>
              <UInput
                v-model="confirmPassword"
                :disabled="loading"
                :type="confirmPasswordVisible ? 'text' : 'password'"
                :trailing-icon="confirmPasswordVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                placeholder="Confirm"
                size="lg"
                class="rounded-xl"
                @trailing-click="confirmPasswordVisible = !confirmPasswordVisible"
              />
            </UFormGroup>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <UFormGroup label="Country" required>
              <USelect
                v-model="country"
                :disabled="loading"
                :options="countries"
                placeholder="Select country"
                size="lg"
                class="rounded-xl"
                trailing-icon="i-heroicons-globe-americas"
              >
                <template #leading>
                  <UIcon v-if="ipInfo.country" name="i-heroicons-map-pin" class="w-4 h-4 text-blue-500" />
                </template>
              </USelect>
            </UFormGroup>

            <UFormGroup label="State/Region">
              <USelect
                v-model="state"
                :disabled="loading || !country"
                :options="states"
                placeholder="Select region"
                size="lg"
                class="rounded-xl"
                trailing-icon="i-heroicons-map"
              >
                <template #leading>
                  <UIcon v-if="ipInfo.region" name="i-heroicons-location-marker" class="w-4 h-4 text-indigo-500" />
                </template>
              </USelect>
            </UFormGroup>
          </div>

          <UCheckbox
            v-model="agreeToTerms"
            :disabled="loading"
            class="mt-2"
          >
            <template #default>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                I agree to the 
                <NuxtLink to="/terms" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Terms
                </NuxtLink>
                & 
                <NuxtLink to="/privacy" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Privacy
                </NuxtLink>
              </span>
            </template>
          </UCheckbox>

          <UButton
            type="submit"
            :loading="loading"
            :disabled="loading"
            color="primary"
            variant="solid"
            size="lg"
            class="w-full rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300"
            trailing-icon="i-heroicons-arrow-right"
          >
            <span class="font-medium">
              {{ loading ? 'Creating Account...' : 'Create Account' }}
            </span>
          </UButton>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-700" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">
              Or sign up with
            </span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <UButton
            @click="signInWithGoogle"
            :disabled="loading"
            color="white"
            variant="outline"
            class="rounded-xl h-12 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex items-center justify-center gap-2">
              <UIcon name="i-simple-icons-google" class="w-5 h-5 text-red-500" />
              <span class="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
            </div>
          </UButton>

          <UButton
            @click="signInWithFacebook"
            :disabled="loading"
            color="white"
            variant="outline"
            class="rounded-xl h-12 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex items-center justify-center gap-2">
              <UIcon name="i-simple-icons-facebook" class="w-5 h-5 text-blue-600" />
              <span class="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</span>
            </div>
          </UButton>

          <UButton
            to="/auth/login"
            color="white"
            variant="outline"
            class="rounded-xl h-12 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex items-center justify-center gap-2">
              <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span class="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">Sign In</span>
            </div>
          </UButton>
        </div>

        <div class="sm:hidden space-y-3">
          <UButton
            @click="signInWithGoogle"
            :disabled="loading"
            color="white"
            variant="outline"
            class="w-full rounded-xl h-12 border-gray-300 dark:border-gray-700"
          >
            <div class="flex items-center justify-center gap-3 w-full">
              <UIcon name="i-simple-icons-google" class="w-5 h-5 text-red-500" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Continue with Google</span>
            </div>
          </UButton>
          
          <UButton
            @click="signInWithFacebook"
            :disabled="loading"
            color="white"
            variant="outline"
            class="w-full rounded-xl h-12 border-gray-300 dark:border-gray-700"
          >
            <div class="flex items-center justify-center gap-3 w-full">
              <UIcon name="i-simple-icons-facebook" class="w-5 h-5 text-blue-600" />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Continue with Facebook</span>
            </div>
          </UButton>
        </div>

        <div class="pt-6 border-t border-gray-200/50 dark:border-slate-800/50">
          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <NuxtLink
              to="/auth/login"
              class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors ml-1"
            >
              Sign in here
            </NuxtLink>
          </p>
        </div>

        <div class="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div class="text-sm">
              <p class="font-medium text-blue-800 dark:text-blue-300 mb-1">Secure Registration</p>
              <p class="text-blue-600/80 dark:text-blue-400/80">
                Your information is encrypted and protected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.u-input), :deep(.u-select) {
  transition: all 0.2s ease;
}

:deep(.u-input:focus-within), :deep(.u-select:focus-within) {
  box-shadow: 0 0 0 4px var(--color-primary-100);
  border-color: var(--color-primary-500);
}

.dark :deep(.u-input:focus-within), .dark :deep(.u-select:focus-within) {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  border-color: var(--color-primary-400);
}

:deep(.u-button:hover) {
  transform: translateY(-1px);
}

:deep(*:focus-visible) {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: 0.75rem;
}
</style>