import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { handleApiError } from '@/lib/api/client'
import { useApproveTransaction, useCancelTransaction, useTransactions } from '@/hooks/useTransactions'
import type {
  ExpenseTransactionResponse,
  TransactionQueryParams,
} from '@/types/transaction.types'
import { ActionIconButton } from '@/components/action-icon-button'

interface PendingExpenseApprovalsProps {
  branchId?: string
}

type ActionType = 'approve' | 'cancel'

export default function PendingExpenseApprovals({ branchId }: PendingExpenseApprovalsProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<ActionType>('approve')
  const [selectedId, setSelectedId] = useState<string>('')
  const [notes, setNotes] = useState('')
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

  const openDialog = (type: ActionType, id: string) => {
    setActionType(type)
    setSelectedId(id)
    setNotes('')
    setDialogOpen(true)
    setActionError(null)
  }

  const handleConfirm = () => {
    if (!selectedId) return
    if (actionType === 'approve') {
      approve(
        { id: selectedId, approval_notes: notes.trim() || undefined },
        { onError: (err) => setActionError(handleApiError(err)), onSuccess: () => setDialogOpen(false) }
      )
      return
    }

    cancel(
      { id: selectedId, reason: notes.trim() || undefined },
      { onError: (err) => setActionError(handleApiError(err)), onSuccess: () => setDialogOpen(false) }
    )
  }

  if (isLoading) {
    return <div className="py-6 text-center text-muted-foreground">Loading pending expenses...</div>
  }

  if (isError) {
    return <div className="py-6 text-center text-red-500">Unable to load pending expenses.</div>
  }

  if (!expenses.length) {
    return <div className="py-6 text-center text-muted-foreground">No pending expense approvals.</div>
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
            <TableHead>Expense</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-semibold">{expense.transaction_number}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{expense.branch_name || expense.branch_id}</TableCell>
              <TableCell className="text-sm">
                <div className="flex flex-col">
                  <span className="font-medium">{expense.currency_name || expense.currency_id}</span>
                  <Badge variant="outline" className="capitalize w-fit mt-1">
                    {expense.expense_category}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">{expense.amount}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {expense.transaction_date ? format(new Date(expense.transaction_date), 'PPpp') : '—'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <ActionIconButton
                    size="sm"
                    variant="ghost"
                    label="Approve expense"
                    onClick={() => openDialog('approve', expense.id)}
                    disabled={loading}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                  />
                  <ActionIconButton
                    size="sm"
                    variant="ghost"
                    label="Cancel expense"
                    onClick={() => openDialog('cancel', expense.id)}
                    disabled={loading}
                    icon={<XCircle className="w-4 h-4" />}
                  />
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
              {actionType === 'approve' ? 'الموافقة على الصرف' : 'إلغاء عملية الصرف'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'يرجى توضيح سبب الموافقة (اختياري)'
                : 'يرجى توضيح سبب الإلغاء (اختياري)'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <Label htmlFor="notes">الملاحظات</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={actionType === 'approve' ? 'سبب الموافقة' : 'سبب الإلغاء'}
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
              إغلاق
            </Button>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {actionType === 'approve' ? 'تأكيد الموافقة' : 'تأكيد الإلغاء'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
