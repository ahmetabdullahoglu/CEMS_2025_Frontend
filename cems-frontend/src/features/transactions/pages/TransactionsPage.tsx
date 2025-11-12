import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useTransactions } from '@/hooks/useTransactions'
import TransactionFiltersComponent from '../components/TransactionFilters'
import TransactionTable from '../components/TransactionTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { TransactionFilters, TransactionQueryParams } from '@/types/transaction.types'

export default function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState<TransactionFilters>({})

  const queryParams: TransactionQueryParams = {
    ...filters,
    page,
    page_size: pageSize,
    sort_by: sortBy,
    sort_order: sortOrder,
  }

  const { data, isLoading, isError, error } = useTransactions(queryParams)

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const handleFiltersChange = (newFilters: TransactionFilters) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }

  const handleResetFilters = () => {
    setFilters({})
    setPage(1)
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Manage and view all currency exchange transactions</p>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-destructive font-semibold">Error Loading Transactions</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error instanceof Error ? error.message : 'Failed to load transactions'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalPages = data?.total_pages || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Manage and view all currency exchange transactions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Transaction
        </Button>
      </div>

      {/* Filters */}
      <TransactionFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {/* Results Summary */}
      {data && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {data.transactions.length > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(page * pageSize, data.total)} of {data.total} transactions
          </div>
        </div>
      )}

      {/* Table */}
      <TransactionTable
        transactions={data?.transactions || []}
        sortBy={sortBy}
        onSort={handleSort}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {data && totalPages > 1 && (
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

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (page <= 3) {
                      pageNum = i + 1
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = page - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className="w-8"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

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
