// Transaction Type and Status Enums (matches API)
export type TransactionType = 'income' | 'expense' | 'exchange' | 'transfer'
export type TransactionStatus = 'pending' | 'completed' | 'cancelled' | 'failed'

// Income and Expense Category Enums
export type IncomeCategory = 'service_fee' | 'commission' | 'other'
export type ExpenseCategory = 'rent' | 'salary' | 'utilities' | 'maintenance' | 'supplies' | 'other'

// Base Transaction Response Fields
interface BaseTransactionResponse {
  id: string // UUID
  transaction_number: string
  transaction_type: TransactionType
  status: TransactionStatus
  branch_id: string // UUID
  branch_name?: string
  customer_id?: string | null // UUID
  user_id: string // UUID
  reference_number?: string | null
  notes?: string | null
  transaction_date: string // ISO datetime
  currency_name?: string
  from_branch_id?: string
  from_branch_name?: string
  to_branch_id?: string
  to_branch_name?: string
  from_currency_name?: string
  to_currency_name?: string
  completed_at?: string | null // ISO datetime
  cancelled_at?: string | null // ISO datetime
  cancelled_by_id?: string | null // UUID
  cancellation_reason?: string | null
  created_at: string // ISO datetime
  updated_at: string // ISO datetime
}

// Income Transaction Types
export interface IncomeTransactionCreate {
  amount: number | string
  currency_id: string // UUID
  branch_id: string // UUID
  customer_id?: string | null // UUID
  reference_number?: string | null
  notes?: string | null
  transaction_date?: string | null // ISO datetime
  income_category: IncomeCategory
  income_source?: string | null
}

export interface IncomeTransactionResponse extends BaseTransactionResponse {
  amount: string // Decimal as string
  currency_id: string // UUID
  income_category: IncomeCategory
  income_source?: string | null
}

// Expense Transaction Types
export interface ExpenseTransactionCreate {
  amount: number | string
  currency_id: string // UUID
  branch_id: string // UUID
  customer_id?: string | null // UUID
  reference_number?: string | null
  notes?: string | null
  transaction_date?: string | null // ISO datetime
  expense_category: ExpenseCategory
  expense_to: string // Payee name (required)
  approval_required?: boolean
}

export interface ExpenseTransactionResponse extends BaseTransactionResponse {
  amount: string // Decimal as string
  currency_id: string // UUID
  expense_category: ExpenseCategory
  expense_to: string
  approval_required: boolean
  approved_at?: string | null // ISO datetime
  approved_by_id?: string | null // UUID
  is_approved: boolean
}

// Exchange Transaction Types
export interface ExchangeTransactionCreate {
  branch_id: string // UUID
  customer_id?: string | null // UUID
  from_currency_id: string // UUID
  to_currency_id: string // UUID
  from_amount: number | string
  exchange_rate?: number | string | null // Uses current rate if not provided
  commission_percentage?: number | string | null // Uses default if not provided
  reference_number?: string | null
  notes?: string | null
  transaction_date?: string | null // ISO datetime
}

export interface ExchangeTransactionResponse extends BaseTransactionResponse {
  from_currency_id: string // UUID
  to_currency_id: string // UUID
  currency_name?: string
  from_currency_name?: string
  to_currency_name?: string
  from_amount: string // Decimal as string
  to_amount: string // Decimal as string
  exchange_rate_used: string // Decimal as string
  commission_amount: string // Decimal as string
  commission_percentage: string // Decimal as string
  effective_rate: string // Rate with commission
  total_cost: string // Total including commission
}

export interface ExchangeCalculationRequest {
  from_currency_id: string // UUID
  to_currency_id: string // UUID
  from_amount: number | string
  commission_percentage?: number | string | null
}

export interface ExchangeCalculationResponse {
  from_currency_id: string // UUID
  from_currency_code: string
  to_currency_id: string // UUID
  to_currency_code: string
  from_amount: string
  to_amount: string
  exchange_rate: string
  commission_percentage: string
  commission_amount: string
  total_cost: string
  effective_rate: string
}

// Transfer Transaction Types
export interface TransferTransactionCreate {
  from_branch_id: string // UUID
  to_branch_id: string // UUID
  currency_id: string // UUID
  amount: number | string
  transfer_type: 'branch_to_branch' | 'vault_to_branch' | 'branch_to_vault'
  reference_number?: string | null
  description?: string | null
  notes?: string | null
  transaction_date?: string | null // ISO datetime
}

