import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { rateSyncApi } from '@/lib/api/rate-sync.api'
import type {
  RateSyncApproveRequest,
  RateSyncInitiateRequest,
  RateSyncRejectRequest,
} from '@/types/rate-sync.types'

export const useInitiateRateSync = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RateSyncInitiateRequest) => rateSyncApi.initiate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rateSync', 'pending'] })
    },
  })
}

export const useRateSyncRequest = (requestId?: string, enabled = true) => {
  return useQuery({
    queryKey: ['rateSync', requestId],
    queryFn: () => rateSyncApi.getRequest(requestId!),
    enabled: !!requestId && enabled,
    staleTime: 1000 * 30,
  })
}

export const useApproveRateSync = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, payload }: { requestId: string; payload: RateSyncApproveRequest }) =>
      rateSyncApi.approveRequest(requestId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rateSync', variables.requestId] })
      queryClient.invalidateQueries({ queryKey: ['rateSync', 'pending'] })
    },
  })
}

export const useRejectRateSync = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, payload }: { requestId: string; payload: RateSyncRejectRequest }) =>
      rateSyncApi.rejectRequest(requestId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rateSync', variables.requestId] })
      queryClient.invalidateQueries({ queryKey: ['rateSync', 'pending'] })
    },
  })
}

export const usePendingRateSyncRequests = (enabled = true) => {
  return useQuery({
    queryKey: ['rateSync', 'pending'],
    queryFn: rateSyncApi.listPendingRequests,
    enabled,
    staleTime: 1000 * 30,
  })
}

export const useCleanupExpiredRateSync = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rateSyncApi.cleanupExpired,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rateSync', 'pending'] })
    },
  })
}
