// Branch Response (matches API BranchResponse schema)
export interface Branch {
  id: string // UUID
  code: string
  name_en: string // English name
  name_ar: string // Arabic name
  region: string // Branch region
  address?: string | null
  city?: string | null
  phone?: string | null
  email?: string | null
  manager_id?: string | null
  is_main_branch: boolean
  is_active: boolean
  opening_balance_date: string // ISO datetime
  created_at: string // ISO datetime
  updated_at: string // ISO datetime
  balances?: BranchBalance[] | null
  // Total base currency value when balances are included (API field: total_value_in_base_currency)
  total_value_in_base_currency?: string | null
  // Deprecated alias kept for backward compatibility
  total_usd_value?: string | null
  // Deprecated fields for backward compatibility
  branch_number?: string
  name?: string // Can be derived from name_en
}

// Branch Create (matches API BranchCreate schema)
export interface BranchCreate {
  code: string
  name_en: string
  name_ar: string
  region: string
  address: string
  city: string
  phone: string
  email?: string | null
  manager_id?: string | null
  is_main_branch?: boolean
  opening_balance_date?: string | null
}

// Branch Update (matches API BranchUpdate schema)
export interface BranchUpdate {
  code?: string
  name_en?: string
  name_ar?: string
  region?: string
  address?: string | null
  city?: string | null
  phone?: string | null
  email?: string | null
  manager_id?: string | null
  is_main_branch?: boolean
  opening_balance_date?: string | null
  is_active?: boolean
}

export interface BranchBalance {
  currency_id?: string
  currency_code: string
  currency_name: string
  balance: string // Decimal as string
  reserved_balance?: string | null // Decimal as string
  available_balance?: string | null // Decimal as string
  minimum_threshold?: string | null // Decimal as string
  maximum_threshold?: string | null // Decimal as string
  last_updated?: string // ISO datetime
  last_reconciled_at?: string | null // ISO datetime
  usd_value?: string | null // Decimal as string
  usd_equivalent?: string // Decimal as string (for backward compatibility)
}

export interface BranchBalancesResponse {
  branch_id: string // UUID
  branch_name: string
  balances: BranchBalance[]
  total_usd_equivalent: string // Decimal as string
}

export interface BranchThreshold {
  currency_id: string
  currency_code: string
  currency_name?: string
  min_balance?: string | null
  max_balance?: string | null
  alert_threshold?: string | null
  updated_at?: string | null
}

export interface BranchThresholdsResponse {
  branch_id: string
  branch_name: string
  thresholds: BranchThreshold[]
}

export interface BranchListResponse {
  success: boolean
  data: Branch[] // Changed from 'branches' to 'data'
  total: number
  page: number
  page_size: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

export interface BranchQueryParams {
  skip?: number // Offset for pagination (replaces page)
  limit?: number // Number of items per page (replaces page_size)
  search?: string
  is_active?: boolean
  region?: string
  include_balances?: boolean
  calculate_usd_value?: boolean
}

// Backward compatibility aliases
export type BranchRequest = BranchCreate
