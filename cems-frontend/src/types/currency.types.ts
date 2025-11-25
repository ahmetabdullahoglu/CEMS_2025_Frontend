// Currency Response (matches OpenAPI CurrencyResponse schema)
export interface Currency {
  id: string // UUID
  code: string
  name: string
  symbol: string
  decimal_places: number
  is_active: boolean
  created_at: string // ISO datetime
  updated_at: string // ISO datetime
  // Additional optional fields some endpoints expose
  name_en?: string
  name_ar?: string
  is_base_currency?: boolean
}

// Legacy field for backward compatibility
export type CurrencyName = string

// Currency Create (matches API CurrencyCreate schema)
export interface CurrencyCreate {
  code: string
  name: string
  symbol: string
  decimal_places: number
  is_active?: boolean
}

// Currency Update (matches API CurrencyUpdate schema)
export interface CurrencyUpdate {
  name?: string | null
  symbol?: string | null
  decimal_places?: number | null
  is_active?: boolean | null
}

export interface ExchangeRate {
  id: string
  from_currency_id: string // UUID
  to_currency_id: string // UUID
  rate: string // Decimal as string
  buy_rate?: string | null
  sell_rate?: string | null
  effective_from?: string
  effective_to?: string | null
  is_current?: boolean
  created_at: string // ISO datetime
  updated_at: string // ISO datetime
  notes?: string | null
  set_by?: string
  from_currency?: Currency
  to_currency?: Currency
}

// Note: ExchangeTransaction types are in transaction.types.ts
// Keeping these for backward compatibility if used elsewhere
export interface ExchangeTransactionRequest {
  branch_id: string // UUID
  commission_percentage?: number | string | null
  customer_id?: string | null
  description?: string | null
  exchange_rate?: number | string | null
  from_amount: number | string
  from_currency_id: string // UUID
  to_currency_id: string // UUID
  notes?: string | null
  reference_number?: string | null
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

// API List Response (matches actual API structure)
export interface CurrencyListResponse {
  success: boolean
  data: Currency[]
  total: number
  page: number
  page_size: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

export interface CurrencyQueryParams {
  skip?: number // Offset for pagination (replaces page)
  limit?: number // Number of items per page (replaces page_size)
  search?: string | null
  include_inactive?: boolean
  region?: string | null
}

export interface UpdateRateRequest {
  buy_rate: number | string
  sell_rate: number | string
  rate: number | string
  to_currency_id: string
  effective_from: string
  notes?: string | null
}

export interface UpdateRateResponse {
  currency: Currency
  message: string
}

export interface RateChangeLogEntry {
  id: string
  exchange_rate_id: string
  from_currency_code: string
  to_currency_code: string
  old_rate: string | null
  old_buy_rate?: string | null
  old_sell_rate?: string | null
  new_rate: string
  new_buy_rate?: string | null
  new_sell_rate?: string | null
  change_type: string
  changed_by?: string | null
  changed_at: string
  reason?: string | null
  rate_change_percentage?: string | null
}

export interface CurrencyRateHistoryResponse {
  data: RateChangeLogEntry[]
  total: number
  success?: boolean
}

export interface CurrencyWithRates {
  currency: Currency
  rates: ExchangeRate[]
}

export interface ExchangeRateListResponse {
  // API may return either `items` or `data` with totals
  items?: ExchangeRate[]
  data?: ExchangeRate[]
  total?: number
  success?: boolean
}

export interface ExchangeRateCreate {
  from_currency_id: string
  to_currency_id: string
  rate: number | string
  buy_rate?: number | string | null
  sell_rate?: number | string | null
  effective_from: string
  notes?: string | null
}

export interface CalculateCurrencyRequest {
  from_currency_id: string
  to_currency_id: string
  amount: number | string
  apply_commission?: boolean
}

export interface CalculateCurrencyResponse {
  from_currency_id: string
  to_currency_id: string
  original_amount: string
  converted_amount: string
  exchange_rate_used: string
}

// Backward compatibility aliases
export type CurrencyRequest = CurrencyCreate
