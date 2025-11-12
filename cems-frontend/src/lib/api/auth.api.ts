import apiClient, { tokenManager } from './client'
import type { LoginRequest, LoginResponse, User } from '@/types/auth.types'

/**
 * Login user and store tokens
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials)

  // Store tokens in localStorage
  tokenManager.setAccessToken(response.data.access_token)
  tokenManager.setRefreshToken(response.data.refresh_token)

  return response.data
}

/**
 * Logout user and clear tokens
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout')
  } finally {
    // Always clear tokens, even if API call fails
    tokenManager.clearTokens()
  }
}

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me')
  return response.data
}
