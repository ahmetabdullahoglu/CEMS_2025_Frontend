import apiClient from './client'
import type {
  Currency,
  ExchangeRate,
  ExchangeTransactionRequest,
  ExchangeTransactionResponse,
} from '@/types/currency.types'

export const currencyApi = {
  // Get all active currencies
  getCurrencies: async (): Promise<Currency[]> => {
    const response = await apiClient.get<Currency[]>('/currencies')
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
}
