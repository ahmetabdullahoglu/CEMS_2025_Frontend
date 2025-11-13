import apiClient from './client'
import type {
  VaultBalancesResponse,
  VaultTransferListResponse,
  VaultTransferQueryParams,
  CreateVaultTransferRequest,
  CreateVaultTransferResponse,
  ApproveVaultTransferResponse,
} from '@/types/vault.types'

export const vaultApi = {
  // Get vault balances
  getVaultBalances: async (): Promise<VaultBalancesResponse> => {
    const response = await apiClient.get<VaultBalancesResponse>('/vault/balances')
    return response.data
  },

  // Get vault transfers
  getVaultTransfers: async (params?: VaultTransferQueryParams): Promise<VaultTransferListResponse> => {
    const response = await apiClient.get<VaultTransferListResponse>('/vault/transfers', { params })
    return response.data
  },

  // Create vault transfer
  createVaultTransfer: async (data: CreateVaultTransferRequest): Promise<CreateVaultTransferResponse> => {
    const response = await apiClient.post<CreateVaultTransferResponse>('/vault/transfers', data)
    return response.data
  },

  // Approve vault transfer
  approveVaultTransfer: async (id: string): Promise<ApproveVaultTransferResponse> => {
    const response = await apiClient.put<ApproveVaultTransferResponse>(`/vault/transfers/${id}/approve`)
    return response.data
  },

  // Complete vault transfer
  completeVaultTransfer: async (id: string): Promise<ApproveVaultTransferResponse> => {
    const response = await apiClient.put<ApproveVaultTransferResponse>(`/vault/transfers/${id}/complete`)
    return response.data
  },

  // Reject vault transfer
  rejectVaultTransfer: async (id: string): Promise<ApproveVaultTransferResponse> => {
    const response = await apiClient.put<ApproveVaultTransferResponse>(`/vault/transfers/${id}/reject`)
    return response.data
  },
}
