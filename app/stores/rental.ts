import { useApi } from '#imports'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export interface ExtraFee {
  id: string
  description?: string
  amount: number | string
}

export interface PropertyPrice {
  amount: number
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually'
  currency: string

  depositAmount: number | null
  depositType: 'One month rent' | 'Two months rent' | 'Fixed amount' | 'Negotiable' | null

  isRefundable: boolean
  minRentPeriod: number
  utilitiesIncluded: boolean

  extraFees: ExtraFee[]
}
interface Coordinates {
  lat: number
  long: number
}
interface LocationUploadData {
  country: string
  state: string
  city: string
  address: string
  coordinates: Coordinates
}
const defaultLocationData: LocationUploadData = {
  country: 'kenya',
  state: '',
  city: '',
  address: '',
  coordinates: { lat: 0, long: 0 }
}


const defaultPriceForm: PropertyPrice = {
    amount: '',
    period: 'monthly',
    currency: 'KES',
    depositAmount: null,
    depositType: 'One month rent',
    isRefundable: true,
    minRentPeriod: 1,
    utilitiesIncluded: false,
    electricity: null,
    water: null,
    internet: null,
    cleaningFee: null,
    serviceFee: null,
    extraFees: [] as any[]
}

interface PropertyLocation {
    country?: string
    city?: string
    selectedCoordinates?: { lat: number; lng: number }
    [key: string]: any
}

interface PropertyHeadInfo {
    title: string
    category: string
    description: string
    profile_picture: string
    theme_color: string
    year_built: number | null
    lot_size: number | null
    floor_number: number | null
}
const DefaultPropertyHeadInfo: PropertyHeadInfo = {
    title: '',
    category: '',
    description: '',
    profile_picture: '',
    theme_color: '#FFFFFF',
    year_built: null,
    lot_size: null,
    floor_number: null
}

interface PropertyRule {
    id?: string
    title: string
    description: string
    is_mandatory: boolean
    created_at?: string
}

interface PropertyAmenity {
    id?: string
    name: string
    slug: string
    description?: string
    icon?: string
    is_free: boolean
    sort_order: number
}

interface UploadedFile {
    id: string
    file: File
    url?: string
    progress: number
    status: 'pending' | 'uploading' | 'completed' | 'failed'
    error?: string
}

interface RentalSection {
    id: string
    data: any
    status: 'draft' | 'saved' | 'synced' | 'error'
    lastUpdated: string
    error?: string
}

interface OngoingCreate {
    id: string
    rentalId?: string
    headInfo: RentalSection
    location: RentalSection
    price: RentalSection
    amenities: RentalSection
    rules: RentalSection
    files: []
    hasUnsavedChanges: boolean
    createdAt: string
}

interface PropertyState {
    ongoingCreate: OngoingCreate
    activeRentalId?: string
    rentalSessions: Record<string, OngoingCreate>
    rentals: any[]
    trending: any[]
    preview: any[]
    interactive: any[]
    searched: any[]
    userRentals: any[]
    loading: {
        creating: boolean
        headInfo: boolean
        location: boolean
        price: boolean
        amenities: boolean
        rules: boolean
        files: boolean
        rentals: boolean
        trending: boolean
        preview: boolean
        interactive: boolean
        searched: boolean
    }
    uploadProgress: Record<string, number>
}

interface MissingFieldsReport {
    required: string[]
    optional: string[]
    isComplete: boolean
    completionPercentage: number
    missingRequiredCount: number
    missingOptionalCount: number
}

interface ApiResponse {
    success: boolean
    message: string
    data?: any
    errors?: string[]
}

const createNewRentalSession = (): OngoingCreate => {
    const sessionId = uuidv4()
    const now = new Date().toISOString()

    const createSection = (defaultData:any=null): RentalSection => ({
        id: uuidv4(),
        data: defaultData,
        status: 'draft',
        lastUpdated: now
    })

    return {
        id: sessionId,
        rentalId: undefined,
        headInfo: createSection(DefaultPropertyHeadInfo),
        location: createSection(defaultLocationData),
        price: createSection(defaultPriceForm),
        amenities: createSection(),
        rules: createSection([]),
        files: [],
        hasUnsavedChanges: false,
        createdAt: now
    }
}

