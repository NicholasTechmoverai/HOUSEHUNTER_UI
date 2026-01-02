<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const passwordVisible = ref(false)

const userStore = useUserStore()
const toast = useToast()

const validateForm = (): string | null => {
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
  const validationError = validateForm()
  if (validationError) {
    toast.add({
      title: 'Validation Error',
      description: validationError,
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    })
    return
  }

  loading.value = true

  try {
    const res = await userStore.login({
      email: email.value,
      password: password.value,
      remember_me: rememberMe.value
    })

    if (!res?.success) {
      toast.add({
        title: 'Login Failed',
        description: res?.message || 'Login failed. Please try again.',
        icon: 'i-heroicons-exclamation-circle',
        color: 'error'
      })
      return
    }

    toast.add({
      title: res.message || 'Login Successful',
      description: 'Welcome back!',
      icon: 'i-heroicons-check-circle',
      color: 'success'
    })

    if (res.redirectTo) {
      await navigateTo(res.redirectTo)
    }
  } catch (err) {
    console.error('Login error:', err)

    toast.add({
      title: 'Login Failed',
      description: 'Error during login. Please check your credentials and try again.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const socialSignIn = async (
  provider: 'Google' | 'Facebook',
  icon: string
) => {
  loading.value = true

  try {
    provider == 'Google' ? useAuthStore().handleGoogleLogin() : useAuthStore().handleFacebookLogin()
    toast.add({
      title: `${provider} Sign In`,
      description: `Redirecting to ${provider}...`,
      icon,
      color: 'info'
    })
  } catch (err) {
    console.error(`${provider} sign-in error:`, err)

    toast.add({
      title: `${provider} Sign In Failed`,
      description: 'Please try again.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const signInWithGoogle = () => socialSignIn('Google', 'i-simple-icons-google')
const signInWithFacebook = () => socialSignIn('Facebook', 'i-simple-icons-facebook')
</script>
<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-start/5 via-brand-middle/5 to-brand-end/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-2 sm:p-4 flex items-center justify-center">
    <!-- Animated background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-brand-start/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-brand-end/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 sm:w-80 h-60 sm:h-80 bg-brand-middle/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative w-full max-w-md sm:max-w-md z-10 mx-2 sm:mx-4"> 
      <!-- Glass card - removed rounded borders -->
      <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl shadow-brand-start/10 dark:shadow-black/30 border border-white/40 dark:border-gray-700/50 overflow-hidden">
        <!-- Gradient accent line using brand colors -->
        <div class="h-1.5 w-full bg-gradient-to-r from-brand-start via-brand-middle to-brand-end" />

        <div class="p-4 sm:p-6 md:p-8 space-y-6">
          <!-- Header -->
          <div class="text-center space-y-4">
            <!-- Logo/Icon -->
            <div class="relative inline-flex">
              <div class="absolute inset-0 bg-gradient-to-r from-brand-start to-brand-end blur-xl opacity-20 animate-pulse" />
              <div class="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-start to-brand-middle flex items-center justify-center mx-auto shadow-lg shadow-brand-start/20">
                <UIcon name="i-heroicons-lock-closed" class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            
            <div class="space-y-2">
              <h1 class="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-brand-start via-brand-middle to-brand-end bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium px-2">
                Sign in to continue to your account
              </p>
            </div>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Email -->
            <div class="space-y-1.5">
              <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                Email Address
                <span class="text-red-500">*</span>
              </label>
              <UInput v-model="email" :disabled="loading" 
                placeholder="you@example.com" 
                size="md" 
                type="email"
                icon="i-heroicons-envelope"
                :ui="{
                  rounded: 'sm:rounded-lg',
                  padding: { 
                    sm: 'px-3 py-2',
                    lg: 'px-4 py-3' 
                  },
                  color: {
                    gray: {
                      outline: 'dark:bg-gray-700/50 bg-gray-50 border-gray-200 dark:border-gray-600 focus:border-brand-start focus:ring-brand-start/20'
                    }
                  }
                }"
                class="w-full transition-all duration-200"
              />
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <label class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                Password
                <span class="text-red-500">*</span>
              </label>
              <UInput v-model="password" :disabled="loading" 
                placeholder="••••••••" 
                :type="passwordVisible ? 'text' : 'password'"
                size="md"
                :ui="{
                  rounded: 'sm:rounded-lg',
                  padding: { 
                    sm: 'px-3 py-2',
                    lg: 'px-4 py-3' 
                  },
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
                    size="md"
                    :icon="passwordVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                    :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
                    @click="passwordVisible = !passwordVisible"
                    class="hover:bg-gray-100 dark:hover:bg-gray-700 px-3"
                  />
                </template>
              </UInput>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
              <div class="flex items-center gap-2">
                <UCheckbox 
                  v-model="rememberMe" 
                  :disabled="loading" 
                  :ui="{
                    background: 'bg-white dark:bg-gray-700',
                    border: 'border-gray-300 dark:border-gray-600',
                    ring: 'focus-visible:ring-2 focus-visible:ring-brand-start focus-visible:ring-offset-2'
                  }"
                />
                <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </div>
              <NuxtLink 
                to="/auth/forgot-password"
                class="text-xs sm:text-sm font-medium text-brand-start hover:text-brand-end dark:text-brand-middle dark:hover:text-brand-start transition-all duration-200 hover:underline self-end sm:self-auto"
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
              size="md"
              :ui="{
                rounded: 'sm:rounded-lg',
                padding: { 
                  sm: 'px-4 py-2.5',
                  lg: 'px-6 py-3.5' 
                }
              }"
              class="w-full bg-gradient-to-r from-brand-start via-brand-middle to-brand-end hover:from-brand-start/90 hover:via-brand-middle/90 hover:to-brand-end/90 shadow-lg shadow-brand-start/20 hover:shadow-brand-start/30 transition-all duration-300"
            >
              <template #leading>
                <UIcon v-if="!loading" name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4 sm:w-5 sm:h-5" />
              </template>
              <span class="font-semibold text-sm sm:text-base">
                {{ loading ? 'Signing in...' : 'Sign In' }}
              </span>
            </UButton>
          </form>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-3 bg-white dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <!-- Social Login - Stack on small screens -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <UButton 
              @click="signInWithGoogle" 
              :disabled="loading" 
              color="white" 
              variant="outline"
              :ui="{
                rounded: 'sm:rounded-lg',
                padding: { 
                  sm: 'px-3 py-2',
                  lg: 'px-4 py-3' 
                }
              }"
              class="border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              <div class="flex items-center justify-center gap-2 sm:gap-3 w-full">
                <UIcon name="i-simple-icons-google" class="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                <span class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
              </div>
            </UButton>

            <UButton 
              @click="signInWithFacebook" 
              :disabled="loading" 
              color="white" 
              variant="outline"
              :ui="{
                rounded: 'sm:rounded-lg',
                padding: { 
                  sm: 'px-3 py-2',
                  lg: 'px-4 py-3' 
                }
              }"
              class="border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              <div class="flex items-center justify-center gap-2 sm:gap-3 w-full">
                <UIcon name="i-simple-icons-facebook" class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-500" />
                <span class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</span>
              </div>
            </UButton>
          </div>

          <!-- Registration Link -->
          <div class="pt-4 text-center">
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?
              <NuxtLink 
                to="/auth/register"
                class="font-semibold text-brand-start hover:text-brand-end dark:text-brand-middle dark:hover:text-brand-start transition-all duration-200 ml-1 hover:underline"
              >
                Sign up now
              </NuxtLink>
            </p>
          </div>
        </div>

        <!-- Security Footer -->
        <div class="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-brand-start/5 via-brand-middle/5 to-brand-end/5 dark:from-gray-700/20 dark:to-gray-700/10 border-t border-gray-100 dark:border-gray-700/50">
          <div class="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-lock-closed" class="w-3 h-3 sm:w-4 sm:h-4 text-brand-start dark:text-brand-middle" />
              <span>256-bit SSL encryption</span>
            </div>
            <span class="hidden sm:inline">•</span>
            <span>Secure login</span>
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