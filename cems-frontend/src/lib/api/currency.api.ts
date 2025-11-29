import apiClient from './client'
import type {
  CalculateCurrencyRequest,
  CalculateCurrencyResponse,
  Currency,
  CurrencyCreate,
  CurrencyListResponse,
  CurrencyQueryParams,
  CurrencyRateHistoryResponse,
  RateChangeLogEntry,
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
    const response = await apiClient.get<CurrencyListResponse>('/currencies', {
      params: { limit: params?.limit ?? 50, ...(params ?? {}) },
    })
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

  getCurrencyWithRates: async (
    id: string,
    options?: { includeHistorical?: boolean }
  ): Promise<CurrencyWithRates> => {
    const response = await apiClient.get<CurrencyWithRates>(`/currencies/${id}/with-rates`, {
      params: { include_historical: options?.includeHistorical || undefined },
    })

    const payload = response.data as CurrencyWithRates &
      Partial<Currency> & { current_rates?: ExchangeRate[] }

    // Normalize API variations: some endpoints return { currency, rates }, others return currency fields directly
    const currency: Currency = payload.currency ?? {
      id: payload.id!,
      code: payload.code!,
      name: payload.name ?? payload.name_en ?? '',
      symbol: payload.symbol ?? '',
      decimal_places: payload.decimal_places ?? 2,
      is_active: payload.is_active ?? true,
      created_at: payload.created_at ?? '',
      updated_at: payload.updated_at ?? '',
      name_en: payload.name_en,
      name_ar: payload.name_ar,
      is_base_currency: payload.is_base_currency,
    }

    const rates = payload.rates ?? payload.current_rates ?? []

    return { currency, rates }
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
    const payload = response.data as ExchangeRateListResponse
    const items = payload.items ?? payload.data ?? []

    return {
      ...payload,
      items,
      data: payload.data ?? items,
      total: payload.total ?? items.length,
    }
  },

  createExchangeRate: async (payload: ExchangeRateCreate): Promise<ExchangeRate> => {
    const response = await apiClient.post<ExchangeRate>('/currencies/rates', payload)
    return response.data
  },

  // Get exchange rate history for a currency pair
  getRateHistory: async (
    fromCurrency: string,
    toCurrency: string,
    limit = 50
  ): Promise<CurrencyRateHistoryResponse> => {
    const from = normalizeCurrencyIdentifier(fromCurrency)
    const to = normalizeCurrencyIdentifier(toCurrency)

    const response = await apiClient.get<CurrencyRateHistoryResponse>(
      `/currencies/rates/history/${encodeURIComponent(from)}/${encodeURIComponent(to)}`,
      {
        params: { limit },
      }
    )
    const payload = response.data as
      | CurrencyRateHistoryResponse
      | CurrencyRateHistoryResponse['data']
      | ExchangeRate

    const normalizeEntry = (entry: RateChangeLogEntry | ExchangeRate): RateChangeLogEntry => {
      if ((entry as RateChangeLogEntry).change_type) return entry as RateChangeLogEntry

      const rate = entry as ExchangeRate

      return {
        id: rate.id,
        exchange_rate_id: rate.id,
        from_currency_code:
          (rate as unknown as { from_currency_code?: string }).from_currency_code ??
          rate.from_currency?.code ??
          '',
        to_currency_code:
          (rate as unknown as { to_currency_code?: string }).to_currency_code ?? rate.to_currency?.code ?? '',
        old_rate: rate.effective_to ? rate.rate : null,
        old_buy_rate: rate.effective_to ? rate.buy_rate ?? null : null,
        old_sell_rate: rate.effective_to ? rate.sell_rate ?? null : null,
        new_rate: rate.rate,
        new_buy_rate: rate.buy_rate ?? null,
        new_sell_rate: rate.sell_rate ?? null,
        change_type: rate.is_current ? 'current' : 'historical',
        changed_by: rate.set_by ?? null,
        changed_at: rate.updated_at ?? rate.effective_from ?? rate.created_at,
        reason: rate.notes ?? null,
        rate_change_percentage: null,
      }
    }

    const dataArray: RateChangeLogEntry[] = Array.isArray((payload as CurrencyRateHistoryResponse).data)
      ? ((payload as CurrencyRateHistoryResponse).data ?? []).map(normalizeEntry)
      : Array.isArray(payload)
        ? (payload as Array<RateChangeLogEntry | ExchangeRate>).map(normalizeEntry)
        : [normalizeEntry(payload as ExchangeRate)]

    return {
      data: dataArray,
      total: (payload as CurrencyRateHistoryResponse).total ?? dataArray.length,
      success: (payload as CurrencyRateHistoryResponse).success ?? true,
    }
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
    const params = {
      amount: payload.amount,
      from_currency: normalizeCurrencyIdentifier(payload.from_currency_id),
      to_currency: normalizeCurrencyIdentifier(payload.to_currency_id),
      apply_commission: payload.apply_commission ?? false,
    }

    const response = await apiClient.get<CalculateCurrencyResponse>('/currencies/calculate', { params })
    return response.data
  },
}
