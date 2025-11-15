import { useMutation, useQuery } from '@tanstack/react-query'
import { reportApi } from '@/lib/api/report.api'
import type { CustomReportParams } from '@/types/report.types'

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

export const useExchangeTrends = ({
  startDate,
  endDate,
  fromCurrency,
  toCurrency,
  enabled = true,
}: {
  startDate: string
  endDate: string
  fromCurrency?: string
  toCurrency?: string
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['reports', 'exchange-trends', startDate, endDate, fromCurrency, toCurrency],
    queryFn: () => reportApi.getExchangeTrends(startDate, endDate, fromCurrency, toCurrency),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export const useLowBalanceAlerts = ({
  branchId,
  severity,
  enabled = true,
}: {
  branchId?: string
  severity?: 'warning' | 'critical'
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['reports', 'low-balance-alerts', branchId, severity],
    queryFn: () => reportApi.getLowBalanceAlerts(branchId, severity),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 2,
  })
}

export const useUserActivityReport = ({
  startDate,
  endDate,
  userId,
  enabled = true,
}: {
  startDate: string
  endDate: string
  userId?: string
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['reports', 'user-activity', startDate, endDate, userId],
    queryFn: () => reportApi.getUserActivity(startDate, endDate, userId),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCustomReport = (params?: CustomReportParams, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['reports', 'custom', params],
    queryFn: () => reportApi.generateCustomReport(params as CustomReportParams),
    enabled: enabled && !!params,
  })
}

export const useReportExport = () => {
  return useMutation({
    mutationFn: reportApi.exportReport,
  })
}
