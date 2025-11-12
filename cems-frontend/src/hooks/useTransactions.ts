import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'
import { transactionApi } from '@/lib/api/transaction.api'
import type {
  TransactionListResponse,
  TransactionQueryParams,
  IncomeTransactionRequest,
  ExpenseTransactionRequest,
  TransferTransactionRequest,
} from '@/types/transaction.types'

/**
 * Fetch transactions list with filters and pagination
 */
const fetchTransactions = async (params: TransactionQueryParams): Promise<TransactionListResponse> => {
  const response = await apiClient.get<TransactionListResponse>('/transactions', { params })
  return response.data
}

/**
 * React Query hook for transactions list
 */
export const useTransactions = (params: TransactionQueryParams) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => fetchTransactions(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

/**
 * Hook for getting branches list
 */
export const useBranches = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: transactionApi.getBranches,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

/**
 * Hook for creating income transaction
 */
export const useCreateIncome = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: IncomeTransactionRequest) => transactionApi.createIncome(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

/**
 * Hook for creating expense transaction
 */
export const useCreateExpense = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ExpenseTransactionRequest) => transactionApi.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

/**
 * Hook for creating transfer transaction
 */
export const useCreateTransfer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TransferTransactionRequest) => transactionApi.createTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

/**
 * Hook for getting transaction details by ID
 */
export const useTransactionDetails = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionApi.getTransactionDetails(id),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook for canceling a transaction
 */
export const useCancelTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => transactionApi.cancelTransaction(id),
    onSuccess: (_, id) => {
      // Invalidate both the transaction details and the transactions list
      queryClient.invalidateQueries({ queryKey: ['transaction', id] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
