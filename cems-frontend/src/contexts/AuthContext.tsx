import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authApi from '@/lib/api/auth.api'
import { tokenManager } from '@/lib/api/client'
import type {
  User,
  LoginRequest,
  AuthState,
  ChangePasswordRequest,
  PasswordResetRequest,
  PasswordResetConfirm,
} from '@/types/auth.types'

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  changePassword: (payload: ChangePasswordRequest) => Promise<void>
  requestPasswordReset: (payload: PasswordResetRequest) => Promise<void>
  resetPassword: (payload: PasswordResetConfirm) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.getAccessToken()

      if (token) {
        try {
          const currentUser = await authApi.getCurrentUser()
          setUser(currentUser)
        } catch (error) {
          // Token is invalid, clear it
          tokenManager.clearTokens()
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setIsLoading(true)
      try {
        const response = await authApi.login(credentials)
        setUser(response.user)
        navigate('/dashboard')
      } catch (error) {
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [navigate]
  )

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await authApi.logout()
    } finally {
      setUser(null)
      tokenManager.clearTokens()
      setIsLoading(false)
      navigate('/login')
    }
  }, [navigate])

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authApi.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      // If refresh fails, logout
      await logout()
    }
  }, [logout])

  const changePassword = useCallback(async (payload: ChangePasswordRequest) => {
    await authApi.changePassword(payload)
  }, [])

  const requestPasswordReset = useCallback(async (payload: PasswordResetRequest) => {
    await authApi.requestPasswordReset(payload)
  }, [])

  const resetPassword = useCallback(async (payload: PasswordResetConfirm) => {
    await authApi.resetPassword(payload)
  }, [])

  useEffect(() => {
    if (!user) return

    const interval = setInterval(async () => {
      try {
        await authApi.refreshTokens()
      } catch (error) {
        await logout()
      }
    }, 10 * 60 * 1000) // refresh every 10 minutes

    return () => clearInterval(interval)
  }, [logout, user])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
    changePassword,
    requestPasswordReset,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
