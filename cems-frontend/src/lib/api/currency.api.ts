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
} from '@/types/currency.types'

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
  getExchangeRate: async (fromCode: string, toCode: string): Promise<ExchangeRate> => {
    const response = await apiClient.get<ExchangeRate>(`/currencies/exchange-rate`, {
      params: { from: fromCode, to: toCode },
    })
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
}
