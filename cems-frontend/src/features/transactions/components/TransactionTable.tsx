import { ArrowUpDown, Eye } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type {
  AnyTransactionResponse,
  IncomeTransactionResponse,
  ExpenseTransactionResponse,
  TransferTransactionResponse,
  ExchangeTransactionResponse,
  TransactionType,
} from '@/types/transaction.types'
import { cn } from '@/lib/utils'
import { ActionIconButton } from '@/components/action-icon-button'

interface TransactionTableProps {
  transactions: AnyTransactionResponse[]
  sortBy?: string
  onSort: (field: string) => void
  onViewDetails?: (transactionId: string, transactionType?: TransactionType) => void
  isLoading?: boolean
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getTypeBadgeClass = (type: string) => {
  switch (type) {
    case 'income':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'expense':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'exchange':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'transfer':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

// Helper to get amount display from transaction
const getTransactionAmount = (transaction: AnyTransactionResponse): string => {
  if (transaction.transaction_type === 'exchange') {
    return (transaction as ExchangeTransactionResponse).from_amount ?? '0'
  }
  return (transaction as IncomeTransactionResponse | ExpenseTransactionResponse | TransferTransactionResponse).amount ?? '0'
}

// Helper to get currency display
const getCurrencyDisplay = (transaction: AnyTransactionResponse): string => {
  const type = transaction.transaction_type
  if (type === 'exchange') {
    const ex = transaction as ExchangeTransactionResponse
    const fromCurrency = ex.from_currency_name || ex.from_currency_id || ''
    const toCurrency = ex.to_currency_name || ex.to_currency_id || ''
    return `${ex.from_amount ?? 'N/A'} ${fromCurrency} → ${ex.to_amount ?? 'N/A'} ${toCurrency}`.trim()
  }
  if (type === 'transfer') {
    const tr = transaction as TransferTransactionResponse
    return tr.currency_name || tr.currency_id || 'N/A'
  }
  if (type === 'expense') {
    const exp = transaction as ExpenseTransactionResponse
    return exp.currency_name || exp.currency_id || 'N/A'
  }
  if (type === 'income') {
    const inc = transaction as IncomeTransactionResponse
    return inc.currency_name || inc.currency_id || 'N/A'
  }
  return 'N/A'
}

// Helper to get customer/branch info
const getPartyInfo = (transaction: AnyTransactionResponse): string => {
  const type = transaction.transaction_type
  if (type === 'exchange') {
    return (transaction.branch_name || transaction.branch_id || 'Exchange').toString()
  }
  if (type === 'transfer') {
    const tr = transaction as TransferTransactionResponse
    const fromBranch = tr.from_branch_name || tr.from_branch_id || 'From'
    const toBranch = tr.to_branch_name || tr.to_branch_id || 'To'
    return `${fromBranch} → ${toBranch}`
  }
  if (type === 'expense') {
    const exp = transaction as ExpenseTransactionResponse
    return exp.expense_to ?? exp.branch_name ?? 'Expense'
  }
  if (type === 'income') {
    const inc = transaction as IncomeTransactionResponse
    return inc.income_source ?? inc.branch_name ?? 'Income'
  }
  return 'N/A'
}

export default function TransactionTable({
  transactions,
  sortBy,
  onSort,
  onViewDetails,
  isLoading,
}: TransactionTableProps) {
  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onSort(field)}
      className={cn('h-8 -ml-3 hover:bg-transparent', sortBy === field && 'text-primary')}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex items-center justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="ml-3 text-sm text-muted-foreground">Loading transactions...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No transactions found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton field="id">ID</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="type">Type</SortButton>
              </TableHead>
              <TableHead>Details</TableHead>
              <TableHead>
                <SortButton field="amount">Amount</SortButton>
              </TableHead>
              <TableHead>Info</TableHead>
              <TableHead>
                <SortButton field="status">Status</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="created_at">Date</SortButton>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              const amount = getTransactionAmount(transaction)
              const displayAmount = Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })
              const partyInfo = getPartyInfo(transaction)
              const currencyDisplay = getCurrencyDisplay(transaction)

              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">#{transaction.transaction_number ?? 'N/A'}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                        getTypeBadgeClass(transaction.transaction_type ?? 'unknown')
                      )}
                    >
                      {(transaction.transaction_type ?? 'unknown').toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{partyInfo}</TableCell>
                  <TableCell className="font-medium">
                    ${displayAmount}
                  </TableCell>
                  <TableCell className="text-sm">
                    {currencyDisplay}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                        getStatusBadgeClass(transaction.status ?? 'pending')
                      )}
                    >
                      {((transaction.status ?? 'pending').charAt(0).toUpperCase() + (transaction.status ?? 'pending').slice(1))}
                    </span>
                  </TableCell>
                  <TableCell>
                    {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionIconButton
                      variant="ghost"
                      size="sm"
                      label="View details"
                      onClick={() => onViewDetails?.(transaction.id, transaction.transaction_type)}
                      icon={<Eye className="w-4 h-4" />}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
