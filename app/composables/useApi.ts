// composables/useApi.ts
import { useAppConfig } from '#imports'
import type { ApiOptions, ApiResponse, ApiError } from '~/types/api'

export const useApi = () => {
  const { site } = useAppConfig()
  const apiBase = `${site.apiBase}/api/v1` || 'http://localhost:8000/api/v1'
  
  const nuxtApp = useNuxtApp()
  const toast = useToast()
  const loading = ref(false)

  // Request interceptor
  const beforeRequest = (options: ApiOptions): ApiOptions => {
    // Add auth token if available
    const token = useCookie('auth_token')
    if (token.value && !options.headers?.['Authorization']) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token.value}`
      }
    }
    
    // Set default content-type if not multipart/form-data
    if (!options.headers?.['Content-Type'] && !options.headers?.['content-type']) {
      options.headers = {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }
    
    return options
  }

  // Response interceptor
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

  // Error handler
  const handleError = (error: any, endpoint: string): never => {
    const apiError: ApiError = new Error(error.message || 'Network error')
    apiError.status = error.status || 500
    apiError.code = error.code
    apiError.response = error.data
    
    // Show toast notification for user-facing errors
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
    
    // Log error for debugging
    console.error(`API Error [${endpoint}]:`, error)
    
    throw apiError
  }

  // Core request function
  const request = async <T = any>(
    method: string,
    endpoint: string,
    body?: any,
    options: ApiOptions = {}
  ): Promise<T> => {
    const finalOptions = beforeRequest(options)
    const url = new URL(`${apiBase}${endpoint}`)
    
    // Add query params
    if (finalOptions.params) {
      Object.entries(finalOptions.params).forEach(([key, value]) => {
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
        headers: finalOptions.headers,
        timeout: finalOptions.timeout,
        onRequest({ options }) {
          // Upload progress
          if (finalOptions.onUploadProgress && options.body instanceof FormData) {
            // You'd need XMLHttpRequest for actual progress tracking
            // This is a simplified version
          }
        },
        onResponse({ response }) {
          // Download progress would go here
        }
      })
      
      return response as T
      
    } catch (error: any) {
      handleError(error, endpoint)
    } finally {
      loading.value = false
    }
  }

  // Retry wrapper
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

  // HTTP methods
  const get = async <T = any>(
    endpoint: string,
    params?: Record<string, any>,
    options: ApiOptions = {}
  ): Promise<T> => {
    return await request<T>('GET', endpoint, undefined, {
      ...options,
      params: { ...options.params, ...params }
    })
  }

  const post = async <T = any>(
    endpoint: string,
    body?: any,
    options: ApiOptions = {}
  ): Promise<T> => {
    // Special handling for FormData
    if (body instanceof FormData) {
      // Don't set Content-Type for FormData - browser will set it with boundary
      delete options.headers?.['Content-Type']
      delete options.headers?.['content-type']
    }
    
    return await request<T>('POST', endpoint, body, options)
  }

  const put = async <T = any>(
    endpoint: string,
    body?: any,
    options: ApiOptions = {}
  ): Promise<T> => {
    return await request<T>('PUT', endpoint, body, options)
  }

  const patch = async <T = any>(
    endpoint: string,
    body?: any,
    options: ApiOptions = {}
  ): Promise<T> => {
    return await request<T>('PATCH', endpoint, body, options)
  }

  const del = async <T = any>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<T> => {
    return await request<T>('DELETE', endpoint, undefined, options)
  }

  // Upload with progress
  const upload = async <T = any>(
    endpoint: string,
    formData: FormData,
    onProgress?: (progress: number) => void,
    options: ApiOptions = {}
  ): Promise<T> => {
    return await post<T>(endpoint, formData, {
      ...options,
      onUploadProgress: onProgress
    })
  }

  // Download file
  const download = async (
    endpoint: string,
    filename: string = 'download',
    params?: Record<string, any>,
    options: ApiOptions = {}
  ): Promise<void> => {
    const response = await get<Blob>(endpoint, params, {
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

  return {
    // Core methods
    get,
    post,
    put,
    patch,
    del,
    upload,
    download,
    
    // Utilities
    request,
    withRetry,
    
    // State
    loading: readonly(loading),
    
    // Interceptors
    setAuthToken: (token: string) => {
      useCookie('auth_token').value = token
    },
    clearAuthToken: () => {
      useCookie('auth_token').value = null
    }
  }
}

// For TypeScript support
export type UseApiReturn = ReturnType<typeof useApi>



// export const useApi = () => {
//   const { site } = useAppConfig()
//   const apiBase = `${site.apiBase}/api/v1` || 'http://localhost:8000/api/v1'

//   const request = async (
//     method: string,
//     endpoint: string,
//     body?: any,
//     options: {
//       headers?: Record<string, string>
//       params?: Record<string, any>
//       timeout?: number
//     } = {}
//   ) => {
//     const url = new URL(`${apiBase}${endpoint}`)
    
//     // Add query params
//     if (options.params) {
//       Object.entries(options.params).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           url.searchParams.append(key, String(value))
//         }
//       })
//     }
    
//     return await $fetch(url.toString(), {
//       method,
//       body,
//       headers: options.headers,
//       timeout: options.timeout
//     })
//   }

//   const get = async (endpoint: string, params?: any, options?: any) =>
//     await request('GET', endpoint, undefined, { ...options, params })

//   const post = async (endpoint: string, body?: any, options?: any) =>
//     await request('POST', endpoint, body, options)

//   const put = async (endpoint: string, body?: any, options?: any) =>
//     await request('PUT', endpoint, body, options)

//   const patch = async (endpoint: string, body?: any, options?: any) =>
//     await request('PATCH', endpoint, body, options)

//   const del = async (endpoint: string, options?: any) =>
//     await request('DELETE', endpoint, undefined, options)

//   return { get, post, put, patch, del }
// }