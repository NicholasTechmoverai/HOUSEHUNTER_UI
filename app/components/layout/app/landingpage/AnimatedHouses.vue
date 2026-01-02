<template>
  <div class="flex">
     <p class="m-auto">
      Find the house of your choice
    </p>
  </div>
  <div class="animation-container flex flex-col items-center">
    <!-- Interactive Search Area -->
    <div class="search-area bg-linear-to-br from-brand-start/10 via-brand-middle/10 to-brand-end/10">
      <!-- Lens that moves with mouse -->
      <div class="search-lens" :style="lensStyle" :class="{ 'hovered': hoveredHouseIndex !== null }">
        <!-- Lens Glass -->
        <div class="lens-glass">
          <!-- Lens flare effect -->
          <div class="lens-flare"></div>
          <!-- Target reticle -->
          <div class="reticle">
            <div class="reticle-circle"></div>
            <div class="reticle-crosshair"></div>
          </div>
          <!-- Pulsing rings -->
          <div class="pulse-ring ring-1"></div>
          <div class="pulse-ring ring-2"></div>
          <div class="pulse-ring ring-3"></div>
        </div>

        <!-- Current house info in lens -->
        <div class="lens-info" v-if="hoveredHouseIndex !== null">
          <div class="info-content">
            <div class="house-price">{{ hoveredHousePrice }}</div>
            <div class="house-beds">{{ hoveredHouseBeds }}</div>
            <div class="house-location">{{ hoveredHouseLocation }}</div>
          </div>
        </div>
      </div>

      <!-- Grid of Houses - FIXED -->
      <div class="houses-grid" ref="gridRef" @mousemove="onGridMouseMove">
        <div v-for="(house, index) in houses" :key="index" class="house-wrapper" :class="{
          'enlarged': house.isEnlarged,
          'highlighted': house.isHighlighted,
        }">
          <div class="house-item" @mouseenter="onHouseEnter(index)" @mouseleave="onHouseLeave(index)">
            <!-- House SVG -->
            <svg class="house-svg" viewBox="0 0 60 60">
              <defs>
                <linearGradient :id="`roofGrad${index}`" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" :stop-color="house.color" stop-opacity="0.9" />
                  <stop offset="100%" :stop-color="house.color" stop-opacity="0.6" />
                </linearGradient>
                <linearGradient :id="`wallGrad${index}`" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" :stop-color="house.color" stop-opacity="0.8" />
                  <stop offset="100%" :stop-color="house.color" stop-opacity="0.4" />
                </linearGradient>
              </defs>

              <!-- House Roof -->
              <polygon points="10,25 30,10 50,25" :fill="`url(#roofGrad${index})`" class="house-roof" />

              <!-- House Body -->
              <rect x="15" y="25" width="30" height="25" rx="2" :fill="`url(#wallGrad${index})`" class="house-body" />

              <!-- Door -->
              <rect x="25" y="35" width="8" height="15" rx="1" :fill="house.color" fill-opacity="0.9"
                class="house-door" />

              <!-- Window -->
              <rect x="35" y="30" width="8" height="8" rx="1" :fill="house.color" fill-opacity="0.3"
                class="house-window" />

              <!-- Window pane lines -->
              <line x1="39" y1="30" x2="39" y2="38" :stroke="house.color" stroke-width="0.5" />
              <line x1="35" y1="34" x2="43" y2="34" :stroke="house.color" stroke-width="0.5" />

              <!-- Door handle -->
              <circle cx="31" cy="42" r="1" fill="white" fill-opacity="0.8" />

              <!-- Chimney -->
              <rect x="35" y="12" width="6" height="8" :fill="house.color" class="house-chimney" />
            </svg>

            <!-- House label -->
            <div class="house-label">{{ house.label }}</div>

            <!-- Glow effect when hovered -->
            <div class="house-glow" v-if="house.isHighlighted"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// State
const mousePosition = ref({ x: 0, y: 0 })
const lensPosition = ref({ x: 200, y: 150 })
const hoveredHouseIndex = ref(null)
const gridRef = ref(null)

// Houses data - using brand colors
const houses = ref([])
const houseColors = [
  'var(--color-brand-start)',
  'var(--color-brand-middle)',
  'var(--color-brand-end)',
  '#059669',
  '#10B981',
  '#0D9488'
]

