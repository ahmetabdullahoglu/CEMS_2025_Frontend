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
export interface TransactionVolumeDataPoint {
  date: string // ISO date (YYYY-MM-DD)
  hour?: string // For hourly data (HH:00)
  count: number
  label?: string
}

export interface TransactionVolumeResponse {
  data: TransactionVolumeDataPoint[]
  total_transactions: number
  period: string
  start_date: string
  end_date: string
}

export interface RevenueTrendDataPoint {
  date: string // ISO date
  revenue: string // Decimal as string
  expenses: string // Decimal as string
  profit: string // Decimal as string
  label?: string
}

export interface RevenueTrendResponse {
  data: RevenueTrendDataPoint[]
  total_revenue: string // Decimal as string
  total_expenses: string // Decimal as string
  total_profit: string // Decimal as string
  period: string
}

export interface CurrencyDistributionItem {
  currency_code: string
  currency_name: string
  total_amount: string // Decimal as string
  transaction_count: number
  percentage: number
  trend?: 'up' | 'down' | 'stable'
}

export interface CurrencyDistributionResponse {
  data: CurrencyDistributionItem[]
  total_currencies: number
  most_traded: string
  least_traded: string
}

export interface BranchComparisonItem {
  branch_id: string
  branch_name: string
  branch_code: string
  total_transactions: number
  total_revenue: string // Decimal as string
  total_profit: string // Decimal as string
  active_customers: number
  rank: number
}

export interface BranchComparisonResponse {
  data: BranchComparisonItem[]
  total_branches: number
  top_branch: string
  comparison_period: string
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
