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
