// Daily Summary Types aligned with backend payload
export interface DailySummaryResponse {
  date: string // ISO date
  branch_id?: string | null
  total_transactions: number
  total_revenue: number | string
  average_commission?: number | string
  volume_by_currency: Record<string, number | string>
  revenue_by_type: {
    exchange: number | string
    income: number | string
    expense: number | string
    transfer: number | string
  }
  transaction_breakdown: {
    exchange: number
    income: number
    expense: number
    transfer: number
  }
}

// Monthly Revenue Types
export interface MonthlyRevenueDailyBreakdownEntry {
  revenue: number | string
  count: number
}

export interface MonthlyRevenueResponse {
  year: number
  month: number
  branch_id?: string | null
  total_revenue: number | string
  total_transactions: number
  average_daily_revenue: number | string
  max_daily_revenue: number | string
  min_daily_revenue: number | string
  daily_breakdown: Record<string, MonthlyRevenueDailyBreakdownEntry>
}

// Branch Performance Types
export interface BranchPerformanceData {
  branch_id: string // UUID
  branch_code: string
  branch_name: string
  total_transactions: number
  total_revenue: number | string
  avg_transaction_value: number | string
  rank: number
}

export interface BranchPerformanceResponse {
  date_range: {
    start: string
    end: string
  }
  total_system_revenue: number | string
  branch_count: number
  branches: BranchPerformanceData[]
}

// Exchange Trends Types
export interface ExchangeTrendData {
  date: string // ISO date
  average_rate: number | string
  total_volume: number | string
  transaction_count: number
  from_currency?: string
  to_currency?: string
}

export interface ExchangeTrendsResponse {
  currency_pair: string
  date_range: {
    start: string
    end: string
  }
  total_transactions: number
  total_volume: number | string
  average_rate: number | string
  min_rate: number | string
  max_rate: number | string
  daily_trends: ExchangeTrendData[]
}

// Balance Snapshot Types
export interface BalanceSnapshotEntry {
  currency_code: string
  currency_name: string
  balance: number | string
  last_updated?: string
}

export interface BalanceSnapshotBranch {
  id: string
  code?: string
  name?: string
}

export interface BalanceSnapshotResponse {
  branch?: BalanceSnapshotBranch | null
  snapshot_date: string
  balances: BalanceSnapshotEntry[]
  currency_count?: number
}

// Balance Movement Types
export interface BalanceMovementItem {
  date: string
  transaction_number: string
  type: string
  amount: number | string
  description?: string | null
  debit: number | string
  credit: number | string
  balance: number | string
}

export interface BalanceMovementResponse {
  branch_id?: string | null
  currency?: string | null
  date_range: {
    start: string
    end: string
  }
  movement_count: number
  movements: BalanceMovementItem[]
}

// Low Balance Alerts Types
export interface LowBalanceAlert {
  branch_id: string // UUID
  branch_name: string
  currency_id: string // UUID
  currency_code: string
  current_balance: string // Decimal as string
  threshold: string // Decimal as string
  shortage: string // Decimal as string
  severity: 'warning' | 'critical'
}

export interface LowBalanceAlertsResponse {
  alerts: LowBalanceAlert[]
  total_alerts?: number
  alert_count?: number
  generated_at?: string
}

// User Activity Types
export interface UserActivityData {
  user_id: string // UUID
  username: string
  full_name: string
  total_transactions: number
  total_amount_handled: string // Decimal as string
  income_count: number
  expense_count: number
  exchange_count: number
  transfer_count: number
  last_activity: string // ISO datetime
}

export interface UserActivityResponse {
  users: UserActivityData[]
  period_start: string // ISO date
  period_end: string // ISO date
}

// Audit Trail Types
export interface AuditLogEntry {
  id: string // UUID
  timestamp: string // ISO datetime
  user_id: string // UUID
  username: string
  action: string
  resource_type: string
  resource_id: string
  description: string
  ip_address?: string
  changes?: Record<string, unknown>
}

export interface AuditTrailResponse {
  logs: AuditLogEntry[]
  total: number
  page: number
  page_size: number
}

// Customer Analysis Types
export interface CustomerAnalysisData {
  customer_id: string // UUID
  customer_name: string
  customer_type: string
  total_transactions: number
  total_volume: string // Decimal as string
  average_transaction_size: string // Decimal as string
  most_frequent_currency: string
  last_transaction_date: string // ISO date
  risk_level: string
}

export interface CustomerAnalysisResponse {
  customers: CustomerAnalysisData[]
  period_start: string // ISO date
  period_end: string // ISO date
  total_customers: number
}

// Custom Report Types
export interface CustomReportParams {
  report_type: 'transactions' | 'revenue' | 'balances' | 'customers' | 'exchanges'
  start_date: string // ISO date
  end_date: string // ISO date
  branch_id?: string // UUID
  currency_id?: string // UUID
  customer_id?: string // UUID
  group_by?: 'day' | 'week' | 'month' | 'branch' | 'currency' | 'customer'
  metrics?: string[] // e.g., ['count', 'sum', 'average']
}

export interface CustomReportResponse {
  data: Array<Record<string, unknown>>
  summary: Record<string, unknown>
  parameters: CustomReportParams
  generated_at: string // ISO datetime
}

// Report Export Types
export interface ReportExportParams {
  report_type: string
  format: 'pdf' | 'excel' | 'csv'
  filters?: Record<string, unknown>
}

export interface ReportExportResponse {
  download_url?: string
  expires_at?: string // ISO datetime
  file_name?: string
  file_size?: number
  // Some report exports may return a generic payload
  [key: string]: unknown
}
