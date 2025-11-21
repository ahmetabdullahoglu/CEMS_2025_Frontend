import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionApi } from '@/lib/api/transaction.api'
import { branchApi } from '@/lib/api/branch.api'
import type {
  TransactionQueryParams,
  IncomeTransactionRequest,
  ExpenseTransactionRequest,
  TransferTransactionRequest,
  TransactionType,
  ExchangeCalculationRequest,
  ExchangeCalculationResponse,
  TransactionSummaryQueryParams,
  TransferReceiptRequest,
} from '@/types/transaction.types'
import type { Branch, BranchListResponse } from '@/types/branch.types'

/**
 * React Query hook for transactions list with filters and pagination
 */
export const useTransactions = (params: TransactionQueryParams, options?: { enabled?: boolean }) => {
  const { enabled = true } = options || {}

  return useQuery({
    queryKey: ['transactions', 'all', params],
    queryFn: () => transactionApi.getTransactions(params),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

const useTransactionsWithType = (
  type: TransactionType,
  params: TransactionQueryParams,
  enabled = true
) => {
  return useQuery({
    queryKey: ['transactions', type, params],
    queryFn: () => transactionApi.getTransactionsByType(type, params),
    enabled,
    staleTime: 1000 * 60 * 2,
  })
}

export const useTransactionsByType = (
  type: TransactionType,
  params: TransactionQueryParams,
  enabled = true
) => useTransactionsWithType(type, params, enabled)

export const usePendingApprovalTransactions = (
  params: TransactionQueryParams,
  enabled = true
) => {
  return useQuery({
    queryKey: ['transactions', 'pending-approvals', params],
    queryFn: () => transactionApi.getPendingApprovalTransactions(params),
    enabled,
    staleTime: 1000 * 60 * 2,
  })
}

/**
 * Hook for getting branches list
 */
export const useBranches = () => {
  return useQuery<BranchListResponse, Error, Branch[]>({
    queryKey: ['branches'],
    queryFn: branchApi.getBranches,
    staleTime: 1000 * 60 * 10, // 10 minutes
    select: (response) => response?.data ?? [],
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
export const useTransactionDetails = (id: string, type?: TransactionType, enabled = true) => {
  return useQuery({
    queryKey: ['transaction', id, type ?? 'any'],
    queryFn: () => transactionApi.getTransactionDetails(id, type),
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
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      transactionApi.cancelTransaction(id, { reason }),
    onSuccess: (_, { id }) => {
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

export const useExchangeRatePreview = () => {
  return useMutation({
    mutationFn: (payload: ExchangeCalculationRequest): Promise<ExchangeCalculationResponse> =>
      transactionApi.previewExchangeRate(payload),
  })
}

export const useReceiveTransfer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: TransferReceiptRequest }) =>
      transactionApi.receiveTransfer(id, payload ?? {}),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['transaction', id] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

export const useTransactionSummary = (
  params: TransactionSummaryQueryParams = {},
  enabled = true
) => {
  return useQuery({
    queryKey: ['transactions', 'summary', params],
    queryFn: () => transactionApi.getTransactionSummary(params),
    enabled,
    staleTime: 1000 * 60 * 5,
  })
}
