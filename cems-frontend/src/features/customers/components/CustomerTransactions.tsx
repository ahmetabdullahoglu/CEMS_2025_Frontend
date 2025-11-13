import { useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  AnyTransactionResponse,
  ExchangeTransactionResponse,
  IncomeTransactionResponse,
  ExpenseTransactionResponse,
  TransferTransactionResponse,
} from '@/types/transaction.types'

interface CustomerTransactionsProps {
  customerId: string
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

// Helper function to get amount from any transaction type with proper type safety
const getTransactionAmount = (transaction: AnyTransactionResponse): string | undefined => {
  switch (transaction.transaction_type) {
    case 'exchange':
      return (transaction as ExchangeTransactionResponse).from_amount
    case 'income':
      return (transaction as IncomeTransactionResponse).amount
    case 'expense':
      return (transaction as ExpenseTransactionResponse).amount
    case 'transfer':
      return (transaction as TransferTransactionResponse).amount
    default:
      return undefined
  }
}

export default function CustomerTransactions({ customerId }: CustomerTransactionsProps) {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  // Calculate skip from page (API uses skip/limit, not page/page_size)
  const skip = (page - 1) * pageSize


  // Fetch transactions filtered by customer ID
  const { data, isLoading, isError } = useTransactions({
    skip,
    limit: pageSize,
    customer_id: customerId,
  })

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

  if (isError || !data) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-sm text-destructive">Failed to load transactions</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No transactions found</p>
            <p className="text-xs text-muted-foreground mt-1">
              This customer hasn't made any transactions yet
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalPages = Math.ceil((data.total || 0) / pageSize)

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.transactions.map((transaction) => {
                // Get amount based on transaction type with proper type safety
                const amount = getTransactionAmount(transaction)

                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">#{transaction.transaction_number}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                          getTypeBadgeClass(transaction.transaction_type)
                        )}
                      >
                        {transaction.transaction_type.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${amount ? Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 }) : 'N/A'}
                    </TableCell>
                    <TableCell>N/A</TableCell>
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
                      })}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
