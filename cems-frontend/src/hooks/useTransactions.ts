import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionApi } from '@/lib/api/transaction.api'
import type {
  TransactionQueryParams,
  IncomeTransactionRequest,
  ExpenseTransactionRequest,
  TransferTransactionRequest,
  TransactionType,
} from '@/types/transaction.types'

/**
 * React Query hook for transactions list with filters and pagination
 */
export const useTransactions = (params: TransactionQueryParams) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionApi.getTransactions(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useTransactionsByType = (
  type: 'all' | TransactionType,
  params: TransactionQueryParams
) => {
  return useQuery({
    queryKey: ['transactions', type, params],
    queryFn: () => {
      switch (type) {
        case 'income':
          return transactionApi.getIncomeTransactions(params)
        case 'expense':
          return transactionApi.getExpenseTransactions(params)
        case 'exchange':
          return transactionApi.getExchangeTransactions(params)
        case 'transfer':
          return transactionApi.getTransferTransactions(params)
        default:
          return transactionApi.getTransactions(params)
      }
    },
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
export const useTransactionDetails = (id: string, enabled = true) => {
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
    mutationFn: (id: string) => transactionApi.cancelTransaction(id),
    onSuccess: (_, id) => {
      // Invalidate both the transaction details and the transactions list
      queryClient.invalidateQueries({ queryKey: ['transaction', id] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

/**
 * Hook for approving a transaction
 */
export const useApproveTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => transactionApi.approveTransaction(id),
    onSuccess: (_, id) => {
      // Invalidate both the transaction details and the transactions list
      queryClient.invalidateQueries({ queryKey: ['transaction', id] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
