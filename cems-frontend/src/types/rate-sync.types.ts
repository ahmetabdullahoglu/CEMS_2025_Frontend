export interface RateSyncInitiateRequest {
  base_currency: string
  source?: string
  target_currencies?: string[]
}

export interface RateSyncRateEntry {
  change: string
  change_percentage: string
  current_rate: string | null
  fetched_rate: string
  from_currency: string
  has_current: boolean
  source: string
  to_currency: string
}

export interface RateSyncInitiateResponse {
  base_currency: string
  expires_at: string
  rates: Record<string, RateSyncRateEntry>
  rates_count: number
  request_id: string
  source: string
  status: string
}

export interface RateSyncRequestDetails extends RateSyncInitiateResponse {
  requested_by?: string
  requested_at?: string
  reviewed_by?: string
  reviewed_at?: string
  review_notes?: string
  is_expired?: boolean
  rates_applied_count?: number
}

export interface RateSyncApproveRequest {
  notes?: string
  spread_percentage?: number
}

export interface RateSyncRejectRequest {
  notes?: string
}

export interface RateSyncPendingListResponse {
  count: number
  requests: RateSyncRequestDetails[]
}
