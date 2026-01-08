<script setup lang="ts">
interface SpotlightProps {
  color?: string
  intensity?: number
  direction?: 'left' | 'right' | 'center'
}

const props = withDefaults(defineProps<SpotlightProps>(), {
  color: 'primary',
  intensity: 10,
  direction: 'center'
})

const gradientDirection = {
  left: 'to right',
  right: 'to left',
  center: 'to right'
}[props.direction]
</script>

<template>
  <div class="relative group">
    <!-- Spotlight effect -->
    <div 
      :style="{
        background: `linear-gradient(${gradientDirection}, 
          transparent, 
          rgb(var(--color-${color}-500) / ${intensity}%), 
          transparent)`
      }"
      class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
             transition-opacity duration-500 pointer-events-none"
    />
    
    <!-- Slot for content -->
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>