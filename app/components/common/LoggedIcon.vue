<template>
  <div v-if="userStore.user" class="cursor-pointer ">
    <UPopover arrow>
      <UAvatar :src="userStore.user.profile_picture" :alt="userStore.user.username || 'User avatar'" />

      <template #content>
        <div class="flex flex-col gap-2 p-2 min-w-[200px]">
          <UButton icon="i-lucide-user" variant="outline" @click="$router.push('/account')" :label="userStore.user?.display_name" />
          <UButton icon="i-lucide-log-out" color="error" variant="outline" @click="userStore.logout()" label="Logout" />
        </div>
      </template>
    </UPopover>

  </div>

  <div v-else>
    <UFieldGroup class="cursor-pointer">

      <UButton icon="i-lucide-rocket" color="neutral" variant="outline" :ui="{ leadingIcon: 'text-primary' }"
        label="Login" @click="$router.push('/auth/login')" />

      <UButton @click="login" color="neutral" variant="outline" icon="i-simple-icons-google" class="text-orange-400" />

    </UFieldGroup>
  </div>
</template>

<script setup lang="ts">

const userStore = useUserStore()
const authStore = useAuthStore()

const login = async () => {
  authStore.setLastAttemptedRouteToCurrent()
  await authStore.handleGoogleLogin()
}
</script>
