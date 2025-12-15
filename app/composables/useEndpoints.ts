export const useEndpoints = () => {
  return {
    user: {
      login: '/auth/login',
      register: '/auth/user/register',
      profile: '/auth/profile',
    },
    auth:{
      googleLogin: `${useAppConfig().site.apiBase}/api/v1/auth/google_login`,
      facebookLogin: '/auth/facebook_login',
      sendVerificationCode: '/auth/verification/send-code',
      verifyCode: '/auth/verification/verify-code',
      renewToken: '/auth/verification/new-token',
      requestPasswordReset: '/auth/password/request-reset',
      resetPassword: '/auth/password/reset',
      changePassword: '/auth/password/change',

    },
    listings: {
      getListings: '/listings',
      getListingDetails: (id: string) => `/listings/${id}`,
    }
  }
}
