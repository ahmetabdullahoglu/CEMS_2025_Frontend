import { useState } from 'react'
import { format } from 'date-fns'
import { Check, X, ArrowRight, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pending Transfers</CardTitle>
          {data && (
            <span className="text-sm text-muted-foreground">
              {data.data?.length ?? 0} pending transfer(s)
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            Loading pending transfers...
          </div>
        )}

        {isError && (
          <div className="text-center py-8 text-red-500">
            Error loading transfers. Please try again.
          </div>
        )}

        {data && (data.data?.length ?? 0) === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No pending transfers.
          </div>
        )}

        {data && (data.data?.length ?? 0) > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transfer</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data.data ?? []).map((transfer) => {
                  const source =
                    transfer.transfer_type === 'branch_to_vault'
                      ? transfer.to_branch_code ?? 'Branch'
                      : transfer.from_vault_code ?? 'Vault'
                  const destination =
                    transfer.transfer_type === 'vault_to_branch'
                      ? transfer.to_branch_code ?? 'Branch'
                      : transfer.to_vault_code ?? 'Vault'

                  return (
                    <TableRow key={transfer.id}>
                    <TableCell>
                      {transfer.created_at ? format(new Date(transfer.created_at), 'MMM dd, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{source}</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{destination}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{transfer.currency_code ?? 'N/A'}</div>
                      </div>
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
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {transfer.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(transfer.id)}
                              disabled={isApproving || isCompleting || isRejecting || isCancelling}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(transfer.id)}
                              disabled={isApproving || isCompleting || isRejecting || isCancelling}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {transfer.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleComplete(transfer.id)}
                            disabled={isApproving || isCompleting || isRejecting || isCancelling}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        )}
                        {['pending', 'approved'].includes(transfer.status ?? '') && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleCancel(transfer.id)}
                            disabled={isApproving || isCompleting || isRejecting || isCancelling}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
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
                    pageNum === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2">
                        ...
                      </span>
                    ) : (
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
      </CardContent>

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
              <p className="text-sm text-muted-foreground">
                {notes.length}/500 حرف
              </p>
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
              variant={actionType === 'approve' ? 'default' : actionType === 'reject' ? 'destructive' : 'secondary'}
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
    </Card>
  )
}
