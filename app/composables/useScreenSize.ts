// composables/useScreenSize.ts
import { ref, onMounted, onUnmounted } from 'vue'

// Define breakpoints for consistency
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280
} as const

// Reactive screen width
const screenWidth = ref(0)
const screenHeight = ref(0)

// Update screen dimensions
const updateScreenSize = () => {
  if (typeof window !== 'undefined') {
    screenWidth.value = window.innerWidth
    screenHeight.value = window.innerHeight
  }
}

// Setup event listener
const setupScreenSizeListener = () => {
  if (typeof window !== 'undefined') {
    updateScreenSize() // Initial update
    window.addEventListener('resize', updateScreenSize)
  }
}

// Cleanup event listener
const cleanupScreenSizeListener = () => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateScreenSize)
  }
}

// Main composable
export const useScreenSize = () => {
  onMounted(setupScreenSizeListener)
  onUnmounted(cleanupScreenSizeListener)

  // Reactive computed values
  const isMobile = computed(() => screenWidth.value < BREAKPOINTS.MOBILE)
  const isTablet = computed(() => 
    screenWidth.value >= BREAKPOINTS.MOBILE && 
    screenWidth.value < BREAKPOINTS.TABLET
  )
  const isDesktop = computed(() => screenWidth.value >= BREAKPOINTS.TABLET)
  const isLargeDesktop = computed(() => screenWidth.value >= BREAKPOINTS.DESKTOP)

  // Common device type
  const deviceType = computed(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    if (isLargeDesktop.value) return 'large-desktop'
    return 'desktop'
  })

  // Direction for drawers/modals
  const drawerDirection = computed(() => 
    isMobile.value ? 'bottom' : 'right'
  )

  // Check specific breakpoints
  const isBelow = (breakpoint: number) => screenWidth.value < breakpoint
  const isAbove = (breakpoint: number) => screenWidth.value >= breakpoint

  return {
    // Reactive values
    width: screenWidth,
    height: screenHeight,
    
    // Device type booleans
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    
    // Device type string
    deviceType,
    
    // Utilities
    drawerDirection,
    isBelow,
    isAbove,
    
    // Breakpoints reference
    breakpoints: BREAKPOINTS,
    
    // Force update (if needed)
    update: updateScreenSize
  }
}

// Export individual functions for direct usage (legacy support)
export const isMobileSize = () => screenWidth.value < BREAKPOINTS.MOBILE
export const isTabletSize = () => 
  screenWidth.value >= BREAKPOINTS.MOBILE && 
  screenWidth.value < BREAKPOINTS.TABLET
export const isDesktopSize = () => screenWidth.value >= BREAKPOINTS.TABLET