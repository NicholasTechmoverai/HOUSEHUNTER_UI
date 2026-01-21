export const useEndpoints = () => {
  const apiBase = useAppConfig().site.apiBase

  return {
    public: {
      info: (infoName: string) => `/public/${infoName}/info`,
    },
    utilities: {
      propertyCategories: '/utilities/property-categories',
      countries: "/utilities/countries",
      genders: "/utilities/allowed-genders",
      currencies: "/utilities/currencies",
    },
    user: {
      login: '/auth/login',
      register: '/auth/user/register',
      profile: '/user/profile',
      searchSuggestions: '/user/search/suggestions',
      searhHistory: (id: string) => `/user/${id}/search-history`,
      getById: (id: string) => `/user/${id}`,
      updateProfile: (id: string) => `/user/${id}/profile`,
      uploadAvatar: (id: string) => `/user/${id}/avatar`,
      changePassword: (id: string) => `/user/${id}/change-password`,
      getFavorites: (id: string) => `/user/${id}/favorites`,
      addFavorite: (id: string) => `/user/${id}/favorites`,
      removeFavorite: (id: string, propertyId: string) =>
        `/user/${id}/favorites/${propertyId}`,
      listings: (id: string) => `/user/${id}/listings`,
    },

    auth: {
      googleLogin: `${apiBase}/api/v1/auth/google_login`,
      oneTapGoogleLogin: `/auth/onetap-google-login`,
      facebookLogin: `${apiBase}/api/v1/auth/facebook_login`,
      sendVerificationCode: '/auth/verification/send-code',
      verifyCode: '/auth/verification/verify-code',
      renewToken: (id: string) => `/auth/${id}/new-token`,
      requestPasswordReset: '/auth/password/request-reset',
      resetPassword: '/auth/password/reset',
      changePassword: '/auth/password/change',
    },

    rental: {
      create: '/rental/',
      list: '/rental/',
      listTrending: '/rentals/trending',
      listFeatured: '/rentals/featured',
      listInteractive: '/rentals/intractive',

      getById: (id: string) => `/rental/${id}`,
      getByIdForEdit: (id: string) => `/rental/${id}/for-edit`,
      getBySlug: (slug: string) => `/rental/slug/${slug}`,

      updateHeadInfo: (rentalId: string) => `/rental/${rentalId}/head-info`,
      updateLocation: (rentalId: string) => `/rental/${rentalId}/location`,
      updatePricing: (rentalId: string) => `/rental/${rentalId}/pricing`,
      updateAmenities: (rentalId: string) => `/rental/${rentalId}/amenities`,
      updateRules: (rentalId: string) => `/rental/${rentalId}/rules`,

      uploadFiles: (rentalId: string) => `/rental/${rentalId}/files`,
      deleteFile: (rentalId: string, fileId: string) =>
        `/rental/${rentalId}/files/${fileId}`,

      toggleAvailability: (rentalId: string) =>
        `/rental/${rentalId}/availability`,
      updateStatus: (rentalId: string) => `/rental/${rentalId}/status`,
      toggleFeatured: (rentalId: string) => `/rental/${rentalId}/featured`,

      addManager: (rentalId: string) => `/rental/${rentalId}/managers`,
      removeManager: (rentalId: string, userId: string) =>
        `/rental/${rentalId}/managers/${userId}`,

      softDelete: (rentalId: string) => `/rental/${rentalId}/soft-delete`,
      hardDelete: (rentalId: string) => `/rental/${rentalId}/hard-delete`,
      restore: (rentalId: string) => `/rental/${rentalId}/restore`,

      getUserRentals: (userId: string) => `/rental/user/${userId}`,
      getManagedRentals: (userId: string) =>
        `/rental/user/${userId}/managed`,

      search: '/rental/search',
      filter: '/rental/filter',
      nearby: '/rental/nearby',
      featured: '/rental/featured',
      verified: '/rental/verified',

      userStats: (userId: string) => `/rental/user/${userId}/stats`,
      categoryStats: '/rental/stats/categories',

      verifyRental: (rentalId: string) => `/rental/${rentalId}/verify`,
      unverifyRental: (rentalId: string) => `/rental/${rentalId}/unverify`,
      rejectRental: (rentalId: string) => `/rental/${rentalId}/reject`,
    },

    listings: {
      create: '/rental/',
      getById: (id: string) => `/rental/${id}`,

      updateHeadInfo: (listingId: string) =>
        `/rental/${listingId}/head-info`,
      updateLocation: (listingId: string) =>
        `/rental/${listingId}/location`,
      updatePricing: (listingId: string) =>
        `/rental/${listingId}/pricing`,
      updateAmenities: (listingId: string) =>
        `/rental/${listingId}/amenities`,
      updateRules: (listingId: string) =>
        `/rental/${listingId}/rules`,

      uploadFiles: (listingId: string) =>
        `/rental/${listingId}/files`,

      getUserListings: (userId: string) =>
        `/rental/user/${userId}`,

      search: '/rental/search',
      featured: '/rental/featured',
    },
    agent: {
      init: (id: string) => `/agent/${id}/init`,
      create: '/agent/create',
      update: (id: string) => `/agent/${id}/update`,
      delete: (id: string) => `/agent/${id}/delete`,
      uploadProfilePicture: (id: string) => `/agent/${id}/upload-profile-picture`,
      getById: (id: string) => `/agent/${id}`,
      getTopAgents: '/agent/top',
      getAgentListings: (agentId: string) => `/agent/${agentId}/listings`,

    },

    apartment: {
      getListings: '/listings',
      getListingDetails: (id: string) => `/listings/${id}`,
    },
  }
}
