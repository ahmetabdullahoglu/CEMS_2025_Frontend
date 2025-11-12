export interface Currency {
  id: number
  code: string
  name: string
  symbol: string
  exchange_rate_to_base: number
  buy_rate: number
  sell_rate: number
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

export interface CurrencyListResponse {
  currencies: Currency[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface CurrencyQueryParams {
  page?: number
  page_size?: number
  search?: string
}

export interface UpdateRateRequest {
  buy_rate: number
  sell_rate: number
}

export interface UpdateRateResponse {
  currency: Currency
  message: string
}
