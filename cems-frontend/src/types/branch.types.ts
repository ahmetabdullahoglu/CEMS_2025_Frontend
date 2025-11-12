export interface Branch {
  id: number
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BranchBalance {
  currency_code: string
  currency_name: string
  balance: number
  usd_equivalent: number
}

export interface BranchBalancesResponse {
  branch_id: number
  branch_name: string
  balances: BranchBalance[]
  total_usd_equivalent: number
}

export interface BranchListResponse {
  branches: Branch[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface BranchQueryParams {
  page?: number
  page_size?: number
  search?: string
}
