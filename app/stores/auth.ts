import { defineStore } from 'pinia'

interface VerificationInfo {
  identifier: string
  type: 'email' | 'phone' | '2fa'
  edit: boolean
  message?: string
  requiredFor?: string[]
  redirectAfter?: string
  timestamp?: number
}

interface PendingAction {
  type: 'route' | 'action'
  path?: string
  action?: string
  params?: Record<string, any>
  query?: Record<string, any>
  timestamp: number
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    verificationInfo: null as VerificationInfo | null,
    pendingActions: [] as PendingAction[],
    loading: false,
    error: null as any,
    verificationRequiredFor: [] as string[],
    lastAttemptedRoute: null as any
  }),

  getters: {
    hasPendingActions: (state) => state.pendingActions.length > 0,
    hasVerificationRequired: (state) => state.verificationRequiredFor.length > 0,
    nextPendingAction: (state) => state.pendingActions[0],
    requiresVerification: (state) => (actionType: string) =>
      state.verificationRequiredFor.includes(actionType),
    isEmailVerification: (state) => state.verificationInfo?.type === 'email',
    isPhoneVerification: (state) => state.verificationInfo?.type === 'phone',
    hasVerificationInfo: (state) => !!state.verificationInfo,
    getVerification: (state) => (type?: string) => {
      if (!state.verificationInfo) return null
      if (type && state.verificationInfo.type !== type) return null
      return state.verificationInfo
    }
  },

  actions: {
    setVerificationInfo(info: VerificationInfo) {
      this.verificationInfo = { ...info, timestamp: Date.now() }
    },

    clearVerificationInfo() {
      this.verificationInfo = null
    },

    addVerificationRequirement(actionType: string) {
      if (!this.verificationRequiredFor.includes(actionType)) {
        this.verificationRequiredFor.push(actionType)
      }
    },

    removeVerificationRequirement(actionType: string) {
      const index = this.verificationRequiredFor.indexOf(actionType)
      if (index > -1) this.verificationRequiredFor.splice(index, 1)
    },

    setLastAttemptedRouteToCurrent() {
      const route = useRoute()
      this.setLastAttemptedRoute(route)
    },

    setLastAttemptedRoute(route: any) {
      this.lastAttemptedRoute = {
        path: route.path,
        fullPath: route.fullPath,
        params: route.params,
        query: route.query,
        name: route.name,
        meta: route.meta,
        timestamp: Date.now()
      }
    },

    clearLastAttemptedRoute() {
      this.lastAttemptedRoute = null
    },

    addPendingRoute(route: any) {
      this.pendingActions = this.pendingActions.filter(
        action => !(action.type === 'route' && action.path === route.path)
      )

      this.pendingActions.push({
        type: 'route',
        path: route.path,
        params: route.params,
        query: route.query,
        timestamp: Date.now()
      })

      this.cleanupOldActions()
    },

    addPendingAction(actionType: string, params?: Record<string, any>) {
      this.pendingActions = this.pendingActions.filter(
        action => !(action.type === 'action' && action.action === actionType)
      )

      this.pendingActions.push({
        type: 'action',
        action: actionType,
        params,
        timestamp: Date.now()
      })

      this.cleanupOldActions()
    },

    popNextAction(): PendingAction | null {
      return this.pendingActions.shift() || null
    },

    clearPendingActions() {
      this.pendingActions = []
    },

    cleanupOldActions(maxAge = 30 * 60 * 1000) {
      const now = Date.now()
      this.pendingActions = this.pendingActions.filter(
        action => now - action.timestamp < maxAge
      )
    },

    async verifyCode(credentials: { identifier: string; code: string; type?: string }) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        const response = await post(endpoints.auth.verifyCode, {
          identifier: credentials.identifier,
          code: credentials.code,
          type: credentials.type || 'email'
        })

        this.clearVerificationInfo()

        return {
          success: response.success,
          message: response.message || response.detail || 'Verification successful',
          data: response,
          pendingActions: this.hasPendingActions
        }
      } catch (error: any) {
        this.error =
          error.response?.data?.message ||
          (error.response?.status === 429
            ? 'Too many attempts. Please try again later.'
            : error.message || 'Verification failed')
        throw error
      } finally {
        this.loading = false
      }
    },

    async resendVerificationCode(type: 'email' | 'phone' = 'email', identifier?: string) {
      const { post } = useApi()
      const endpoints = useEndpoints()

      this.loading = true
      this.error = null

      try {
        const response = await post(endpoints.auth.sendVerificationCode, {
          type,
          identifier: identifier || this.getUserIdentifier()
        })

        return {
          success: response.success,
          message: response.message || response.detail || 'Verification code resent successfully',
          data: response
        }
      } catch (error: any) {
        this.error =
          error.response?.details ||
          error.response?.data?.message ||
          (error.response?.status === 429
            ? 'Please wait before requesting another code.'
            : error.message || 'Failed to resend code')
        throw error
      } finally {
        this.loading = false
      }
    },

    checkIfVerificationRequired(route: any, actionType?: string) {
      if (actionType && this.requiresVerification(actionType)) {
        return {
          required: true,
          info: {
            identifier: this.getUserIdentifier(),
            type: this.getDefaultVerificationType(),
            edit: false,
            requiredFor: [actionType],
            redirectAfter: route.fullPath
          }
        }
      }

      const requiresAuth = route.meta?.requiresAuth
      const requiresVerified = route.meta?.requiresVerified

      if (requiresAuth || requiresVerified) {
        const userStore = useUserStore()

        if (!userStore.isAuthenticated) {
          this.setLastAttemptedRoute(route)
          return { required: false }
        }

        if (requiresVerified && !userStore.hasEmailVerified) {
          return {
            required: true,
            info: {
              identifier: userStore.user?.email || '',
              type: 'email',
              edit: false,
              requiredFor: ['route_access'],
              redirectAfter: route.fullPath,
              message: 'This route requires email verification.'
            }
          }
        }
      }

      return { required: false }
    },

    getUserIdentifier(): string {
      const userStore = useUserStore()
      return userStore.user?.email || userStore.user?.phone_number || ''
    },

    getDefaultVerificationType(): 'email' | 'phone' {
      const userStore = useUserStore()
      return userStore.user?.phone_number ? 'phone' : 'email'
    },

    restorePendingActionsAfterAuth() {
      if (this.hasPendingActions) {
        const nextAction = this.popNextAction()

        if (nextAction?.type === 'route' && nextAction.path) {
          return {
            type: 'redirect' as const,
            path: nextAction.path,
            params: nextAction.params,
            query: nextAction.query
          }
        }

        if (nextAction?.type === 'action' && nextAction.action) {
          return {
            type: 'action' as const,
            action: nextAction.action,
            params: nextAction.params
          }
        }
      }

      if (this.lastAttemptedRoute) {
        const route = this.lastAttemptedRoute
        this.clearLastAttemptedRoute()
        return {
          type: 'redirect' as const,
          path: route.path,
          params: route.params,
          query: route.query
        }
      }

      return null
    },

    handleRouteGuard(route: any): boolean {
      const verificationCheck = this.checkIfVerificationRequired(route)

      if (verificationCheck.required && verificationCheck.info) {
        this.setVerificationInfo(verificationCheck.info)
        const router = useRouter()
        router.push({
          name: 'auth-verify',
          query: { redirect: route.fullPath }
        })
        return false
      }

      return true
    },
    async handleGoogleLogin(): Promise<void> {
      try {
        const width = 500;
        const height = 600;

        // Center the popup
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        // Open popup window
        const popup = window.open(
          useEndpoints().auth.googleLogin,
          'Google Login',
          `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
        );

        if (!popup) {
          throw new Error('Popup blocked! Please allow popups for this site.');
        }

        // Listen for messages from the popup
        const messageHandler = (event: MessageEvent) => {
          // Security: only accept messages from our backend
          if (event.origin !== useAppConfig().site.apiBase) {
            throw new Error('unauthorized origin'+ event.origin)
          };

          const data = event.data;

          if (data.type === 'google-login-success') {
            console.log('✅ Google login successful:', data.user);

            useUserStore().setUser(data.user.user,data.user.access_token)
            const redirectTo = this.lastAttemptedRoute.fullPath
            navigateTo(redirectTo)
            this.clearLastAttemptedRoute()

            // Clean up
            window.removeEventListener('message', messageHandler);

            if (!popup.closed) popup.close();
          }

          if (data.type === 'google-login-error') {
            console.error('❌ Google login failed:', data.error);
            // this.showError(data.error || 'Google login failed');
            window.removeEventListener('message', messageHandler);
          }
        };

        window.addEventListener('message', messageHandler);

        // Optional: Check if popup closed without sending message
        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
            window.removeEventListener('message', messageHandler);

            // Only show error if we haven't already handled success/error
            // if (!this.googleLoginComplete) {
            //   this.showError('Login cancelled or popup closed');
            // }
          }
        }, 500);

      } catch (error: any) {
        console.error('Google login error:', error);
        // this.showError(error.message || 'Failed to start Google login');
      }
    },

    async handleFacebookLogin() {
      //  
    },

    clearAll() {
      this.clearVerificationInfo()
      this.clearPendingActions()
      this.clearLastAttemptedRoute()
      this.verificationRequiredFor = []
      this.error = null
    }
  },

  persist: {
    storage: process.client ? localStorage : undefined,
    paths: [
      'verificationInfo',
      'pendingActions',
      'verificationRequiredFor',
      'lastAttemptedRoute'
    ],
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    }
  }
})
