import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vaultApi } from '@/lib/api/vault.api'
import type {
  VaultTransferQueryParams,
  CreateVaultTransferRequest,
} from '@/types/vault.types'

export const useVaultBalances = () => {
  return useQuery({
    queryKey: ['vault', 'details'],
    queryFn: vaultApi.getVaultDetails,
    staleTime: 1000 * 60 * 2, // 2 minutes - balances change frequently
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
    queryFn: () => vaultApi.getReconciliationReport(vaultId!),
    enabled: Boolean(vaultId),
    staleTime: 1000 * 60 * 5,
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
      queryClient.invalidateQueries({ queryKey: ['vault', 'balances'] })
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

export const useCompleteVaultTransfer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => vaultApi.completeVaultTransfer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vault', 'transfers'] })
      queryClient.invalidateQueries({ queryKey: ['vault', 'balances'] })
    },
  })
}
