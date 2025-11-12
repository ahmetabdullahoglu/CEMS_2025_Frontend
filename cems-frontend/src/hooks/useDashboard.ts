import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'
import type { DashboardOverview } from '@/types/dashboard.types'

/**
 * Fetch dashboard overview data
 */
const fetchDashboardOverview = async (): Promise<DashboardOverview> => {
  const response = await apiClient.get<DashboardOverview>('/dashboard/overview')
  return response.data
}

/**
 * React Query hook for dashboard overview data
 */
export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: fetchDashboardOverview,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  })
}
