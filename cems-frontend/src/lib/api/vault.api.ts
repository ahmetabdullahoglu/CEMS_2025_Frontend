import apiClient from './client'
import type {
  VaultBalancesResponse,
  VaultDetailsResponse,
  VaultTransferListResponse,
  VaultTransferQueryParams,
  CreateVaultTransferRequest,
  CreateVaultTransferResponse,
  ApproveVaultTransferResponse,
  VaultCurrencyBalanceDetails,
  VaultReconciliationReport,
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
  approveVaultTransfer: async (id: string, notes?: string): Promise<ApproveVaultTransferResponse> => {
    const response = await apiClient.put<ApproveVaultTransferResponse>(
      `/vault/transfer/${id}/approve`,
      { approved: true, notes }
    )
    return response.data
  },

  // Reject vault transfer
  rejectVaultTransfer: async (id: string, notes?: string): Promise<ApproveVaultTransferResponse> => {
    const response = await apiClient.put<ApproveVaultTransferResponse>(
      `/vault/transfer/${id}/approve`,
      { approved: false, notes }
    )
    return response.data
  },

  // Complete vault transfer
  completeVaultTransfer: async (id: string): Promise<ApproveVaultTransferResponse> => {
    const response = await apiClient.put<ApproveVaultTransferResponse>(`/vault/transfer/${id}/complete`, {})
    return response.data
  },

  // Get main vault details with balances
  getVaultDetails: async (): Promise<VaultDetailsResponse> => {
    const response = await apiClient.get<VaultDetailsResponse>('/vault')
    return response.data
  },

  // Get vault balance for specific currency
  getCurrencyBalance: async (currencyId: string): Promise<VaultCurrencyBalanceDetails> => {
    const response = await apiClient.get<VaultCurrencyBalanceDetails>(`/vault/balances/${currencyId}`)
    return response.data
  },

  // Perform vault reconciliation
  reconcileVault: async (data: {
    currency_id: string
    expected_balance: string
    actual_balance: string
    notes?: string
  }): Promise<{
    success: boolean
    difference: string
    reconciliation_id: string
  }> => {
    const response = await apiClient.post('/vault/reconciliation', data)
    return response.data
  },

  // Get latest reconciliation report for a vault
  getReconciliationReport: async (vaultId: string): Promise<VaultReconciliationReport> => {
    const response = await apiClient.get<VaultReconciliationReport>('/vault/reconciliation', {
      params: { vault_id: vaultId },
    })
    return response.data
  },
}
