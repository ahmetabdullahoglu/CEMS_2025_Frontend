import axios from 'axios'
import apiClient, { API_BASE_URL, tokenManager } from './client'
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  PasswordResetConfirm,
  PasswordResetRequest,
  User,
} from '@/types/auth.types'

interface RefreshTokenResponse {
  access_token: string
  refresh_token?: string
  token_type: string
}

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

/**
 * Change password for authenticated user
 */
export const changePassword = async (payload: ChangePasswordRequest): Promise<void> => {
  await apiClient.post('/auth/change-password', payload)
}

/**
 * Request password reset link
 */
export const requestPasswordReset = async (payload: PasswordResetRequest): Promise<void> => {
  await apiClient.post('/auth/request-password-reset', payload)
}

/**
 * Reset password with token
 */
export const resetPassword = async (payload: PasswordResetConfirm): Promise<void> => {
  await apiClient.post('/auth/reset-password', payload)
}

/**
 * Refresh access token using refresh token
 */
export const refreshTokens = async (): Promise<RefreshTokenResponse> => {
  const refreshToken = tokenManager.getRefreshToken()

  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await axios.post<RefreshTokenResponse>(`${API_BASE_URL}/auth/refresh`, {
    refresh_token: refreshToken,
  })

  tokenManager.setAccessToken(response.data.access_token)
  if (response.data.refresh_token) {
    tokenManager.setRefreshToken(response.data.refresh_token)
  }

  return response.data
}
