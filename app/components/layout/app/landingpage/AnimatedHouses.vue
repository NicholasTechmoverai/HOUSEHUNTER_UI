<template>
  <div class="loader-container">
    <div class="loader-wrapper">
      <!-- Header -->
      <div class="loader-header">
        <h1>House Hunter</h1>
        <p class="tagline">Finding your perfect home</p>
      </div>

      <!-- Interactive Search Area -->
      <div class="search-area">
        <!-- Lens that moves with mouse -->
        <div 
          class="search-lens" 
          :style="lensStyle"
          :class="{ 'active': isSearching, 'hovered': hoveredHouseIndex !== null }"
          @mouseenter="onLensEnter"
          @mouseleave="onLensLeave"
        >
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
          
          <!-- Lens Handle -->
          <div class="lens-handle"></div>
          
          <!-- Current house info in lens -->
          <div class="lens-info" v-if="hoveredHouseIndex !== null">
            <div class="info-content">
              <div class="house-price">{{ hoveredHousePrice }}</div>
              <div class="house-beds">{{ hoveredHouseBeds }}</div>
              <div class="house-location">{{ hoveredHouseLocation }}</div>
            </div>
          </div>
        </div>

        <!-- Grid of Houses -->
        <div class="houses-grid" ref="gridRef" @mousemove="onGridMouseMove">
          <div 
            v-for="(house, index) in houses" 
            :key="index"
            class="house-wrapper"
            :style="house.style"
            :class="{ 
              'enlarged': house.isEnlarged,
              'highlighted': house.isHighlighted,
              'scanned': house.isScanned
            }"
          >
            <div class="house-item" @mouseenter="onHouseEnter(index)" @mouseleave="onHouseLeave(index)">
              <!-- House SVG -->
              <svg class="house-svg" width="60" height="60" viewBox="0 0 60 60">
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
                <polygon 
                  points="10,25 30,10 50,25" 
                  :fill="`url(#roofGrad${index})`"
                  class="house-roof"
                />
                
                <!-- House Body -->
                <rect 
                  x="15" 
                  y="25" 
                  width="30" 
                  height="25" 
                  rx="2" 
                  :fill="`url(#wallGrad${index})`"
                  class="house-body"
                />
                
                <!-- Door -->
                <rect 
                  x="25" 
                  y="35" 
                  width="8" 
                  height="15" 
                  rx="1" 
                  :fill="house.color"
                  fill-opacity="0.9"
                  class="house-door"
                />
                
                <!-- Window -->
                <rect 
                  x="35" 
                  y="30" 
                  width="8" 
                  height="8" 
                  rx="1" 
                  :fill="house.color"
                  fill-opacity="0.3"
                  class="house-window"
                />
                
                <!-- Window pane lines -->
                <line x1="39" y1="30" x2="39" y2="38" :stroke="house.color" stroke-width="0.5" />
                <line x1="35" y1="34" x2="43" y2="34" :stroke="house.color" stroke-width="0.5" />
                
                <!-- Door handle -->
                <circle cx="31" cy="42" r="1" fill="white" fill-opacity="0.8" />
                
                <!-- Chimney -->
                <rect 
                  x="35" 
                  y="12" 
                  width="6" 
                  height="8" 
                  :fill="house.color"
                  class="house-chimney"
                />
              </svg>
              
              <!-- House label -->
              <div class="house-label">{{ house.label }}</div>
              
              <!-- Scan progress -->
              <div class="scan-progress" v-if="house.scanProgress > 0">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: house.scanProgress + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Status Panel -->
      <div class="status-panel">
        <div class="status-header">
          <div class="search-status">
            <span class="status-icon">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5" fill="none" />
                <line x1="12" y1="12" x2="16" y2="16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </span>
            <span class="status-text">{{ currentStatus }}</span>
            <span class="status-ellipsis">
              <span class="dot">.</span>
              <span class="dot">.</span>
              <span class="dot">.</span>
            </span>
          </div>
          
          <div class="scan-stats">
            <div class="stat">
              <span class="stat-label">Scanned</span>
              <span class="stat-value">{{ scannedHouses }}/{{ houses.length }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Matches</span>
              <span class="stat-value">{{ matchesFound }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Time</span>
              <span class="stat-value">{{ timeElapsed }}</span>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="search-progress">
          <div class="progress-container">
            <div class="progress-track">
              <div 
                class="progress-indicator" 
                :style="{ width: overallProgress + '%' }"
              ></div>
            </div>
            <span class="progress-percent">{{ Math.round(overallProgress) }}%</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="controls">
          <button 
            @click="toggleSearch" 
            class="control-btn primary"
            :class="{ 'searching': isSearching }"
          >
            <span class="btn-icon">
              <svg v-if="!isSearching" width="16" height="16" viewBox="0 0 16 16">
                <circle cx="6" cy="6" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 16 16">
                <rect x="3" y="3" width="10" height="10" fill="currentColor"/>
              </svg>
            </span>
            {{ isSearching ? 'Stop Scanning' : 'Start Scanning' }}
          </button>

          <div class="mode-controls">
            <span class="mode-label">Mode:</span>
            <button 
              @click="setScanMode('auto')" 
              class="mode-btn"
              :class="{ 'active': scanMode === 'auto' }"
            >
              Auto Scan
            </button>
            <button 
              @click="setScanMode('manual')" 
              class="mode-btn"
              :class="{ 'active': scanMode === 'manual' }"
            >
              Manual
            </button>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div v-if="showResults" class="results-panel">
        <div class="results-header">
          <h3>Scan Complete!</h3>
          <p>Found {{ matchesFound }} properties matching your criteria</p>
        </div>
        <div class="results-grid">
          <div 
            v-for="n in Math.min(4, matchesFound)" 
            :key="n" 
            class="result-card"
            :style="{ animationDelay: `${n * 0.1}s` }"
          >
            <div class="result-visual">
              <div class="result-placeholder"></div>
              <div class="result-badge">Match</div>
            </div>
            <div class="result-info">
              <div class="result-title">Property #{{ n }}</div>
              <div class="result-details">
                <span>{{ 2 + n }} beds</span>
                <span>{{ 1 + n }} baths</span>
                <span>{{ 1000 + n * 150 }} sq ft</span>
              </div>
              <div class="result-price">${{ 250000 + n * 50000 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// State
const isSearching = ref(false)
const scanMode = ref('auto')
const mousePosition = ref({ x: 0, y: 0 })
const lensPosition = ref({ x: 200, y: 150 })
const hoveredHouseIndex = ref(null)
const showResults = ref(false)
const gridRef = ref(null)

// Timing
const overallProgress = ref(0)
const timeElapsed = ref('0:00')
const scannedHouses = ref(0)
const matchesFound = ref(0)

const statusMessages = [
  'Initializing scan...',
  'Mapping properties...',
  'Analyzing house data...',
  'Checking availability...',
  'Evaluating prices...',
  'Finding best matches...'
]
const currentStatusIndex = ref(0)
const currentStatus = computed(() => statusMessages[currentStatusIndex.value])

// Houses data
const houses = ref([])
const houseColors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4']

// Initialize houses grid
const initializeHouses = () => {
  const newHouses = []
  const rows = 3
  const cols = 4
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col
      newHouses.push({
        id: index,
        label: `H${index + 1}`,
        color: houseColors[index % houseColors.length],
        isEnlarged: false,
        isHighlighted: false,
        isScanned: false,
        scanProgress: 0,
        price: `$${(250000 + index * 25000).toLocaleString()}`,
        beds: `${2 + (index % 3)} beds`,
        location: ['Downtown', 'Suburb', 'Waterfront', 'Hills'][index % 4],
        style: {
          gridColumn: col + 1,
          gridRow: row + 1
        }
      })
    }
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

// Interval handlers
let searchInterval = null
let timeInterval = null
let startTime = null
let autoScanIndex = 0

// Mouse movement
const onGridMouseMove = (event) => {
  if (!gridRef.value) return
  
  const rect = gridRef.value.getBoundingClientRect()
  mousePosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
  
  // Follow mouse in manual mode
  if (scanMode.value === 'manual') {
    lensPosition.value = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }
}

const onHouseEnter = (index) => {
  hoveredHouseIndex.value = index
  houses.value[index].isHighlighted = true
  
  // Auto-enlarge house when lens hovers in manual mode
  if (scanMode.value === 'manual') {
    houses.value[index].isEnlarged = true
  }
}

const onHouseLeave = (index) => {
  hoveredHouseIndex.value = null
  houses.value[index].isHighlighted = false
  houses.value[index].isEnlarged = false
}

const onLensEnter = () => {
  // Lens hover effect
}

const onLensLeave = () => {
  hoveredHouseIndex.value = null
  houses.value.forEach(house => {
    house.isHighlighted = false
    house.isEnlarged = false
  })
}

// Search control
const toggleSearch = () => {
  if (isSearching.value) {
    stopSearch()
  } else {
    startSearch()
  }
}

const startSearch = () => {
  isSearching.value = true
  showResults.value = false
  overallProgress.value = 0
  scannedHouses.value = 0
  matchesFound.value = 0
  autoScanIndex = 0
  startTime = Date.now()
  
  // Reset houses
  houses.value.forEach(house => {
    house.isScanned = false
    house.scanProgress = 0
  })
  
  // Start auto-scan interval
  if (scanMode.value === 'auto') {
    searchInterval = setInterval(autoScanHouses, 800)
  }
  
  // Start timer
  timeInterval = setInterval(updateTimer, 1000)
  
  // Update status
  updateStatus()
}

const stopSearch = () => {
  clearInterval(searchInterval)
  clearInterval(timeInterval)
  isSearching.value = false
  showResults.value = false
}

const completeSearch = () => {
  clearInterval(searchInterval)
  clearInterval(timeInterval)
  isSearching.value = false
  overallProgress.value = 100
  matchesFound.value = Math.floor(Math.random() * 5) + 3
  showResults.value = true
  
  // Final status
  currentStatusIndex.value = statusMessages.length - 1
}

// Auto-scan logic
const autoScanHouses = () => {
  if (autoScanIndex >= houses.value.length) {
    completeSearch()
    return
  }
  
  const house = houses.value[autoScanIndex]
  
  // Animate scanning
  let progress = 0
  const scanInterval = setInterval(() => {
    progress += 20
    house.scanProgress = progress
    
    // Move lens to house position
    if (scanMode.value === 'auto') {
      const houseElement = document.querySelector(`.house-wrapper:nth-child(${autoScanIndex + 1})`)
      if (houseElement) {
        const rect = houseElement.getBoundingClientRect()
        const gridRect = gridRef.value.getBoundingClientRect()
        lensPosition.value = {
          x: rect.left + rect.width / 2 - gridRect.left,
          y: rect.top + rect.height / 2 - gridRect.top
        }
      }
      
      // Enlarge house when lens is over it
      if (progress >= 50) {
        house.isEnlarged = true
        house.isHighlighted = true
      }
    }
    
    if (progress >= 100) {
      clearInterval(scanInterval)
      house.isScanned = true
      house.isEnlarged = false
      house.isHighlighted = false
      scannedHouses.value++
      
      // Randomly find matches
      if (Math.random() > 0.5) {
        matchesFound.value++
      }
      
      // Update overall progress
      overallProgress.value = (scannedHouses.value / houses.value.length) * 100
      
      // Move to next house
      autoScanIndex++
    }
  }, 100)
}

const updateStatus = () => {
  currentStatusIndex.value = (currentStatusIndex.value + 1) % statusMessages.length
  if (isSearching.value) {
    setTimeout(updateStatus, 2000)
  }
}

const updateTimer = () => {
  if (!startTime) return
  
  const elapsed = Math.floor((Date.now() - startTime) / 1000)
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  timeElapsed.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const setScanMode = (mode) => {
  scanMode.value = mode
  
  // Reset lens position for manual mode
  if (mode === 'manual' && gridRef.value) {
    lensPosition.value = {
      x: gridRef.value.clientWidth / 2,
      y: gridRef.value.clientHeight / 2
    }
  }
  
  // Restart search if active
  if (isSearching.value) {
    stopSearch()
    startSearch()
  }
}

// Initialize
onMounted(() => {
  initializeHouses()
  
  // Auto-start in auto mode
  setTimeout(() => {
    if (!isSearching.value) {
      startSearch()
    }
  }, 1000)
})

onUnmounted(() => {
  stopSearch()
})
</script>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.loader-wrapper {
  width: 100%;
  max-width: 800px;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.loader-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981);
  border-radius: 24px 24px 0 0;
}

/* Header */
.loader-header {
  text-align: center;
  margin-bottom: 2rem;
}

.loader-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  letter-spacing: -0.5px;
  background: linear-gradient(90deg, #60a5fa, #c4b5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  color: #94a3b8;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 0.5rem;
  letter-spacing: 0.05em;
}

/* Search Area */
.search-area {
  position: relative;
  height: 400px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
}

/* Houses Grid */
.houses-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 2rem;
  height: 100%;
  position: relative;
  z-index: 1;
}

.house-wrapper {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.house-wrapper.enlarged {
  transform: scale(1.3);
  z-index: 10;
}

.house-wrapper.highlighted .house-item {
  box-shadow: 0 0 0 2px #3b82f6, 0 10px 30px rgba(59, 130, 246, 0.3);
}

.house-wrapper.scanned .house-item {
  opacity: 0.6;
  filter: grayscale(0.5);
}

.house-item {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.house-item:hover {
  background: rgba(51, 65, 85, 0.8);
  transform: translateY(-2px);
}

.house-svg {
  transition: all 0.3s ease;
}

.house-wrapper.enlarged .house-svg {
  transform: scale(1.2);
}

.house-label {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e1;
}

.scan-progress {
  width: 100%;
  margin-top: 0.75rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.house-wrapper.highlighted .scan-progress {
  opacity: 1;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Search Lens */
.search-lens {
  position: absolute;
  width: 180px;
  height: 180px;
  pointer-events: none;
  z-index: 100;
  transition: transform 0.1s linear;
}

.search-lens.active {
  pointer-events: auto;
}

.lens-glass {
  position: relative;
  width: 140px;
  height: 140px;
  border: 3px solid rgba(59, 130, 246, 0.8);
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(59, 130, 246, 0.05) 40%,
    transparent 70%
  );
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 40px rgba(59, 130, 246, 0.3),
    inset 0 0 40px rgba(255, 255, 255, 0.1);
}

/* Lens flare */
.lens-flare {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(10px);
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
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: reticlePulse 2s infinite;
}

.reticle-crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
}

.reticle-crosshair::before,
.reticle-crosshair::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
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
  border: 1px solid rgba(59, 130, 246, 0.4);
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

/* Lens handle */
.lens-handle {
  position: absolute;
  top: 85px;
  left: 85px;
  width: 50px;
  height: 15px;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  border-radius: 0 8px 8px 0;
  transform: rotate(45deg);
  transform-origin: left center;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
}

/* Lens info */
.lens-info {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  min-width: 140px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
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
  background: rgba(15, 23, 42, 0.95);
  border-right: 1px solid rgba(59, 130, 246, 0.3);
  border-bottom: 1px solid rgba(59, 130, 246, 0.3);
  transform: rotate(45deg);
}

.info-content {
  text-align: center;
}

.house-price {
  font-size: 1rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 0.25rem;
}

.house-beds {
  font-size: 0.875rem;
  color: #cbd5e1;
  margin-bottom: 0.25rem;
}

.house-location {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* Status Panel */
.status-panel {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-weight: 500;
}

.status-icon {
  color: #60a5fa;
}

.status-ellipsis {
  display: inline-flex;
  gap: 2px;
}

.status-ellipsis .dot {
  animation: ellipsis 1.5s infinite;
  opacity: 0;
}

.status-ellipsis .dot:nth-child(1) { animation-delay: 0s; }
.status-ellipsis .dot:nth-child(2) { animation-delay: 0.2s; }
.status-ellipsis .dot:nth-child(3) { animation-delay: 0.4s; }

.scan-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stat-label {
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

/* Progress Bar */
.search-progress {
  margin-bottom: 1.5rem;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-track {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-indicator {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-indicator::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

.progress-percent {
  font-weight: 600;
  color: white;
  min-width: 40px;
}

/* Controls */
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.control-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.control-btn.primary.searching {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.mode-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mode-label {
  color: #94a3b8;
  font-size: 0.875rem;
}

.mode-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.mode-btn.active {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.5);
}

/* Results Panel */
.results-panel {
  background: rgba(15, 23, 42, 0.6);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideUp 0.5s ease;
}

.results-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.results-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.results-header p {
  color: #94a3b8;
  font-size: 0.875rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.result-card {
  background: rgba(30, 41, 59, 0.8);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: cardAppear 0.5s ease backwards;
}

.result-visual {
  position: relative;
}

.result-placeholder {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 8px;
  animation: placeholderPulse 2s infinite alternate;
}

.result-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #10b981;
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
}

.result-info {
  flex: 1;
}

.result-title {
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}

.result-details {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.result-details span {
  font-size: 0.75rem;
  color: #94a3b8;
}

.result-price {
  font-size: 1rem;
  font-weight: 700;
  color: #10b981;
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
  0%, 100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes ellipsis {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes placeholderPulse {
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .loader-wrapper {
    padding: 1.5rem;
  }
  
  .search-area {
    height: 300px;
  }
  
  .houses-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 1rem;
    padding: 1rem;
  }
  
  .lens-glass {
    width: 100px;
    height: 100px;
  }
  
  .search-lens {
    width: 140px;
    height: 140px;
  }
  
  .status-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .scan-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  .controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .mode-controls {
    width: 100%;
    justify-content: center;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>