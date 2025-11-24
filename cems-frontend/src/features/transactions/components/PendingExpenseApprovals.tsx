import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { handleApiError } from '@/lib/api/client'
import { useApproveTransaction, useCancelTransaction, useTransactions } from '@/hooks/useTransactions'
import type {
  ExpenseTransactionResponse,
  TransactionQueryParams,
} from '@/types/transaction.types'

interface PendingExpenseApprovalsProps {
  branchId?: string
}

export default function PendingExpenseApprovals({ branchId }: PendingExpenseApprovalsProps) {
  const [approvalNotes, setApprovalNotes] = useState<Record<string, string>>({})
  const [cancelReasons, setCancelReasons] = useState<Record<string, string>>({})
  const [actionError, setActionError] = useState<string | null>(null)

  const params: TransactionQueryParams = useMemo(
    () => ({
      transaction_type: 'expense',
      status_filter: 'pending',
      limit: 50,
      ...(branchId ? { branch_id: branchId } : {}),
    }),
    [branchId]
  )

  const { data, isLoading, isError } = useTransactions(params)
  const { mutate: approve, isPending: isApproving } = useApproveTransaction()
  const { mutate: cancel, isPending: isCancelling } = useCancelTransaction()

  const expenses = (data?.transactions || []) as ExpenseTransactionResponse[]
  const loading = isLoading || isApproving || isCancelling

  const handleApprove = (id: string) => {
    setActionError(null)
    approve(
      { id, approval_notes: approvalNotes[id]?.trim() || undefined },
      { onError: (err) => setActionError(handleApiError(err)) }
    )
  }

  const handleCancel = (id: string) => {
    setActionError(null)
    cancel(
      { id, reason: cancelReasons[id]?.trim() || undefined },
      { onError: (err) => setActionError(handleApiError(err)) }
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-6 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading pending expenses...
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-6 text-red-500">Unable to load pending expenses.</CardContent>
      </Card>
    )
  }

  if (!expenses.length) {
    return (
      <Card>
        <CardContent className="py-6 text-muted-foreground">No pending expense approvals.</CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {actionError && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {actionError}
        </div>
      )}
      {expenses.map((expense) => (
        <Card key={expense.id} className="border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Expense #{expense.transaction_number}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {expense.transaction_date ? format(new Date(expense.transaction_date), 'PPpp') : '—'}
              </p>
            </div>
            <Badge variant="outline" className="capitalize">
              {expense.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Currency: {expense.currency_id}</Badge>
              <Badge variant="outline">Amount: {expense.amount}</Badge>
              {expense.branch_id ? <Badge variant="outline">Branch: {expense.branch_id}</Badge> : null}
            </div>
            <div className="grid gap-2">
              <Label className="text-xs" htmlFor={`approve-${expense.id}`}>
                Approval Notes
              </Label>
              <Textarea
                id={`approve-${expense.id}`}
                value={approvalNotes[expense.id] ?? ''}
                onChange={(e) =>
                  setApprovalNotes((prev) => ({ ...prev, [expense.id]: e.target.value }))
                }
                placeholder="Add approval explanation (optional)"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs" htmlFor={`cancel-${expense.id}`}>
                Cancel Reason
              </Label>
              <Input
                id={`cancel-${expense.id}`}
                value={cancelReasons[expense.id] ?? ''}
                onChange={(e) =>
                  setCancelReasons((prev) => ({ ...prev, [expense.id]: e.target.value }))
                }
                placeholder="Provide a reason to cancel (optional)"
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleCancel(expense.id)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={() => handleApprove(expense.id)} disabled={loading}>
              {isApproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Approve
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
