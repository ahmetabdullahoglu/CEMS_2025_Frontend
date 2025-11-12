// User interface
export interface User {
  id: number
  email: string
  full_name: string
  role: 'admin' | 'manager' | 'cashier'
  branch_id: number | null
  is_active: boolean
}

// Login request payload
export interface LoginRequest {
  email: string
  password: string
}

// Login response from API
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
