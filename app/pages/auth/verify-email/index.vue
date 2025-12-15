<template>
  <EmailVerification
    :email="userEmail"
    :disabled="editDisabled"
    :description="verificationDescription"
    :g_loading="loading"
    :errorMessage="errorMessage"
    :successMessage="successMessage"
    @submit="handleVerification"
    @resend="handleResendCode"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '#imports' // ✅ SAFE in Nuxt 3

const toast = useToast()
const authStore = useAuthStore()

const userEmail = ref('')
const editDisabled = ref(false)
const loading = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

const verificationDescription =
  'We sent a 6-digit code to your email address. Enter it below to verify your account.'

onMounted(() => {
  if (!authStore.hasVerificationInfo) return

  const verification = authStore.getVerification('email')
  if (verification?.identifier) {
    userEmail.value = verification.identifier
    editDisabled.value = true
    handleResendCode()
  }
})

const showToast = (
  title: string,
  description: string,
  color: 'success' | 'error' = 'success'
) => {
  toast.add({ title, description, color })
}

const handleVerification = async (code: [],email: string) => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await authStore.verifyCode({
      identifier: email,
      type: 'email',
      code
    })

    if (!response?.success) {
      throw new Error(response?.message || 'Verification failed')
    }

    successMessage.value =
      response.message || 'Your email has been verified successfully'

    showToast('Email verified', successMessage.value)
  } catch (err: any) {
    console.error(err)
    errorMessage.value = err.detail || err?.message || 'Invalid or expired code'
    showToast('Verification failed', errorMessage.value, 'error')
  } finally {
    loading.value = false
  }
}

const handleResendCode = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await authStore.resendVerificationCode(
      'email',
      userEmail.value
    )

    if (!response?.success) {
      throw new Error(response?.message || 'Resend failed')
    }

    successMessage.value =
      response.message || 'A new verification code has been sent'

    showToast('Code sent', successMessage.value, 'success')
  } catch (err: any) {
    errorMessage.value = err?.message || 'Unable to resend code'
    showToast('Resend failed', errorMessage.value, 'error')
  } finally {
    loading.value = false
  }
}
</script>
