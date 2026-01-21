import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as any,
    userprofile: null as any,
    
    token: null as string | null,
    loading: false,
    breadCrumbItems: [],
    error: null as any,
    redirectRoutes: {
      verify_email: '/auth/verify-email',
      reset_password: '/auth/reset-password',
      verify_phone: '/auth/verify-phone',
      dashboard: '/',
      login: '/auth/login'
    }
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
    profile: (state) => state.user,
    hasEmailVerified: (state) => state.user?.email_verified || false,
    hasPhoneVerified: (state) => state.user?.phone_verified || false,
    requiresVerification: (state) => !state.user?.email_verified || !state.user?.phone_verified
  },

  actions: {
    updateBreadcrumbItems(item) {
      this.breadCrumbItems = item
    },

    setUser(user: any, token?: string) {
      this.user = user
      if (token) this.token = token
      
    },

    clearUser() {
      this.user = null
      this.token = null
      this.error = null
    },

    logout() {
      const authStore = useAuthStore()
      this.clearUser()
      authStore.clearPendingActions()
      authStore.clearLastAttemptedRoute()
      this.userprofile = null
      return true
    },

    async login(credentials: { email: string; password: string; remember_me?: boolean }) {
      const { post } = useApi()
      const endpoints = useEndpoints()
      const authStore = useAuthStore()

      this.loading = true
      this.error = null

      try {
        const response = await post(endpoints.user.login, credentials)

        if (response.success) {
          this.setUser(response.user, response.access_token)

          if (!response.user?.email_verified) {
            authStore.setVerificationInfo({
              identifier: credentials.email,
              type: 'email',
              edit: false,
              requiredFor: ['login'],
              message: 'Please verify your email to continue.',
              redirectAfter: this.redirectRoutes.dashboard
            })

            return {
              success: true,
              message: response.message,
              redirectTo: this.redirectRoutes.verify_email,
              requiresVerification: true
            }
          }

          if (!response.user?.phone_verified) {
            authStore.setVerificationInfo({
              identifier: response.user.phone_number || credentials.email,
              type: 'phone',
              edit: false,
              requiredFor: ['login'],
              message: 'Please verify your phone number to continue.',
              redirectAfter: this.redirectRoutes.dashboard
            })

            return {
              success: true,
              message: response.message,
              redirectTo: this.redirectRoutes.verify_phone,
              requiresVerification: true
            }
          }

          const pendingAction = authStore.restorePendingActionsAfterAuth()

          if (pendingAction?.type === 'redirect') {
            return {
              success: true,
              message: response.message,
              redirectTo: pendingAction.path,
              requiresVerification: false
            }
          }

          return {
            success: true,
            message: response.message,
            redirectTo: this.redirectRoutes.dashboard,
            requiresVerification: false
          }
        }

        return {
          success: false,
          message: response.message || 'Login failed'
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(payload: Record<string, any>) {
      const { post } = useApi()
      const endpoints = useEndpoints()
      const authStore = useAuthStore()

      this.loading = true
      this.error = null

      try {
        const response = await post(endpoints.user.register, payload)
        if (response.success) {
          this.setUser(response.user, response.access_token)
          authStore.setVerificationInfo({
            identifier: payload.email,
            type: 'email',
            edit: false,
            requiredFor: ['registration'],
            message: 'Please verify your email to activate your account.',
            redirectAfter: this.redirectRoutes.dashboard
          })

          return {
            ...response,
            redirectTo: this.redirectRoutes.verify_email
          }
        }

        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUser(forceRefresh = false) {
      if (this.user && !forceRefresh) return this.user

      const { get } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        const response = await get(endpoints.user.profile)
        this.user = response.user || response.data || response
        return this.user
      } catch (error: any) {
        if (error.response?.status === 401) {
          this.clearUser()
        }
        this.error = error.response?.data?.message || error.message || 'Failed to fetch user'
        throw error
      } finally {
        this.loading = false
      }
    },

    async verifyEmail(credentials: { email: string; code: string }) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        const response = await post(endpoints.user.verifyEmail, credentials)

        if (response.success && this.user) {
          this.user.email_verified = true
          this.user.email_verified_at = new Date().toISOString()
        }

        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Email verification failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async verifyPhone(credentials: { phone: string; code: string }) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        const response = await post(endpoints.user.verifyPhone, credentials)

        if (response.success && this.user) {
          this.user.phone_verified = true
          this.user.phone_verified_at = new Date().toISOString()
        }

        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Phone verification failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUserProfile(data: Record<string, any>) {
      const { patch,post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        const response = await post(endpoints.user.updateProfile(this.user.public_id), data,true)

        if (response.success) {
          this.user = { ...this.user, ...response.user }
        }

        return response
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Profile update failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async changePassword(data: { current_password: string; new_password: string }) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        return await post(endpoints.user.changePassword, data)
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Password change failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async forgotPassword(email: string) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        return await post(endpoints.user.forgotPassword, { email })
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Password reset request failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetPassword(data: { token: string; password: string }) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        return await post(endpoints.user.resetPassword, data)
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Password reset failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async get_search_history(type: string | null = null) {
      if (!this.user) return
      const { get } = useApi()
      const endpoints = useEndpoints()

      try {
        return await get(endpoints.user.searchHistory(this.user.id), { type }, true)
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Getting history failed'
        throw error
      }
    },

    async get_suggestions() {
      const { get } = useApi()
      const endpoints = useEndpoints()

      try {
        return await get(endpoints.user.searchHistory(this.user.id), {}, true)
      } catch (error: any) {
        this.error = error.response?.data?.message || error.message || 'Getting history failed'
        throw error
      }
    },

    async fetch_user_profile() {

      try {
        const { post } = useApi()
        const endpoints = useEndpoints()

        const response = await post(
          endpoints.user.profile,
          {}, true
        )

        if (response.success) {
          this.userprofile = response.data
          console.log("received user",response.data)
          return {
            success: true,
            message: 'Location saved successfully',
            data: response
          }
        } else {
          return {
            success: false,
            message: 'Failed to fetch user profile',
            errors: response.errors || []
          }
        }

      } catch (error: any) {
        return {
          success: false,
          message: 'Failed to load profile',
          errors: [error.message]
        }
      } finally {
      }
    },
    async fetch_user_listings(id:string  | null = null) {
      try {
        const { post } = useApi()
        const endpoints = useEndpoints()

        const response = await post(
          endpoints.user.listings(id?id :this.user.public_id ),
          {}, true
        )

        if (response.success) {
          this.userlistings = response.data.listings
          return {
            success: true,
            message: 'listings loaded successfully',
            data: response
          }
        } else {
          return {
            success: false,
            message: 'Failed to fetch user listings',
            errors: response.errors || []
          }
        }



      } catch (error: any) {
        return {
          success: false,
          message: 'Failed to load listings',
          errors: [error.message]
        }
      } finally {
      }

    },

    async fetch_user_notifications() {

    },

    init() {
      if (!this.user) {
        useGoogleOneTap()
      }
      if(this.token){
        this.renewT
      }
    },

    initCrossTabListener() {
      this.init()
      window.addEventListener('storage', (event: StorageEvent) => {
        if (event.key === 'user') {
          if (event.newValue) {
            try {
              const data = JSON.parse(event.newValue)
              this.user = data.user || null
              this.token = data.token || null
            } catch (e) {
              console.error('Failed to parse user-store:', e)
            }
          } else {
            this.clearUser()
          }
        }
      })
    },

    onMounted() {
      this.init()
      this.initCrossTabListener()
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user-store',
        storage: import.meta.client ? localStorage : undefined,
        paths: ['user', 'token']
      }
    ]
  }
})