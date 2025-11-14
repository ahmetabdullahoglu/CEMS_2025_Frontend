import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/dashboard.api'

/**
 * React Query hook for dashboard overview data
 */
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: dashboardApi.getOverview,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  })
}

/**
 * Hook for detailed dashboard stats with period filter
 */
export const useDashboardStats = (period?: 'today' | 'week' | 'month' | 'year') => {
  return useQuery({
    queryKey: ['dashboard', 'stats', period],
    queryFn: () => dashboardApi.getStats(period),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook for dashboard charts data
 */
export const useDashboardCharts = (period?: 'week' | 'month' | 'quarter' | 'year') => {
  return useQuery({
    queryKey: ['dashboard', 'charts', period],
    queryFn: () => dashboardApi.getCharts(period),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook for recent transactions on dashboard
 */
export const useDashboardRecentTransactions = (limit: number = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-transactions', limit],
    queryFn: () => dashboardApi.getRecentTransactions(limit),
    staleTime: 1000 * 60 * 2, // 2 minutes (more frequent updates)
  })
}

/**
 * Hook for dashboard alerts
 */
export const useDashboardAlerts = (unreadOnly: boolean = false) => {
  return useQuery({
    queryKey: ['dashboard', 'alerts', unreadOnly],
    queryFn: () => dashboardApi.getAlerts(unreadOnly),
    staleTime: 1000 * 60 * 1, // 1 minute (alerts need frequent updates)
    refetchInterval: 1000 * 60 * 1, // Refetch every minute
  })
}

/**
 * Hook for dashboard quick actions
 */
export const useDashboardQuickActions = () => {
  return useQuery({
    queryKey: ['dashboard', 'quick-actions'],
    queryFn: dashboardApi.getQuickActions,
    staleTime: 1000 * 60 * 30, // 30 minutes (rarely changes)
  })
}

// ==================== Individual Chart Hooks ====================

/**
 * Hook for transaction volume chart data
 */
export const useTransactionVolume = (params?: {
  period?: 'today' | 'week' | 'month' | 'year'
  start_date?: string
  end_date?: string
}) => {
  return useQuery({
    queryKey: ['dashboard', 'charts', 'transaction-volume', params],
    queryFn: () => dashboardApi.getTransactionVolume(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook for revenue trend chart data
 */
export const useRevenueTrend = (params?: {
  period?: 'week' | 'month' | 'quarter' | 'year'
  start_date?: string
  end_date?: string
}) => {
  return useQuery({
    queryKey: ['dashboard', 'charts', 'revenue-trend', params],
    queryFn: () => dashboardApi.getRevenueTrend(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook for currency distribution chart data
 */
export const useCurrencyDistribution = (params?: {
  period?: 'today' | 'week' | 'month' | 'year'
  limit?: number
}) => {
  return useQuery({
    queryKey: ['dashboard', 'charts', 'currency-distribution', params],
    queryFn: () => dashboardApi.getCurrencyDistribution(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook for branch comparison chart data
 */
export const useBranchComparison = (params?: {
  period?: 'today' | 'week' | 'month' | 'year'
  metric?: 'revenue' | 'transactions' | 'profit'
  limit?: number
}) => {
  return useQuery({
    queryKey: ['dashboard', 'charts', 'branch-comparison', params],
    queryFn: () => dashboardApi.getBranchComparison(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
