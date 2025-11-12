export type IdType = 'national_id' | 'passport' | 'driving_license' | 'other'

export interface Customer {
  id: number
  name: string
  id_type: IdType
  id_number: string
  phone?: string
  email?: string
  address?: string
  created_at: string
  updated_at: string
}

export interface CustomerRequest {
  name: string
  id_type: IdType
  id_number: string
  phone?: string
  email?: string
  address?: string
}

export interface CustomerListResponse {
  customers: Customer[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface CustomerQueryParams {
  page?: number
  page_size?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
