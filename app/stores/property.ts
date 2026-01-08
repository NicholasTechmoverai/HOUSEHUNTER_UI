import { defineStore } from 'pinia'

interface PropertyPrice {
  amount?: number
  currency?: string
  period?: string
  depositAmount?: number
  isRefundable?: boolean
  minRentPeriod?: number
}

interface PropertyLocation {
  country?: string
  city?: string
  selectedCoordinates?: { lat: number; lng: number }
  [key: string]: any
}


export const usePropertyStore = defineStore('property', {
  state: () => ({
    apartments: [],
    rentals: [],
    swaps: [],
    trending: [],
    preview: [],
    interactive: [],
    searched: [],

    loading: {
      creating: false,
      apartments: false,
      rentals: false,
      swaps: false,
      trending: false,
      preview: false,
      interactive: false,
      searched: false
    }
  }),

  getters: {
    isPropertyComplete(): boolean {
      return true
    }
  },

  actions: {

    async fetchApartments() {
      if (this.apartments.length) return

      this.loading.apartments = true
      const { get } = useApi()

      try {
        this.apartments = await get('/apartments')
      } finally {
        this.loading.apartments = false
      }
    },

    async fetchRentals() {
      if (this.rentals.length) return

      this.loading.rentals = true
      const { get } = useApi()

      try {
        this.rentals = await get('/rentals')
      } finally {
        this.loading.rentals = false
      }
    },

    async fetchSwaps() {
      if (this.swaps.length) return

      this.loading.swaps = true
      const { get } = useApi()

      try {
        this.swaps = await get('/swaps')
      } finally {
        this.loading.swaps = false
      }
    }
  }
})