import { useMemo } from 'react'
import { format } from 'date-fns'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePendingApprovalTransactions, useReceiveTransfer, useCancelTransaction } from '@/hooks/useTransactions'
import type { TransactionQueryParams, TransferTransactionResponse } from '@/types/transaction.types'
import { formatBranchLabel } from '@/utils/branch'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PendingTransferApprovalsProps {
  branchId?: string
}

export default function PendingTransferApprovals({ branchId }: PendingTransferApprovalsProps) {
  const [cancelReasons, setCancelReasons] = useState<Record<string, string>>({})
  const params: TransactionQueryParams = useMemo(
    () => ({ status_filter: 'pending', ...(branchId ? { branch_id: branchId } : {}) }),
    [branchId]
  )
  const { data, isLoading, isError } = usePendingApprovalTransactions(params)
  const { mutate: receive, isPending: isReceiving } = useReceiveTransfer()
  const { mutate: cancel, isPending: isCancelling } = useCancelTransaction()

  const pendingTransfers = (data?.transactions || []) as TransferTransactionResponse[]
  const loading = isLoading || isReceiving || isCancelling

  const handleCancel = (id: string) => {
    const reason = cancelReasons[id]?.trim()
    if (!reason) {
      setCancelReasons((prev) => ({ ...prev, [id]: '' }))
      return
    }

    cancel(
      { id, reason },
      {
        onSuccess: () => {
          setCancelReasons((prev) => {
            const next = { ...prev }
            delete next[id]
            return next
          })
        },
      }
    )
  }

  const handleReceive = (id: string) => {
    receive({ id, payload: {} })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-6 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading pending transfers...
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-6 text-red-500">Unable to load pending transfers.</CardContent>
      </Card>
    )
  }

  if (!pendingTransfers.length) {
    return (
      <Card>
        <CardContent className="py-6 text-muted-foreground">No pending transfer approvals.</CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {pendingTransfers.map((transfer) => (
        <Card key={transfer.id} className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Transfer #{transfer.transaction_number}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {transfer.transaction_date
                  ? format(new Date(transfer.transaction_date), 'PPpp')
                  : 'Awaiting scheduling'}
              </p>
            </div>
            <Badge variant="secondary" className="capitalize">
              {transfer.transfer_type.replace(/_/g, ' ')}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-md border p-3 text-foreground">
              <div className="flex items-center justify-between">
                <span>From</span>
                <span>{formatBranchLabel({
                  id: transfer.from_branch_id || transfer.from_branch_name || '',
                  code: transfer.from_branch_id || '',
                  name: transfer.from_branch_name || transfer.from_branch_id || '—',
                })}</span>
              </div>
              <div className="flex items-center justify-center py-2 text-muted-foreground">
                <ArrowRight className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <span>To</span>
                <span>{formatBranchLabel({
                  id: transfer.to_branch_id || transfer.to_branch_name || '',
                  code: transfer.to_branch_id || '',
                  name: transfer.to_branch_name || transfer.to_branch_id || '—',
                })}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Currency: {transfer.currency_name || transfer.currency_id}</Badge>
              <Badge variant="outline">Amount: {transfer.amount}</Badge>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs">Cancel Reason</Label>
              <Input
                value={cancelReasons[transfer.id] ?? ''}
                onChange={(e) => setCancelReasons((prev) => ({ ...prev, [transfer.id]: e.target.value }))}
                placeholder="Provide a reason to cancel"
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleCancel(transfer.id)}
              disabled={loading || !cancelReasons[transfer.id]?.trim()}
            >
              Cancel
            </Button>
            <Button onClick={() => handleReceive(transfer.id)} disabled={loading}>
              {isReceiving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Approve Receipt
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
