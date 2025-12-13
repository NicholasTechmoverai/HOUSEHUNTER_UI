import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as any,
    token: null as string | null,
    loading: false,
    error: null as any,
    endpoints: useEndpoints(),
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    profile: (state) => state.user,
  },

  actions: {
    setUser(user: any, token?: string) {
      this.user = user
      if (token) this.token = token
    },

    logout() {
      this.user = null
      this.token = null
    },

    async login(credentials: { email: string; password: string ,remember_me?:boolean}) {
      const { post } = useApi()
      this.loading = true
      this.error = null

      try {
        const res = await post(this.endpoints.user.login, credentials)
        this.setUser(res.user ?? res.data ?? res, res.token)
        return res
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.loading = false
      }
    },

    async register(payload: Record<string, any>) {
      const { post } = useApi()
      this.loading = true
      this.error = null

      try {
        const res = await post(this.endpoints.user.register, payload)
        this.setUser(res.user ?? res.data ?? res, res.token)
        return res
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      if (this.user) return this.user

      const { get } = useApi()
      this.loading = true
      this.error = null

      try {
        const res = await get(this.endpoints.user.profile)
        this.user = res.user ?? res.data ?? res
        return this.user
      } catch (err) {
        this.error = err
        this.user = null
        throw err
      } finally {
        this.loading = false
      }
    },
  },

  persist: {
    storage: process.client ? localStorage : undefined,
    paths: ['user', 'token'],
  },
})
