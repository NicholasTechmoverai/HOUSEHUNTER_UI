<template>
  <UPageCard
    spotlight
    class="
      w-full
      lg:w-[400px]
      xl:w-[420px]
    "
  >
    <!-- HEADER -->
    <template #header>
      <div
        class="
          flex flex-col gap-3
          sm:flex-row sm:items-center
          w-full
        "
      >
        <div class="flex items-center gap-3">
          <UIcon
            name="i-heroicons-home-modern"
            class="w-6 h-6 text-purple-600 dark:text-purple-400"
          />
          <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Your Properties
          </h2>
        </div>

        <UButton
          to="/create/rental"
          color="primary"
          variant="ghost"
          size="sm"
          icon="i-heroicons-plus"
          class="sm:ml-auto self-start sm:self-auto"
        >
          Add New
        </UButton>
      </div>
    </template>

    <!-- LIST -->
    <UScrollArea
      v-if="items.length"
      v-slot="{ item }"
      :items="items"
      :virtualize="{ estimateSize: 104 }"
      class="h-[70vh] sm:h-96"
    >
      <UCard
       :to="`/rentals/${item.category}/${item.public_id}`"
        class="
          flex flex-col gap-3
          sm:flex-row sm:gap-4 sm:items-start
          border border-gray-100 dark:border-gray-800
          hover:bg-gray-50 dark:hover:bg-gray-900/40
          transition
        "
      >
        <!-- IMAGE -->
        <img
          :src="item.profile_picture || placeholderImage"
          class="
            w-full h-40
            sm:w-20 sm:h-20
            rounded-lg object-cover
          "
          loading="lazy"
          @error="handleImageError"
        />

        <!-- CONTENT -->
        <div class="flex-1">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-semibold text-gray-900 dark:text-white truncate">
              {{ item.slug }}
            </h3>

            <UBadge
              v-if="item.status"
              :color="getStatusColor(item.status)"
              variant="soft"
              size="xs"
              class="shrink-0"
            >
              {{ item.status }}
            </UBadge>
          </div>

          <p class="text-sm text-gray-500 line-clamp-2 mt-1">
            {{ item.description || 'No description provided' }}
          </p>

          <!-- ACTIONS -->
          <div class="flex flex-wrap gap-2 mt-3">
            <UButton
              size="xs"
              variant="soft"
              class="flex-1 sm:flex-none"
              :to="`/rentals/${item.category}/${item.public_id}`"
            >
              View
            </UButton>

            <UButton
              v-if="canEdit(item)"
              size="xs"
              color="purple"
              class="flex-1 sm:flex-none"
              :to="`/create/rental/${item.public_id}/`"
            >
              Edit
            </UButton>
          </div>
        </div>
      </UCard>
    </UScrollArea>

    <!-- EMPTY -->
    <UEmpty
      v-else
      icon="i-heroicons-home"
      title="No properties yet"
      description="Create your first rental to get started."
      class="py-10"
    />

    <!-- LOAD MORE -->
    <div
      v-if="canLoadMore"
      class="mt-4 flex justify-center"
    >
      <UButton
        size="sm"
        variant="outline"
        class="w-full sm:w-auto"
        :loading="loading"
        @click="loadMore"
      >
        Load more
      </UButton>
    </div>
  </UPageCard>
</template>


<script setup lang="ts">

/* PROPS */
const props = withDefaults(defineProps<{
  items: []
  total: number
  loading?: boolean
  limit?: number
}>(), {
  loading: false,
  limit: 10
})

/* EMITS */
const emit = defineEmits<{
  (e: 'load-more', payload: { offset: number; limit: number }): void
}>()

/* LOCAL STATE */
const offset = ref(props.items.length)
const placeholderImage = '/images/placeholder-property.jpg'

/* COMPUTED */
const canLoadMore = computed(() => props.items.length < props.total)

/* METHODS */
const loadMore = () => {
  emit('load-more', {
    offset: offset.value,
    limit: props.limit
  })
  offset.value += props.limit
}

const handleImageError = (e: Event) => {
  (e.target as HTMLImageElement).src = placeholderImage
}

const canEdit = (item) => {
  const userStore = useUserStore()
  return item.publisher?.public_id === userStore.user?.public_id
}

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    active: 'sucess',
    available: 'green',
    pending: 'yellow',
    draft: 'warning',
    inactive: 'error',
    rented: 'info',
    sold: 'purple',
    occupied: 'purple'
  }
  return map[status.toLowerCase()] || 'gray'
}
</script>
