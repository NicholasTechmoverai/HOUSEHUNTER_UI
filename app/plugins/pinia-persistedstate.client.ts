// plugins/pinia-persistedstate.client.ts
import { defineNuxtPlugin } from '#app'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  // Register the persisted state plugin
  nuxtApp.$pinia.use(piniaPluginPersistedstate)
  
  // Now initialize store-specific listeners
  const userStore = useUserStore()
  userStore.initCrossTabListener()
})