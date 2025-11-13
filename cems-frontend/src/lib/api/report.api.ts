import apiClient from './client'
import type {
  DailySummaryResponse,
  MonthlyRevenueResponse,
  BranchPerformanceResponse,
  ExchangeTrendsResponse,
  BalanceSnapshotResponse,
  BalanceMovementResponse,
  LowBalanceAlertsResponse,
  UserActivityResponse,
  AuditTrailResponse,
  CustomerAnalysisResponse,
  CustomReportParams,
  CustomReportResponse,
  ReportExportParams,
  ReportExportResponse,
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

  // Get exchange trends report
  getExchangeTrends: async (startDate: string, endDate: string, fromCurrency?: string, toCurrency?: string): Promise<ExchangeTrendsResponse> => {
    const response = await apiClient.get<ExchangeTrendsResponse>('/reports/exchange-trends', {
      params: {
        start_date: startDate,
        end_date: endDate,
        from_currency: fromCurrency,
        to_currency: toCurrency,
      },
    })
    return response.data
  },

  // Get balance snapshot report
  getBalanceSnapshot: async (branchId?: string): Promise<BalanceSnapshotResponse> => {
    const response = await apiClient.get<BalanceSnapshotResponse>('/reports/balance-snapshot', {
      params: branchId ? { branch_id: branchId } : undefined,
    })
    return response.data
  },

  // Get balance movement report
  getBalanceMovement: async (startDate: string, endDate: string, branchId?: string, currencyId?: string): Promise<BalanceMovementResponse> => {
    const response = await apiClient.get<BalanceMovementResponse>('/reports/balance-movement', {
      params: {
        start_date: startDate,
        end_date: endDate,
        branch_id: branchId,
        currency_id: currencyId,
      },
    })
    return response.data
  },

  // Get low balance alerts report
  getLowBalanceAlerts: async (branchId?: string, severity?: 'warning' | 'critical'): Promise<LowBalanceAlertsResponse> => {
    const response = await apiClient.get<LowBalanceAlertsResponse>('/reports/low-balance-alerts', {
      params: {
        branch_id: branchId,
        severity,
      },
    })
    return response.data
  },

  // Get user activity report
  getUserActivity: async (startDate: string, endDate: string, userId?: string): Promise<UserActivityResponse> => {
    const response = await apiClient.get<UserActivityResponse>('/reports/user-activity', {
      params: {
        start_date: startDate,
        end_date: endDate,
        user_id: userId,
      },
    })
    return response.data
  },

  // Get audit trail report
  getAuditTrail: async (startDate: string, endDate: string, userId?: string, action?: string, page: number = 1, pageSize: number = 50): Promise<AuditTrailResponse> => {
    const response = await apiClient.get<AuditTrailResponse>('/reports/audit-trail', {
      params: {
        start_date: startDate,
        end_date: endDate,
        user_id: userId,
        action,
        page,
        page_size: pageSize,
      },
    })
    return response.data
  },

  // Get customer analysis report
  getCustomerAnalysis: async (startDate: string, endDate: string, customerType?: string, riskLevel?: string): Promise<CustomerAnalysisResponse> => {
    const response = await apiClient.get<CustomerAnalysisResponse>('/reports/customer-analysis', {
      params: {
        start_date: startDate,
        end_date: endDate,
        customer_type: customerType,
        risk_level: riskLevel,
      },
    })
    return response.data
  },

  // Generate custom report
  generateCustomReport: async (params: CustomReportParams): Promise<CustomReportResponse> => {
    const response = await apiClient.post<CustomReportResponse>('/reports/custom', params)
    return response.data
  },

  // Export report
  exportReport: async (params: ReportExportParams): Promise<ReportExportResponse> => {
    const response = await apiClient.post<ReportExportResponse>('/reports/export', params)
    return response.data
  },
}
