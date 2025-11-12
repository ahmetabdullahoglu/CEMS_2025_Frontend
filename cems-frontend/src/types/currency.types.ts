export interface Currency {
  id: number
  code: string
  name: string
  symbol: string
  exchange_rate_to_base: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ExchangeRate {
  from_currency: string
  to_currency: string
  rate: number
  updated_at: string
}

export interface ExchangeTransactionRequest {
  from_currency_code: string
  to_currency_code: string
  from_amount: number
  customer_name?: string
  branch_id?: number
}

export interface ExchangeTransactionResponse {
  id: number
  from_currency_code: string
  to_currency_code: string
  from_amount: number
  to_amount: number
  exchange_rate: number
  customer_name?: string
  branch_id?: number
  status: string
  created_at: string
}
