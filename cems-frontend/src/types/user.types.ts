// Role interface
export interface Role {
  id: string
  name: string
  display_name_ar: string
}

// User Response (matches API UserResponse schema)
export interface User {
  id: string
  username: string
  email: string
  full_name: string
  phone_number?: string | null
  is_active: boolean
  is_superuser: boolean
  last_login?: string | null // ISO datetime
  failed_login_attempts: number
  is_locked: boolean
  created_at: string // ISO datetime
  updated_at: string // ISO datetime
  roles: Role[]
}

// User List Response
export interface UserListResponse {
  success: boolean
  data: User[]
  total: number
  page: number
  page_size: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

// User Query Params
export interface UserQueryParams {
  skip?: number
  limit?: number
  search?: string
  is_active?: boolean
  role?: string
}

// User Create Request
export interface UserCreateRequest {
  username: string
  email: string
  password: string
  full_name: string
  phone_number?: string
  role_ids?: string[]
}

// User Update Request
export interface UserUpdateRequest {
  email?: string
  full_name?: string
  phone_number?: string
  is_active?: boolean
  role_ids?: string[]
}
