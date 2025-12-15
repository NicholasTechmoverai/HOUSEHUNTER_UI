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
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-6 flex items-center justify-center">
    <!-- Animated background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative w-full max-w-md z-10">
      <!-- Glass card -->
      <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 dark:shadow-black/30 border border-white/40 dark:border-gray-700/50 overflow-hidden">
        <!-- Gradient accent line -->
        <div class="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div class="p-6 md:p-8 space-y-7">
          <!-- Header -->
          <div class="text-center space-y-5">
            <!-- Logo/Icon -->
            <div class="relative inline-flex">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
              <div class="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
                <UIcon name="i-heroicons-lock-closed" class="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div class="space-y-3">
              <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p class="text-sm text-gray-600 dark:text-gray-300 font-medium">
                Sign in to continue to your account
              </p>
            </div>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Email -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                Email Address
                <span class="text-red-500">*</span>
              </label>
              <UInput v-model="email" :disabled="loading" 
                placeholder="you@example.com" 
                size="lg" 
                type="email"
                icon="i-heroicons-envelope"
                :ui="{
                  rounded: 'rounded-xl',
                  padding: { lg: 'px-4 py-3' },
                  color: {
                    gray: {
                      outline: 'dark:bg-gray-700/50 bg-gray-50 border-gray-200 dark:border-gray-600'
                    }
                  }
                }"
                class="w-full transition-all duration-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
              />
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                Password
                <span class="text-red-500">*</span>
              </label>
              <UInput v-model="password" :disabled="loading" 
                placeholder="••••••••" 
                :type="passwordVisible ? 'text' : 'password'"
                size="lg"
                :ui="{
                  rounded: 'rounded-xl',
                  padding: { lg: 'px-4 py-3' },
                  color: {
                    gray: {
                      outline: 'dark:bg-gray-700/50 bg-gray-50 border-gray-200 dark:border-gray-600'
                    }
                  }
                }"
                class="w-full transition-all duration-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
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
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between pt-2">
              <div class="flex items-center gap-2">
                <UCheckbox 
                  v-model="rememberMe" 
                  :disabled="loading" 
                  :ui="{
                    background: 'bg-white dark:bg-gray-700',
                    border: 'border-gray-300 dark:border-gray-600',
                    ring: 'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                  }"
                />
                <span class="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </div>
              <NuxtLink 
                to="/auth/forgot-password"
                class="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-200 hover:underline"
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
              size="lg"
              :ui="{
                rounded: 'rounded-xl',
                padding: { lg: 'px-6 py-3.5' }
              }"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <template #leading>
                <UIcon v-if="!loading" name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
              </template>
              <span class="font-semibold text-base">
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
              <span class="px-4 bg-white dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-3">
            <UButton 
              @click="signInWithGoogle" 
              :disabled="loading" 
              color="white" 
              variant="outline"
              :ui="{
                rounded: 'rounded-xl',
                padding: { lg: 'px-4 py-3' }
              }"
              class="border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              <div class="flex items-center justify-center gap-3 w-full">
                <UIcon name="i-simple-icons-google" class="w-5 h-5 text-red-500" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
              </div>
            </UButton>

            <UButton 
              @click="signInWithFacebook" 
              :disabled="loading" 
              color="white" 
              variant="outline"
              :ui="{
                rounded: 'rounded-xl',
                padding: { lg: 'px-4 py-3' }
              }"
              class="border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
            >
              <div class="flex items-center justify-center gap-3 w-full">
                <UIcon name="i-simple-icons-facebook" class="w-5 h-5 text-blue-600 dark:text-blue-500" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</span>
              </div>
            </UButton>
          </div>

          <!-- Registration Link -->
          <div class="pt-4 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?
              <NuxtLink 
                to="/auth/register"
                class="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-200 ml-1 hover:underline"
              >
                Sign up now
              </NuxtLink>
            </p>
          </div>
        </div>

        <!-- Security Footer -->
        <div class="px-6 md:px-8 py-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-700/30 dark:to-gray-700/20 border-t border-gray-100 dark:border-gray-700/50">
          <div class="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>256-bit SSL encryption • Secure login</span>
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