import apiClient from './client'
import type {
  DailySummaryResponse,
  MonthlyRevenueResponse,
  BranchPerformanceResponse,
} from '@/types/report.types'

export const reportApi = {
  // Get daily summary report
  getDailySummary: async (date: string): Promise<DailySummaryResponse> => {
    const response = await apiClient.get<DailySummaryResponse>('/reports/daily-summary', {
      params: { date },
    })
    return response.data
  },

  // Get monthly revenue report
  getMonthlyRevenue: async (year: number, month: number): Promise<MonthlyRevenueResponse> => {
    const response = await apiClient.get<MonthlyRevenueResponse>('/reports/monthly-revenue', {
      params: { year, month },
    })
    return response.data
  },

  // Get branch performance report
  getBranchPerformance: async (startDate: string, endDate: string): Promise<BranchPerformanceResponse> => {
    const response = await apiClient.get<BranchPerformanceResponse>('/reports/branch-performance', {
      params: { start_date: startDate, end_date: endDate },
    })
    return response.data
  },
}