export const useRentalStore = defineStore('rental', {
    state: (): PropertyState => ({
        ongoingCreate: createNewRentalSession(),
        activeRentalId: undefined,
        rentalSessions: {},
        rentals: [],
        trending: [],
        preview: [],
        interactive: [],
        searched: [],
        userRentals: [],
        loading: {
            creating: false,
            headInfo: false,
            location: false,
            price: false,
            amenities: false,
            rules: false,
            files: false,
            rentals: false,
            trending: false,
            preview: false,
            interactive: false,
            searched: false
        },
        uploadProgress: {}
    }),

    getters: {
        isPropertyComplete(): boolean {
            return this.checkAllRequiredData().isComplete
        },

        rentalProgress(): number {
            const sections = ['headInfo', 'location', 'price', 'amenities', 'rules', 'files'] as const
            const completed = sections.filter(section =>
                this.ongoingCreate[section].status === 'synced'
            ).length
            return Math.round((completed / sections.length) * 100)
        },

        hasRentalId(): boolean {
            return !!this.ongoingCreate.rentalId
        },

        uploadedFiles(): UploadedFile[] {
            return this.ongoingCreate.files.filter(file => file.status === 'completed')
        },

        pendingFiles(): UploadedFile[] {
            return this.ongoingCreate.files.filter(file => file.status !== 'completed')
        }
    },

    actions: {
        createNewRentalSession() {
            return createNewRentalSession()
        },

        startNewRentalSession(): string {
            const newSession = createNewRentalSession()
            this.ongoingCreate = newSession
            this.rentalSessions[newSession.id] = newSession
            this.activeRentalId = undefined
            return newSession.id
        },

        switchRentalSession(sessionId: string): boolean {
            if (this.rentalSessions[sessionId]) {
                this.ongoingCreate = this.rentalSessions[sessionId]
                this.activeRentalId = this.ongoingCreate.rentalId
                return true
            }
            return false
        },

        saveCurrentSession() {
            this.rentalSessions[this.ongoingCreate.id] = { ...this.ongoingCreate }
        },

        deleteRentalSession(sessionId: string) {
            delete this.rentalSessions[sessionId]
            if (sessionId === this.ongoingCreate.id) {
                this.startNewRentalSession()
            }
        },

        listRentalSessions() {
            return Object.values(this.rentalSessions).map(session => ({
                id: session.id,
                title: session.headInfo.data?.title || 'Untitled Rental',
                createdAt: session.createdAt,
                progress: this.calculateSessionProgress(session)
            }))
        },

        calculateSessionProgress(session: OngoingCreate): number {
            const sections = ['headInfo', 'location', 'price', 'amenities', 'rules'] as const
            const completed = sections.filter(section =>
                session[section].status === 'synced'
            ).length
            return Math.round((completed / sections.length) * 100)
        },

        setHeadInfo(data: PropertyHeadInfo) {
            this.ongoingCreate.headInfo = {
                ...this.ongoingCreate.headInfo,
                id: uuidv4(),
                data,
                status: 'draft',
                lastUpdated: new Date().toISOString()
            }
            this.ongoingCreate.hasUnsavedChanges = true
            this.saveCurrentSession()
        },

        setLocation(data: PropertyLocation) {
            this.ongoingCreate.location = {
                ...this.ongoingCreate.location,
                id: uuidv4(),
                data,
                status: 'draft',
                lastUpdated: new Date().toISOString()
            }
            this.ongoingCreate.hasUnsavedChanges = true
            this.saveCurrentSession()
        },

        setPrice(data: PropertyPrice) {
            this.ongoingCreate.price = {
                ...this.ongoingCreate.price,
                id: uuidv4(),
                data,
                status: 'draft',
                lastUpdated: new Date().toISOString()
            }
            this.ongoingCreate.hasUnsavedChanges = true
            this.saveCurrentSession()
        },

        setAmenities(data: PropertyAmenity[]) {
            this.ongoingCreate.amenities = {
                ...this.ongoingCreate.amenities,
                id: uuidv4(),
                data,
                status: 'draft',
                lastUpdated: new Date().toISOString()
            }
            this.ongoingCreate.hasUnsavedChanges = true
            this.saveCurrentSession()
        },

        setRules(data: PropertyRule[]) {
            this.ongoingCreate.rules = {
                ...this.ongoingCreate.rules,
                id: uuidv4(),
                data,
                status: 'draft',
                lastUpdated: new Date().toISOString()
            }
            this.ongoingCreate.hasUnsavedChanges = true
            this.saveCurrentSession()
        },

        addFiles(files: File[]) {
            console.log(files)
            this.ongoingCreate.files = [...files]
            this.ongoingCreate.hasUnsavedChanges = true
            console.log("saved", this.ongoingCreate.files)

            this.saveCurrentSession()

        },

        removeFile(fileId: string) {
            this.ongoingCreate.files = this.ongoingCreate.files.filter(file => file.id !== fileId)
            this.ongoingCreate.hasUnsavedChanges = true
            this.saveCurrentSession()
        },

        async uploadHeadInfo(): Promise<ApiResponse> {
            if (!this.ongoingCreate.headInfo.data) {
                return {
                    success: false,
                    message: 'No head info data to upload'
                }
            }

            this.loading.headInfo = true

            try {
                const { post } = useApi()
                const endpoints = useEndpoints()

                const endpoint = this.ongoingCreate.rentalId
                    ? endpoints.rental.updateHeadInfo(this.ongoingCreate.rentalId)
                    : endpoints.rental.updateHeadInfo(this.ongoingCreate.id)

                const response = await post(endpoint,
                    this.ongoingCreate.headInfo, true
                )

                if (!this.ongoingCreate.rentalId && response.data?.id) {
                    this.ongoingCreate.rentalId = response.data.id
                    this.activeRentalId = response.data.id
                }

                this.ongoingCreate.headInfo.status = 'synced'
                this.ongoingCreate.headInfo.lastUpdated = new Date().toISOString()
                this.saveCurrentSession()

                return {
                    success: true,
                    message: 'Head info saved successfully',
                    data: response
                }

            } catch (error: any) {
                this.ongoingCreate.headInfo.status = 'error'
                this.ongoingCreate.headInfo.error = error.message
                this.saveCurrentSession()

                return {
                    success: false,
                    message: 'Failed to save head info',
                    errors: [error.message]
                }
            } finally {
                this.loading.headInfo = false
            }
        },

        async uploadLocation(): Promise<ApiResponse> {
            if (!this.ongoingCreate.location.data || !this.ongoingCreate.rentalId) {
                return {
                    success: false,
                    message: !this.ongoingCreate.rentalId
                        ? 'Create rental first before uploading location'
                        : 'No location data to upload'
                }
            }

            this.loading.location = true

            try {
                const { post } = useApi()
                const endpoints = useEndpoints()

                const response = await post(
                    endpoints.rental.updateLocation(this.ongoingCreate.rentalId),
                    this.ongoingCreate.location.data, true
                )

                this.ongoingCreate.location.status = 'synced'
                this.ongoingCreate.location.lastUpdated = new Date().toISOString()
                this.saveCurrentSession()

                return {
                    success: true,
                    message: 'Location saved successfully',
                    data: response
                }

            } catch (error: any) {
                this.ongoingCreate.location.status = 'error'
                this.ongoingCreate.location.error = error.message
                this.saveCurrentSession()

                return {
                    success: false,
                    message: 'Failed to save location',
                    errors: [error.message]
                }
            } finally {
                this.loading.location = false
            }
        },

        async uploadPrice(): Promise<ApiResponse> {
            if (!this.ongoingCreate.price.data || !this.ongoingCreate.rentalId) {
                return {
                    success: false,
                    message: !this.ongoingCreate.rentalId
                        ? 'Create rental first before uploading price'
                        : 'No price data to upload'
                }
            }

            this.loading.price = true

            try {
                const { post } = useApi()
                const endpoints = useEndpoints()

                const response = await post(
                    endpoints.rental.updatePricing(this.ongoingCreate.rentalId),
                    this.ongoingCreate.price.data, true
                )

                this.ongoingCreate.price.status = 'synced'
                this.ongoingCreate.price.lastUpdated = new Date().toISOString()
                this.saveCurrentSession()

                return {
                    success: true,
                    message: 'Price saved successfully',
                    data: response
                }

            } catch (error: any) {
                this.ongoingCreate.price.status = 'error'
                this.ongoingCreate.price.error = error.message
                this.saveCurrentSession()

                return {
                    success: false,
                    message: 'Failed to save price',
                    errors: [error.message]
                }
            } finally {
                this.loading.price = false
            }
        },

        async uploadAmenities(): Promise<ApiResponse> {
            if (!this.ongoingCreate.amenities.data || !this.ongoingCreate.rentalId) {
                return {
                    success: false,
                    message: !this.ongoingCreate.rentalId
                        ? 'Create rental first before uploading amenities'
                        : 'No amenities data to upload'
                }
            }

            this.loading.amenities = true

            try {
                const { post } = useApi()
                const endpoints = useEndpoints()

                const response = await post(
                    endpoints.rental.updateAmenities(this.ongoingCreate.rentalId),
                    this.ongoingCreate.amenities.data, true
                )

                this.ongoingCreate.amenities.status = 'synced'
                this.ongoingCreate.amenities.lastUpdated = new Date().toISOString()
                this.saveCurrentSession()

                return {
                    success: true,
                    message: 'Amenities saved successfully',
                    data: response
                }

            } catch (error: any) {
                this.ongoingCreate.amenities.status = 'error'
                this.ongoingCreate.amenities.error = error.message
                this.saveCurrentSession()

                return {
                    success: false,
                    message: 'Failed to save amenities',
                    errors: [error.message]
                }
            } finally {
                this.loading.amenities = false
            }
        },

        async uploadRules(): Promise<ApiResponse> {
            if (!this.ongoingCreate.rules.data || !this.ongoingCreate.rentalId) {
                return {
                    success: false,
                    message: !this.ongoingCreate.rentalId
                        ? 'Create rental first before uploading rules'
                        : 'No rules data to upload'
                }
            }

            this.loading.rules = true

            try {
                const { post } = useApi()
                const endpoints = useEndpoints()

                const response = await post(
                    endpoints.rental.updateRules(this.ongoingCreate.rentalId),
                    this.ongoingCreate.rules.data,true
                )

                this.ongoingCreate.rules.status = 'synced'
                this.ongoingCreate.rules.lastUpdated = new Date().toISOString()
                this.saveCurrentSession()

                return {
                    success: true,
                    message: 'Rules saved successfully',
                    data: response
                }

            } catch (error: any) {
                this.ongoingCreate.rules.status = 'error'
                this.ongoingCreate.rules.error = error.message
                this.saveCurrentSession()

                return {
                    success: false,
                    message: 'Failed to save rules',
                    errors: [error.message]
                }
            } finally {
                this.loading.rules = false
            }
        },

        async uploadFiles(): Promise<ApiResponse> {
            if (!this.ongoingCreate.rentalId || this.ongoingCreate.files.length === 0) {
                return {
                    success: false,
                    message: !this.ongoingCreate.rentalId
                        ? 'Create rental first before uploading files'
                        : 'No files to upload'
                }
            }

            this.loading.files = true

            // const pendingFiles = this.ongoingCreate.files.filter(f => f.status === 'pending')
            // pendingFiles.forEach(file => file.status = 'uploading')

            try {
                const { post } = useApi()
                const endpoints = useEndpoints()

                const formData = new FormData()
                this.ongoingCreate.files.forEach(file => {
                    formData.append('files', file, file.name)
                })

                const response = await post(
                    endpoints.rental.uploadFiles(this.ongoingCreate.rentalId),
                    formData, true, { headers: { 'Content-Type': 'multipart/form-data' } }
                )

                // pendingFiles.forEach(file => {
                //     file.status = 'completed'
                //     file.url = response.data?.files?.find((f: any) => f.filename === file.file.name)?.url
                // })

                this.saveCurrentSession()

                return {
                    success: true,
                    message: 'Files uploaded successfully',
                    data: response
                }

            } catch (error: any) {
                // pendingFiles.forEach(file => {
                //     file.status = 'failed'
                //     file.error = error.message
                // })
                this.saveCurrentSession()

                return {
                    success: false,
                    message: 'Failed to upload files',
                    errors: [error.message]
                }
            } finally {
                this.loading.files = false
            }
        },

        async uploadAllSections(): Promise<ApiResponse[]> {
            const results: ApiResponse[] = []

            if (this.ongoingCreate.headInfo.status !== 'synced') {
                results.push(await this.uploadHeadInfo())
            }

            if (this.ongoingCreate.rentalId) {
                const sections = [
                    { name: 'location', uploadFn: () => this.uploadLocation() },
                    { name: 'price', uploadFn: () => this.uploadPrice() },
                    { name: 'amenities', uploadFn: () => this.uploadAmenities() },
                    { name: 'rules', uploadFn: () => this.uploadRules() },
                    { name: 'files', uploadFn: () => this.uploadFiles() }
                ] as const

                for (const section of sections) {
                    if (this.ongoingCreate[section.name].status !== 'synced' &&
                        this.ongoingCreate[section.name].data) {
                        results.push(await section.uploadFn())
                    }
                }
            }

            return results
        },

        async persistOngoingCreate(): Promise<ApiResponse> {
            const results = await this.uploadAllSections()

            const failed = results.filter(r => !r.success)
            if (failed.length > 0) {
                return {
                    success: false,
                    message: `Failed to upload ${failed.length} section(s)`,
                    errors: failed.flatMap(f => f.errors || [])
                }
            }

            this.ongoingCreate.hasUnsavedChanges = false
            this.saveCurrentSession()

            return {
                success: true,
                message: 'All sections saved successfully',
                data: { results }
            }
        },

        async checkAllRequiredData(): Promise<MissingFieldsReport> {
            const missingRequired: string[] = []
            const missingOptional: string[] = []

            const addField = (list: string[], category: string, field: string) => {
                list.push(`${category}: ${field}`)
            }

            if (!this.ongoingCreate.headInfo.data) {
                missingRequired.push('Basic Information')
            } else {
                if (!this.ongoingCreate.headInfo.data.title) {
                    addField(missingRequired, 'Basic Information', 'Title')
                }
                if (!this.ongoingCreate.headInfo.data.category) {
                    addField(missingRequired, 'Basic Information', 'Category')
                }
                if (!this.ongoingCreate.headInfo.data.description) {
                    addField(missingRequired, 'Basic Information', 'Description')
                }
            }

            if (this.ongoingCreate.files.length === 0) {
                missingRequired.push('Files')
            }

            if (!this.ongoingCreate.amenities.data || this.ongoingCreate.amenities.data.length === 0) {
                missingOptional.push('Amenities')
            }

            if (!this.ongoingCreate.location.data) {
                missingRequired.push('Location')
            } else {
                if (!this.ongoingCreate.location.data.country) {
                    addField(missingRequired, 'Location', 'Country')
                }
                if (!this.ongoingCreate.location.data.city) {
                    addField(missingRequired, 'Location', 'City')
                }
                if (!this.ongoingCreate.location.data.selectedCoordinates) {
                    addField(missingOptional, 'Location', 'Map Coordinates')
                }
            }

            if (!this.ongoingCreate.rules.data || this.ongoingCreate.rules.data.length === 0) {
                missingOptional.push('Rules')
            }

            if (!this.ongoingCreate.price.data) {
                missingRequired.push('Pricing')
            } else {
                if (!this.ongoingCreate.price.data.amount) {
                    addField(missingRequired, 'Pricing', 'Amount')
                }
                if (!this.ongoingCreate.price.data.currency) {
                    addField(missingRequired, 'Pricing', 'Currency')
                }
                if (!this.ongoingCreate.price.data.period) {
                    addField(missingRequired, 'Pricing', 'Rental Period')
                }
            }

            const totalRequiredFields = 9
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

        resetCurrentSession() {
            this.ongoingCreate = createNewRentalSession()
            this.activeRentalId = undefined
            this.saveCurrentSession()
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
        }
    }
})