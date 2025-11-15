// Vault Balance Types
export interface VaultBalance {
  currency_id?: string // UUID - optional because some legacy payloads omit it
  currency_code: string
  currency_name: string
  balance: string // Decimal as string
  last_updated: string // ISO datetime
  // Deprecated fields for backward compatibility
  reserved?: string // Decimal as string
  available?: string // Decimal as string
}

// Vault balances endpoint now returns array directly
export type VaultBalancesResponse = VaultBalance[]

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

export interface VaultCurrencyBalanceDetails {
  currency_id: string
  currency_code: string
  currency_name?: string
  balance: string
  reserved: string
  available: string
  last_updated: string
  branch_allocations?: Array<{
    branch_id: string
    branch_name: string
    balance: string
    reserved?: string | null
    last_updated?: string | null
  }>
}

export interface VaultReconciliationResult {
  vault_id: string
  vault_code: string
  currency_id: string
  currency_code: string
  system_balance: string
  physical_count: string | null
  discrepancy: string | null
  last_reconciled_at: string | null
  reconciled_by: string | null
}

export interface VaultReconciliationReport {
  vault_id: string
  vault_code: string
  vault_name: string
  reconciliation_date: string
  results: VaultReconciliationResult[]
  total_discrepancies: number
  notes: string | null
}

// Vault Transfer Types
export type VaultTransferStatus = 'pending' | 'approved' | 'completed' | 'rejected'

export interface VaultTransferBranch {
  id: string
  name: string
}

export interface VaultTransferUser {
  id: string
  username: string
}

export interface VaultTransfer {
  id: string // UUID
  from_branch?: VaultTransferBranch | null
  to_branch?: VaultTransferBranch | null
  currency_code: string
  currency_name?: string
  amount: string // Decimal as string
  status: VaultTransferStatus
  notes?: string | null
  created_by?: VaultTransferUser | null
  approved_by?: VaultTransferUser | null
  completed_by?: VaultTransferUser | null
  created_at: string // ISO datetime
  approved_at?: string | null // ISO datetime
  completed_at?: string | null // ISO datetime
  // Deprecated fields for backward compatibility
  from_branch_id?: string | null
  from_branch_name?: string | null
  to_branch_id?: string | null
  to_branch_name?: string | null
  requested_by?: string | null
  requested_at?: string
  updated_at?: string
}

export interface VaultTransferListResponse {
  success: boolean
  data: VaultTransfer[]
  total: number
  page: number
  page_size: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
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
