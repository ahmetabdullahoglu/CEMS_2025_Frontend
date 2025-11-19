import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Loader2, AlertCircle, ArrowRightLeft, ArrowDownLeft } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useTransactionDetails, useCancelTransaction, useApproveTransaction } from '@/hooks/useTransactions'
import { useBranches } from '@/hooks/useBranches'
import { BranchTooltip } from '@/components/BranchTooltip'
import type { Branch } from '@/types/branch.types'
import type { TransactionDetail, TransactionType } from '@/types/transaction.types'

interface TransactionDetailsDialogProps {
  transactionId: string | null
  transactionType?: TransactionType
  open: boolean
  onOpenChange: (open: boolean) => void
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    failed: 'bg-red-100 text-red-800',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const DetailRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => {
  if (!value) return null

  return (
    <div className="flex justify-between py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

const ExchangeTransactionDetails = ({ transaction }: { transaction: TransactionDetail }) => {
  if (transaction.transaction_type !== 'exchange') return null

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center justify-center gap-3 text-lg font-semibold">
          <span>
            {transaction.from_amount ? Number(transaction.from_amount).toFixed(2) : 'N/A'}{' '}
            {transaction.from_currency?.code || transaction.from_currency_name || 'N/A'}
          </span>
          <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
          <span>
            {transaction.to_amount ? Number(transaction.to_amount).toFixed(2) : 'N/A'}{' '}
            {transaction.to_currency?.code || transaction.to_currency_name || 'N/A'}
          </span>
        </div>
        <div className="text-center text-sm text-muted-foreground mt-2">
          Exchange Rate: 1 {transaction.from_currency?.code || transaction.from_currency_name || 'N/A'} ={' '}
          {transaction.exchange_rate_used ? Number(transaction.exchange_rate_used).toFixed(4) : 'N/A'}{' '}
          {transaction.to_currency?.code || transaction.to_currency_name || 'N/A'}
        </div>
      </div>

      <div className="space-y-1">
        <DetailRow label="Transaction Number" value={transaction.transaction_number} />
        <DetailRow label="Customer Name" value={transaction.customer?.name} />
        <DetailRow label="Branch" value={transaction.branch?.name || transaction.branch_name} />
        <DetailRow label="Created By" value={transaction.user?.full_name} />
        <DetailRow
          label="Created At"
          value={transaction.created_at ? format(new Date(transaction.created_at), 'PPpp') : 'N/A'}
        />
        <DetailRow
          label="Updated At"
          value={transaction.updated_at ? format(new Date(transaction.updated_at), 'PPpp') : 'N/A'}
        />
      </div>
    </div>
  )
}

const IncomeTransactionDetails = ({ transaction }: { transaction: TransactionDetail }) => {
  if (transaction.transaction_type !== 'income') return null

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-green-50 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">
              {transaction.amount ? Number(transaction.amount).toFixed(2) : 'N/A'}{' '}
              {transaction.currency?.code || transaction.currency_name || 'N/A'}
            </div>
            <div className="text-sm text-green-600 mt-1">Income</div>
          </div>
      </div>

      <div className="space-y-1">
        <DetailRow label="Transaction Number" value={transaction.transaction_number} />
        <DetailRow label="Category" value={transaction.income_category} />
        <DetailRow label="Source" value={transaction.income_source} />
        <DetailRow label="Notes" value={transaction.notes} />
        <DetailRow label="Branch" value={transaction.branch?.name || transaction.branch_name} />
        <DetailRow label="Created By" value={transaction.user?.full_name} />
        <DetailRow
          label="Created At"
          value={transaction.created_at ? format(new Date(transaction.created_at), 'PPpp') : 'N/A'}
        />
        <DetailRow
          label="Updated At"
          value={transaction.updated_at ? format(new Date(transaction.updated_at), 'PPpp') : 'N/A'}
        />
      </div>
    </div>
  )
}

const ExpenseTransactionDetails = ({ transaction }: { transaction: TransactionDetail }) => {
  if (transaction.transaction_type !== 'expense') return null

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-red-50 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-700">
              {transaction.amount ? Number(transaction.amount).toFixed(2) : 'N/A'}{' '}
              {transaction.currency?.code || transaction.currency_name || 'N/A'}
            </div>
            <div className="text-sm text-red-600 mt-1">Expense</div>
          </div>
      </div>

      <div className="space-y-1">
        <DetailRow label="Transaction Number" value={transaction.transaction_number} />
        <DetailRow label="Category" value={transaction.expense_category} />
        <DetailRow label="Payee" value={transaction.expense_to} />
        <DetailRow label="Notes" value={transaction.notes} />
        <DetailRow label="Branch" value={transaction.branch?.name || transaction.branch_name} />
        <DetailRow label="Created By" value={transaction.user?.full_name} />
        <DetailRow
          label="Created At"
          value={transaction.created_at ? format(new Date(transaction.created_at), 'PPpp') : 'N/A'}
        />
        <DetailRow
          label="Updated At"
          value={transaction.updated_at ? format(new Date(transaction.updated_at), 'PPpp') : 'N/A'}
        />
      </div>
    </div>
  )
}

