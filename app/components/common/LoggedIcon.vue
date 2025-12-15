<template>
  <div v-if="userStore.user">
    <UAvatar
      :src="userStore.user.profile_picture"
      :alt="userStore.user.username || 'User avatar'"
    />
  </div>

  <div v-else>
    <UButton
      icon="i-lucide-rocket"
      color="neutral"
      variant="outline"
      :ui="{ leadingIcon: 'text-primary' }"
      @click="login"
    >
      Login
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { useUserStore, useAuthStore } from '#imports'

const userStore = useUserStore()
const authStore = useAuthStore()

const login = async () => {
  authStore.setLastAttemptedRouteToCurrent()
  await authStore.handleGoogleLogin()
}
</script>
