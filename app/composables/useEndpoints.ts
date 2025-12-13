export const useEndpoints = () => {
  return {
    user: {
      login: '/auth/login',
      register: '/auth/register',
      profile: '/auth/profile',
    },
  }
}
