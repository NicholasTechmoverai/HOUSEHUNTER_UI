import { useAppConfig } from '#imports'
import type { ApiOptions, ApiResponse, ApiError } from '~/types/api'

export const useApi = () => {
  const { site } = useAppConfig()
  const apiBase = `${site.apiBase}/api/v1` || 'http://localhost:8000/api/v1'
  
  const nuxtApp = useNuxtApp()
  const toast = useToast()
  const loading = ref(false)
  const userStore = useUserStore()

const createAuthHeaders = (headers: Record<string, string> = {}): Record<string, string> => {
    const token = userStore.token
    
    if (!token) {
        throw new Error('No authentication token available')
    }
    
    const authHeaders: Record<string, string> = {
        'Authorization': `Bearer ${token}`
    }
    
    const hasContentType = headers['Content-Type'] || headers['content-type']
    
    if (hasContentType) {
        const contentTypeKey = headers['Content-Type'] ? 'Content-Type' : 'content-type'
        authHeaders[contentTypeKey] = headers[contentTypeKey]
    } else {
        authHeaders['Content-Type'] = 'application/json'
    }
    
    return authHeaders
}

  const prepareHeaders = (options: ApiOptions, authenticate: boolean = false): Record<string, string> => {
    const headers: Record<string, string> = { ...options.headers }
    
    if (authenticate) {
      try {
        const authHeaders = createAuthHeaders(headers)
        Object.assign(headers, authHeaders)
      } catch (error) {
        console.warn('Authentication warning:', error.message)
      }
    } else {
      const token = useCookie('auth_token')
      if (token.value && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${token.value}`
      }
    }
    
    const isFormData = options.body instanceof FormData
    const hasContentType = headers['Content-Type'] || headers['content-type']
    
    if (isFormData) {
      delete headers['Content-Type']
      delete headers['content-type']
    } else if (!hasContentType) {
      headers['Content-Type'] = 'application/json'
    }
    
    return headers
  }

  const handleResponse = async <T>(
    response: Response,
    options: ApiOptions
  ): Promise<ApiResponse<T>> => {
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    let data: T
    const contentType = response.headers.get('content-type')
    
    if (options.responseType === 'blob') {
      data = await response.blob() as T
    } else if (options.responseType === 'text') {
      data = await response.text() as T
    } else if (options.responseType === 'arrayBuffer') {
      data = await response.arrayBuffer() as T
    } else if (contentType?.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text() as T
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers
    }
  }

  const handleError = (error: any, endpoint: string): never => {
    const apiError: ApiError = new Error(error.message || 'Network error')
    apiError.status = error.status || 500
    apiError.code = error.code
    apiError.response = error.data
    
    if (error.status >= 400) {
      const message = error.data?.message || 
                     error.data?.detail || 
                     `Request failed: ${error.status}`
      
      toast.add({
        title: 'Error',
        description: message,
        icon: 'i-heroicons-exclamation-triangle',
        color: 'red'
      })
    }
    
    console.error(`API Error [${endpoint}]:`, error)
    
    throw apiError
  }

  const request = async <T = any>(
    method: string,
    endpoint: string,
    body?: any,
    authenticate: boolean = false,
    options: ApiOptions = {}
  ): Promise<T> => {
    const headers = prepareHeaders({ ...options, body }, authenticate)
    const url = new URL(`${apiBase}${endpoint}`)
    
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    
    loading.value = true
    
    try {
      const response = await $fetch(url.toString(), {
        method,
        body,
        headers,
        timeout: options.timeout
      })
      
      return response as T
      
    } catch (error: any) {
      handleError(error, endpoint)
    } finally {
      loading.value = false
    }
  }

  const withRetry = async <T>(
    fn: () => Promise<T>,
    options?: ApiOptions['retry']
  ): Promise<T> => {
    const retryConfig = options || { attempts: 3, delay: 1000 }
    
    for (let attempt = 1; attempt <= retryConfig.attempts; attempt++) {
      try {
        return await fn()
      } catch (error: any) {
        if (attempt === retryConfig.attempts) throw error
        
        if (retryConfig.onRetry) {
          retryConfig.onRetry(error, attempt)
        }
        
        await new Promise(resolve => setTimeout(resolve, retryConfig.delay * attempt))
      }
    }
    
    throw new Error('Max retries exceeded')
  }

  const get = async <T = any>(
    endpoint: string,
    params?: Record<string, any>,
    authenticate: boolean = false,
    options: ApiOptions = {}
  ): Promise<T> => {
    return await request<T>('GET', endpoint, undefined, authenticate, {
      ...options,
      params: { ...options.params, ...params }
    })
  }

  const post = async <T = any>(
    endpoint: string,
    body?: any,
    authenticate: boolean = false,
    options: ApiOptions = {}
  ): Promise<T> => {
    return await request<T>('POST', endpoint, body, authenticate, options)
  }

  const put = async <T = any>(
    endpoint: string,
    body?: any,
    authenticate: boolean = false,
    options: ApiOptions = {}
  ): Promise<T> => {
    return await request<T>('PUT', endpoint, body, authenticate, options)
  }

  const patch = async <T = any>(
    endpoint: string,
    body?: any,
    authenticate: boolean = false,
    options: ApiOptions = {}
  ): Promise<T> => {
    return await request<T>('PATCH', endpoint, body, authenticate, options)
  }

  const del = async <T = any>(
    endpoint: string,
    authenticate: boolean = false,
    options: ApiOptions = {}
  ): Promise<T> => {
    return await request<T>('DELETE', endpoint, undefined, authenticate, options)
  }

  const upload = async <T = any>(
    endpoint: string,
    formData: FormData,
    onProgress?: (progress: number) => void,
    authenticate: boolean = false,
    options: ApiOptions = {}
  ): Promise<T> => {
    return await post<T>(endpoint, formData, authenticate, {
      ...options,
      onUploadProgress: onProgress
    })
  }

  const download = async (
    endpoint: string,
    filename: string = 'download',
    params?: Record<string, any>,
    authenticate: boolean = false,
    options: ApiOptions = {}
  ): Promise<void> => {
    const response = await get<Blob>(endpoint, params, authenticate, {
      ...options,
      responseType: 'blob'
    })
    
    const url = window.URL.createObjectURL(response)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const checkAuth = (): { isAuthenticated: boolean; token?: string } => {
    const token = userStore.token
    return {
      isAuthenticated: !!token,
      token
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshTokenCookie = useCookie('refresh_token')
      if (!refreshTokenCookie.value) return false
      
      const response = await post<{ access_token: string }>(
        '/auth/refresh',
        { refresh_token: refreshTokenCookie.value },
        false,
        {}
      )
      
      if (response.access_token) {
        userStore.setToken(response.access_token)
        return true
      }
      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  return {
    get,
    post,
    put,
    patch,
    del,
    upload,
    download,
    checkAuth,
    refreshToken,
    request,
    withRetry,
    loading: readonly(loading),
    setAuthToken: (token: string) => {
      userStore.setToken(token)
      useCookie('auth_token').value = token
    },
    clearAuthToken: () => {
      userStore.clearToken()
      useCookie('auth_token').value = null
      useCookie('refresh_token').value = null
    }
  }
}

export type UseApiReturn = ReturnType<typeof useApi>