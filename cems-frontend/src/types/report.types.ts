// Daily Summary Types
export interface DailySummaryStats {
  total_transactions: number
  total_revenue: number
  total_expenses: number
  net_profit: number
  exchange_transactions: number
  income_transactions: number
  expense_transactions: number
  transfer_transactions: number
}

export interface DailySummaryChartData {
  hour: string
  transactions: number
  revenue: number
}

export interface DailySummaryResponse {
  date: string
  stats: DailySummaryStats
  hourly_data: DailySummaryChartData[]
}

// Monthly Revenue Types
export interface MonthlyRevenueData {
  date: string
  revenue: number
  expenses: number
  profit: number
}

export interface MonthlyRevenueResponse {
  month: string
  total_revenue: number
  total_expenses: number
  total_profit: number
  daily_data: MonthlyRevenueData[]
}

// Branch Performance Types
export interface BranchPerformanceData {
  branch_id: number
  branch_name: string
  total_transactions: number
  total_revenue: number
  total_expenses: number
  net_profit: number
  top_currency: string
  top_currency_volume: number
}

export interface BranchPerformanceResponse {
  branches: BranchPerformanceData[]
  period_start: string
  period_end: string
}
