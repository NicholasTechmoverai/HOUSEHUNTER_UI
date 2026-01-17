// export default defineNuxtRouteMiddleware(async () => {
//   const userStore = useUserStore()

//   if (userStore.token && !userStore.user) {
//     await userStore.fetchUser()
//   }

//   if (!userStore.isAuthenticated) {
//     return navigateTo('/auth/login')
//   }
// })
