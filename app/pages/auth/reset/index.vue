<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const code = ref<string[]>(Array(6).fill(''))
const message = ref('Enter your email to receive a verification code')
const messageType = ref<'error' | 'success' | 'info'>('info')
const codeDisabled = ref(true)
const loading = ref(false)
const isEmailVerified = ref(false)
const resendLoading = ref(false)
const verifyLoading = ref(false)
const countdown = ref(0)
const timer = ref<NodeJS.Timeout | null>(null)

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const startCountdown = () => {
  countdown.value = 60
  if (timer.value) clearInterval(timer.value)
  timer.value = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      if (timer.value) clearInterval(timer.value)
    }
  }, 1000)
}

const sendVerificationCode = async () => {
  if (!validateEmail(email.value)) {
    message.value = 'Please enter a valid email address'
    messageType.value = 'error'
    return
  }

  loading.value = true
  message.value = 'Sending verification code...'
  messageType.value = 'info'
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    isEmailVerified.value = true
    codeDisabled.value = false
    message.value = 'Verification code sent to your email'
    messageType.value = 'success'
    startCountdown()
  } catch {
    message.value = 'Failed to send verification code'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const resendCode = async () => {
  if (countdown.value > 0 || !isEmailVerified.value) return
  
  resendLoading.value = true
  message.value = 'Resending code...'
  messageType.value = 'info'
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1200))
    message.value = 'New verification code sent'
    messageType.value = 'success'
    startCountdown()
  } catch {
    message.value = 'Failed to resend code'
    messageType.value = 'error'
  } finally {
    resendLoading.value = false
  }
}

const verifyCode = async () => {
  const verificationCode = code.value.join('')
  if (verificationCode.length !== 6) {
    message.value = 'Please enter the complete 6-digit code'
    messageType.value = 'error'
    return
  }

  verifyLoading.value = true
  message.value = 'Verifying your code...'
  messageType.value = 'info'
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    message.value = 'Verification successful! Redirecting...'
    messageType.value = 'success'
    setTimeout(() => {
      navigateTo('/auth/reset-password')
    }, 1500)
  } catch {
    message.value = 'Invalid verification code. Please try again.'
    messageType.value = 'error'
  } finally {
    verifyLoading.value = false
  }
}

const resetForm = () => {
  email.value = ''
  code.value = Array(6).fill('')
  isEmailVerified.value = false
  codeDisabled.value = true
  message.value = 'Enter your email to receive a verification code'
  messageType.value = 'info'
  if (timer.value) clearInterval(timer.value)
  countdown.value = 0
}

