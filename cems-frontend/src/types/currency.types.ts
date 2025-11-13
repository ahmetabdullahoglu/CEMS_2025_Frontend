// Currency Response (matches API CurrencyResponse schema)
export interface Currency {
  id: string // UUID
  code: string
  name: string
  symbol: string
  exchange_rate_to_base: string // Decimal as string
  buy_rate: string // Decimal as string
  sell_rate: string // Decimal as string
  is_active: boolean
  created_at: string // ISO datetime
  updated_at: string // ISO datetime
}

// Currency Create (matches API CurrencyCreate schema)
export interface CurrencyCreate {
  code: string
  name: string
  symbol: string
  exchange_rate_to_base: number | string // Accept both for form input
  buy_rate: number | string // Accept both for form input
  sell_rate: number | string // Accept both for form input
}

// Currency Update (matches API CurrencyUpdate schema)
export interface CurrencyUpdate {
  code?: string
  name?: string
  symbol?: string
  exchange_rate_to_base?: number | string
  buy_rate?: number | string
  sell_rate?: number | string
  is_active?: boolean
}

export interface ExchangeRate {
  from_currency: string
  to_currency: string
  rate: string // Decimal as string
  updated_at: string // ISO datetime
}

// Note: ExchangeTransaction types are in transaction.types.ts
// Keeping these for backward compatibility if used elsewhere
export interface ExchangeTransactionRequest {
  from_currency_code: string
  to_currency_code: string
  from_amount: number | string
  customer_name?: string
  branch_id?: string // UUID
}

export interface ExchangeTransactionResponse {
  id: string // UUID
  from_currency_code: string
  to_currency_code: string
  from_amount: string // Decimal as string
  to_amount: string // Decimal as string
  exchange_rate: string // Decimal as string
  customer_name?: string
  branch_id?: string // UUID
  status: string
  created_at: string // ISO datetime
}

export interface CurrencyListResponse {
  currencies: Currency[]
  total: number
  skip?: number
  limit?: number
}

export interface CurrencyQueryParams {
  skip?: number // Offset for pagination (replaces page)
  limit?: number // Number of items per page (replaces page_size)
  search?: string
  is_active?: boolean
}

export interface UpdateRateRequest {
  buy_rate: number | string
  sell_rate: number | string
}

export interface UpdateRateResponse {
  currency: Currency
  message: string
}

// Backward compatibility aliases
export type CurrencyRequest = CurrencyCreate
