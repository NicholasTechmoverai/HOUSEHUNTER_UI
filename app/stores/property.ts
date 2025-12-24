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

interface PropertyHeadInfo {
  title?: string
  category?: string
  description?: string
  [key: string]: any
}

interface OngoingCreate {
  headInfo?: PropertyHeadInfo
  files: File[]
  rules: any[]
  amenities: any[]
  price?: PropertyPrice
  location?: PropertyLocation
  rulesContent: string
  propertyRules: any[]
  hasUnsavedChanges: boolean
}

interface PropertyState {
  ongoingCreate: OngoingCreate
  apartments: any[]
  rentals: any[]
  swaps: any[]
  trending: any[]
  preview: any[]
  interactive: any[]
  searched: any[]

  loading: {
    creating: boolean
    apartments: boolean
    rentals: boolean
    swaps: boolean
    trending: boolean
    preview: boolean
    interactive: boolean
    searched: boolean
  }
}

interface MissingFieldsReport {
  required: string[]
  optional: string[]
  isComplete: boolean
  completionPercentage: number
  missingRequiredCount: number
  missingOptionalCount: number
}

export const usePropertyStore = defineStore('property', {
  state: (): PropertyState => ({
    ongoingCreate: {
      headInfo: undefined,
      files: [],
      rules: [],
      amenities: [],
      price: undefined,
      location: undefined,
      rulesContent: '',
      propertyRules: [],
      hasUnsavedChanges: false
    },
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
    // Getter for quick completeness check
    isPropertyComplete(): boolean {
      return this.checkAllRequiredData().isComplete
    }
  },

  actions: {
    async checkAllRequiredData(): Promise<MissingFieldsReport> {
      const missingRequired: string[] = []
      const missingOptional: string[] = []

      // Helper to add field with proper labeling
      const addField = (list: string[], category: string, field: string) => {
        list.push(`${category}: ${field}`)
      }

      // 1. Check Head Info section
      if (!this.ongoingCreate.headInfo) {
        missingRequired.push('Basic Information (entire section)')
      } else {
        if (!this.ongoingCreate.headInfo.title) {
          addField(missingRequired, 'Basic Information', 'Title')
        }
        if (!this.ongoingCreate.headInfo.category) {
          addField(missingRequired, 'Basic Information', 'Category')
        }
        if (!this.ongoingCreate.headInfo.description) {
          addField(missingRequired, 'Basic Information', 'Description')
        }
      }

      // 2. Check Files section
      if (!this.ongoingCreate.files || this.ongoingCreate.files.length === 0) {
        missingRequired.push('Files: Property Images')
      }

      // 3. Check Amenities section
      if (!this.ongoingCreate.amenities || this.ongoingCreate.amenities.length === 0) {
        missingOptional.push('Amenities: No amenities selected')
      }

      // 4. Check Location section
      if (!this.ongoingCreate.location) {
        missingRequired.push('Location: Entire section')
      } else {
        if (!this.ongoingCreate.location.country) {
          addField(missingRequired, 'Location', 'Country')
        }
        if (!this.ongoingCreate.location.city) {
          addField(missingRequired, 'Location', 'City')
        }
        if (!this.ongoingCreate.location.selectedCoordinates) {
          addField(missingOptional, 'Location', 'Map Coordinates (optional)')
        }
      }

      // 5. Check Rules section
      if (!this.ongoingCreate.rules || this.ongoingCreate.rules.length === 0) {
        missingOptional.push('Rules: No rules specified')
      }

      // 6. Check Price section
      if (!this.ongoingCreate.price) {
        missingRequired.push('Pricing: Entire section')
      } else {
        // Required price fields
        if (!this.ongoingCreate.price.amount) {
          addField(missingRequired, 'Pricing', 'Amount')
        }
        if (!this.ongoingCreate.price.currency) {
          addField(missingRequired, 'Pricing', 'Currency')
        }
        if (!this.ongoingCreate.price.period) {
          addField(missingRequired, 'Pricing', 'Rental Period')
        }

        // Optional price fields
        if (!this.ongoingCreate.price.depositAmount) {
          addField(missingOptional, 'Pricing', 'Deposit Amount')
        }
        if (this.ongoingCreate.price.isRefundable === undefined) {
          addField(missingOptional, 'Pricing', 'Refundable Deposit')
        }
        if (!this.ongoingCreate.price.minRentPeriod) {
          addField(missingOptional, 'Pricing', 'Minimum Rental Period')
        }
      }

      // 7. Check Rules Content (if using advanced mode)
      if (!this.ongoingCreate.rulesContent?.trim()) {
        missingOptional.push('Rules: Detailed rules content')
      }

      // Calculate completion statistics
      const totalRequiredFields = 9 // Adjust based on your actual required count
      const missingRequiredCount = missingRequired.length
      const missingOptionalCount = missingOptional.length
      const completionPercentage = Math.max(
        0,
        Math.round(((totalRequiredFields - missingRequiredCount) / totalRequiredFields) * 100)
      )

      return {
        required: missingRequired,
        optional: missingOptional,
        isComplete: missingRequiredCount === 0,
        completionPercentage,
        missingRequiredCount,
        missingOptionalCount
      }
    },

    async persistOngoingCreate(): Promise<{
      success: boolean
      message: string
      data?: any
      errors?: string[]
    }> {
      const { post } = useApi()
      const endpoints = useEndpoints()

      const validation = await this.checkAllRequiredData()
      if (!validation.isComplete) {
        return {
          success: false,
          message: 'Cannot save incomplete property listing',
          errors: validation.required
        }
      }

      this.loading.creating = true
      this.ongoingCreate.hasUnsavedChanges = false

      try {
        const formData = new FormData()

        // JSON fields
        formData.append('headInfo', JSON.stringify(this.ongoingCreate.headInfo))
        formData.append('location', JSON.stringify(this.ongoingCreate.location))
        formData.append('amenities', JSON.stringify(this.ongoingCreate.amenities))
        formData.append('price', JSON.stringify(this.ongoingCreate.price))
        formData.append('propertyRules', JSON.stringify(this.ongoingCreate.propertyRules))
        formData.append('rulesContent', this.ongoingCreate.rulesContent || '')
        formData.append('createdAt', new Date().toISOString())

        // FILES (REAL FILE OBJECTS)
        this.ongoingCreate.files.forEach((file: File) => {
          formData.append('files', file)
        })

        const response = await post(endpoints.rental.create, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        this.resetOngoingCreate()

        return {
          success: true,
          message: response.message || 'Rental created successfully',
          data: response.data || response
        }

      } catch (error: any) {
        this.ongoingCreate.hasUnsavedChanges = true

        if (error.response) {
          const apiError = error.response.data
          return {
            success: false,
            message: apiError?.message || apiError?.detail || 'Failed to create rental',
            errors: apiError?.errors || []
          }
        }

        return {
          success: false,
          message: 'Network or server error'
        }

      } finally {
        this.loading.creating = false
      }
    },

    async validateAndPersist(): Promise<MissingFieldsReport> {
      const validation = await this.checkAllRequiredData()

      if (validation.isComplete) {
        await this.persistOngoingCreate()
        return validation
      } else {
        // Return validation report without persisting
        return validation
      }
    },

    resetOngoingCreate() {
      this.ongoingCreate = {
        headInfo: undefined,
        files: [],
        rules: [],
        amenities: [],
        price: undefined,
        location: undefined,
        rulesContent: '',
        propertyRules: [],
        hasUnsavedChanges: false
      }
    },

    getValidationSummary(): string {
      const report = this.checkAllRequiredData()

      if (report.isComplete) {
        return 'All required fields are complete. Ready to submit!'
      }

      const summary = []

      if (report.missingRequiredCount > 0) {
        summary.push(`Missing ${report.missingRequiredCount} required field(s)`)
      }

      if (report.missingOptionalCount > 0) {
        summary.push(`${report.missingOptionalCount} optional field(s) not filled`)
      }

      summary.push(`${report.completionPercentage}% complete`)

      return summary.join(' • ')
    },

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