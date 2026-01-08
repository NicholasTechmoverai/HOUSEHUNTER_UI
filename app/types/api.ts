// types/api.ts
export interface ApiOptions {
  headers?: Record<string, string>
  params?: Record<string, any>
  timeout?: number
  responseType?: 'json' | 'text' | 'blob' | 'arrayBuffer'
  retry?: {
    attempts: number
    delay: number
    onRetry?: (error: any, attempt: number) => void
  }
  onUploadProgress?: (progress: number) => void
  onDownloadProgress?: (progress: number) => void
}

export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

export interface ApiError extends Error {
  status?: number
  code?: string
  response?: any
}

