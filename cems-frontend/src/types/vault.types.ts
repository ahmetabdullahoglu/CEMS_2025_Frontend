export type VaultType = 'main' | 'branch'

// Vault Balance Types
export interface VaultBalanceInfo {
  currency_code: string
  currency_name: string
  balance: string
  last_updated: string
  currency_id?: string
}

export interface VaultResponse {
  id: string
  vault_code: string
  name: string
  vault_type: VaultType
  branch_id: string | null
  is_active: boolean
  description: string | null
  location: string | null
  balances?: VaultBalanceInfo[]
  created_at: string
  updated_at: string
}

export interface VaultCreate {
  vault_code: string
  name: string
  vault_type: VaultType
  branch_id?: string | null
  description?: string | null
  location?: string | null
}

export interface VaultUpdate {
  name?: string
  branch_id?: string | null
  description?: string | null
  location?: string | null
  is_active?: boolean
}

export interface VaultBalanceResponse {
  vault_id: string
  vault_code: string
  vault_name: string
  currency_id: string
  currency_code: string
  balance: string
  last_updated: string
}

export interface VaultBalanceUpdate {
  vault_id: string
  currency_id: string
  new_balance: string | number
  reason: string
}

export interface VaultCurrencyBalanceDetails extends VaultBalanceResponse {
  reserved?: string
  available?: string
  branch_allocations?: Array<{
    branch_id: string
    branch_name: string
    balance: string
    reserved?: string | null
    last_updated?: string | null
  }>
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

export type VaultTransferType = 'vault_to_vault' | 'vault_to_branch' | 'branch_to_vault'
export type VaultTransferStatus = 'pending' | 'approved' | 'in_transit' | 'completed' | 'cancelled' | 'rejected'

export interface VaultTransferResponse {
  id: string
  transfer_number: string
  transfer_type: VaultTransferType
  status: VaultTransferStatus
  from_vault_id: string
  from_vault_code?: string | null
  to_vault_id?: string | null
  to_vault_code?: string | null
  to_branch_id?: string | null
  to_branch_code?: string | null
  currency_id: string
  currency_code?: string | null
  amount: string
  initiated_by: string
  initiated_by_name?: string | null
  initiated_at: string
  approved_by?: string | null
  approved_by_name?: string | null
  approved_at?: string | null
  received_by?: string | null
  received_by_name?: string | null
  completed_at?: string | null
  cancelled_at?: string | null
  notes?: string | null
  rejection_reason?: string | null
}

export interface VaultTransferQueryParams {
  skip?: number
  limit?: number
  status?: VaultTransferStatus
  branch_id?: string
  vault_id?: string
  transfer_type?: VaultTransferType
  date_from?: string
  date_to?: string
}

export type PaginatedVaultTransfers = PaginatedResponse<VaultTransferResponse>

export interface VaultToVaultTransferCreate {
  amount: string | number
  currency_id: string
  from_vault_id: string
  to_vault_id: string
  notes?: string | null
}

export interface VaultToBranchTransferCreate {
  amount: string | number
  currency_id: string
  vault_id: string
  branch_id: string
  notes?: string | null
}

export interface BranchToVaultTransferCreate {
  amount: string | number
  currency_id: string
  branch_id: string
  vault_id: string
  notes?: string | null
}

export type CreateVaultTransferRequest =
  | ({ transfer_type: 'vault_to_vault' } & VaultToVaultTransferCreate)
  | ({ transfer_type: 'vault_to_branch' } & VaultToBranchTransferCreate)
  | ({ transfer_type: 'branch_to_vault' } & BranchToVaultTransferCreate)

export type CreateVaultTransferResponse = VaultTransferResponse
export type ApproveVaultTransferResponse = VaultTransferResponse

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

export interface VaultReconciliationRequest {
  vault_id: string
  currency_id?: string | null
  notes?: string | null
}

export interface VaultStatistics {
  vault_id: string
  vault_code: string
  vault_name: string
  total_balance_usd_equivalent: string
  currency_count: number
  pending_transfers_in: number
  pending_transfers_out: number
  last_transfer_date: string | null
  last_reconciliation_date: string | null
}

export interface VaultTransferSummary {
  period_start: string
  period_end: string
  total_transfers: number
  completed_transfers: number
  pending_transfers: number
  cancelled_transfers: number
  total_amount_transferred: string
  average_transfer_amount: string
  by_currency: Array<Record<string, unknown>>
  by_type: Array<Record<string, unknown>>
}

export interface VaultStatisticsResponse {
  statistics: VaultStatistics
  transfer_summary?: VaultTransferSummary
}
