import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { currencyApi } from '@/lib/api/currency.api'
import type {
  ExchangeTransactionRequest,
  CurrencyQueryParams,
  UpdateRateRequest,
} from '@/types/currency.types'

export const useCurrencies = (params?: CurrencyQueryParams) => {
  return useQuery({
    queryKey: ['currencies', params],
    queryFn: () => currencyApi.getCurrencies(params),
    staleTime: 1000 * 60 * 5, // 5 minutes - currency rates can change
  })
}

export const useActiveCurrencies = () => {
  return useQuery({
    queryKey: ['currencies', 'active'],
    queryFn: currencyApi.getActiveCurrencies,
    staleTime: 1000 * 60 * 10, // 10 minutes - active currencies list doesn't change often
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

export const useUpdateCurrencyRates = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRateRequest }) =>
      currencyApi.updateCurrencyRates(id, data),
    onSuccess: () => {
      // Invalidate currencies list to refresh after updating rates
      queryClient.invalidateQueries({ queryKey: ['currencies'] })
    },
  })
}

export const useCurrencyRateHistory = (currencyId?: string, enabled = true) => {
  return useQuery({
    queryKey: ['currencies', currencyId, 'history'],
    queryFn: () => currencyApi.getRateHistory(currencyId!, { limit: 30 }),
    enabled: enabled && Boolean(currencyId),
    staleTime: 1000 * 60 * 5,
  })
}
