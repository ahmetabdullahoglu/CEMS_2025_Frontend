import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { branchApi } from '@/lib/api/branch.api'
import type { BranchQueryParams, BranchCreate, BranchUpdate } from '@/types/branch.types'

export const useBranches = (params?: BranchQueryParams) => {
  return useQuery({
    queryKey: ['branches', params],
    queryFn: () => branchApi.getBranches(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useBranch = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['branch', id],
    queryFn: () => branchApi.getBranch(id),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useBranchBalances = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ['branch', id, 'balances'],
    queryFn: () => branchApi.getBranchBalances(id),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes - balances change frequently
  })
}

/**
 * Hook for creating a new branch
 */
export const useCreateBranch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BranchCreate) => branchApi.createBranch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
    },
  })
}

/**
 * Hook for updating a branch
 */
export const useUpdateBranch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BranchUpdate }) =>
      branchApi.updateBranch(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['branch', id] })
      queryClient.invalidateQueries({ queryKey: ['branches'] })
    },
  })
}

/**
 * Hook for deleting a branch
 */
export const useDeleteBranch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => branchApi.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] })
    },
  })
}

/**
 * Hook for setting branch thresholds
 */
export const useSetBranchThresholds = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      thresholds,
    }: {
      id: string
      thresholds: Array<{ currency_id: string; min_balance: string; max_balance?: string }>
    }) => branchApi.setBranchThresholds(id, thresholds),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['branch', id] })
      queryClient.invalidateQueries({ queryKey: ['branch', id, 'balances'] })
    },
  })
}

/**
 * Hook for assigning user to branch
 */
export const useAssignUserToBranch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      branchApi.assignUserToBranch(id, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['branch', id] })
    },
  })
}

/**
 * Hook for removing user from branch
 */
export const useRemoveUserFromBranch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      branchApi.removeUserFromBranch(id, userId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['branch', id] })
    },
  })
}
