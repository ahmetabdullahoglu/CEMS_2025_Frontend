import { ArrowUpDown, Eye } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Transaction } from '@/types/transaction.types'
import { cn } from '@/lib/utils'

interface TransactionTableProps {
  transactions: Transaction[]
  sortBy?: string
  onSort: (field: string) => void
  onViewDetails?: (transactionId: number) => void
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
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getTypeBadgeClass = (type: string) => {
  return type === 'buy'
    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
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
              <TableHead>Customer</TableHead>
              <TableHead>
                <SortButton field="amount">Amount</SortButton>
              </TableHead>
              <TableHead>Currency</TableHead>
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
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">#{transaction.id}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                      getTypeBadgeClass(transaction.type)
                    )}
                  >
                    {transaction.type.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>{transaction.customer_name || 'N/A'}</TableCell>
                <TableCell className="font-medium">
                  ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>{transaction.currency_code}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                      getStatusBadgeClass(transaction.status)
                    )}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(transaction.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails?.(transaction.id)}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
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
