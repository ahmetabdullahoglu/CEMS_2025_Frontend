// Vault Balance Types
export interface VaultBalance {
  currency_code: string
  currency_name: string
  balance: number
  reserved: number
  available: number
  last_updated: string
}

export interface VaultBalancesResponse {
  balances: VaultBalance[]
  total_value_usd: number
  last_updated: string
}

// Vault Transfer Types
export type VaultTransferStatus = 'pending' | 'approved' | 'completed' | 'rejected'

export interface VaultTransfer {
  id: number
  from_branch_id?: number
  from_branch_name?: string
  to_branch_id?: number
  to_branch_name?: string
  currency_code: string
  amount: number
  status: VaultTransferStatus
  notes?: string
  requested_by?: string
  approved_by?: string
  completed_by?: string
  requested_at: string
  approved_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface VaultTransferListResponse {
  transfers: VaultTransfer[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface VaultTransferQueryParams {
  page?: number
  page_size?: number
  status?: VaultTransferStatus
  branch_id?: number
}

export interface CreateVaultTransferRequest {
  from_branch_id?: number
  to_branch_id?: number
  currency_code: string
  amount: number
  notes?: string
}

export interface CreateVaultTransferResponse {
  transfer: VaultTransfer
  message: string
}

export interface ApproveVaultTransferResponse {
  transfer: VaultTransfer
  message: string
}
