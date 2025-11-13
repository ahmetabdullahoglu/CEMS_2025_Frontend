import apiClient from './client'
import type {
  DashboardOverview,
  DashboardOverviewResponse,
  DashboardStatsResponse,
  DashboardCharts,
  DashboardRecentTransactions,
  DashboardAlerts,
  DashboardQuickActions,
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
}
