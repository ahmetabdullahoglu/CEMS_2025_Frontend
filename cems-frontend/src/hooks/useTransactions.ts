import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'
import type { TransactionListResponse, TransactionQueryParams } from '@/types/transaction.types'

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
