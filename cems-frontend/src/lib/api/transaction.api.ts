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
} from '@/types/transaction.types'

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

  // Pending approvals helper (filters expense endpoint to pending status)
  getPendingApprovalTransactions: async (
    params: TransactionQueryParams = {}
  ): Promise<TransactionListResponse> => {
    const response = await apiClient.get<TransactionListResponse>('/transactions/expense', {
      params: { ...withTypeFilters(params, 'expense'), status: 'pending' },
    })
    return response.data
  },

  // Get transaction details by ID
  getTransactionDetails: async (id: string): Promise<TransactionDetail> => {
    const response = await apiClient.get<TransactionDetail>(`/transactions/${id}`)
    return response.data
  },

  // Cancel transaction
  cancelTransaction: async (
    id: string,
    payload?: TransactionCancelRequest
  ): Promise<CancelTransactionResponse> => {
    const response = await apiClient.put<CancelTransactionResponse>(
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
}
