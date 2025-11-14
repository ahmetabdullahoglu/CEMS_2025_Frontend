import apiClient from './client'
import type {
  DashboardOverviewResponse,
  DashboardStatsResponse,
  DashboardCharts,
  DashboardRecentTransactions,
  DashboardAlerts,
  DashboardQuickActions,
  TransactionVolumeResponse,
  RevenueTrendResponse,
  CurrencyDistributionResponse,
  BranchComparisonResponse,
} from '@/types/dashboard.types'

export const dashboardApi = {
  // Get dashboard overview (main dashboard data)
  getOverview: async (): Promise<DashboardOverviewResponse> => {
    const response = await apiClient.get<DashboardOverviewResponse>('/dashboard/overview')
    return response.data
  },

  // Get detailed dashboard stats with period filter
  getStats: async (period?: 'today' | 'week' | 'month' | 'year'): Promise<DashboardStatsResponse> => {
    const response = await apiClient.get<DashboardStatsResponse>('/dashboard/stats', {
      params: period ? { period } : undefined,
    })
    return response.data
  },

  // Get dashboard charts data
  getCharts: async (period?: 'week' | 'month' | 'quarter' | 'year'): Promise<DashboardCharts> => {
    const response = await apiClient.get<DashboardCharts>('/dashboard/charts', {
      params: period ? { period } : undefined,
    })
    return response.data
  },

  // Get recent transactions for dashboard
  getRecentTransactions: async (limit?: number): Promise<DashboardRecentTransactions> => {
    const response = await apiClient.get<DashboardRecentTransactions>(
      '/dashboard/recent-transactions',
      {
        params: limit ? { limit } : undefined,
      }
    )
    return response.data
  },

  // Get dashboard alerts
  getAlerts: async (unread_only?: boolean): Promise<DashboardAlerts> => {
    const response = await apiClient.get<DashboardAlerts>('/dashboard/alerts', {
      params: unread_only ? { unread_only } : undefined,
    })
    return response.data
  },

  // Get quick actions for dashboard
  getQuickActions: async (): Promise<DashboardQuickActions> => {
    const response = await apiClient.get<DashboardQuickActions>('/dashboard/quick-actions')
    return response.data
  },

  // ==================== Individual Chart Endpoints ====================

  // Get transaction volume chart data
  getTransactionVolume: async (params?: {
    period?: 'today' | 'week' | 'month' | 'year'
    start_date?: string
    end_date?: string
  }): Promise<TransactionVolumeResponse> => {
    const response = await apiClient.get<TransactionVolumeResponse>(
      '/dashboard/charts/transaction-volume',
      { params }
    )
    return response.data
  },

  // Get revenue trend chart data
  getRevenueTrend: async (params?: {
    period?: 'week' | 'month' | 'quarter' | 'year'
    start_date?: string
    end_date?: string
  }): Promise<RevenueTrendResponse> => {
    const response = await apiClient.get<RevenueTrendResponse>(
      '/dashboard/charts/revenue-trend',
      { params }
    )
    return response.data
  },

  // Get currency distribution chart data
  getCurrencyDistribution: async (params?: {
    period?: 'today' | 'week' | 'month' | 'year'
    limit?: number
  }): Promise<CurrencyDistributionResponse> => {
    const response = await apiClient.get<CurrencyDistributionResponse>(
      '/dashboard/charts/currency-distribution',
      { params }
    )
    return response.data
  },

  // Get branch comparison chart data
  getBranchComparison: async (params?: {
    period?: 'today' | 'week' | 'month' | 'year'
    metric?: 'revenue' | 'transactions' | 'profit'
    limit?: number
  }): Promise<BranchComparisonResponse> => {
    const response = await apiClient.get<BranchComparisonResponse>(
      '/dashboard/charts/branch-comparison',
      { params }
    )
    return response.data
  },
}
