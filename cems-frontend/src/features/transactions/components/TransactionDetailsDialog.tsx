import { useState } from 'react'
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
import { useTransactionDetails, useCancelTransaction } from '@/hooks/useTransactions'
import type { TransactionDetail } from '@/types/transaction.types'

interface TransactionDetailsDialogProps {
  transactionId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
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

const DetailRow = ({ label, value }: { label: string; value: string | number | undefined }) => {
  if (!value) return null

  return (
    <div className="flex justify-between py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

const ExchangeTransactionDetails = ({ transaction }: { transaction: TransactionDetail }) => {
  if (transaction.type !== 'exchange') return null

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/50 p-4">
        <div className="flex items-center justify-center gap-3 text-lg font-semibold">
          <span>
            {transaction.from_amount.toFixed(2)} {transaction.from_currency_code}
          </span>
          <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
          <span>
            {transaction.to_amount.toFixed(2)} {transaction.to_currency_code}
          </span>
        </div>
        <div className="text-center text-sm text-muted-foreground mt-2">
          Exchange Rate: 1 {transaction.from_currency_code} = {transaction.exchange_rate.toFixed(4)}{' '}
          {transaction.to_currency_code}
        </div>
      </div>

      <div className="space-y-1">
        <DetailRow label="Transaction ID" value={`#${transaction.id}`} />
        <DetailRow label="Customer Name" value={transaction.customer_name} />
        <DetailRow label="Branch" value={transaction.branch_name} />
        <DetailRow label="Created By" value={transaction.created_by} />
        <DetailRow
          label="Created At"
          value={format(new Date(transaction.created_at), 'PPpp')}
        />
        <DetailRow
          label="Updated At"
          value={format(new Date(transaction.updated_at), 'PPpp')}
        />
      </div>
    </div>
  )
}

const IncomeTransactionDetails = ({ transaction }: { transaction: TransactionDetail }) => {
  if (transaction.type !== 'income') return null

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-green-50 p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700">
            {transaction.amount.toFixed(2)} {transaction.currency_code}
          </div>
          <div className="text-sm text-green-600 mt-1">Income</div>
        </div>
      </div>

      <div className="space-y-1">
        <DetailRow label="Transaction ID" value={`#${transaction.id}`} />
        <DetailRow label="Description" value={transaction.description} />
        <DetailRow label="Branch" value={transaction.branch_name} />
        <DetailRow label="Created By" value={transaction.created_by} />
        <DetailRow
          label="Created At"
          value={format(new Date(transaction.created_at), 'PPpp')}
        />
        <DetailRow
          label="Updated At"
          value={format(new Date(transaction.updated_at), 'PPpp')}
        />
      </div>
    </div>
  )
}

const ExpenseTransactionDetails = ({ transaction }: { transaction: TransactionDetail }) => {
  if (transaction.type !== 'expense') return null

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-red-50 p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-700">
            {transaction.amount.toFixed(2)} {transaction.currency_code}
          </div>
          <div className="text-sm text-red-600 mt-1">Expense</div>
        </div>
      </div>

      <div className="space-y-1">
        <DetailRow label="Transaction ID" value={`#${transaction.id}`} />
        <DetailRow label="Category" value={transaction.category} />
        <DetailRow label="Description" value={transaction.description} />
        <DetailRow label="Branch" value={transaction.branch_name} />
        <DetailRow label="Created By" value={transaction.created_by} />
        <DetailRow
          label="Created At"
          value={format(new Date(transaction.created_at), 'PPpp')}
        />
        <DetailRow
          label="Updated At"
          value={format(new Date(transaction.updated_at), 'PPpp')}
        />
      </div>
    </div>
  )
}

const TransferTransactionDetails = ({ transaction }: { transaction: TransactionDetail }) => {
  if (transaction.type !== 'transfer') return null

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-blue-50 p-4">
        <div className="flex items-center justify-center gap-3">
          <div className="text-center">
            <div className="text-sm text-blue-600 font-medium">From</div>
            <div className="text-lg font-semibold text-blue-900">
              {transaction.from_branch_name || `Branch #${transaction.from_branch_id}`}
            </div>
          </div>
          <ArrowDownLeft className="h-6 w-6 text-blue-500 rotate-90" />
          <div className="text-center">
            <div className="text-sm text-blue-600 font-medium">To</div>
            <div className="text-lg font-semibold text-blue-900">
              {transaction.to_branch_name || `Branch #${transaction.to_branch_id}`}
            </div>
          </div>
        </div>
        <div className="text-center text-xl font-bold text-blue-700 mt-3">
          {transaction.amount.toFixed(2)} {transaction.currency_code}
        </div>
      </div>

      <div className="space-y-1">
        <DetailRow label="Transaction ID" value={`#${transaction.id}`} />
        <DetailRow label="Description" value={transaction.description} />
        <DetailRow label="Created By" value={transaction.created_by} />
        <DetailRow
          label="Created At"
          value={format(new Date(transaction.created_at), 'PPpp')}
        />
        <DetailRow
          label="Updated At"
          value={format(new Date(transaction.updated_at), 'PPpp')}
        />
      </div>
    </div>
  )
}

export default function TransactionDetailsDialog({
  transactionId,
  open,
  onOpenChange,
}: TransactionDetailsDialogProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const { data: transaction, isLoading, isError } = useTransactionDetails(
    transactionId || 0,
    !!transactionId && open
  )

  const { mutate: cancelTransaction, isPending: isCancelling } = useCancelTransaction()

  const handleCancel = () => {
    if (!transactionId) return

    cancelTransaction(transactionId, {
      onSuccess: () => {
        setShowCancelConfirm(false)
        onOpenChange(false)
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
          <h3 className="text-lg font-semibold capitalize">{transaction.type} Transaction</h3>
          <StatusBadge status={transaction.status} />
        </div>

        {transaction.type === 'exchange' && <ExchangeTransactionDetails transaction={transaction} />}
        {transaction.type === 'income' && <IncomeTransactionDetails transaction={transaction} />}
        {transaction.type === 'expense' && <ExpenseTransactionDetails transaction={transaction} />}
        {transaction.type === 'transfer' && <TransferTransactionDetails transaction={transaction} />}
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
            {!showCancelConfirm ? (
              <>
                {transaction.status === 'pending' && (
                  <Button
                    variant="destructive"
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full sm:w-auto"
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
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-destructive w-full sm:flex-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Are you sure you want to cancel this transaction?</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(false)}
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
