<template>
  <NuxtLink :to="`/rentals/${rental?.public_id}`" class="block w-full mx-auto group">
    <div class="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden transition-all duration-300 hover:shadow-xl">

      <div class="relative h-64 flex bg-gray-50 dark:bg-gray-950">
        <div class="w-2/3 h-full relative overflow-hidden border-r border-white/10 dark:border-gray-800/50">
          <img :src="rental?.gallery?.[0]?.url || '/placeholder.jpg'"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div class="absolute bottom-3 left-3 text-white">
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-black text-emerald-400 leading-none">
                {{ formatPrice(rental?.pricing?.rent) }}
              </span>
              <span class="text-xs opacity-80 uppercase">/mo</span>
            </div>
            <div class="text-[10px] font-medium opacity-70 mt-0.5 uppercase tracking-wider">
              Deposit: {{ formatPrice(rental?.pricing?.deposit_amount) }}
            </div>
          </div>
        </div>

        <div class="w-1/3 flex flex-col">
          <div class="h-1/2 relative overflow-hidden border-b border-white/10 dark:border-gray-800/50">
            <img :src="rental?.gallery?.[1]?.url || '/placeholder.jpg'" class="w-full h-full object-cover" />
          </div>
          <div class="h-1/2 relative overflow-hidden">
            <img :src="rental?.gallery?.[2]?.url || '/placeholder.jpg'" class="w-full h-full object-cover" />
            <div v-if="remainingCount > 0"
              class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
              <UIcon name="i-heroicons-photo" class="w-5 h-5 mb-0.5" />
              <span class="text-sm font-bold">+{{ remainingCount }}</span>
            </div>
          </div>
        </div>

        <div class="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
          <UButton :icon="isFavorited ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" color="neutral" variant="subtle"
            :ui="{ rounded: 'rounded-none', padding: { xs: 'p-1.5' } }"
            :class="isFavorited ? 'text-red-500' : 'text-gray-700'" @click.prevent="toggleFavorite" />
          <UButton icon="i-heroicons-share" color="neutral" variant="subtle" 
            :ui="{ rounded: 'rounded-none', padding: { xs: 'p-1.5' } }"
            class="text-gray-700" @click.prevent="handleShare" />
        </div>
      </div>

      <div class="p-4 space-y-4">
        <div class="flex justify-between items-start gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-500 transition-colors">
                {{ rental?.title }}
              </h3>
              <div class="flex items-center gap-1 shrink-0 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded border border-amber-200/50 dark:border-amber-800/50">
                <UIcon name="i-heroicons-star-solid" class="w-3 h-3 text-amber-500" />
                <span class="text-xs font-bold text-amber-700 dark:text-amber-400">4.8</span>
              </div>
            </div>

            <button @click.prevent="openMap"
              class="flex items-center text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm mt-1.5 group/loc">
              <UIcon name="i-heroicons-map-pin-solid" class="w-3.5 h-3.5 mr-1 text-primary-500" />
              <span class="truncate border-b border-gray-200 dark:border-gray-800 group-hover/loc:border-primary-500">
                {{ rental?.address }}, {{ rental?.city }}
              </span>
              <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-2.5 h-2.5 ml-0.5" />
            </button>
          </div>
        </div>

        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug">
          {{ rental?.description }}
        </p>
        
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">resources</p>
        
        <div class="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <div class="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded shrink-0">
            <UIcon name="i-heroicons-home" class="w-3.5 h-3.5 text-gray-500" />
            <span class="text-xs font-bold text-gray-700 dark:text-gray-200">{{ rental?.bedrooms }} Bed</span>
          </div>
          <div class="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded shrink-0">
            <UIcon name="i-heroicons-swatch" class="w-3.5 h-3.5 text-gray-500" />
            <span class="text-xs font-bold text-gray-700 dark:text-gray-200">{{ rental?.bathrooms }} Bath</span>
          </div>
          <div v-for="amenity in rental?.amenities" :key="amenity"
            class="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded shrink-0">
            <UIcon :name="amenity.icon||'i-heroicons-check-circle'" class="w-3.5 h-3.5 text-emerald-500" />
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
              {{ amenity.name }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div class="flex items-center gap-2">
            <UAvatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" size="xs" :ui="{ rounded: 'rounded-none' }" />
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Verified Property</span>
          </div>
          <div class="flex items-center gap-1 text-primary-600 font-bold text-xs uppercase tracking-widest">
            Details
            <UIcon name="i-heroicons-arrow-right" class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Rental } from '~/types/rental'

const props = defineProps<{ rental: Rental }>()
const isFavorited = ref(false)
const toast = useToast()

const remainingCount = computed(() => Math.max(0, (props.rental?.gallery?.length || 0) - 3))

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  toast.add({
    title: isFavorited.value ? 'Added to Favorites' : 'Removed from Favorites',
    color: isFavorited.value ? 'primary' : 'gray',
    ui: { rounded: 'rounded-none' }
  })
}

const handleShare = async () => {
  try {
    await navigator.share({ title: props.rental?.title, url: window.location.href })
  } catch {
    navigator.clipboard.writeText(window.location.href)
    toast.add({ title: 'Link copied!', ui: { rounded: 'rounded-none' } })
  }
}

const openMap = (e: Event) => {
  e.preventDefault(); e.stopPropagation()
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.rental?.address + ' ' + props.rental?.city)}`, '_blank')
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount || 0)
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>