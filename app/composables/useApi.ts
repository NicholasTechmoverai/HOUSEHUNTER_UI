export const useApi = () => {
  const { site } = useAppConfig()
  const apiBase = `${site.apiBase}/api/v1` || 'http://localhost:8000/api/v1' // fallback

  const get = async (endpoint: string) =>
    await $fetch(`${apiBase}${endpoint}`)

  const post = async (endpoint: string, body: any) =>
    await $fetch(`${apiBase}${endpoint}`, { method: 'POST', body })

  const put = async (endpoint: string, body: any) =>
    await $fetch(`${apiBase}${endpoint}`, { method: 'PUT', body })

  const patch = async (endpoint: string, body: any) =>
    await $fetch(`${apiBase}${endpoint}`, { method: 'PATCH', body })

  const del = async (endpoint: string) =>
    await $fetch(`${apiBase}${endpoint}`, { method: 'DELETE' })

  return { get, post, put, patch, del }
}
