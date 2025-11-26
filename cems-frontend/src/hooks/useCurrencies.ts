import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { currencyApi } from '@/lib/api/currency.api'
import type {
  CalculateCurrencyRequest,
  CurrencyQueryParams,
  CurrencyUpdate,
  CurrencyWithRates,
  ExchangeRateCreate,
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
    mutationFn: (data: CalculateCurrencyRequest) => currencyApi.calculateExchange(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

export const useCreateCurrency = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: currencyApi.createCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] })
      queryClient.invalidateQueries({ queryKey: ['currencies', 'active'] })
    },
  })
}

export const useUpdateCurrency = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CurrencyUpdate }) =>
      currencyApi.updateCurrency(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] })
      queryClient.invalidateQueries({ queryKey: ['currencies', 'active'] })
    },
  })
}

export const useActivateCurrency = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: currencyApi.activateCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] })
      queryClient.invalidateQueries({ queryKey: ['currencies', 'active'] })
    },
  })
}

export const useDeactivateCurrency = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: currencyApi.deactivateCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] })
      queryClient.invalidateQueries({ queryKey: ['currencies', 'active'] })
    },
  })
}

export const useDeleteCurrency = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: currencyApi.deleteCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] })
      queryClient.invalidateQueries({ queryKey: ['currencies', 'active'] })
    },
  })
}

export const useCreateExchangeRate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ExchangeRateCreate) => currencyApi.createExchangeRate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currencies'] })
      queryClient.invalidateQueries({ queryKey: ['exchangeRates'] })
    },
  })
}

export const useExchangeRatesList = (params?: {
  from_currency_id?: string | null
  to_currency_id?: string | null
  is_current?: boolean | null
  skip?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: ['exchangeRates', params],
    queryFn: () => currencyApi.listExchangeRates(params),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCurrencyWithRates = (
  currencyId?: string,
  options?: { includeHistorical?: boolean; enabled?: boolean }
) => {
  return useQuery<CurrencyWithRates>({
    queryKey: ['currencyWithRates', currencyId, options?.includeHistorical],
    queryFn: () => currencyApi.getCurrencyWithRates(currencyId!, options),
    enabled: !!currencyId && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
    select: (payload) => {
      const wrapped = (payload as { data?: CurrencyWithRates }).data
      const base = wrapped ?? payload
      return {
        ...base,
        rates: Array.isArray(base?.rates) ? base.rates : [],
      } as CurrencyWithRates
    },
  })
}

export const useCurrencyRateHistory = (
  fromCurrency?: string,
  toCurrency?: string,
  options?: { enabled?: boolean; limit?: number }
) => {
  const from = fromCurrency ? normalizeCurrencyIdentifier(fromCurrency) : undefined
  const to = toCurrency ? normalizeCurrencyIdentifier(toCurrency) : undefined

  const hasPair = !!from && !!to && !isSameCurrency(from, to)

  return useQuery({
    queryKey: ['currencies', from, to, 'history', options?.limit],
    queryFn: () => currencyApi.getRateHistory(from!, to!, options?.limit),
    enabled: (options?.enabled ?? true) && hasPair,
    staleTime: 1000 * 60 * 5,
  })
}
