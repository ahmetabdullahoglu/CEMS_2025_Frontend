// ==================== Overview Endpoint ====================
export interface DashboardOverviewData {
  total_transactions_today: number
  total_revenue_today: number
  active_branches: number
  low_balance_alerts: number
  pending_approvals: number
  transaction_growth_percent: number
}

export interface TopCurrency {
  currency_code: string
  total_amount: number
  transaction_count: number
}

export interface QuickStatsData {
  transactions_yesterday: number
  average_transaction_value: number
  busiest_hour: string
}

export interface DashboardOverviewResponse {
  overview: DashboardOverviewData
  top_currencies: TopCurrency[]
  quick_stats: QuickStatsData
  generated_at: string
}

// Legacy types for backward compatibility
export interface DashboardStats {
  total_transactions: number
  total_revenue: number
  active_customers: number
  vault_balance: number
  transactions_change: number
  revenue_change: number
  customers_change: number
}

export interface RevenueData {
  date: string
  revenue: number
}

export interface DashboardOverview {
  stats: DashboardStats
  revenue_trend: RevenueData[]
}

// ==================== Stats Endpoint ====================
export interface DashboardStatsResponse {
  total_transactions: number
  total_revenue: string // Decimal as string
  total_income: string // Decimal as string
  total_expenses: string // Decimal as string
  total_exchanges: number
  total_transfers: number
  active_customers: number
  pending_transactions: number
  completed_transactions: number
  cancelled_transactions: number
  vault_balance: string // Decimal as string
  period: 'today' | 'week' | 'month' | 'year'
}

// ==================== Charts Endpoint ====================
export interface ChartDataPoint {
  date: string // ISO date
  value: number
  label?: string
}

export interface TransactionTypeChart {
  income: number
  expense: number
  exchange: number
  transfer: number
}

export interface DashboardCharts {
  revenue_trend: ChartDataPoint[]
  transaction_volume: ChartDataPoint[]
  transaction_types: TransactionTypeChart
  currency_distribution: Array<{
    currency_code: string
    amount: string // Decimal as string
    percentage: number
  }>
}

// ==================== Individual Chart Endpoints ====================
// Valid period values vary by endpoint - see individual interfaces below

// Transaction Volume: daily, weekly, monthly (NOT yearly)
export type TransactionVolumePeriod = 'daily' | 'weekly' | 'monthly'

// Revenue Trend: monthly, yearly (NOT daily or weekly)
export type RevenueTrendPeriod = 'monthly' | 'yearly'

// Currency & Branch: daily, weekly, monthly
export type GeneralChartPeriod = 'daily' | 'weekly' | 'monthly'

export interface TransactionVolumeDataPoint {
  // Daily responses use `date`; weekly/monthly responses use `period`
  date?: string // ISO date (YYYY-MM-DD)
  period?: string // e.g., "2025-W37" (weekly) or "2025-11" (monthly)
  hour?: string // For hourly data (HH:00)
  count?: number // Legacy field
  value?: number // Current API field
  label?: string
}

export interface TransactionVolumeResponse {
  data: TransactionVolumeDataPoint[]
  total_transactions?: number
  period: TransactionVolumePeriod
  chart_type: 'line'
  start_date?: string
  end_date?: string
  generated_at?: string
}

// Revenue Trend - actual API response structure
export interface RevenueTrendDataPoint {
  period: string // e.g., "2025-01" for monthly, "2025" for yearly
  revenue: number
}

export interface RevenueTrendResponse {
  period: string // "monthly" or "yearly"
  chart_type: 'area'
  data: RevenueTrendDataPoint[]
  generated_at: string
}

// Currency Distribution - actual API response structure
export interface CurrencyDistributionItem {
  currency: string // Currency code (e.g., "USD")
  count: number // Transaction count
  percentage: number // Percentage of total
}

export interface CurrencyDistributionResponse {
  chart_type: 'pie'
  period_days: number
  data: CurrencyDistributionItem[]
  generated_at: string
}

export type BranchComparisonMetric = 'revenue' | 'transactions' | 'efficiency'

// Branch Comparison - actual API response structure
export interface BranchComparisonItem {
  branch_name: string
  branch_code: string
  value: number // The metric value (revenue, transactions, or efficiency)
}

export interface BranchComparisonResponse {
  chart_type: 'bar'
  metric: BranchComparisonMetric
  period_days: number
  data: BranchComparisonItem[]
  generated_at: string
}

// ==================== Recent Transactions Endpoint ====================
export interface RecentTransaction {
  id: string // UUID
  transaction_number: string
  transaction_type: 'income' | 'expense' | 'exchange' | 'transfer'
  amount: string // Decimal as string
  currency_code: string
  status: 'pending' | 'completed' | 'cancelled' | 'failed'
  created_at: string // ISO datetime
  customer_name?: string
  branch_name?: string
}

export interface DashboardRecentTransactions {
  transactions: RecentTransaction[]
  total: number
}

// ==================== Alerts Endpoint ====================
export interface DashboardAlert {
  id: string // UUID
  type: 'low_balance' | 'pending_approval' | 'failed_transaction' | 'system' | 'security'
  severity: 'info' | 'warning' | 'error' | 'critical'
  title: string
  message: string
  created_at: string // ISO datetime
  read: boolean
  action_url?: string
  metadata?: Record<string, unknown>
}

export interface DashboardAlerts {
  alerts: DashboardAlert[]
  unread_count: number
  total: number
}

// ==================== Quick Actions Endpoint ====================
export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  action_type: 'create' | 'view' | 'report' | 'external'
  action_url: string
  enabled: boolean
  requires_permission?: string
}

export interface DashboardQuickActions {
  actions: QuickAction[]
}
