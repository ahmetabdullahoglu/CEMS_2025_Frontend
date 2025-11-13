// Role interface
export interface Role {
  id: string // UUID
  name: string
  display_name_ar: string
}

// Branch info in user context
export interface UserBranch {
  id: string // UUID
  name: string
  code: string
  is_primary?: boolean
}

// User interface (matches API UserResponse)
export interface User {
  id: string // UUID
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
  branches?: UserBranch[] // User's assigned branches
}

// Login request payload (matches API LoginRequest)
export interface LoginRequest {
  username: string // Can be username or email
  password: string
}

// Login response from API (matches API LoginResponse)
export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

// Auth state for context/store
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// User Create (for registration/admin creation)
export interface UserCreate {
  username: string
  email: string
  full_name: string
  phone_number?: string | null
  password: string
  is_active?: boolean
  is_superuser?: boolean
  role_ids?: string[] // UUID array
}

// User Update
export interface UserUpdate {
  username?: string
  email?: string
  full_name?: string
  phone_number?: string | null
  is_active?: boolean
  is_superuser?: boolean
  role_ids?: string[] // UUID array
}

// Change Password Request
export interface ChangePasswordRequest {
  old_password: string
  new_password: string
}

// Password Reset Request
export interface PasswordResetRequest {
  email: string
}

// Password Reset Confirm
export interface PasswordResetConfirm {
  token: string
  new_password: string
}
