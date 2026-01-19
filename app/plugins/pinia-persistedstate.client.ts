import { defineNuxtPlugin } from '#app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$pinia.use(piniaPluginPersistedstate)

  const userStore = useUserStore()
  userStore.initCrossTabListener()
  const authStore = useAuthStore()
  if (userStore.isAuthenticated) {
    authStore.refreshToken()
    authStore.startAutoRefresh()
  }
})