const handleEmailSubmit = async () => {
  if (isEmailVerified.value) {
    await verifyCode()
  } else {
    await sendVerificationCode()
  }
}

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-3 flex items-center justify-center">
    <div class="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/20 border border-white/20 dark:border-slate-800/50 overflow-hidden">
      <!-- Header with gradient accent -->
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 w-full" />
      
      <div class="p-2 md:p-6 lg:p-8 space-y-8">
        <!-- Logo & Title -->
        <div class="text-center space-y-4">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-20" />
            <div class="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
              <UIcon name="i-heroicons-lock-closed" class="w-10 h-10 text-white" />
            </div>
          </div>
          <div class="space-y-2">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Secure Password Reset
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              We'll send a 6-digit code to your email
            </p>
          </div>
        </div>

        <!-- Status Message -->
        <Transition name="fade-slide" mode="out-in">
          <UAlert 
            v-if="message"
            :color="messageType"
            :icon="{
              info: 'i-heroicons-information-circle',
              success: 'i-heroicons-check-circle',
              error: 'i-heroicons-exclamation-circle'
            }[messageType]"
            :title="message"
            :variant="messageType === 'info' ? 'subtle' : 'soft'"
            class="rounded-xl border-l-4"
            :class="{
              'border-blue-500': messageType === 'info',
              'border-green-500': messageType === 'success',
              'border-red-500': messageType === 'error'
            }"
          />
        </Transition>

        <!-- Email Input -->
        <div class="space-y-2">
          <UFormGroup label="Email Address" :required="!isEmailVerified">
            <UInput
              v-model="email"
              :loading="loading"
              :disabled="loading || isEmailVerified"
              :trailing-icon="isEmailVerified ? 'i-heroicons-check-circle' : 'i-heroicons-envelope'"
              :trailing-icon-class="isEmailVerified ? 'text-green-500 dark:text-green-400' : 'text-gray-400'"
              placeholder="you@example.com"
              size="lg"
              type="email"
              @keyup.enter="handleEmailSubmit"
              class="rounded-xl w-full"
              :ui="{
                rounded: 'rounded-xl',
                color: {
                  gray: {
                    outline: 'dark:bg-slate-800/50'
                  }
                }
              }"
            >
              <template #trailing>
                <div v-if="loading" class="flex items-center">
                  <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                </div>
              </template>
            </UInput>
          </UFormGroup>
        </div>

        <!-- Code Input (Slide in) -->
        <Transition name="slide-fade">
          <div v-if="isEmailVerified" class="space-y-4">
            <UFormGroup label="Verification Code" required>
              <div class="space-y-3">
                <UPinInput
                  v-model="code"
                  :disabled="codeDisabled || verifyLoading"
                  :length="6"
                  size="lg"
                  autocomplete="one-time-code"
                  class="justify-center"
                  :ui="{
                    size: {
                      lg: 'text-lg h-14 w-14'
                    },
                    rounded: 'rounded-xl'
                  }"
                  @complete="verifyCode"
                />
                <div class="flex items-center justify-between text-sm">
                  <UButton
                    @click="resendCode"
                    :disabled="resendLoading || countdown > 0"
                    variant="link"
                    color="primary"
                    size="sm"
                    class="p-0 h-auto"
                  >
                    <UIcon 
                      v-if="resendLoading" 
                      name="i-heroicons-arrow-path" 
                      class="w-3 h-3 mr-1 animate-spin" 
                    />
                    <span v-else-if="countdown > 0" class="flex items-center gap-1">
                      <UIcon name="i-heroicons-clock" class="w-3 h-3" />
                      {{ countdown }}s
                    </span>
                    <span v-else class="flex items-center gap-1">
                      <UIcon name="i-heroicons-arrow-path" class="w-3 h-3" />
                      Resend code
                    </span>
                  </UButton>
                  <span class="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <UIcon name="i-heroicons-shield-exclamation" class="w-3 h-3" />
                    Expires in 10min
                  </span>
                </div>
              </div>
            </UFormGroup>
          </div>
        </Transition>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <UButton
            @click="handleEmailSubmit"
            :loading="loading || verifyLoading"
            :disabled="(!email || !validateEmail(email)) && !isEmailVerified"
            color="primary"
            variant="solid"
            size="lg"
            class="w-full rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300"
            :trailing-icon="isEmailVerified ? 'i-heroicons-arrow-right' : 'i-heroicons-paper-airplane'"
          >
            <span class="font-medium">
              {{ verifyLoading ? 'Verifying...' : loading ? 'Sending...' : isEmailVerified ? 'Verify Code' : 'Send Code' }}
            </span>
          </UButton>

          <div class="grid grid-cols-2 gap-3">
            <UButton
              @click="resetForm"
              variant="outline"
              color="gray"
              class="rounded-xl h-11"
              trailing-icon="i-heroicons-arrow-path"
            >
              Start Over
            </UButton>
            <UButton
              to="/auth/login"
              variant="outline"
              color="gray"
              class="rounded-xl h-11"
              trailing-icon="i-heroicons-arrow-left"
            >
              Back to Login
            </UButton>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-6 border-t border-gray-200/50 dark:border-slate-800/50">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">
              Need help?
            </span>
            <NuxtLink 
              to="/support" 
              class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-1"
            >
              <UIcon name="i-heroicons-question-mark-circle" class="w-4 h-4" />
              Contact Support
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

:deep(.pin-input-container) {
  gap: 0.75rem;
}

:deep(.pin-input) {
  height: 3.5rem;
  width: 3.5rem;
  font-size: 1.25rem;
  border-radius: 1rem;
  border: 2px solid var(--color-gray-200);
  background: white;
  transition: all 0.2s ease;
  font-weight: 600;
  color: var(--color-gray-900);
}

:deep(.pin-input:focus) {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 4px var(--color-primary-100);
  transform: translateY(-2px);
  outline: none;
}

:deep(.pin-input:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

.dark :deep(.pin-input) {
  border-color: var(--color-gray-700);
  background: var(--color-gray-800);
  color: var(--color-gray-100);
}

.dark :deep(.pin-input:focus) {
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}
</style>