// Vault Balance Types
export interface VaultBalance {
  currency_code: string
  currency_name: string
  balance: string // Decimal as string
  last_updated: string // ISO datetime
  // Deprecated fields for backward compatibility
  reserved?: string // Decimal as string
  available?: string // Decimal as string
}

export interface VaultBalancesResponse {
  balances: VaultBalance[]
  total_value_usd?: string // Decimal as string
  last_updated?: string // ISO datetime
}

// Vault Details Response (from GET /vault)
export interface VaultDetailsResponse {
  id: string
  vault_code: string
  name: string
  vault_type: 'main' | 'branch'
  branch_id: string | null
  is_active: boolean
  description?: string | null
  location?: string | null
  balances: VaultBalance[]
  created_at: string
  updated_at: string
}

// Vault Transfer Types
export type VaultTransferStatus = 'pending' | 'approved' | 'completed' | 'rejected'

export interface VaultTransfer {
  id: string // UUID
  from_branch_id?: string | null // UUID
  from_branch_name?: string | null
  to_branch_id?: string | null // UUID
  to_branch_name?: string | null
  currency_code: string
  amount: string // Decimal as string
  status: VaultTransferStatus
  notes?: string | null
  requested_by?: string | null
  approved_by?: string | null
  completed_by?: string | null
  requested_at: string // ISO datetime
  approved_at?: string | null // ISO datetime
  completed_at?: string | null // ISO datetime
  created_at: string // ISO datetime
  updated_at: string // ISO datetime
}

export interface VaultTransferListResponse {
  transfers: VaultTransfer[]
  total: number
  skip?: number
  limit?: number
}

export interface VaultTransferQueryParams {
  skip?: number // Offset for pagination (replaces page)
  limit?: number // Number of items per page (replaces page_size)
  status?: VaultTransferStatus
  branch_id?: string // UUID
}

export interface CreateVaultTransferRequest {
  from_branch_id?: string | null // UUID
  to_branch_id?: string | null // UUID
  currency_code: string
  amount: number | string // Accept both for form input
  notes?: string | null
}

export interface CreateVaultTransferResponse {
  transfer: VaultTransfer
  message: string
}

export interface ApproveVaultTransferResponse {
  transfer: VaultTransfer
  message: string
}
