<template>
  <div class="flex items-center justify-center">
    <img 
      :src="computedLogo"
      :style="{ width: computedSize + 'px' }"
      class="rounded-lg select-none"
      alt="Logo"
    >
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  withBackground: {
    type: Boolean,
    default: false
  },
  withName: {
    type: Boolean,
    default: false
  },
  size: {
    type: Number,
    default: 1
  }
})

// Images
import logoWithName from '~/assets/images/named_logo.png'
import logoWithoutBg from '~/assets/images/f_logo.png'
import logoDefault from '~/assets/images/logo.png'

// Choose image
const computedLogo = computed(() => {
  if (props.withName) return logoWithName
  if (props.withBackground) return logoDefault
  return logoWithoutBg
})

// Scale (e.g., size=1 → 50px, size=2 → 100px)
const computedSize = computed(() => 85 * props.size)
</script>
