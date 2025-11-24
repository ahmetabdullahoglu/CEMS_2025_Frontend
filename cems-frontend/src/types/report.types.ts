// Daily Summary Types
export interface DailySummaryStats {
  total_transactions: number
  total_revenue: string // Decimal as string
  total_expenses: string // Decimal as string
  net_profit: string // Decimal as string
  exchange_transactions: number
  income_transactions: number
  expense_transactions: number
  transfer_transactions: number
}

export interface DailySummaryChartData {
  hour: string
  transactions: number
  revenue: string // Decimal as string
}

export interface DailySummaryResponse {
  date: string // ISO date
  stats: DailySummaryStats
  hourly_data: DailySummaryChartData[]
}

// Monthly Revenue Types
export interface MonthlyRevenueData {
  date: string // ISO date
  revenue: string // Decimal as string
  expenses: string // Decimal as string
  profit: string // Decimal as string
}

export interface MonthlyRevenueResponse {
  month: string
  total_revenue: string // Decimal as string
  total_expenses: string // Decimal as string
  total_profit: string // Decimal as string
  daily_data: MonthlyRevenueData[]
}

// Branch Performance Types
export interface BranchPerformanceData {
  branch_id: string // UUID
  branch_name: string
  total_transactions: number
  total_revenue: string // Decimal as string
  total_expenses: string // Decimal as string
  net_profit: string // Decimal as string
  top_currency: string
  top_currency_volume: string // Decimal as string
}

export interface BranchPerformanceResponse {
  branches: BranchPerformanceData[]
  period_start: string // ISO date
  period_end: string // ISO date
}

// Exchange Trends Types
export interface ExchangeTrendData {
  date: string // ISO date
  from_currency: string
  to_currency: string
  average_rate: string // Decimal as string
  total_volume: string // Decimal as string
  transaction_count: number
}

export interface ExchangeTrendsResponse {
  trends: ExchangeTrendData[]
  period_start: string // ISO date
  period_end: string // ISO date
  most_traded_pair: {
    from_currency: string
    to_currency: string
    volume: string
  }
}

// Balance Snapshot Types
export interface CurrencyBalance {
  currency_id: string // UUID
  currency_code: string
  currency_name: string
  balance: string // Decimal as string
  reserved: string // Decimal as string
  available: string // Decimal as string
}

export interface BranchBalanceSnapshot {
  branch_id: string // UUID
  branch_name: string
  balances: CurrencyBalance[]
}

export interface BalanceSnapshotResponse {
  timestamp: string // ISO datetime
  total_value_usd: string // Decimal as string
  branches: BranchBalanceSnapshot[]
}

// Balance Movement Types
export interface BalanceMovement {
  date: string // ISO date
  currency_code: string
  opening_balance: string // Decimal as string
  deposits: string // Decimal as string
  withdrawals: string // Decimal as string
  exchanges_in: string // Decimal as string
  exchanges_out: string // Decimal as string
  closing_balance: string // Decimal as string
}

export interface BalanceMovementResponse {
  movements: BalanceMovement[]
  period_start: string // ISO date
  period_end: string // ISO date
  branch_id?: string // UUID
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
  total_alerts: number
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
