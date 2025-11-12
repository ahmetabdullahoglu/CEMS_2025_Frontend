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
