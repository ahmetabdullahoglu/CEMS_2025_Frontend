import { useQuery } from '@tanstack/react-query'
import { branchApi } from '@/lib/api/branch.api'
import type { BranchQueryParams } from '@/types/branch.types'

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
