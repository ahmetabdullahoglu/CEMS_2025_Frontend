// Currency Response (matches actual API response)
export interface Currency {
  id: string // UUID
  code: string
  name_en: string
  name_ar: string
  symbol: string
  is_base_currency: boolean
  decimal_places: number
  is_active: boolean
  created_at: string // ISO datetime
  updated_at: string // ISO datetime
  // Exchange rates (may not be present in list response)
  exchange_rate_to_base?: string // Decimal as string
  buy_rate?: string // Decimal as string
  sell_rate?: string // Decimal as string
}

// Legacy field for backward compatibility
export type CurrencyName = string

// Currency Create (matches API CurrencyCreate schema)
export interface CurrencyCreate {
  code: string
  name_en: string
  name_ar: string
  symbol: string
  is_base_currency?: boolean
  decimal_places?: number
  exchange_rate_to_base?: number | string // Accept both for form input
  buy_rate?: number | string // Accept both for form input
  sell_rate?: number | string // Accept both for form input
}

// Currency Update (matches API CurrencyUpdate schema)
export interface CurrencyUpdate {
  code?: string
  name_en?: string
  name_ar?: string
  symbol?: string
  is_base_currency?: boolean
  decimal_places?: number
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

// API List Response (matches actual API structure)
export interface CurrencyListResponse {
  success: boolean
  data: Currency[] // API returns data array, not currencies
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
