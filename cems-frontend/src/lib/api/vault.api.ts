import apiClient from './client'
import type {
  BranchToVaultTransferCreate,
  CreateVaultTransferRequest,
  CreateVaultTransferResponse,
  PaginatedVaultTransfers,
  VaultBalanceResponse,
  VaultBalanceUpdate,
  VaultCurrencyBalanceDetails,
  VaultCreate,
  VaultReconciliationReport,
  VaultReconciliationRequest,
  VaultResponse,
  VaultStatistics,
  VaultTransferQueryParams,
  VaultTransferResponse,
  VaultTransferSummary,
  VaultToBranchTransferCreate,
  VaultToVaultTransferCreate,
  VaultUpdate,
} from '@/types/vault.types'

export const vaultApi = {
  getMainVault: async (): Promise<VaultResponse> => {
    const response = await apiClient.get<VaultResponse>('/vault')
    return response.data
  },

  getVaultById: async (vaultId: string): Promise<VaultResponse> => {
    const response = await apiClient.get<VaultResponse>(`/vault/${vaultId}`)
    return response.data
  },

  listVaults: async (params?: {
    branch_id?: string
    is_active?: boolean
    skip?: number
    limit?: number
    search?: string
    vault_type?: string
  }) => {
    const response = await apiClient.get('/vault/all', { params })
    return response.data
  },

  createVault: async (payload: VaultCreate): Promise<VaultResponse> => {
    const response = await apiClient.post<VaultResponse>('/vault', payload)
    return response.data
  },

  updateVault: async (vaultId: string, payload: VaultUpdate): Promise<VaultResponse> => {
    const response = await apiClient.put<VaultResponse>(`/vault/${vaultId}`, payload)
    return response.data
  },

  // Get vault balances
  getVaultBalances: async (vaultId?: string): Promise<VaultBalanceResponse[]> => {
    const response = await apiClient.get<VaultBalanceResponse[]>('/vault/balances', {
      params: vaultId ? { vault_id: vaultId } : undefined,
    })
    return response.data
  },

  // Get vault transfers
  getVaultTransfers: async (params?: VaultTransferQueryParams): Promise<PaginatedVaultTransfers> => {
    const response = await apiClient.get<PaginatedVaultTransfers>('/vault/transfers', { params })
    return response.data
  },

  // Create vault transfer
  createVaultTransfer: async (data: CreateVaultTransferRequest): Promise<CreateVaultTransferResponse> => {
    const { transfer_type, ...body } = data

    if (transfer_type === 'vault_to_vault') {
      const response = await apiClient.post<CreateVaultTransferResponse>(
        '/vault/transfer/vault-to-vault',
        body as VaultToVaultTransferCreate
      )
      return response.data
    }

    if (transfer_type === 'vault_to_branch') {
      const response = await apiClient.post<CreateVaultTransferResponse>(
        '/vault/transfer/to-branch',
        body as VaultToBranchTransferCreate
      )
      return response.data
    }

    const response = await apiClient.post<CreateVaultTransferResponse>(
      '/vault/transfer/from-branch',
      body as BranchToVaultTransferCreate
    )
    return response.data
  },

  // Approve vault transfer
  approveVaultTransfer: async (id: string, notes?: string): Promise<VaultTransferResponse> => {
    const response = await apiClient.put<VaultTransferResponse>(`/vault/transfer/${id}/approve`, {
      approved: true,
      notes,
    })
    return response.data
  },

  // Reject vault transfer
  rejectVaultTransfer: async (id: string, notes?: string): Promise<VaultTransferResponse> => {
    const response = await apiClient.put<VaultTransferResponse>(`/vault/transfer/${id}/approve`, {
      approved: false,
      notes,
    })
    return response.data
  },

  // Complete vault transfer
  completeVaultTransfer: async (id: string): Promise<VaultTransferResponse> => {
    const response = await apiClient.put<VaultTransferResponse>(`/vault/transfer/${id}/complete`, {})
    return response.data
  },

  // Cancel vault transfer
  cancelVaultTransfer: async (id: string, reason?: string): Promise<VaultTransferResponse> => {
    const response = await apiClient.delete<VaultTransferResponse>(`/vault/transfer/${id}`, {
      params: reason ? { reason } : undefined,
    })
    return response.data
  },

  getVaultTransferDetails: async (transferId: string): Promise<VaultTransferResponse> => {
    const response = await apiClient.get<VaultTransferResponse>(`/vault/transfers/${transferId}`)
    return response.data
  },

  // Get vault balance for specific currency
  getCurrencyBalance: async (currencyIdentifier: string, vaultId?: string): Promise<VaultCurrencyBalanceDetails> => {
    const response = await apiClient.get<VaultCurrencyBalanceDetails>(
      `/vault/balances/${currencyIdentifier}`,
      {
        params: vaultId ? { vault_id: vaultId } : undefined,
      }
    )
    return response.data
  },

  // Perform vault reconciliation
  reconcileVault: async (payload: VaultReconciliationRequest): Promise<VaultReconciliationReport> => {
    const response = await apiClient.post<VaultReconciliationReport>('/vault/reconciliation', payload)
    return response.data
  },

  // Get latest reconciliation report for a vault (falls back to main vault when not provided)
  getReconciliationReport: async (vaultId?: string): Promise<VaultReconciliationReport> => {
    const response = await apiClient.get<VaultReconciliationReport>('/vault/reconciliation', {
      params: vaultId ? { vault_id: vaultId } : undefined,
    })
    return response.data
  },

  getVaultStatistics: async (vaultId?: string): Promise<VaultStatistics> => {
    const response = await apiClient.get<VaultStatistics>('/vault/statistics', {
      params: vaultId ? { vault_id: vaultId } : undefined,
    })
    return response.data
  },

  getVaultTransferStatistics: async (
    vaultId?: string,
    period_days?: number
  ): Promise<VaultTransferSummary> => {
    const response = await apiClient.get<VaultTransferSummary>('/vault/statistics/transfers', {
      params: {
        ...(vaultId ? { vault_id: vaultId } : {}),
        ...(period_days ? { period_days } : {}),
      },
    })
    return response.data
  },

  adjustVaultBalance: async (payload: VaultBalanceUpdate): Promise<VaultBalanceResponse> => {
    const response = await apiClient.put<VaultBalanceResponse>('/vault/balances/adjust', payload)
    return response.data
  },
}
