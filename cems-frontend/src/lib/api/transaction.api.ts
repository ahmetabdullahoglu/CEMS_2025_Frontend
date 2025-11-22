import apiClient from './client'
import type {
  IncomeTransactionRequest,
  IncomeTransactionResponse,
  ExpenseTransactionRequest,
  ExpenseTransactionResponse,
  TransferTransactionRequest,
  TransferTransactionResponse,
  Branch,
  TransactionDetail,
  TransactionListResponse,
  TransactionQueryParams,
  CancelTransactionResponse,
  TransactionCancelRequest,
  TransactionType,
  ExchangeCalculationRequest,
  ExchangeCalculationResponse,
  TransactionSummary,
  TransactionSummaryQueryParams,
  TransferReceiptRequest,
} from '@/types/transaction.types'

const detailEndpointMap: Partial<Record<TransactionType, string>> = {
  exchange: '/transactions/exchange',
  income: '/transactions/income',
  expense: '/transactions/expense',
  transfer: '/transactions/transfer',
}

const withTypeFilters = (params: TransactionQueryParams = {}, type?: TransactionType) => {
  if (!type) return params

  const rest: TransactionQueryParams = { ...params }
  delete rest.transaction_type
  return rest
}

export const transactionApi = {
  // Create income transaction
  createIncome: async (data: IncomeTransactionRequest): Promise<IncomeTransactionResponse> => {
    const response = await apiClient.post<IncomeTransactionResponse>(
      '/transactions/income',
      data
    )
    return response.data
  },

  // Create expense transaction
  createExpense: async (data: ExpenseTransactionRequest): Promise<ExpenseTransactionResponse> => {
    const response = await apiClient.post<ExpenseTransactionResponse>(
      '/transactions/expense',
      data
    )
    return response.data
  },

  // Create transfer transaction
  createTransfer: async (
    data: TransferTransactionRequest
  ): Promise<TransferTransactionResponse> => {
    const response = await apiClient.post<TransferTransactionResponse>(
      '/transactions/transfer',
      data
    )
    return response.data
  },

  // Get all branches
  getBranches: async (): Promise<Branch[]> => {
    const response = await apiClient.get<Branch[]>('/branches')
    return response.data
  },

  // Get transactions list with filters and pagination
  getTransactions: async (params: TransactionQueryParams): Promise<TransactionListResponse> => {
    const response = await apiClient.get<TransactionListResponse>('/transactions', { params })
    return response.data
  },

  // Get transactions filtered by type using dedicated endpoints
  getTransactionsByType: async (
    type: TransactionType,
    params: TransactionQueryParams = {}
  ): Promise<TransactionListResponse> => {
    const response = await apiClient.get<TransactionListResponse>(`/transactions/${type}`, {
      params: withTypeFilters(params, type),
    })
    return response.data
  },

  getIncomeTransactions: async (
    params: TransactionQueryParams = {}
  ): Promise<TransactionListResponse> => {
    return transactionApi.getTransactionsByType('income', params)
  },

  getExpenseTransactions: async (
    params: TransactionQueryParams = {}
  ): Promise<TransactionListResponse> => {
    return transactionApi.getTransactionsByType('expense', params)
  },

  getExchangeTransactions: async (
    params: TransactionQueryParams = {}
  ): Promise<TransactionListResponse> => {
    return transactionApi.getTransactionsByType('exchange', params)
  },

  getTransferTransactions: async (
    params: TransactionQueryParams = {}
  ): Promise<TransactionListResponse> => {
    return transactionApi.getTransactionsByType('transfer', params)
  },

  // Pending transfer approvals helper (awaiting receipt)
  getPendingApprovalTransactions: async (
    params: TransactionQueryParams = {}
  ): Promise<TransactionListResponse> => {
    const response = await apiClient.get<TransactionListResponse>('/transactions/transfer', {
      params: { ...withTypeFilters(params, 'transfer'), status: 'pending' },
    })
    return response.data
  },

  // Get transaction details by ID
  getTransactionDetails: async (id: string, type?: TransactionType): Promise<TransactionDetail> => {
    const detailEndpoint = type ? detailEndpointMap[type] : undefined
    const endpoint = detailEndpoint ? `${detailEndpoint}/${id}` : `/transactions/${id}`

    const response = await apiClient.get<TransactionDetail>(endpoint)
    return response.data
  },

  // Cancel transaction
  cancelTransaction: async (
    id: string,
    payload: TransactionCancelRequest
  ): Promise<CancelTransactionResponse> => {
    const response = await apiClient.post<CancelTransactionResponse>(
      `/transactions/${id}/cancel`,
      payload
    )
    return response.data
  },

  // Approve transaction
  approveTransaction: async (id: string): Promise<TransactionDetail> => {
    const response = await apiClient.post<TransactionDetail>(`/transactions/expense/${id}/approve`)
    return response.data
  },

  previewExchangeRate: async (
    payload: ExchangeCalculationRequest
  ): Promise<ExchangeCalculationResponse> => {
    const response = await apiClient.post<ExchangeCalculationResponse>(
      '/transactions/exchange/rate-preview',
      payload
    )
    return response.data
  },

  receiveTransfer: async (
    id: string,
    payload: TransferReceiptRequest = {}
  ): Promise<TransferTransactionResponse> => {
    const response = await apiClient.post<TransferTransactionResponse>(
      `/transactions/transfer/${id}/receive`,
      payload
    )
    return response.data
  },

  getTransactionSummary: async (
    params?: TransactionSummaryQueryParams
  ): Promise<TransactionSummary> => {
    const response = await apiClient.get<TransactionSummary>('/transactions/stats/summary', { params })
    return response.data
  },
}
