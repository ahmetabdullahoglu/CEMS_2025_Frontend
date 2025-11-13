// Branch Response (matches API BranchResponse schema)
export interface Branch {
  id: string // UUID
  branch_number: string
  name: string
  code: string
  address?: string | null
  city?: string | null
  phone?: string | null
  email?: string | null
  is_active: boolean
  created_at: string // ISO datetime
  updated_at: string // ISO datetime
}

// Branch Create (matches API BranchCreate schema)
export interface BranchCreate {
  name: string
  code: string
  address?: string | null
  city?: string | null
  phone?: string | null
  email?: string | null
}

// Branch Update (matches API BranchUpdate schema)
export interface BranchUpdate {
  name?: string
  code?: string
  address?: string | null
  city?: string | null
  phone?: string | null
  email?: string | null
  is_active?: boolean
}

export interface BranchBalance {
  currency_code: string
  currency_name: string
  balance: string // Decimal as string
  usd_equivalent: string // Decimal as string
}

export interface BranchBalancesResponse {
  branch_id: string // UUID
  branch_name: string
  balances: BranchBalance[]
  total_usd_equivalent: string // Decimal as string
}

export interface BranchListResponse {
  branches: Branch[]
  total: number
  skip?: number
  limit?: number
}

export interface BranchQueryParams {
  skip?: number // Offset for pagination (replaces page)
  limit?: number // Number of items per page (replaces page_size)
  search?: string
  is_active?: boolean
}

// Backward compatibility aliases
export type BranchRequest = BranchCreate
