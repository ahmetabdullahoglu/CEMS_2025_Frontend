import apiClient from './client'
import type {
  CalculateCurrencyRequest,
  CalculateCurrencyResponse,
  Currency,
  CurrencyCreate,
  CurrencyListResponse,
  CurrencyQueryParams,
  CurrencyRateHistoryResponse,
  CurrencyUpdate,
  CurrencyWithRates,
  ExchangeRate,
  ExchangeRateCreate,
  ExchangeRateListResponse,
} from '@/types/currency.types'
import type { ExchangeCalculationResponse } from '@/types/transaction.types'
import { normalizeCurrencyIdentifier } from '@/utils/currency'

export const currencyApi = {
  // Get all currencies with pagination
  getCurrencies: async (params?: CurrencyQueryParams): Promise<CurrencyListResponse> => {
    const response = await apiClient.get<CurrencyListResponse>('/currencies', { params })
    return response.data
  },

  // Get all active currencies (simple list for dropdowns)
  getActiveCurrencies: async (): Promise<Currency[]> => {
    const response = await apiClient.get<Currency[]>('/currencies/active')
    return response.data
  },

  getCurrencyById: async (id: string): Promise<Currency> => {
    const response = await apiClient.get<Currency>(`/currencies/${id}`)
    return response.data
  },

  getCurrencyByCode: async (code: string): Promise<Currency> => {
    const response = await apiClient.get<Currency>(`/currencies/code/${encodeURIComponent(code)}`)
    return response.data
  },

  getCurrencyWithRates: async (id: string): Promise<CurrencyWithRates> => {
    const response = await apiClient.get<CurrencyWithRates>(`/currencies/${id}/with-rates`)
    return response.data
  },

  createCurrency: async (payload: CurrencyCreate): Promise<Currency> => {
    const response = await apiClient.post<Currency>('/currencies', payload)
    return response.data
  },

  updateCurrency: async (id: string, payload: CurrencyUpdate): Promise<Currency> => {
    const response = await apiClient.put<Currency>(`/currencies/${id}`, payload)
    return response.data
  },

  deleteCurrency: async (id: string): Promise<void> => {
    await apiClient.delete(`/currencies/${id}`)
  },

  activateCurrency: async (id: string): Promise<Currency> => {
    const response = await apiClient.patch<Currency>(`/currencies/${id}/activate`)
    return response.data
  },

  deactivateCurrency: async (id: string): Promise<Currency> => {
    const response = await apiClient.patch<Currency>(`/currencies/${id}/deactivate`)
    return response.data
  },

  // Get exchange rate between two currencies (pair lookup)
  getExchangeRate: async (fromCurrency: string, toCurrency: string): Promise<ExchangeRate> => {
    const from = normalizeCurrencyIdentifier(fromCurrency)
    const to = normalizeCurrencyIdentifier(toCurrency)

    const response = await apiClient.get<ExchangeRate>(
      `/currencies/rates/${encodeURIComponent(from)}/${encodeURIComponent(to)}`
    )
    return response.data
  },

  listExchangeRates: async (params?: {
    from_currency_id?: string | null
    to_currency_id?: string | null
    is_current?: boolean | null
    skip?: number
    limit?: number
  }): Promise<ExchangeRateListResponse> => {
    const response = await apiClient.get<ExchangeRateListResponse>('/currencies/rates', { params })
    return response.data
  },

  createExchangeRate: async (payload: ExchangeRateCreate): Promise<ExchangeRate> => {
    const response = await apiClient.post<ExchangeRate>('/currencies/rates', payload)
    return response.data
  },

  // Get exchange rate history for a currency pair
  getRateHistory: async (
    fromCurrency: string,
    toCurrency: string,
    params?: {
      date_from?: string | null
      date_to?: string | null
    }
  ): Promise<CurrencyRateHistoryResponse> => {
    const from = normalizeCurrencyIdentifier(fromCurrency)
    const to = normalizeCurrencyIdentifier(toCurrency)

    const response = await apiClient.get<ExchangeRateListResponse>(
      `/currencies/rates/history/${encodeURIComponent(from)}/${encodeURIComponent(to)}`,
      { params }
    )
    const payload = response.data
    return { data: payload.items, total: payload.total, success: true }
  },

  getExchangeRatePair: async (fromCurrency: string, toCurrency: string): Promise<ExchangeRate> => {
    const from = normalizeCurrencyIdentifier(fromCurrency)
    const to = normalizeCurrencyIdentifier(toCurrency)

    const response = await apiClient.get<ExchangeRate>(
      `/currencies/rates/${encodeURIComponent(from)}/${encodeURIComponent(to)}`
    )
    return response.data
  },

  // Calculate currency exchange using identifiers (UUID)
  calculateExchange: async (
    payload: CalculateCurrencyRequest
  ): Promise<ExchangeCalculationResponse | CalculateCurrencyResponse> => {
    const response = await apiClient.post<CalculateCurrencyResponse>('/currencies/calculate', payload)
    return response.data
  },
}
