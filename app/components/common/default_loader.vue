<template>
  <div 
    v-if="isActive"
    :class="{
      'fixed inset-0 z-50 bg-black/20 backdrop-blur-[5px]': isPageOverlay,
      'absolute inset-0 z-40 bg-white/0 backdrop-blur-sm': !isPageOverlay
    }"
    class="flex items-center justify-center transition-opacity duration-300"
  >
    <div class="relative" :style="containerStyle">
      <div 
        class="absolute inset-0 bg-white/0 backdrop-blur-[1px] rounded-full shadow-2xl overflow-hidden! "
        :style="outerRingStyle"
      ></div>
      
      <div 
        class="relative"
        :style="mainContainerStyle"
      >
        
        <div class="absolute inset-0 rounded-full">
          <div 
            v-for="(house, index) in houses" 
            :key="index"
            class="absolute transition-transform duration-300 ease-out "
            :class="{ 
              'scale-150 z-20': house.isEnlarged,
              'opacity-40 grayscale': house.isEnlarged // Use 'isEnlarged' to grey out scanned-like houses for a brief moment
            }"
            :style="{
              left: `${house.x}%`,
              top: `${house.y}%`,
              '--color': house.color,
              transform: `translate(-50%, -50%) scale(${house.isEnlarged ? 1.5 : 1})`
            }"
          >
            <svg 
              class="drop-shadow-md transition-transform duration-300"
              :width="house.size" 
              :height="house.size" 
              viewBox="0 0 24 24"
            >
              <polygon 
                points="4,10 12,3 20,10" 
                :fill="house.color"
                fill-opacity="0.95"
              />
              <rect 
                x="6" 
                y="10" 
                width="12" 
                height="10" 
                rx="1" 
                :fill="house.color"
                fill-opacity="0.8"
              />
              <rect 
                x="10" 
                y="13" 
                width="4" 
                height="7" 
                rx="1" 
                :fill="house.color"
                fill-opacity="0.95"
              />
              <circle 
                cx="11.5" 
                cy="16" 
                r="0.8" 
                :fill="house.color"
                fill-opacity="0.6"
              />
              <rect 
                x="14" 
                y="12" 
                width="3" 
                height="3" 
                rx="0.5" 
                :fill="house.color"
                fill-opacity="0.4"
              />
              <rect 
                x="15" 
                y="6" 
                width="3" 
                height="4" 
                :fill="house.color"
              />
            </svg>
            
            </div>
        </div>

        <div 
          class="absolute z-30 transition-all duration-75 ease-linear"
          :style="{
            left: `${lensPosition.x}%`,
            top: `${lensPosition.y}%`,
            transform: `translate(-50%, -50%) rotate(${lensAngle}deg)`
          }"
        >
          <div class="relative">
            <div class="absolute -inset-2 bg-blue-500/20 blur-md rounded-full animate-ping"></div>
            
            <div class="relative w-12 h-12 border-2 border-blue-500 rounded-full bg-gradient-to-br from-blue-400/20 to-transparent backdrop-blur-sm shadow-lg">
              <div class="absolute inset-0">
                <div class="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2">
                  <div class="absolute left-1/2 w-4 h-0.5 bg-blue-500 -translate-x-1/2"></div>
                </div>
                <div class="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2">
                  <div class="absolute top-1/2 h-4 w-0.5 bg-blue-500 -translate-y-1/2"></div>
                </div>
                
                <div class="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-red-500/50"></div>
              </div>
              
              <div 
                v-for="n in 4" 
                :key="n"
                class="absolute top-1/2 left-1/2 w-1 h-3 bg-blue-400 -translate-x-1/2 -translate-y-1/2 origin-center"
                :style="{
                  transform: `
                    translate(-50%, -50%) 
                    rotate(${n * 90 + lensSegmentAngle}deg) 
                    translateY(-16px)
                  `
                }"
              ></div>
            </div>
            
            <div class="absolute -inset-4 border border-blue-300/30 rounded-full animate-ping"></div>
            <div class="absolute -inset-6 border border-blue-200/20 rounded-full animate-ping" style="animation-delay: 0.5s"></div>
            
            <div class="absolute top-1/2 left-1/2 w-8 h-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-r shadow-md"
              style="transform: translate(24px, -50%) rotate(45deg); transform-origin: left center">
            </div>
          </div>
          
          </div>

        <div 
          class="absolute left-1/2 -translate-x-1/2 text-center"
          :style="statusTextStyle"
        >
          <div class="flex items-center justify-center gap-1 text-sm font-medium text-gray-700">
            <svg class="w-4 h-4 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>{{ statusText }}</span>
            <div class="flex gap-0.5">
              <span class="animate-pulse" style="animation-delay: 0s">.</span>
              <span class="animate-pulse" style="animation-delay: 0.2s">.</span>
              <span class="animate-pulse" style="animation-delay: 0.4s">.</span>
            </div>
          </div>
          
          </div>
      </div>
      
      <button 
        v-if="!isPageOverlay"
        @click="$emit('close')"
        class="absolute w-8 h-8 bg-white/10 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200"
        :style="closeButtonStyle"
      >
        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  isActive: {
    type: Boolean,
    default: true
  },
  statusText: {
    type: String,
    default: 'Loading'
  },
  speed: {
    type: String,
    default: 'ultra', 
    validator: (value) => ['slow', 'medium', 'fast', 'ultra'].includes(value)
  },
  // New size prop in pixels
  size: {
    type: Number,
    default: 256 // default w-64 h-64 in Tailwind (256px)
  },
  // New prop for page overlay mode
  isPageOverlay: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// Removed unused state variables (scannedCount, matchesFound, hoveredHouse, scanProgress, isScanned)
