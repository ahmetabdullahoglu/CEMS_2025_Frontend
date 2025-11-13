// Customer Type and Risk Level Enums (matches API)
export type CustomerType = 'individual' | 'corporate'
export type RiskLevel = 'low' | 'medium' | 'high'

// Document Type Enum (matches API)
export type DocumentType =
  | 'national_id'
  | 'passport'
  | 'driving_license'
  | 'utility_bill'
  | 'bank_statement'
  | 'commercial_registration'
  | 'tax_certificate'
  | 'other'

// Customer Response (matches API CustomerResponse)
export interface Customer {
  id: string // UUID
  customer_number: string
  first_name: string
  last_name: string
  name_ar?: string | null
  national_id?: string | null
  passport_number?: string | null
  phone_number: string
  email?: string | null
  date_of_birth: string // ISO date format
  nationality: string
  address?: string | null
  city?: string | null
  country: string
  customer_type: CustomerType
  risk_level: RiskLevel
  is_active: boolean
  is_verified: boolean
  registered_at: string // ISO datetime
  verified_at?: string | null // ISO datetime
  last_transaction_date?: string | null // ISO datetime
  branch_id: string // UUID
  registered_by_id?: string | null // UUID
  verified_by_id?: string | null // UUID
  created_at: string // ISO datetime
  updated_at: string // ISO datetime
  additional_info?: Record<string, any> | null
}

// Customer Create (matches API CustomerCreate)
export interface CustomerCreate {
  first_name: string
  last_name: string
  name_ar?: string | null
  national_id?: string | null
  passport_number?: string | null
  phone_number: string
  email?: string | null
  date_of_birth: string // ISO date format (YYYY-MM-DD)
  nationality: string
  address?: string | null
  city?: string | null
  country: string
  customer_type: CustomerType
  risk_level?: RiskLevel // Defaults to 'low' in API
  branch_id: string // UUID
  additional_info?: Record<string, any> | null
}

// Customer Update (matches API CustomerUpdate)
export interface CustomerUpdate {
  first_name?: string
  last_name?: string
  name_ar?: string | null
  national_id?: string | null
  passport_number?: string | null
  phone_number?: string
  email?: string | null
  date_of_birth?: string
  nationality?: string
  address?: string | null
  city?: string | null
  country?: string
  customer_type?: CustomerType
  risk_level?: RiskLevel
  is_active?: boolean
  additional_info?: Record<string, any> | null
}

// Customer Detail Response (with relationships)
export interface CustomerDetail extends Customer {
  branch?: {
    id: string
    name: string
    code: string
  }
  registered_by?: {
    id: string
    full_name: string
    username: string
  } | null
  verified_by?: {
    id: string
    full_name: string
    username: string
  } | null
  // Statistics
  total_transactions?: number
  total_documents?: number
}

// Customer List Response (paginated)
export interface CustomerListResponse {
  customers: Customer[]
  total: number
  page?: number
  page_size?: number
  total_pages?: number
}

// Customer Query Parameters
export interface CustomerQueryParams {
  page?: number
  page_size?: number
  search?: string
  customer_type?: CustomerType
  risk_level?: RiskLevel
  is_active?: boolean
  is_verified?: boolean
  branch_id?: string // UUID
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// Customer Document Response (matches API CustomerDocumentResponse)
export interface CustomerDocument {
  id: string // UUID
  customer_id: string // UUID
  document_type: DocumentType
  document_url: string
  document_number?: string | null
  issue_date?: string | null // ISO date
  expiry_date?: string | null // ISO date
  is_verified: boolean
  verified_at?: string | null // ISO datetime
  verified_by_id?: string | null // UUID
  verification_notes?: string | null
  uploaded_at: string // ISO datetime
  uploaded_by_id?: string | null // UUID
  created_at: string // ISO datetime
  updated_at: string // ISO datetime
}

// Customer Document Create (matches API CustomerDocumentCreate)
export interface CustomerDocumentCreate {
  document_type: DocumentType
  document_number?: string | null
  issue_date?: string | null
  expiry_date?: string | null
  // Note: document file is uploaded separately via multipart/form-data
}

// Customer Note Response (matches API CustomerNoteResponse)
export interface CustomerNote {
  id: string // UUID
  customer_id: string // UUID
  note_text: string
  created_by_id: string // UUID
  created_at: string // ISO datetime
  updated_at: string // ISO datetime
  created_by?: {
    id: string
    full_name: string
    username: string
  }
}

// Customer Note Create (matches API CustomerNoteCreate)
export interface CustomerNoteCreate {
  note_text: string
}

// Customer KYC Verification (matches API CustomerKYCVerification)
export interface CustomerKYCVerification {
  risk_level: RiskLevel
  verification_notes?: string | null
}

// Customer Statistics Response
export interface CustomerStats {
  total_transactions: number
  total_amount_exchanged: string // Decimal as string
  last_transaction_date?: string | null
  average_transaction_amount: string // Decimal as string
  most_common_currency?: string | null
}

// Document Upload Response
export interface DocumentUploadResponse {
  id: string
  document_url: string
  message: string
}

// Backward compatibility aliases
export type CustomerRequest = CustomerCreate
export type IdType = DocumentType
