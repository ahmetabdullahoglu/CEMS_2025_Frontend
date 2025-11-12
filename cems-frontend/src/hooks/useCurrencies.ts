import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { currencyApi } from '@/lib/api/currency.api'
import type { ExchangeTransactionRequest } from '@/types/currency.types'

export const useCurrencies = () => {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: currencyApi.getCurrencies,
    staleTime: 1000 * 60 * 10, // 10 minutes - currencies don't change often
  })
}

export const useExchangeRate = (fromCode?: string, toCode?: string) => {
  return useQuery({
    queryKey: ['exchangeRate', fromCode, toCode],
    queryFn: () => currencyApi.getExchangeRate(fromCode!, toCode!),
    enabled: !!fromCode && !!toCode && fromCode !== toCode,
    staleTime: 1000 * 60 * 2, // 2 minutes - exchange rates update frequently
  })
}

export const useCreateExchange = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ExchangeTransactionRequest) => currencyApi.createExchange(data),
    onSuccess: () => {
      // Invalidate transactions list to refresh after creating new transaction
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
