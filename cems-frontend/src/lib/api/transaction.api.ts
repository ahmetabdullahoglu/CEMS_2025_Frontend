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
} from '@/types/transaction.types'

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

  // Get transaction details by ID
  getTransactionDetails: async (id: string): Promise<TransactionDetail> => {
    const response = await apiClient.get<TransactionDetail>(`/transactions/${id}`)
    return response.data
  },

  // Cancel transaction
  cancelTransaction: async (id: string): Promise<CancelTransactionResponse> => {
    const response = await apiClient.put<CancelTransactionResponse>(`/transactions/${id}/cancel`)
    return response.data
  },
}
