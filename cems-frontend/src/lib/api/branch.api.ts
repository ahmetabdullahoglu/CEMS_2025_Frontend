import apiClient from './client'
import type {
  Branch,
  BranchListResponse,
  BranchQueryParams,
  BranchBalancesResponse,
} from '@/types/branch.types'

export const branchApi = {
  // Get all branches with pagination
  getBranches: async (params?: BranchQueryParams): Promise<BranchListResponse> => {
    const response = await apiClient.get<BranchListResponse>('/branches', { params })
    return response.data
  },

  // Get single branch
  getBranch: async (id: string): Promise<Branch> => {
    const response = await apiClient.get<Branch>(`/branches/${id}`)
    return response.data
  },

  // Get branch balances
  getBranchBalances: async (id: string): Promise<BranchBalancesResponse> => {
    const response = await apiClient.get<BranchBalancesResponse>(`/branches/${id}/balances`)
    return response.data
  },
}