const houses = ref([])

// Lens state
const lensPosition = ref({ x: 50, y: 50 })
const lensAngle = ref(0)
const lensSegmentAngle = ref(0)

const speedSettings = {
  slow: { 
    moveSpeed: 0.5, 
    houseCount: 15,
    pathRadius: 30
  },
  medium: { 
    moveSpeed: 0.8, 
    houseCount: 20,
    pathRadius: 35
  },
  fast: { 
    moveSpeed: 1.2, 
    houseCount: 25,
    pathRadius: 40
  },
  ultra: { 
    moveSpeed: 2.5, 
    houseCount: 75, 
    pathRadius: 50 
  }
}

// House colors
const houseColors = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', 
  '#06B6D4', '#84CC16', '#EC4899', '#14B8A6', '#6366F1', 
  '#F97316', '#A855F7', '#22C55E', '#F43F5E',
]

// Computed styles for scaling
const containerStyle = computed(() => ({
  // Scale the entire relative container based on the size prop
  transform: `scale(${props.size / 256})` 
}))

const mainContainerStyle = computed(() => ({
  width: '256px',
  height: '256px',
}))

const outerRingStyle = computed(() => ({
  // Keep the padding/margin proportional to the default 8px (-m-8, -m-8)
  margin: `-${props.size / 28}px`, 
  borderWidth: `${props.size / 44}px`, // Default 4px border (4/256 = 1/64)
  borderColor: '#1e40af', // Blue-900 equivalent
}))

const statusTextStyle = computed(() => ({
  // Adjust position to remain below the scaled container
  bottom: `${-(props.size * 0.25)}px`, 
}))

const closeButtonStyle = computed(() => ({
  // Adjust position to remain outside the scaled container
  top: `${-(props.size * 0.08)}px`,
  right: `${-(props.size * 0.08)}px`,
}))

// Initialize houses
const initializeHouses = () => {
  const settings = speedSettings[props.speed]
  const newHouses = []
  
  for (let i = 0; i < settings.houseCount; i++) {
    const angle = (i * 137.5) * (Math.PI / 180) 
    const radiusScale = (i / settings.houseCount) * 40 + 10 
    const radius = radiusScale 
    const offset = 50
    
    const x = offset + Math.cos(angle) * radius
    const y = offset + Math.sin(angle) * radius
    
    newHouses.push({
      id: i,
      x: Math.max(10, Math.min(90, x + (Math.random() - 0.5) * 5)), 
      y: Math.max(10, Math.min(90, y + (Math.random() - 0.5) * 5)),
      color: houseColors[i % houseColors.length],
      size: 20 + Math.random() * 8, // House sizes remain absolute to 24x24 viewBox
      isEnlarged: false,
    })
  }
  
  houses.value = newHouses
}

// Lens animation
let animationFrame = null
let angle = 0

const startLensAnimation = () => {
  const settings = speedSettings[props.speed]
  
  const animate = () => {
    if (!props.isActive) return
    
    angle += settings.moveSpeed * 0.03 
    
    // Complex lens movement (lemniscate pattern)
    const t = angle * 0.7
    lensPosition.value.x = 50 + Math.cos(t) * settings.pathRadius * Math.cos(t * 0.5)
    lensPosition.value.y = 50 + Math.sin(t) * (settings.pathRadius * 0.8) * Math.sin(t * 0.7)
    
    // Lens rotation
    lensAngle.value = Math.sin(angle * 0.5) * 15
    
    // Segment rotation
    lensSegmentAngle.value += 3 
    
    // Check proximity to houses (only for animation effect)
    houses.value.forEach((house) => {
      const distance = Math.sqrt(
        Math.pow(lensPosition.value.x - house.x, 2) + 
        Math.pow(lensPosition.value.y - house.y, 2)
      )
      
      // Enlarge the house if the lens is close
      if (distance < 12) {
        if (!house.isEnlarged) {
          house.isEnlarged = true
        }
      } else {
        if (house.isEnlarged) {
          house.isEnlarged = false
        }
      }
    })
    
    animationFrame = requestAnimationFrame(animate)
  }
  
  animationFrame = requestAnimationFrame(animate)
}

// Initialize and cleanup logic remains the same
onMounted(() => {
  initializeHouses()
  if (props.isActive) {
    startLensAnimation()
  }
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})

watch(() => props.isActive, (newVal) => {
  if (newVal) {
    initializeHouses()
    startLensAnimation()
  } else {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
  }
})

watch(() => props.speed, () => {
  initializeHouses()
  if (props.isActive && animationFrame) {
    cancelAnimationFrame(animationFrame)
    startLensAnimation()
  }
})
</script>

<style scoped>
/* Custom animations (kept simple and fast) */
.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>