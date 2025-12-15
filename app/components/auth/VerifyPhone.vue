<template>
  <div class="w-full max-w-md mx-auto mt-4">
    <!-- Header -->
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Verify Your Email
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        {{ description }}
      </p>
    </div>

    <!-- Verification Form -->
    <UCard class="border border-gray-200 dark:border-gray-800">
      <!-- Email Display -->
      <div class="mb-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-at-symbol" class="w-4 h-4 text-gray-500" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ maskedEmail }}
            </span>
          </div>
          <UBadge color="gray" variant="subtle" size="sm">
            Code expires in 10 minutes
          </UBadge>
        </div>
      </div>

      <!-- Code Input -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Enter 6-digit verification code
          </label>
          <UPinInput
            v-model="code"
            :disabled="disabled || loading"
            :autofocus="true"
            :length="6"
            placeholder="•"
            class="justify-center"
            :ui="{ 
              base: 'w-12 h-14 text-center text-xl font-semibold',
              ring: 'focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400'
            }"
            @complete="handleAutoSubmit"
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
            <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 flex-shrink-0" />
            <span class="text-sm">{{ error }}</span>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex items-center gap-2 text-green-600 dark:text-green-400">
            <UIcon name="i-heroicons-check-circle" class="w-4 h-4 flex-shrink-0" />
            <span class="text-sm">{{ success }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <UButton
            type="button"
            :disabled="disabled || loading"
            :loading="loading"
            color="primary"
            variant="solid"
            class="flex-1"
            @click="handleSubmit"
          >
            <template #leading>
              <UIcon name="i-heroicons-check" class="w-4 h-4" />
            </template>
            Verify Email
          </UButton>

          <UButton
            type="button"
            :disabled="disabled || resendCooldown > 0"
            color="gray"
            variant="ghost"
            @click="handleResend"
            class="flex-1"
          >
            <template #leading>
              <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
            </template>
            {{ resendButtonText }}
          </UButton>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div class="space-y-3">
          <div class="flex items-start gap-2">
            <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Check your spam folder if you don't see the email. The code is case-sensitive.
            </p>
          </div>
          
          <div v-if="resendCooldown > 0" class="flex items-center gap-2 text-sm">
            <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-400" />
            <span class="text-gray-500 dark:text-gray-400">
              Resend available in {{ formatTime(resendCooldown) }}
            </span>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  email: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: 'Enter the verification code sent to your email to verify your account.'
  },
  autoSubmit: {
    type: Boolean,
    default: true
  },
  resendCooldownSeconds: {
    type: Number,
    default: 60
  }
})

const emit = defineEmits<{
  resend: []
  submit: [code: string]
  success: []
  error: [message: string]
}>()

const code = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const resendCooldown = ref(0)
const countdownInterval = ref<NodeJS.Timeout | null>(null)

const maskedEmail = computed(() => {
  if (!props.email) return ''
  const [username, domain] = props.email.split('@')
  if (!username || !domain) return props.email
  
  const maskedUsername = username.length > 2 
    ? `${username[0]}${'*'.repeat(username.length - 2)}${username[username.length - 1]}`
    : username
  return `${maskedUsername}@${domain}`
})

const resendButtonText = computed(() => {
  if (resendCooldown.value > 0) {
    return `Resend (${resendCooldown.value}s)`
  }
  return 'Resend Code'
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleAutoSubmit = () => {
  if (props.autoSubmit && code.value.length === 6) {
    handleSubmit()
  }
}

const handleSubmit = async () => {
  if (code.value.length !== 6) {
    error.value = 'Please enter the complete 6-digit code'
    return
  }

  if (!/^\d{6}$/.test(code.value)) {
    error.value = 'Code must contain only numbers'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    emit('submit', code.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Verification failed'
    emit('error', error.value)
  } finally {
    loading.value = false
  }
}

const handleResend = () => {
  if (resendCooldown.value > 0) return
  
  error.value = ''
  success.value = 'Verification code resent successfully!'
  
  emit('resend')
  startResendCooldown()
}

const startResendCooldown = () => {
  resendCooldown.value = props.resendCooldownSeconds
  
  countdownInterval.value = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--
    } else {
      clearInterval(countdownInterval.value!)
      countdownInterval.value = null
    }
  }, 1000)
}

const clearCode = () => {
  code.value = ''
  error.value = ''
  success.value = ''
}

const setError = (message: string) => {
  error.value = message
  success.value = ''
}

const setSuccess = (message: string) => {
  success.value = message
  error.value = ''
}

onMounted(() => {
  startResendCooldown()
})

onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})

defineExpose({
  clearCode,
  setError,
  setSuccess
})
</script>

<style scoped>
/* :deep(.pin-input-container) {
  @apply gap-3;
}

:deep(.pin-input-input) {
  @apply transition-all duration-200;
}

:deep(.pin-input-input:focus) {
  @apply ring-2 ring-primary-500 dark:ring-primary-400 border-primary-500 dark:border-primary-400;
} */
</style>