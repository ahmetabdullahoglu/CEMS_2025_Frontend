import axios, { AxiosError } from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// Get API base URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management utilities
const TOKEN_KEY = 'cems_access_token'
const REFRESH_TOKEN_KEY = 'cems_refresh_token'

export const tokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },
  setAccessToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token)
  },
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },
  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },
  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Track if we're currently refreshing the token to avoid multiple refresh requests
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = tokenManager.getRefreshToken()

      if (!refreshToken) {
        // No refresh token available, redirect to login
        tokenManager.clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        const { access_token, refresh_token: new_refresh_token } = response.data

        // Store new tokens
        tokenManager.setAccessToken(access_token)
        if (new_refresh_token) {
          tokenManager.setRefreshToken(new_refresh_token)
        }

        // Update the authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`
        }

        // Process the queued requests
        processQueue(null, access_token)

        // Retry the original request
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        processQueue(refreshError as Error, null)
        tokenManager.clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Handle other errors
    return Promise.reject(error)
  }
)

// API error handler utility
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string; message?: string }>

    if (axiosError.response) {
      // Server responded with error
      const data = axiosError.response.data as { detail?: string; message?: string; error?: { message?: string } }

      const errorMessage =
        data?.error?.message ||
        data?.detail ||
        data?.message ||
        'An error occurred while processing your request'
      return errorMessage
    } else if (axiosError.request) {
      // Request made but no response
      return 'Unable to connect to the server. Please check your internet connection.'
    }
  }

  // Generic error
  return 'An unexpected error occurred. Please try again.'
}

export default apiClient
