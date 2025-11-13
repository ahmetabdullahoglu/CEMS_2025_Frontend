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