const TransferTransactionDetails = ({ transaction, branches }: {
  transaction: TransactionDetail
  branches?: Branch[]
}) => {
  if (transaction.transaction_type !== 'transfer') return null

  const fromBranch = branches?.find(b => b.id === transaction.from_branch_id)
  const toBranch = branches?.find(b => b.id === transaction.to_branch_id)

  const fromBranchLabel =
    fromBranch?.name || transaction.from_branch_name || `Branch #${transaction.from_branch_id ?? 'Unknown'}`
  const toBranchLabel =
    toBranch?.name || transaction.to_branch_name || `Branch #${transaction.to_branch_id ?? 'Unknown'}`

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-blue-50 p-4">
        <div className="flex items-center justify-center gap-3">
          <div className="text-center">
            <div className="text-sm text-blue-600 font-medium">From</div>
            <div className="text-lg font-semibold text-blue-900">
              {fromBranch ? (
                <BranchTooltip branch={fromBranch} branchId={transaction.from_branch_id}>
                  {fromBranchLabel}
                </BranchTooltip>
              ) : (
                <span className="text-muted-foreground">{fromBranchLabel}</span>
              )}
            </div>
          </div>
          <ArrowDownLeft className="h-6 w-6 text-blue-500 rotate-90" />
          <div className="text-center">
            <div className="text-sm text-blue-600 font-medium">To</div>
            <div className="text-lg font-semibold text-blue-900">
              {toBranch ? (
                <BranchTooltip branch={toBranch} branchId={transaction.to_branch_id}>
                  {toBranchLabel}
                </BranchTooltip>
              ) : (
                <span className="text-muted-foreground">{toBranchLabel}</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-center text-xl font-bold text-blue-700 mt-3">
          {transaction.amount ? Number(transaction.amount).toFixed(2) : 'N/A'}{' '}
          {transaction.currency?.code || transaction.currency_name || 'N/A'}
        </div>
      </div>

      <div className="space-y-1">
        <DetailRow label="Transaction Number" value={transaction.transaction_number} />
        <DetailRow label="Notes" value={transaction.notes} />
        <DetailRow label="Created By" value={transaction.user?.full_name} />
        <DetailRow
          label="Created At"
          value={transaction.created_at ? format(new Date(transaction.created_at), 'PPpp') : 'N/A'}
        />
        <DetailRow
          label="Updated At"
          value={transaction.updated_at ? format(new Date(transaction.updated_at), 'PPpp') : 'N/A'}
        />
      </div>
    </div>
  )
}

export default function TransactionDetailsDialog({
  transactionId,
  transactionType,
  open,
  onOpenChange,
}: TransactionDetailsDialogProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showApproveConfirm, setShowApproveConfirm] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)

  const { data: transaction, isLoading, isError } = useTransactionDetails(
    transactionId || '',
    transactionType,
    !!transactionId && open
  )
  const { data: branchesData } = useBranches()

  const { mutate: cancelTransaction, isPending: isCancelling } = useCancelTransaction()
  const { mutate: approveTransaction, isPending: isApproving } = useApproveTransaction()

  useEffect(() => {
    if (!open) {
      setShowApproveConfirm(false)
      setShowCancelConfirm(false)
      setActionError(null)
    }
  }, [open])

  const handleCancel = () => {
    if (!transactionId) return

    cancelTransaction(
      { id: transactionId, reason: cancellationReason || undefined },
      {
        onSuccess: () => {
          setShowCancelConfirm(false)
          setCancellationReason('')
          onOpenChange(false)
        },
      }
    )
  }

  const handleApprove = () => {
    if (!transactionId) return

    setActionError(null)
    approveTransaction(transactionId, {
      onSuccess: () => {
        setShowApproveConfirm(false)
        setActionError(null)
        onOpenChange(false)
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'Failed to approve transaction'
        setActionError(message)
      },
    })
  }

  const renderTransactionContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )
    }

    if (isError || !transaction) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <p className="text-sm text-muted-foreground">Failed to load transaction details</p>
        </div>
      )
    }

    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold capitalize">{transaction.transaction_type ?? 'Unknown'} Transaction</h3>
          <StatusBadge status={transaction.status ?? 'pending'} />
        </div>

        {transaction.transaction_type === 'exchange' && <ExchangeTransactionDetails transaction={transaction} />}
        {transaction.transaction_type === 'income' && <IncomeTransactionDetails transaction={transaction} />}
        {transaction.transaction_type === 'expense' && <ExpenseTransactionDetails transaction={transaction} />}
        {transaction.transaction_type === 'transfer' && (
          <TransferTransactionDetails transaction={transaction} branches={branchesData?.data} />
        )}
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>View detailed information about this transaction</DialogDescription>
        </DialogHeader>

        <div className="py-4">{renderTransactionContent()}</div>

        {!isLoading && !isError && transaction && (
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {!showCancelConfirm && !showApproveConfirm ? (
              <>
                {transaction.status === 'pending' && transaction.transaction_type === 'expense' && (
                  <Button
                    onClick={() => {
                      setActionError(null)
                      setShowCancelConfirm(false)
                      setShowApproveConfirm(true)
                    }}
                    className="w-full sm:w-auto"
                    disabled={isApproving}
                  >
                    Approve Transaction
                  </Button>
                )}
                {transaction.status === 'pending' && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setActionError(null)
                      setShowApproveConfirm(false)
                      setShowCancelConfirm(true)
                    }}
                    className="w-full sm:w-auto"
                    disabled={isCancelling}
                  >
                    Cancel Transaction
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
              </>
            ) : showApproveConfirm ? (
              <>
                {actionError && (
                  <div className="flex items-center gap-2 text-sm text-destructive w-full">
                    <AlertCircle className="h-4 w-4" />
                    <span>{actionError}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-green-600 w-full sm:flex-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Are you sure you want to approve this transaction?</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActionError(null)
                    setShowApproveConfirm(false)
                  }}
                  disabled={isApproving}
                  className="w-full sm:w-auto"
                >
                  No, Go Back
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="w-full sm:w-auto"
                >
                  {isApproving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Yes, Approve
                </Button>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2 text-sm w-full sm:flex-1">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>Are you sure you want to cancel this transaction?</span>
                  </div>
                  <Textarea
                    placeholder="Optional reason"
                    value={cancellationReason}
                    onChange={(event) => setCancellationReason(event.target.value)}
                    rows={3}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActionError(null)
                    setShowCancelConfirm(false)
                  }}
                  disabled={isCancelling}
                  className="w-full sm:w-auto"
                >
                  No, Keep It
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="w-full sm:w-auto"
                >
                  {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Yes, Cancel
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
