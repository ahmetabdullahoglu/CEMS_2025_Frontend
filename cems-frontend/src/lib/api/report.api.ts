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
  getDailySummary: async (
    targetDate?: string,
    branchId?: string | null
  ): Promise<DailySummaryResponse> => {
    const response = await apiClient.get<DailySummaryResponse>('/reports/daily-summary', {
      params: {
        target_date: targetDate,
        branch_id: branchId ?? undefined,
      },
    })
    return response.data
  },

  // Get monthly revenue report
  getMonthlyRevenue: async (
    year: number,
    month: number,
    branchId?: string | null
  ): Promise<MonthlyRevenueResponse> => {
    const response = await apiClient.get<MonthlyRevenueResponse>('/reports/monthly-revenue', {
      params: { year, month, branch_id: branchId ?? undefined },
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
  getExchangeTrends: async (
    startDate: string,
    endDate: string,
    fromCurrency: string,
    toCurrency: string
  ): Promise<ExchangeTrendsResponse> => {
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
  getBalanceSnapshot: async (branchId?: string, snapshotDate?: string): Promise<BalanceSnapshotResponse> => {
    const response = await apiClient.get<BalanceSnapshotResponse>('/reports/balance-snapshot', {
      params: {
        branch_id: branchId,
        snapshot_date: snapshotDate,
      },
    })
    return response.data
  },

  // Get balance movement report
  getBalanceMovement: async (
    startDate: string,
    endDate: string,
    branchId?: string,
    currencyCode?: string
  ): Promise<BalanceMovementResponse> => {
    const response = await apiClient.get<BalanceMovementResponse>('/reports/balance-movement', {
      params: {
        start_date: startDate,
        end_date: endDate,
        branch_id: branchId,
        currency_code: currencyCode,
      },
    })
    return response.data
  },

  // Get low balance alerts report
  getLowBalanceAlerts: async (): Promise<LowBalanceAlertsResponse> => {
    const response = await apiClient.get<LowBalanceAlertsResponse>('/reports/low-balance-alerts')
    return response.data
  },

  // Get user activity report
  getUserActivity: async (startDate: string, endDate: string, userId: string): Promise<UserActivityResponse> => {
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
  getAuditTrail: async (
    entityType: string,
    entityId: string
  ): Promise<AuditTrailResponse> => {
    const response = await apiClient.get<AuditTrailResponse>('/reports/audit-trail', {
      params: {
        entity_type: entityType,
        entity_id: entityId,
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
    const { report_type, format, filters } = params
    const response = await apiClient.post<ReportExportResponse>(
      '/reports/export',
      filters ?? {},
      { params: { report_type, format } }
    )
    return response.data
  },
}
