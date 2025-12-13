// stores/property.ts
import { defineStore } from 'pinia'

export const usePropertyStore = defineStore('property', {
  state: () => ({
    apartments: [] as any[],
    rentals: [] as any[],
    swaps: [] as any[],
    trending: [] as any[],
    preview: [] as any[],
    interactive: [] as any[],
    searched: [] as any[],

    // loading states
    loading: {
      apartments: false,
      rentals: false,
      swaps: false,
      trending: false,
      preview: false,
      interactive: false,
      searched: false,
    }
  }),

  actions: {
    async fetchApartments() {
      if (this.apartments.length) return  // already loaded → skip

      this.loading.apartments = true
      const { get } = useApi()
      this.apartments = await get('/apartments')
      this.loading.apartments = false
    },

    async fetchRentals() {
      if (this.rentals.length) return
      this.loading.rentals = true
      const { get } = useApi()
      this.rentals = await get('/rentals')
      this.loading.rentals = false
    },

    async fetchSwaps() {
      if (this.swaps.length) return
      this.loading.swaps = true
      const { get } = useApi()
      this.swaps = await get('/swaps')
      this.loading.swaps = false
    },

    // add more...
  }
})
