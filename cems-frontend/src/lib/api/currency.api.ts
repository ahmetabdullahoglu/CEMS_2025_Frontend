import apiClient from './client'
import type {
  Currency,
  ExchangeRate,
  ExchangeTransactionRequest,
  ExchangeTransactionResponse,
  CurrencyListResponse,
  CurrencyQueryParams,
  UpdateRateRequest,
  UpdateRateResponse,
  CurrencyRateHistoryResponse,
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

  // Get exchange rate between two currencies
  getExchangeRate: async (fromCurrency: string, toCurrency: string): Promise<ExchangeRate> => {
    const from = normalizeCurrencyIdentifier(fromCurrency)
    const to = normalizeCurrencyIdentifier(toCurrency)

    const response = await apiClient.get<ExchangeRate>(
      `/currencies/rates/${encodeURIComponent(from)}/${encodeURIComponent(to)}`
    )
    return response.data
  },

  // Create exchange transaction
  createExchange: async (
    data: ExchangeTransactionRequest
  ): Promise<ExchangeTransactionResponse> => {
    const response = await apiClient.post<ExchangeTransactionResponse>(
      '/transactions/exchange',
      data
    )
    return response.data
  },

  // Update currency rates
  updateCurrencyRates: async (
    id: string,
    data: UpdateRateRequest
  ): Promise<UpdateRateResponse> => {
    const response = await apiClient.put<UpdateRateResponse>(`/currencies/${id}`, data)
    return response.data
  },

  // Get exchange rate history for a currency
  getRateHistory: async (
    fromCurrency: string,
    toCurrency: string,
    params?: {
      start_date?: string
      end_date?: string
      limit?: number
    }
  ): Promise<CurrencyRateHistoryResponse> => {
    const from = normalizeCurrencyIdentifier(fromCurrency)
    const to = normalizeCurrencyIdentifier(toCurrency)

    const response = await apiClient.get<CurrencyRateHistoryResponse>(
      `/currencies/rates/history/${encodeURIComponent(from)}/${encodeURIComponent(to)}`,
      { params }
    )
    return response.data
  },

  // Calculate currency exchange using identifiers (UUID or code)
  calculateExchange: async (
    params: {
      amount: number | string
      from_currency: string
      to_currency: string
      apply_commission?: boolean
    }
  ): Promise<ExchangeCalculationResponse> => {
    const response = await apiClient.get<ExchangeCalculationResponse>('/currencies/calculate', {
      params: {
        amount: params.amount,
        from_currency: normalizeCurrencyIdentifier(params.from_currency),
        to_currency: normalizeCurrencyIdentifier(params.to_currency),
        apply_commission: params.apply_commission,
      },
    })
    return response.data
  },
}
