import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { currencyApi } from '@/lib/api/currency.api'
import type {
  ExchangeTransactionRequest,
  CurrencyQueryParams,
  UpdateRateRequest,
} from '@/types/currency.types'
import { isSameCurrency, normalizeCurrencyIdentifier } from '@/utils/currency'

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

export const useExchangeRate = (fromCurrency?: string, toCurrency?: string) => {
  const from = fromCurrency ? normalizeCurrencyIdentifier(fromCurrency) : undefined
  const to = toCurrency ? normalizeCurrencyIdentifier(toCurrency) : undefined

  return useQuery({
    queryKey: ['exchangeRate', from, to],
    queryFn: () => currencyApi.getExchangeRate(from!, to!),
    enabled: !!from && !!to && !isSameCurrency(from, to),
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

export const useCurrencyRateHistory = (
  fromCurrency?: string,
  toCurrency?: string,
  enabled = true
) => {
  const from = fromCurrency ? normalizeCurrencyIdentifier(fromCurrency) : undefined
  const to = toCurrency ? normalizeCurrencyIdentifier(toCurrency) : undefined

  const hasPair = !!from && !!to && !isSameCurrency(from, to)

  return useQuery({
    queryKey: ['currencies', from, to, 'history'],
    queryFn: () => currencyApi.getRateHistory(from!, to!, { limit: 30 }),
    enabled: enabled && hasPair,
    staleTime: 1000 * 60 * 5,
  })
}
