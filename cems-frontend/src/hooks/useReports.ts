import { useMutation, useQuery } from '@tanstack/react-query'
import { reportApi } from '@/lib/api/report.api'
import type { CustomReportParams, LowBalanceAlertsResponse, ReportExportParams } from '@/types/report.types'

export const useDailySummary = (params: { targetDate?: string; branchId?: string | null }, enabled = true) => {
  return useQuery({
    queryKey: ['reports', 'daily-summary', params.targetDate, params.branchId],
    queryFn: () => reportApi.getDailySummary(params.targetDate, params.branchId),
    enabled: enabled && !!params.targetDate,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useMonthlyRevenue = (
  params: { year: number; month: number; branchId?: string | null },
  enabled = true
) => {
  return useQuery({
    queryKey: ['reports', 'monthly-revenue', params.year, params.month, params.branchId],
    queryFn: () => reportApi.getMonthlyRevenue(params.year, params.month, params.branchId),
    enabled: enabled && !!params.year && !!params.month,
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
  fromCurrency: string
  toCurrency: string
  enabled?: boolean
}) => {
  const hasPair = !!fromCurrency && !!toCurrency

  return useQuery({
    queryKey: ['reports', 'exchange-trends', startDate, endDate, fromCurrency, toCurrency],
    queryFn: () => reportApi.getExchangeTrends(startDate, endDate, fromCurrency, toCurrency),
    enabled: enabled && !!startDate && !!endDate && hasPair,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export const useLowBalanceAlerts = ({
  severity,
  enabled = true,
}: {
  severity?: 'warning' | 'critical'
  enabled?: boolean
}) => {
  return useQuery<LowBalanceAlertsResponse>({
    queryKey: ['reports', 'low-balance-alerts'],
    queryFn: () => reportApi.getLowBalanceAlerts(),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 2,
    select: (data) => {
      if (!severity) return data
      return {
        ...data,
        alerts: data.alerts.filter((alert) => alert.severity === severity),
      }
    },
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
  userId: string
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['reports', 'user-activity', startDate, endDate, userId],
    queryFn: () => reportApi.getUserActivity(startDate, endDate, userId),
    enabled: enabled && !!startDate && !!endDate && !!userId,
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
    mutationFn: (params: ReportExportParams) => reportApi.exportReport(params),
  })
}
