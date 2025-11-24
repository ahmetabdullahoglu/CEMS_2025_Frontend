import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vaultApi } from '@/lib/api/vault.api'
import type {
  CreateVaultTransferRequest,
  VaultTransferQueryParams,
  VaultResponse,
  VaultBalanceUpdate,
  VaultStatistics,
  VaultTransferSummary,
  VaultCreate,
  VaultUpdate,
} from '@/types/vault.types'

export const useVaultsList = (params?: {
  branch_id?: string
  is_active?: boolean
  search?: string
  vault_type?: string
  skip?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: ['vault', 'list', params],
    queryFn: () => vaultApi.listVaults(params),
    staleTime: 1000 * 60 * 5,
    select: (response): VaultResponse[] => {
      if (Array.isArray(response)) return response
      if (response && Array.isArray((response as { data?: unknown }).data)) {
        return (response as { data: VaultResponse[] }).data
      }
      return []
    },
  })
}

export const useVaultBalances = () => {
  return useQuery({
    queryKey: ['vault', 'details'],
    queryFn: vaultApi.getMainVault,
    staleTime: 1000 * 60 * 2, // 2 minutes - balances change frequently
  })
}

export const useVaultDetails = (vaultId?: string) => {
  return useQuery({
    queryKey: ['vault', 'details', vaultId],
    queryFn: () => vaultApi.getVaultById(vaultId!),
    enabled: Boolean(vaultId),
    staleTime: 1000 * 60 * 2,
  })
}

export const useVaultCurrencyBalance = (currencyId?: string) => {
  return useQuery({
    queryKey: ['vault', 'currency-balance', currencyId],
    queryFn: () => vaultApi.getCurrencyBalance(currencyId!),
    enabled: Boolean(currencyId),
    staleTime: 1000 * 60, // 1 minute per currency
  })
}

export const useVaultReconciliationReport = (vaultId?: string) => {
  return useQuery({
    queryKey: ['vault', 'reconciliation', vaultId],
    queryFn: () => vaultApi.getReconciliationReport(vaultId),
    enabled: true,
    staleTime: 1000 * 60 * 5,
  })
}

export const useReconcileVault = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: vaultApi.reconcileVault,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vault', 'reconciliation', variables.vault_id] })
    },
  })
}

export const useVaultTransfers = (params?: VaultTransferQueryParams) => {
  return useQuery({
    queryKey: ['vault', 'transfers', params],
    queryFn: () => vaultApi.getVaultTransfers(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useCreateVaultTransfer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateVaultTransferRequest) => vaultApi.createVaultTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault', 'transfers'] })
      queryClient.invalidateQueries({ queryKey: ['vault', 'details'] })
    },
  })
}

export const useAdjustVaultBalance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: VaultBalanceUpdate) => vaultApi.adjustVaultBalance(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vault', 'details'] })
      queryClient.invalidateQueries({ queryKey: ['vault', 'details', variables.vault_id] })
    },
  })
}

export const useApproveVaultTransfer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      vaultApi.approveVaultTransfer(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault', 'transfers'] })
    },
  })
}

export const useRejectVaultTransfer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      vaultApi.rejectVaultTransfer(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault', 'transfers'] })
    },
  })
}

export const useVaultTransferDetails = (transferId?: string) => {
  return useQuery({
    queryKey: ['vault', 'transfer', transferId],
    queryFn: () => vaultApi.getVaultTransferDetails(transferId!),
    enabled: Boolean(transferId),
  })
}

export const useVaultStatistics = (vaultId?: string) => {
  return useQuery<VaultStatistics>({
    queryKey: ['vault', 'statistics', vaultId],
    queryFn: () => vaultApi.getVaultStatistics(vaultId),
    enabled: true,
    staleTime: 1000 * 60 * 5,
  })
}

export const useVaultTransferStatistics = (vaultId?: string, periodDays?: number) => {
  return useQuery<VaultTransferSummary>({
    queryKey: ['vault', 'statistics', 'transfers', vaultId, periodDays],
    queryFn: () => vaultApi.getVaultTransferStatistics(vaultId, periodDays),
    enabled: true,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateVault = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: VaultCreate) => vaultApi.createVault(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault', 'list'] })
    },
  })
}

export const useUpdateVault = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vaultId, payload }: { vaultId: string; payload: VaultUpdate }) =>
      vaultApi.updateVault(vaultId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vault', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['vault', 'details', variables.vaultId] })
    },
  })
}

export const useCompleteVaultTransfer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => vaultApi.completeVaultTransfer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault', 'transfers'] })
      queryClient.invalidateQueries({ queryKey: ['vault', 'details'] })
    },
  })
}

export const useCancelVaultTransfer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      vaultApi.cancelVaultTransfer(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault', 'transfers'] })
    },
  })
}
