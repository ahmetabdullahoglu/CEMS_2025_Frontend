import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { usePendingApprovalTransactions, useReceiveTransfer, useCancelTransaction } from '@/hooks/useTransactions'
import type { TransactionQueryParams, TransferTransactionResponse } from '@/types/transaction.types'
import { formatBranchLabel } from '@/utils/branch'
import { handleApiError } from '@/lib/api/client'

interface PendingTransferApprovalsProps {
  branchId?: string
}

type ActionType = 'receive' | 'cancel'

export default function PendingTransferApprovals({ branchId }: PendingTransferApprovalsProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<ActionType>('receive')
  const [selectedId, setSelectedId] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)

  const params: TransactionQueryParams = useMemo(
    () => ({
      status_filter: 'pending',
      transaction_type: 'transfer',
      limit: 50,
      ...(branchId ? { branch_id: branchId } : {}),
    }),
    [branchId]
  )
  const { data, isLoading, isError } = usePendingApprovalTransactions(params)
  const { mutate: receive, isPending: isReceiving } = useReceiveTransfer()
  const { mutate: cancel, isPending: isCancelling } = useCancelTransaction()

  const pendingTransfers = (data?.transactions || []) as TransferTransactionResponse[]
  const loading = isLoading || isReceiving || isCancelling

  const openDialog = (type: ActionType, id: string) => {
    setActionType(type)
    setSelectedId(id)
    setNotes('')
    setDialogOpen(true)
    setActionError(null)
  }

  const handleConfirm = () => {
    if (!selectedId) return
    if (actionType === 'cancel') {
      cancel(
        { id: selectedId, reason: notes.trim() || undefined },
        { onError: (err) => setActionError(handleApiError(err)), onSuccess: () => setDialogOpen(false) }
      )
      return
    }

    receive(
      { id: selectedId, payload: {} },
      { onError: (err) => setActionError(handleApiError(err)), onSuccess: () => setDialogOpen(false) }
    )
  }

  const renderRoute = (transfer: TransferTransactionResponse) => (
    <div className="flex flex-col gap-1 text-sm">
      <div className="flex items-center gap-2">
        <span className="font-medium">
          {formatBranchLabel({
            id: transfer.from_branch_id || '',
            code: transfer.from_branch_id || '',
            name: transfer.from_branch_name || transfer.from_branch_id || '—',
          })}
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">
          {formatBranchLabel({
            id: transfer.to_branch_id || '',
            code: transfer.to_branch_id || '',
            name: transfer.to_branch_name || transfer.to_branch_id || '—',
          })}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 text-muted-foreground text-xs">
        <Badge variant="outline" className="capitalize">
          {transfer.transfer_type.replace(/_/g, ' ')}
        </Badge>
        <Badge variant="secondary">{transfer.transaction_number}</Badge>
      </div>
    </div>
  )

  if (isLoading) {
    return <div className="py-6 text-center text-muted-foreground">Loading pending transfers...</div>
  }

  if (isError) {
    return <div className="py-6 text-center text-red-500">Unable to load pending transfers.</div>
  }

  if (!pendingTransfers.length) {
    return <div className="py-6 text-center text-muted-foreground">No pending transfer approvals.</div>
  }

  return (
    <div className="space-y-4">
      {actionError && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {actionError}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transfer</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingTransfers.map((transfer) => (
            <TableRow key={transfer.id}>
              <TableCell className="font-semibold">{transfer.transaction_number}</TableCell>
              <TableCell>{renderRoute(transfer)}</TableCell>
              <TableCell className="text-sm">
                <div className="flex flex-col">
                  <span className="font-medium">{transfer.currency_name || transfer.currency_id}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {transfer.status}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">{transfer.amount}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {transfer.transaction_date ? format(new Date(transfer.transaction_date), 'PPpp') : '—'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDialog('receive', transfer.id)}
                    disabled={loading}
                  >
                    Approve Receipt
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openDialog('cancel', transfer.id)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'cancel' ? 'إلغاء عملية التحويل' : 'تأكيد استلام التحويل'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'cancel'
                ? 'يرجى إدخال سبب الإلغاء (اختياري)'
                : 'يمكنك إضافة ملاحظات على الاستلام (اختياري)'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <Label htmlFor="notes">الملاحظات</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={actionType === 'cancel' ? 'سبب الإلغاء' : 'ملاحظات الاستلام'}
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
              إغلاق
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {actionType === 'cancel' ? 'تأكيد الإلغاء' : 'تأكيد الاستلام'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
