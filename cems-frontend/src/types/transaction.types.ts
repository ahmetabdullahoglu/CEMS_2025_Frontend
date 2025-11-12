export type TransactionType = 'buy' | 'sell'
export type TransactionStatus = 'completed' | 'pending' | 'cancelled'

export interface Transaction {
  id: number
  type: TransactionType
  amount: number
  currency_code: string
  exchange_rate: number
  total_amount: number
  status: TransactionStatus
  customer_name?: string
  branch_id?: number
  branch_name?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface TransactionFilters {
  type?: TransactionType
  status?: TransactionStatus
  branch_id?: number
  date_from?: string
  date_to?: string
  search?: string
}

export interface TransactionListResponse {
  transactions: Transaction[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface TransactionQueryParams extends TransactionFilters {
  page?: number
  page_size?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// Income Transaction Types
export interface IncomeTransactionRequest {
  currency_code: string
  amount: number
  description: string
  branch_id?: number
}

export interface IncomeTransactionResponse {
  id: number
  currency_code: string
  amount: number
  description: string
  branch_id?: number
  status: string
  created_at: string
}

// Expense Transaction Types
export interface ExpenseTransactionRequest {
  currency_code: string
  amount: number
  description: string
  category: string
  branch_id?: number
}

export interface ExpenseTransactionResponse {
  id: number
  currency_code: string
  amount: number
  description: string
  category: string
  branch_id?: number
  status: string
  created_at: string
}

// Transfer Transaction Types
export interface TransferTransactionRequest {
  from_branch_id: number
  to_branch_id: number
  currency_code: string
  amount: number
  description?: string
}

export interface TransferTransactionResponse {
  id: number
  from_branch_id: number
  to_branch_id: number
  from_branch_name?: string
  to_branch_name?: string
  currency_code: string
  amount: number
  description?: string
  status: string
  created_at: string
}

// Branch Types
export interface Branch {
  id: number
  name: string
  code: string
  address?: string
  phone?: string
  is_active: boolean
}
