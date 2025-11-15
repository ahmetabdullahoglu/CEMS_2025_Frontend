import { Eye } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type {
  ExchangeTransactionResponse,
  IncomeTransactionResponse,
  ExpenseTransactionResponse,
  TransferTransactionResponse,
} from '@/types/transaction.types'

interface BaseViewProps<T> {
  transactions: T[]
  isLoading?: boolean
  onViewDetails?: (id: string) => void
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: Record<string, string> = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  return (
    <Badge variant="secondary" className={statusStyles[status] || 'bg-gray-100 text-gray-800'}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
    </Badge>
  )
}

const renderState = ({
  isLoading,
  hasData,
  emptyLabel,
}: {
  isLoading?: boolean
  hasData: boolean
  emptyLabel: string
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Loading transactions...
        </CardContent>
      </Card>
    )
  }

  if (!hasData) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          {emptyLabel}
        </CardContent>
      </Card>
    )
  }

  return null
}

export const ExchangeTransactionsView = ({
  transactions,
  isLoading,
  onViewDetails,
}: BaseViewProps<ExchangeTransactionResponse>) => {
  const state = renderState({
    isLoading,
    hasData: transactions.length > 0,
    emptyLabel: 'No exchange transactions found',
  })

  if (state) {
    return state
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>From → To</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">#{transaction.transaction_number}</TableCell>
                <TableCell>{transaction.customer_id || 'Walk-in'}</TableCell>
                <TableCell className="text-sm">
                  {Number(transaction.from_amount || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{' '}
                  {transaction.from_currency_id}
                  <span className="px-2 text-muted-foreground">→</span>
                  {Number(transaction.to_amount || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{' '}
                  {transaction.to_currency_id}
                </TableCell>
                <TableCell>
                  {transaction.exchange_rate_used
                    ? Number(transaction.exchange_rate_used).toFixed(4)
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={transaction.status ?? 'pending'} />
                </TableCell>
                <TableCell>
                  {transaction.created_at ? format(new Date(transaction.created_at), 'PP') : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onViewDetails?.(transaction.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export const IncomeTransactionsView = ({
  transactions,
  isLoading,
  onViewDetails,
}: BaseViewProps<IncomeTransactionResponse>) => {
  const state = renderState({
    isLoading,
    hasData: transactions.length > 0,
    emptyLabel: 'No income transactions found',
  })

  if (state) {
    return state
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">#{transaction.transaction_number}</TableCell>
                <TableCell className="capitalize">{transaction.income_category}</TableCell>
                <TableCell>{transaction.income_source || 'General'}</TableCell>
                <TableCell className="font-semibold">
                  {Number(transaction.amount || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{' '}
                  {transaction.currency_id}
                </TableCell>
                <TableCell>
                  <StatusBadge status={transaction.status ?? 'pending'} />
                </TableCell>
                <TableCell>
                  {transaction.created_at ? format(new Date(transaction.created_at), 'PP') : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onViewDetails?.(transaction.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export const ExpenseTransactionsView = ({
  transactions,
  isLoading,
  onViewDetails,
}: BaseViewProps<ExpenseTransactionResponse>) => {
  const state = renderState({
    isLoading,
    hasData: transactions.length > 0,
    emptyLabel: 'No expense transactions found',
  })

  if (state) {
    return state
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Payee</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">#{transaction.transaction_number}</TableCell>
                <TableCell className="capitalize">{transaction.expense_category}</TableCell>
                <TableCell>{transaction.expense_to}</TableCell>
                <TableCell className="font-semibold">
                  {Number(transaction.amount || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{' '}
                  {transaction.currency_id}
                </TableCell>
                <TableCell>
                  {transaction.approval_required ? (
                    <Badge variant={transaction.is_approved ? 'default' : 'outline'}>
                      {transaction.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Not Required</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={transaction.status ?? 'pending'} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onViewDetails?.(transaction.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export const TransferTransactionsView = ({
  transactions,
  isLoading,
  onViewDetails,
}: BaseViewProps<TransferTransactionResponse>) => {
  const state = renderState({
    isLoading,
    hasData: transactions.length > 0,
    emptyLabel: 'No transfer transactions found',
  })

  if (state) {
    return state
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>From Branch</TableHead>
              <TableHead>To Branch</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">#{transaction.transaction_number}</TableCell>
                <TableCell className="text-xs">{transaction.from_branch_id}</TableCell>
                <TableCell className="text-xs">{transaction.to_branch_id}</TableCell>
                <TableCell className="font-semibold">
                  {Number(transaction.amount || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{' '}
                  {transaction.currency_id}
                </TableCell>
                <TableCell>
                  {transaction.is_received ? (
                    <Badge variant="default">Received</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={transaction.status ?? 'pending'} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onViewDetails?.(transaction.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
