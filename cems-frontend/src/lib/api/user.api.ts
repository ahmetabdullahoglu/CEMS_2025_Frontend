import apiClient from './client'
import type {
  User,
  UserListResponse,
  UserQueryParams,
  UserCreateRequest,
  UserUpdateRequest,
} from '@/types/user.types'

export const userApi = {
  // Get users list with filters and pagination
  getUsers: async (params?: UserQueryParams): Promise<UserListResponse> => {
    const response = await apiClient.get<UserListResponse>('/users', { params })
    return response.data
  },

  // Get user by ID
  getUser: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`)
    return response.data
  },

  // Create new user
  createUser: async (data: UserCreateRequest): Promise<User> => {
    const response = await apiClient.post<User>('/users', data)
    return response.data
  },

  // Update user
  updateUser: async (id: string, data: UserUpdateRequest): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, data)
    return response.data
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`)
  },

  // Lock/Unlock user
  toggleLockUser: async (id: string, lock: boolean): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}/lock`, { is_locked: lock })
    return response.data
  },

  // Reset user password
  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    await apiClient.put(`/users/${id}/reset-password`, { new_password: newPassword })
  },
}
