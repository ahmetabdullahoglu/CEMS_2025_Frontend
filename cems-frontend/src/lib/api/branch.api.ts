import apiClient from './client'
import type {
  Branch,
  BranchCreate,
  BranchUpdate,
  BranchListResponse,
  BranchQueryParams,
  BranchBalancesResponse,
  BranchThresholdsResponse,
} from '@/types/branch.types'

export const branchApi = {
  // Get all branches with pagination
  getBranches: async (params?: BranchQueryParams): Promise<BranchListResponse> => {
    const response = await apiClient.get<BranchListResponse>('/branches', {
      params: { limit: params?.limit ?? 50, ...(params ?? {}) },
    })
    return response.data
  },

  // Get single branch
  getBranch: async (id: string): Promise<Branch> => {
    const response = await apiClient.get<Branch>(`/branches/${id}`)
    return response.data
  },

  // Create new branch
  createBranch: async (data: BranchCreate): Promise<Branch> => {
    const response = await apiClient.post<Branch>('/branches', data)
    return response.data
  },

  // Update branch
  updateBranch: async (id: string, data: BranchUpdate): Promise<Branch> => {
    const response = await apiClient.put<Branch>(`/branches/${id}`, data)
    return response.data
  },

  // Delete branch
  deleteBranch: async (id: string): Promise<void> => {
    await apiClient.delete(`/branches/${id}`)
  },

  // Get branch balances
  getBranchBalances: async (id: string): Promise<BranchBalancesResponse> => {
    const response = await apiClient.get<BranchBalancesResponse | { data: BranchBalancesResponse }>(
      `/branches/${id}/balances`
    )
    const payload = response.data as BranchBalancesResponse | { data: BranchBalancesResponse }
    return 'data' in payload ? payload.data : payload
  },

  // Set branch balance thresholds
  setBranchThresholds: async (
    id: string,
    thresholds: Array<{ currency_id: string; min_balance: string; max_balance?: string }>
  ): Promise<void> => {
    await apiClient.put(`/branches/${id}/thresholds`, { thresholds })
  },

  // Get branch thresholds (used for alerting)
  getBranchThresholds: async (id: string): Promise<BranchThresholdsResponse> => {
    const response = await apiClient.get<BranchThresholdsResponse>(`/branches/${id}/thresholds`)
    return response.data
  },

  // Assign user to branch
  assignUserToBranch: async (id: string, userId: string): Promise<void> => {
    await apiClient.post(`/branches/${id}/users`, { user_id: userId })
  },

  // Remove user from branch
  removeUserFromBranch: async (id: string, userId: string): Promise<void> => {
    await apiClient.delete(`/branches/${id}/users/${userId}`)
  },
}
