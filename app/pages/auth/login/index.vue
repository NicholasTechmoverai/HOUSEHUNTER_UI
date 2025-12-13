<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const passwordVisible = ref(false)
const userStore = useUserStore()

const validateForm = () => {
  if (!email.value || !password.value) {
    return 'Please fill in all fields'
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    return 'Please enter a valid email address'
  }
  
  if (password.value.length < 6) {
    return 'Password must be at least 6 characters'
  }
  
  return null
}

const handleLogin = async () => {
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
    await userStore.login({ email: email.value, password: password.value, remember_me: rememberMe.value })
    
    useToast().add({
      title: 'Login Successful',
      description: 'Welcome back!',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
    
    navigateTo('/dashboard')
  } catch (error) {
    useToast().add({
      title: 'Login Failed',
      description: 'Invalid credentials. Please try again.',
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
      title: 'Google Sign In',
      description: 'Redirecting to Google...',
      icon: 'i-simple-icons-google',
      color: 'blue'
    })
  } catch (error) {
    useToast().add({
      title: 'Google Sign In Failed',
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
      title: 'Facebook Sign In',
      description: 'Redirecting to Facebook...',
      icon: 'i-simple-icons-facebook',
      color: 'blue'
    })
  } catch (error) {
    useToast().add({
      title: 'Facebook Sign In Failed',
      description: 'Please try again.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

const signInWithGithub = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    useToast().add({
      title: 'GitHub Sign In',
      description: 'Redirecting to GitHub...',
      icon: 'i-simple-icons-github',
      color: 'gray'
    })
  } catch (error) {
    useToast().add({
      title: 'GitHub Sign In Failed',
      description: 'Please try again.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-3   flex items-center justify-center">
    <div class="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/20 border border-white/20 dark:border-slate-800/50 overflow-hidden">
      <!-- Header with gradient accent -->
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 w-full" />
      
      <div class="p-2 md:pd-6 lg:p-8 space-y-8">
        <!-- Logo & Title -->
        <div class="text-center space-y-4">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-20" />
            <div class="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
              <UIcon name="i-heroicons-user-circle" class="w-10 h-10 text-white" />
            </div>
          </div>
          <div class="space-y-2">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="w-full gap-3 flex flex-col">
          <!-- Email -->
          <UFormGroup label="Email Address" required>
            <UInput
              v-model="email"
              :disabled="loading"
              trailing-icon="i-heroicons-envelope"
              placeholder="you@example.com"
              size="lg"
              type="email"
              class="rounded-xl w-full"
              :ui="{
                rounded: 'rounded-xl',
                color: {
                  gray: {
                    outline: 'dark:bg-slate-800/50'
                  }
                }
              }"
            />
          </UFormGroup>

          <!-- Password -->
          <UFormGroup label="Password" required>
            <UInput
              v-model="password"
              :disabled="loading"
              :type="passwordVisible ? 'text' : 'password'"
              :trailing-icon="passwordVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
              placeholder="Enter your password"
              size="lg"
              class="rounded-xl"
              :ui="{
                rounded: 'rounded-xl',
                color: {
                  gray: {
                    outline: 'dark:bg-slate-800/50'
                  }
                }
              }"
              @trailing-click="passwordVisible = !passwordVisible"
            />
          </UFormGroup>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <UCheckbox
              v-model="rememberMe"
              :disabled="loading"
              label="Remember me"
              class="text-sm"
            />
            <NuxtLink
              to="/auth/forgot-password"
              class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              Forgot password?
            </NuxtLink>
          </div>

          <!-- Login Button -->
          <UButton
            type="submit"
            :loading="loading"
            :disabled="!email || !password || loading"
            color="primary"
            variant="solid"
            size="lg"
            class="w-full rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300"
            trailing-icon="i-heroicons-arrow-right"
          >
            <span class="font-medium">
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </span>
          </UButton>
        </form>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <!-- Social Login Buttons -->
        <div class="grid grid-cols-3 gap-3">
          <!-- Google -->
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

          <!-- Facebook -->
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

          <!-- GitHub -->
          <UButton
            @click="signInWithGithub"
            :disabled="loading"
            color="white"
            variant="outline"
            class="rounded-xl h-12 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex items-center justify-center gap-2">
              <UIcon name="i-simple-icons-github" class="w-5 h-5 text-gray-900 dark:text-gray-100" />
              <span class="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</span>
            </div>
          </UButton>
        </div>

        <!-- Alternative Social Login (Mobile optimized) -->
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

        <!-- Registration Link -->
        <div class="pt-6 border-t border-gray-200/50 dark:border-slate-800/50">
          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <NuxtLink
              to="/auth/register"
              class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors ml-1"
            >
              Sign up now
            </NuxtLink>
          </p>
        </div>

        <!-- Security Notice -->
        <div class="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
          <div class="flex items-start gap-3">
            <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div class="text-sm">
              <p class="font-medium text-blue-800 dark:text-blue-300 mb-1">Secure Login</p>
              <p class="text-blue-600/80 dark:text-blue-400/80">
                Your information is protected with 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.u-input) {
  transition: all 0.2s ease;
}

:deep(.u-input:focus-within) {
  box-shadow: 0 0 0 4px var(--color-primary-100);
  border-color: var(--color-primary-500);
}

.dark :deep(.u-input:focus-within) {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  border-color: var(--color-primary-400);
}

/* Social button hover effects */
:deep(.social-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark :deep(.social-button:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Smooth transitions */
.u-button,
.u-input,
.u-checkbox {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus styles for accessibility */
:deep(*:focus-visible) {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: 0.75rem;
}
</style>