// Initialize houses grid
const initializeHouses = () => {
  const newHouses = []
  const totalHouses = 24 // 6 columns × 4 rows for desktop

  for (let i = 0; i < totalHouses; i++) {
    newHouses.push({
      id: i,
      label: `H${i + 1}`,
      color: houseColors[i % houseColors.length],
      isEnlarged: false,
      isHighlighted: false,
      price: `Ksh ${(25000 + i * 5000).toLocaleString()}/month`,
      beds: `${1 + (i % 3)} bed${i % 3 !== 0 ? 's' : ''}`,
      location: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'][i % 4]
    })
  }
  houses.value = newHouses
}

// Computed
const lensStyle = computed(() => ({
  left: `${lensPosition.value.x}px`,
  top: `${lensPosition.value.y}px`,
  transform: `translate(-50%, -50%)`
}))

const hoveredHousePrice = computed(() =>
  hoveredHouseIndex.value !== null ? houses.value[hoveredHouseIndex.value].price : ''
)

const hoveredHouseBeds = computed(() =>
  hoveredHouseIndex.value !== null ? houses.value[hoveredHouseIndex.value].beds : ''
)

const hoveredHouseLocation = computed(() =>
  hoveredHouseIndex.value !== null ? houses.value[hoveredHouseIndex.value].location : ''
)

// Mouse movement
const onGridMouseMove = (event) => {
  if (!gridRef.value) return

  const rect = gridRef.value.getBoundingClientRect()
  mousePosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }

  // Follow mouse
  lensPosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

const onHouseEnter = (index) => {
  hoveredHouseIndex.value = index
  houses.value[index].isHighlighted = true
  houses.value[index].isEnlarged = true
}

const onHouseLeave = (index) => {
  hoveredHouseIndex.value = null
  houses.value[index].isHighlighted = false
  houses.value[index].isEnlarged = false
}

// Initialize
onMounted(() => {
  initializeHouses()
})

// Auto move lens for demo effect
let demoInterval = null
onMounted(() => {
  demoInterval = setInterval(() => {
    if (gridRef.value && !hoveredHouseIndex.value) {
      const rect = gridRef.value.getBoundingClientRect()
      const houseElements = document.querySelectorAll('.house-wrapper')

      if (houseElements.length > 0) {
        const randomIndex = Math.floor(Math.random() * houseElements.length)
        const randomHouse = houseElements[randomIndex]
        const houseRect = randomHouse.getBoundingClientRect()

        lensPosition.value = {
          x: houseRect.left + houseRect.width / 2 - rect.left,
          y: houseRect.top + houseRect.height / 2 - rect.top
        }

        // Briefly highlight the house
        houses.value[randomIndex].isHighlighted = true
        houses.value[randomIndex].isEnlarged = true

        setTimeout(() => {
          houses.value[randomIndex].isHighlighted = false
          houses.value[randomIndex].isEnlarged = false
        }, 1000)
      }
    }
  }, 3000)
})

onUnmounted(() => {
  if (demoInterval) {
    clearInterval(demoInterval)
  }
})
</script>

<style scoped>
.animation-container {
  width: 100%;
  height: 500px;
  position: relative;
  background: linear-gradient(135deg,
      rgba(var(--color-brand-start-rgb, 5, 150, 105), 0.03) 0%,
      rgba(var(--color-brand-middle-rgb, 16, 185, 129), 0.02) 50%,
      rgba(var(--color-brand-end-rgb, 13, 148, 136), 0.03) 100%);
  border-radius: 0px;
}

/* Search Area */
.search-area {
  margin: auto;
  position: relative;
  width: 100%;
  max-width: 1024px;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

/* Houses Grid - FIXED */
.houses-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  place-items: center;
}

/* House wrapper */
.house-wrapper {
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  width: 100%;
  max-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.house-wrapper.enlarged {
  transform: scale(1.2);
  z-index: 10;
}

.house-wrapper.highlighted .house-item {
  box-shadow: 0 0 0 2px var(--color-brand-start),
    0 10px 40px rgba(var(--color-brand-start-rgb, 5, 150, 105), 0.3);
}

.house-item {
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 10px;
  width: 100%;
}

.house-svg {
  width: 60px;
  height: 60px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.house-wrapper.enlarged .house-svg {
  transform: scale(1.3);
}

.house-label {
  margin-top: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  transition: all 0.3s ease;
  text-align: center;
}

.house-wrapper.highlighted .house-label {
  color: var(--color-brand-start);
  font-weight: 700;
}

.house-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle at center,
      rgba(var(--color-brand-start-rgb, 5, 150, 105), 0.15) 0%,
      transparent 70%);
  border-radius: 12px;
  animation: glowPulse 2s infinite;
  z-index: -1;
}

