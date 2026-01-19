export const useGoogleOneTap = () => {
    if (document.getElementById('google-gsi')) return

    const script = document.createElement('script')
    script.id = 'google-gsi'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    if (!import.meta.client) return
    if (!window.google?.accounts?.id) return

    const config = useRuntimeConfig()


    google.accounts.id.initialize({
        client_id: config.public.googleClientId,
        callback: handleCredential
    })

    google.accounts.id.prompt()
}


const handleCredential = async (response: { credential: string }) => {

    try {
        // Send the token to your backend for verification
        const { post } = useApi()  // your Axios composable or fetch
        const endpoints = useEndpoints()
        const result = await post(endpoints.auth.oneTapGoogleLogin, { token: response.credential })

        if (result.success) {
            const userStore = useUserStore()
            userStore.setUser(result.data.user, result.data.access_token)
        } else {
            console.error('Login failed:', result.message)
        }
    } catch (error) {
        console.error('Error sending token to backend:', error)
    }
}
