<template>
  <div>
    <div v-if="profileData">
      <h2>{{ profileData.name }}</h2>
      <p>{{ profileData.bio }}</p>
      <pre class="text-black">{{ profileData }}</pre>
    </div>

    <div v-else>
      No profile data found.
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEndpoints } from '~/composables/useEndpoints'
import { watch } from 'vue'
import { useSeo } from '~/composables/useSeo'

const route = useRoute()
const { post } = useApi()
const endpoints = useEndpoints()

const { data: profileData, pending, error } = await useAsyncData(
  `user_profile_${route.params.id}`,
  async () => {
    try {
      const response = await post(
        endpoints.user.getById(route.params.id),
        {},
        true
      )
      return response.success ? response.data : null
    } catch (err) {
      console.error('Error fetching profile:', err)
      return null
    }
  }
)

// Update SEO reactively when data arrives
watch(profileData, (newData) => {
  if (!newData) return
  useSeo({
    title: newData.displayName || 'User Profile',
    description: newData.bio || 'View user profile on HouseHunter.',
    image: newData.profile_picture
  })
}, { immediate: true })
</script>

<style scoped>
pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
</style>