export interface TransferTransactionResponse extends Omit<BaseTransactionResponse, 'branch_id'> {
  from_branch_id: string // UUID
  to_branch_id: string // UUID
  currency_id: string // UUID
  amount: string // Decimal as string
  transfer_type: 'branch_to_branch' | 'vault_to_branch' | 'branch_to_vault'
  description?: string | null
  received_at?: string | null // ISO datetime
  received_by_id?: string | null // UUID
  is_received: boolean
  is_pending_receipt: boolean
  branch_id?: never // Transfer doesn't have branch_id in base
}

export interface TransferReceiptRequest {
  receipt_notes?: string | null
}

// Union type for all transaction responses
export type AnyTransactionResponse =
  | IncomeTransactionResponse
  | ExpenseTransactionResponse
  | ExchangeTransactionResponse
  | TransferTransactionResponse

// Transaction List Response (with pagination)
export interface TransactionListResponse {
  total: number
  transactions: AnyTransactionResponse[]
  skip?: number
  limit?: number
}

// Transaction Filters and Query Params
export interface TransactionFilters {
  transaction_type?: TransactionType
  branch_id?: string // UUID
  customer_id?: string // UUID
  status_filter?: TransactionStatus
  currency_id?: string // UUID
  amount_min?: number
  amount_max?: number
  date_from?: string // ISO date
  date_to?: string // ISO date
}

export interface TransactionQueryParams extends TransactionFilters {
  skip?: number // Offset for pagination
  limit?: number // Number of items per page
}

// Transaction Cancel Request
export interface TransactionCancelRequest {
  reason?: string
}

// Transaction Summary/Stats
export interface TransactionSummary {
  total_count: number
  total_amount: string
  by_status: Record<string, number>
  by_type: Record<string, number>
  date_range: Record<string, string>
}

export interface TransactionSummaryQueryParams {
  branch_id?: string | null
  date_from?: string | null
  date_to?: string | null
}

// Transaction Cancel Response
export interface CancelTransactionResponse {
  id: string
  status: TransactionStatus
  cancelled_at: string
  cancellation_reason?: string | null
}

// Transaction Detail (with relationships) - includes all base fields plus relationships
export interface TransactionDetail extends BaseTransactionResponse {
  // Relationship objects
  branch?: {
    id: string
    name: string
    code: string
  }
  customer?: {
    id: string
    name: string
    phone: string
  } | null
  user?: {
    id: string
    full_name: string
    username: string
  }
  currency?: {
    id: string
    code: string
    name: string
  }
  branch_name?: string
  from_branch_name?: string
  to_branch_name?: string
  currency_name?: string
  from_currency_name?: string
  to_currency_name?: string

  // Fields that vary by transaction type (all optional as they depend on type)
  amount?: string // For income, expense, transfer
  income_category?: IncomeCategory
  income_source?: string | null
  expense_category?: ExpenseCategory
  expense_to?: string
  approval_required?: boolean
  approved_at?: string | null
  approved_by_id?: string | null

  // Exchange-specific fields
  from_currency_id?: string
  to_currency_id?: string
  from_amount?: string
  to_amount?: string
  exchange_rate_used?: string
  commission_amount?: string
  commission_percentage?: string
  effective_rate?: string
  total_cost?: string
  from_currency?: {
    id: string
    code: string
    name: string
  }
  to_currency?: {
    id: string
    code: string
    name: string
  }

  // Transfer-specific fields
  from_branch_id?: string
  to_branch_id?: string
  received_at?: string | null
  received_by_id?: string | null
}

// Branch type (basic info used in transactions)
export interface Branch {
  id: string // UUID
  name: string
  code: string
  address?: string
  phone?: string
  is_active: boolean
}

// Backward compatibility aliases (for existing code)
export type IncomeTransactionRequest = IncomeTransactionCreate
export type ExpenseTransactionRequest = ExpenseTransactionCreate
export type ExchangeTransactionRequest = ExchangeTransactionCreate
export type TransferTransactionRequest = TransferTransactionCreate
export type Transaction = AnyTransactionResponse // Alias for old 'Transaction' type
