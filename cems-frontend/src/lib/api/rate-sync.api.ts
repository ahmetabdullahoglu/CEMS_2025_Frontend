import apiClient from './client'
import type {
  RateSyncApproveRequest,
  RateSyncInitiateRequest,
  RateSyncInitiateResponse,
  RateSyncPendingListResponse,
  RateSyncRejectRequest,
  RateSyncRequestDetails,
} from '@/types/rate-sync.types'

export const rateSyncApi = {
  initiate: async (payload: RateSyncInitiateRequest): Promise<RateSyncInitiateResponse> => {
    const response = await apiClient.post<RateSyncInitiateResponse>('/rate-sync/sync-rates', payload)
    return response.data
  },

  getRequest: async (requestId: string): Promise<RateSyncRequestDetails> => {
    const response = await apiClient.get<RateSyncRequestDetails>(`/rate-sync/sync-requests/${requestId}`)
    return response.data
  },

  approveRequest: async (
    requestId: string,
    payload: RateSyncApproveRequest
  ): Promise<RateSyncRequestDetails> => {
    const response = await apiClient.post<RateSyncRequestDetails>(
      `/rate-sync/sync-requests/${requestId}/approve`,
      payload
    )
    return response.data
  },

  rejectRequest: async (
    requestId: string,
    payload: RateSyncRejectRequest
  ): Promise<RateSyncRequestDetails> => {
    const response = await apiClient.post<RateSyncRequestDetails>(
      `/rate-sync/sync-requests/${requestId}/reject`,
      payload
    )
    return response.data
  },

  listPendingRequests: async (): Promise<RateSyncPendingListResponse> => {
    const response = await apiClient.get<RateSyncPendingListResponse>('/rate-sync/sync-requests')
    return response.data
  },

  cleanupExpired: async (): Promise<string> => {
    const response = await apiClient.post<string>('/rate-sync/sync-requests/cleanup-expired')
    return response.data
  },
}
