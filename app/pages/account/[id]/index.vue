<template>
  <div>
    <div v-if="profileData">
      <h2>{{ profileData.name }}</h2>
      <p>{{ profileData.bio }}</p>

      <pre>
listings:
{{ userListings }}
      </pre>

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

const route = useRoute()
const { post } = useApi()
const endpoints = useEndpoints()

const { data: profileData, pending, error } = await useAsyncData(
  `user_profile_${route.params.id}`,
  async () => {
    const response = await post(
      endpoints.user.getById(route.params.id),
      {},
      true
    )
    return response?.success ? response.data : null
  }
)

const {
  data: userListings,
  pending: listingsPending,
  error: listingsError
} = await useAsyncData(
  `user_listings_${route.params.id}`,
  async () => {
    const response = await post(
      endpoints.user.listings(route.params.id),
      {},
      true
    )
    return response?.success ? response.data : null
  }
)

watchEffect(() => {
  if (!profileData.value) return

  useSeo({
    title: profileData.value.name || 'User Profile',
    description:
      profileData.value.bio || 'User profile on Real Estate Directory',
    image: profileData.value.profile_picture_thumbnail || ''
  })
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