/* Search Lens */
.search-lens {
  position: absolute;
  width: 160px;
  height: 160px;
  pointer-events: none;
  z-index: 100;
  transition: transform 0.1s linear;
}

.lens-glass {
  position: relative;
  width: 120px;
  height: 120px;
  border: 3px solid rgba(var(--color-brand-start-rgb, 5, 150, 105), 0.8);
  border-radius: 50%;
  background: radial-gradient(circle at center,
      rgba(var(--color-brand-start-rgb, 5, 150, 105), 0.1) 0%,
      rgba(var(--color-brand-middle-rgb, 16, 185, 129), 0.05) 40%,
      transparent 70%);
  backdrop-filter: blur(5px);
  box-shadow:
    0 0 30px rgba(var(--color-brand-start-rgb, 5, 150, 105), 0.3),
    inset 0 0 30px rgba(255, 255, 255, 0.1);
}

/* Lens flare */
.lens-flare {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(8px);
  opacity: 0.5;
}

/* Reticle */
.reticle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
}

.reticle-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border: 2px solid rgba(var(--color-brand-start-rgb, 5, 150, 105), 0.9);
  border-radius: 50%;
  animation: reticlePulse 2s infinite;
}

.reticle-crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
}

.reticle-crosshair::before,
.reticle-crosshair::after {
  content: '';
  position: absolute;
  background: rgba(var(--color-brand-start-rgb, 5, 150, 105), 0.7);
}

.reticle-crosshair::before {
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  transform: translateY(-50%);
}

.reticle-crosshair::after {
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  transform: translateX(-50%);
}

/* Pulse rings */
.pulse-ring {
  position: absolute;
  border: 1px solid rgba(var(--color-brand-start-rgb, 5, 150, 105), 0.3);
  border-radius: 50%;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  opacity: 0;
  animation: pulse 2s infinite;
}

.pulse-ring.ring-2 {
  animation-delay: 0.7s;
}

.pulse-ring.ring-3 {
  animation-delay: 1.4s;
}

/* Lens info */
.lens-info {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  backdrop-filter: blur(10px);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(var(--color-brand-start-rgb, 5, 150, 105), 0.2);
  min-width: 160px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 101;
}

.search-lens.hovered .lens-info {
  opacity: 1;
}

.lens-info::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: white;
  border-right: 1px solid rgba(var(--color-brand-start-rgb, 5, 150, 105), 0.2);
  border-bottom: 1px solid rgba(var(--color-brand-start-rgb, 5, 150, 105), 0.2);
  transform: rotate(45deg);
}

.info-content {
  text-align: center;
}

.house-price {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-brand-start);
  margin-bottom: 0.25rem;
}

.house-beds {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.house-location {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

/* Animations */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

@keyframes reticlePulse {

  0%,
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes glowPulse {

  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .animation-container {
    height: fit-content;
  }

  .houses-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }

  .house-wrapper {
    max-width: 90px;
  }

  .house-svg {
    width: 55px;
    height: 55px;
  }

  .lens-glass {
    width: 90px;
    height: 90px;
  }

  .search-lens {
    width: 130px;
    height: 130px;
  }
}

@media (max-width: 768px) {
  .animation-container {
    height: fit-content;
  }

  .houses-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(8, 1fr);
    gap: 0.75rem;
  }

  .house-wrapper {
    max-width: 80px;
  }

  .house-svg {
    width: 50px;
    height: 50px;
  }

  .house-label {
    font-size: 0.8rem;
    margin-top: 6px;
  }

  .lens-glass {
    width: 70px;
    height: 70px;
  }

  .search-lens {
    width: 110px;
    height: 110px;
  }

  .lens-info {
    top: -70px;
    min-width: 130px;
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 480px) {
  .animation-container {
    height: fit-content;
  }

  .houses-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(12, 1fr);
    gap: 0.5rem;
  }

  .search-area {
    padding: 15px;
  }

  .house-wrapper {
    max-width: 70px;
  }

  .house-svg {
    width: 45px;
    height: 45px;
  }

  .house-label {
    font-size: 0.75rem;
    margin-top: 4px;
  }

  .lens-glass {
    width: 60px;
    height: 60px;
  }

  .search-lens {
    width: 90px;
    height: 90px;
  }

  .lens-info {
    top: -60px;
    min-width: 110px;
    padding: 0.4rem 0.6rem;
  }

  .house-price {
    font-size: 0.9rem;
  }

  .house-beds {
    font-size: 0.8rem;
  }

  .house-location {
    font-size: 0.7rem;
  }
}
</style>