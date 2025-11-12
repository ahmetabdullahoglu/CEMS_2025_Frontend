import { useQuery } from '@tanstack/react-query'
import { reportApi } from '@/lib/api/report.api'

export const useDailySummary = (date: string, enabled = true) => {
  return useQuery({
    queryKey: ['reports', 'daily-summary', date],
    queryFn: () => reportApi.getDailySummary(date),
    enabled: enabled && !!date,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useMonthlyRevenue = (year: number, month: number, enabled = true) => {
  return useQuery({
    queryKey: ['reports', 'monthly-revenue', year, month],
    queryFn: () => reportApi.getMonthlyRevenue(year, month),
    enabled: enabled && !!year && !!month,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export const useBranchPerformance = (startDate: string, endDate: string, enabled = true) => {
  return useQuery({
    queryKey: ['reports', 'branch-performance', startDate, endDate],
    queryFn: () => reportApi.getBranchPerformance(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
