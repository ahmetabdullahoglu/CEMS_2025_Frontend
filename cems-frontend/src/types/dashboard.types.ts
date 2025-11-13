// ==================== Overview Endpoint ====================
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
