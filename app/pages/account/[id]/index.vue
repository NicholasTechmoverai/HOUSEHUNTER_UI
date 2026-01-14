<template>
  <div>
    <div v-if="profileData">
      <!-- Profile header -->
      <h2>{{ profileData.name }}</h2>
      <p>{{ profileData.bio }}</p>

      <!-- Debug / raw data -->
      <pre class="text-black">{{ profileData }}</pre>
    </div>

    <div v-else>
      No profile data found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import { useEndpoints } from '~/composables/useEndpoints'
import { useSeo } from '~/composables/useSeo'

// Router & API setup
const route = useRoute()
const { post } = useApi()
const endpoints = useEndpoints()

// Fetch user profile with async data
const { data: profileData, pending, error } = await useAsyncData(
  `user_profile_${route.params.id}`,
  async () => {
    try {
      const response = await post(endpoints.user.getById(route.params.id), {}, true)
      return response.success ? response.data : null
    } catch (err) {
      console.error('Error fetching profile:', err)
      return null
    }
  }
)

// Update SEO dynamically when profile data is available
watchEffect(() => {
  if (profileData.value) {
    useSeo({
      title: profileData.value.name || 'User Profile',
      description: profileData.value.bio || 'User profile on Real Estate Directory',
      image: profileData.value.profile_picture_thumbnail || ''
    })
  }
})
</script>

<style scoped>
pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
</style>
