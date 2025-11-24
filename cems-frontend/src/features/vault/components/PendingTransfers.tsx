import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Check, X, ArrowRight, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  useVaultTransfers,
  useApproveVaultTransfer,
  useCompleteVaultTransfer,
  useRejectVaultTransfer,
  useCancelVaultTransfer,
} from '@/hooks/useVault'
import { useBranches } from '@/hooks/useBranches'
import { useActiveCurrencies } from '@/hooks/useCurrencies'
import { useVaultsList } from '@/hooks/useVault'
import { formatBranchLabel } from '@/utils/branch'
import type { VaultTransferResponse } from '@/types/vault.types'

export default function PendingTransfers() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const skip = (page - 1) * pageSize

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'cancel'>('approve')
  const [selectedTransferId, setSelectedTransferId] = useState<string>('')
  const [notes, setNotes] = useState('')

  const { data, isLoading, isError } = useVaultTransfers({
    skip,
    limit: pageSize,
    status: 'pending',
  })

  const { mutate: approve, isPending: isApproving } = useApproveVaultTransfer()
  const { mutate: complete, isPending: isCompleting } = useCompleteVaultTransfer()
  const { mutate: reject, isPending: isRejecting } = useRejectVaultTransfer()
  const { mutate: cancel, isPending: isCancelling } = useCancelVaultTransfer()

  const { data: branchesData } = useBranches({ limit: 200, is_active: true })
  const { data: currenciesData } = useActiveCurrencies()
  const { data: vaultsData } = useVaultsList({ is_active: true })

  const branchLookup = useMemo(() => {
    const map = new Map<string, { code?: string; name?: string }>()
    ;(branchesData?.data ?? []).forEach((branch) => {
      map.set(branch.id, { code: branch.code, name: branch.name_en ?? branch.name })
    })
    return map
  }, [branchesData])

  const currencyLookup = useMemo(() => {
    const map = new Map<string, { code?: string; name?: string }>()
    ;(currenciesData ?? []).forEach((currency) => {
      map.set(currency.id, { code: currency.code, name: currency.name })
    })
    return map
  }, [currenciesData])

  const vaultLookup = useMemo(() => {
    const map = new Map<string, { code?: string; name?: string }>()
    ;(vaultsData ?? []).forEach((vault) => {
      map.set(vault.id, { code: vault.vault_code, name: vault.name })
    })
    return map
  }, [vaultsData])

  const resolveBranchLabel = (id?: string | null, fallbackCode?: string | null) => {
    if (!id && !fallbackCode) return undefined
    const branch = id ? branchLookup.get(id) : undefined

    return formatBranchLabel(
      branch
        ? { id, code: branch.code ?? undefined, name: branch.name ?? undefined }
        : undefined,
      fallbackCode ?? undefined,
      id ?? undefined
    )
  }

  const resolveVaultLabel = (id?: string | null, fallbackCode?: string | null) => {
    if (!id && !fallbackCode) return undefined
    const vault = id ? vaultLookup.get(id) : undefined
    if (vault?.code && vault?.name) return `${vault.code} - ${vault.name}`
    if (vault?.code) return vault.code
    if (vault?.name && id) return `${vault.name}`
    return fallbackCode ?? id ?? 'Unknown vault'
  }

  const resolveCurrencyLabel = (id: string, fallback?: string | null) => {
    const currency = currencyLookup.get(id)
    if (currency?.code && currency?.name) return `${currency.code} - ${currency.name}`
    if (currency?.code) return currency.code
    if (currency?.name) return currency.name
    return fallback ?? id
  }

  const handleApprove = (id: string) => {
    setActionType('approve')
    setSelectedTransferId(id)
    setNotes('')
    setDialogOpen(true)
  }

  const handleReject = (id: string) => {
    setActionType('reject')
    setSelectedTransferId(id)
    setNotes('')
    setDialogOpen(true)
  }

  const handleCancel = (id: string) => {
    setActionType('cancel')
    setSelectedTransferId(id)
    setNotes('')
    setDialogOpen(true)
  }

  const handleConfirmAction = () => {
    if (actionType === 'approve') {
      approve(
        { id: selectedTransferId, notes: notes.trim() || undefined },
        {
          onSuccess: () => {
            setDialogOpen(false)
            setNotes('')
          },
        }
      )
      return
    }

    if (actionType === 'reject') {
      reject(
        { id: selectedTransferId, notes: notes.trim() || undefined },
        {
          onSuccess: () => {
            setDialogOpen(false)
            setNotes('')
          },
        }
      )
      return
    }

    cancel(
      { id: selectedTransferId, reason: notes.trim() || undefined },
      {
        onSuccess: () => {
          setDialogOpen(false)
          setNotes('')
        },
      }
    )
  }

  const handleComplete = (id: string) => {
    if (window.confirm('Are you sure you want to complete this transfer?')) {
      complete(id)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      approved: 'default',
      in_transit: 'outline',
      completed: 'outline',
      rejected: 'destructive',
      cancelled: 'destructive',
    }
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
  }

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    if (!data) return []
    const totalPages = Math.ceil((data?.total || 0) / pageSize)
    const current = page
    const delta = 2

    const pages: (number | string)[] = []

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= current - delta && i <= current + delta)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }

    return pages
  }

  const renderTransferRoute = (transfer: VaultTransferResponse) => {
    const fromLabel = (() => {
      if (transfer.transfer_type === 'branch_to_vault') {
        const branchId = (transfer as { branch_id?: string }).branch_id
        return resolveBranchLabel(branchId ?? transfer.to_branch_id, transfer.to_branch_code)
      }
      return resolveVaultLabel(transfer.from_vault_id, transfer.from_vault_code)
    })()

    const toLabel = (() => {
      if (transfer.transfer_type === 'vault_to_branch') {
        return resolveBranchLabel(transfer.to_branch_id, transfer.to_branch_code)
      }
      return resolveVaultLabel(transfer.to_vault_id, transfer.to_vault_code)
    })()

    return (
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium rounded-md bg-red-50 text-red-700 px-2 py-1">
            {fromLabel ?? 'Unknown'}
          </span>
          <ArrowRight className="w-3 h-3 text-muted-foreground" />
          <span className="font-medium rounded-md bg-emerald-50 text-emerald-700 px-2 py-1">
            {toLabel ?? 'Unknown'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Badge variant="outline" className="capitalize">
            {transfer.transfer_type.replaceAll('_', ' ')}
          </Badge>
          <Badge variant="secondary">{transfer.transfer_number}</Badge>
        </div>
      </div>
    )
  }

  const renderMeta = (transfer: VaultTransferResponse) => {
    const initiated = transfer.initiated_at
      ? format(new Date(transfer.initiated_at), 'MMM dd, yyyy')
      : '—'
    const completed = transfer.completed_at
      ? format(new Date(transfer.completed_at), 'MMM dd, yyyy')
      : transfer.approved_at
        ? format(new Date(transfer.approved_at), 'MMM dd, yyyy')
        : '—'

    return (
      <div className="flex flex-col text-xs text-muted-foreground gap-1">
        <div className="flex items-center gap-1">
          <span>Initiated:</span>
          <span className="font-medium text-foreground">{initiated}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Last Update:</span>
          <span className="font-medium text-foreground">{completed}</span>
        </div>
        {transfer.notes && (
          <div className="line-clamp-2">Notes: {transfer.notes}</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Pending transfers: {data.data?.length ?? 0}</span>
          <span>
            Showing {Math.min(pageSize, data.data?.length ?? 0)} of {data.total || data.data?.length || 0}
          </span>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8 text-muted-foreground">Loading pending transfers...</div>
      )}

      {isError && (
        <div className="text-center py-8 text-red-500">Error loading transfers. Please try again.</div>
      )}

      {data && (data.data?.length ?? 0) === 0 && (
        <div className="text-center py-8 text-muted-foreground">No pending transfers.</div>
      )}

      {data && (data.data?.length ?? 0) > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transfer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Meta</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data.data ?? []).map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">{transfer.transfer_number}</span>
                    </div>
                  </TableCell>
                  <TableCell>{renderTransferRoute(transfer)}</TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {resolveCurrencyLabel(transfer.currency_id, transfer.currency_code)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {Number(transfer.amount ?? 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>{getStatusBadge(transfer.status ?? 'pending')}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {transfer.initiated_by_name || transfer.initiated_by || '-'}
                  </TableCell>
                  <TableCell>{renderMeta(transfer)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {transfer.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(transfer.id)}
                            disabled={isApproving || isRejecting || isCancelling || isCompleting}
                          >
                            <Check className="w-4 h-4 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleReject(transfer.id)}
                            disabled={isApproving || isRejecting || isCancelling || isCompleting}
                          >
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancel(transfer.id)}
                            disabled={isApproving || isRejecting || isCancelling || isCompleting}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Cancel
                          </Button>
                        </>
                      )}
                      {(transfer.status === 'approved' || transfer.status === 'in_transit') && (
                        <Button
                          size="sm"
                          onClick={() => handleComplete(transfer.id)}
                          disabled={isApproving || isRejecting || isCancelling || isCompleting}
                          variant="outline"
                        >
                          Mark Received
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {(() => {
            const totalPages = Math.ceil((data?.total || 0) / pageSize)
            return totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>

                {getPageNumbers().map((pageNum, idx) =>
                  pageNum === '...'
                    ? (
                        <span key={`ellipsis-${idx}`} className="px-2">
                          ...
                        </span>
                      )
                    : (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(pageNum as number)}
                        >
                          {pageNum}
                        </Button>
                      )
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )
          })()}
        </>
      )}

      {/* Approve/Reject Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve'
                ? 'الموافقة على التحويل'
                : actionType === 'reject'
                  ? 'رفض التحويل'
                  : 'إلغاء التحويل'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'يمكنك إضافة ملاحظات للموافقة (اختياري).'
                : actionType === 'reject'
                  ? 'يمكنك إضافة سبب الرفض (اختياري).'
                  : 'يمكنك إضافة سبب الإلغاء (اختياري).'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">الملاحظات</Label>
              <Textarea
                id="notes"
                placeholder={
                  actionType === 'approve'
                    ? 'مثال: تمت الموافقة بعد التحقق من الأرصدة'
                    : actionType === 'reject'
                      ? 'مثال: رصيد غير كافي في الفرع'
                      : 'مثال: تم الإلغاء بناءً على طلب المسؤول'
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
                rows={4}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">{notes.length}/500 حرف</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isApproving || isRejecting || isCancelling}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={isApproving || isRejecting || isCancelling}
              variant={
                actionType === 'approve' ? 'default' : actionType === 'reject' ? 'destructive' : 'secondary'
              }
            >
              {isApproving || isRejecting || isCancelling ? (
                'جاري المعالجة...'
              ) : actionType === 'approve' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  تأكيد الموافقة
                </>
              ) : actionType === 'reject' ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  تأكيد الرفض
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  تأكيد الإلغاء
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
