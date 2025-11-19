import { format } from 'date-fns'
import { ArrowRightLeft, MoveRight, TrendingDown, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type {
  ExchangeTransactionResponse,
  IncomeTransactionResponse,
  ExpenseTransactionResponse,
  TransferTransactionResponse,
  TransactionType,
} from '@/types/transaction.types'
import { cn } from '@/lib/utils'

interface BaseTypeListProps<T> {
  transactions: T[]
  onViewDetails?: (id: string, transactionType?: TransactionType) => void
}

const EmptyState = ({ message }: { message: string }) => (
  <Card>
    <CardContent className="py-10 text-center text-sm text-muted-foreground">{message}</CardContent>
  </Card>
)

const StatusBadge = ({ status }: { status?: string | null }) => {
  if (!status) return null

  const styles: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    failed: 'bg-red-100 text-red-800',
  }

  return (
    <Badge variant="secondary" className={cn('capitalize', styles[status] ?? '')}>
      {status}
    </Badge>
  )
}

const formatAmount = (amount?: string, currency?: string) => {
  if (!amount) return 'N/A'
  const value = Number(amount)
  if (Number.isNaN(value)) return amount
  return `${value.toLocaleString(undefined, { minimumFractionDigits: 2 })} ${currency ?? ''}`.trim()
}

export const ExchangeTransactionsList = ({
  transactions,
  onViewDetails,
}: BaseTypeListProps<ExchangeTransactionResponse>) => {
  if (!transactions.length) {
    return <EmptyState message="No exchange transactions found" />
  }

  return (
    <div className="grid gap-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-semibold">Exchange #{transaction.transaction_number}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {transaction.transaction_date
                  ? format(new Date(transaction.transaction_date), 'PPpp')
                  : '—'}
              </p>
            </div>
            <StatusBadge status={transaction.status} />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2 rounded-md border p-3 text-sm">
              <div className="flex items-center justify-between font-medium">
                <span>From</span>
                <span>
                  {formatAmount(transaction.from_amount, transaction.from_currency_name || transaction.from_currency_id)}
                </span>
              </div>
              <div className="flex items-center justify-center text-muted-foreground">
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Rate {transaction.exchange_rate_used ?? '—'}
              </div>
              <div className="flex items-center justify-between font-medium">
                <span>To</span>
                <span>{formatAmount(transaction.to_amount, transaction.to_currency_name || transaction.to_currency_id)}</span>
              </div>
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <div>Commission: {transaction.commission_amount ?? '—'}</div>
              <div>Effective Rate: {transaction.effective_rate ?? '—'}</div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(transaction.id, transaction.transaction_type)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export const IncomeTransactionsList = ({
  transactions,
  onViewDetails,
}: BaseTypeListProps<IncomeTransactionResponse>) => {
  if (!transactions.length) {
    return <EmptyState message="No income transactions found" />
  }

  return (
    <div className="grid gap-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardHeader className="flex items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" /> Income #{transaction.transaction_number}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {transaction.transaction_date
                  ? format(new Date(transaction.transaction_date), 'PPpp')
                  : '—'}
              </p>
            </div>
            <StatusBadge status={transaction.status} />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold text-green-700">
              {formatAmount(transaction.amount, transaction.currency_name || transaction.currency_id)}
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <div>Category: {transaction.income_category}</div>
              <div>Source: {transaction.income_source ?? '—'}</div>
              <div>Branch: {transaction.branch_name || transaction.branch_id}</div>
              <div>Reference: {transaction.reference_number ?? '—'}</div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(transaction.id, transaction.transaction_type)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export const ExpenseTransactionsList = ({
  transactions,
  onViewDetails,
}: BaseTypeListProps<ExpenseTransactionResponse>) => {
  if (!transactions.length) {
    return <EmptyState message="No expense transactions found" />
  }

  return (
    <div className="grid gap-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardHeader className="flex items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" /> Expense #{transaction.transaction_number}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {transaction.transaction_date
                  ? format(new Date(transaction.transaction_date), 'PPpp')
                  : '—'}
              </p>
            </div>
            <StatusBadge status={transaction.status} />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-bold text-red-700">
              {formatAmount(transaction.amount, transaction.currency_name || transaction.currency_id)}
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <div>Category: {transaction.expense_category}</div>
              <div>Payee: {transaction.expense_to}</div>
              <div>Approval Required: {transaction.approval_required ? 'Yes' : 'No'}</div>
              <div>Approved At: {transaction.approved_at ? format(new Date(transaction.approved_at), 'PPpp') : '—'}</div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails?.(transaction.id, transaction.transaction_type)}
            >
              Review Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export const TransferTransactionsList = ({
  transactions,
  onViewDetails,
}: BaseTypeListProps<TransferTransactionResponse>) => {
  if (!transactions.length) {
    return <EmptyState message="No transfer transactions found" />
  }

  return (
    <div className="grid gap-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardHeader className="flex items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MoveRight className="h-4 w-4 text-blue-600" /> Transfer #{transaction.transaction_number}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {transaction.transaction_date
                  ? format(new Date(transaction.transaction_date), 'PPpp')
                  : '—'}
              </p>
            </div>
            <StatusBadge status={transaction.status} />
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-md border p-3 text-sm text-foreground">
              <div className="flex items-center justify-between">
                <span>From Branch</span>
                <span>{transaction.from_branch_name || transaction.from_branch_id}</span>
              </div>
              <div className="flex items-center justify-center py-2 text-muted-foreground">
                <MoveRight className="h-4 w-4" />
              </div>
              <div className="flex items-center justify-between">
                <span>To Branch</span>
                <span>{transaction.to_branch_name || transaction.to_branch_id}</span>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>Transfer Type: {transaction.transfer_type}</div>
              <div>Amount: {formatAmount(transaction.amount, transaction.currency_name || transaction.currency_id)}</div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails?.(transaction.id, transaction.transaction_type)}
            >
              Inspect Transfer
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
