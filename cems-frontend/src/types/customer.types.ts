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

export interface CustomerDocument {
  id: number
  customer_id: number
  file_name: string
  file_type: string
  file_size: number
  file_url: string
  uploaded_at: string
}

export interface DocumentUploadResponse {
  document: CustomerDocument
  message: string
}
