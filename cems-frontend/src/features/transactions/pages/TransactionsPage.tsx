import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, ChevronDown, ArrowLeftRight, TrendingUp, TrendingDown, Move } from 'lucide-react'
import { useTransactionsByType } from '@/hooks/useTransactions'
import TransactionFiltersComponent from '../components/TransactionFilters'
import TransactionTable from '../components/TransactionTable'
import ExchangeDialog from '../components/ExchangeDialog'
import IncomeDialog from '../components/IncomeDialog'
import ExpenseDialog from '../components/ExpenseDialog'
import TransferDialog from '../components/TransferDialog'
import TransactionDetailsDialog from '../components/TransactionDetailsDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  type TransactionFilters,
  type TransactionQueryParams,
  type TransactionType,
  type ExchangeTransactionResponse,
  type IncomeTransactionResponse,
  type ExpenseTransactionResponse,
  type TransferTransactionResponse,
} from '@/types/transaction.types'
import {
  ExchangeTransactionsView,
  IncomeTransactionsView,
  ExpenseTransactionsView,
  TransferTransactionsView,
} from '../components/TransactionTypeViews'

export default function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState<TransactionFilters>({})
  const [activeTab, setActiveTab] = useState<'all' | TransactionType>('all')
  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false)
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false)
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const queryParams: TransactionQueryParams = {
    ...filters,
    skip: (page - 1) * pageSize,
    limit: pageSize,
    sort_by: sortBy,
    sort_order: sortOrder,
  }

  const { data, isLoading, isError, error } = useTransactionsByType(activeTab, queryParams)

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
    setActiveTab((newFilters.transaction_type as TransactionType) || 'all')
    setPage(1) // Reset to first page when filters change
  }

  const handleResetFilters = () => {
    setFilters({})
    setActiveTab('all')
    setPage(1)
  }

  const handleTabChange = (value: string) => {
    const nextTab = value as 'all' | TransactionType
    setActiveTab(nextTab)
    setFilters((prev) => ({
      ...prev,
      transaction_type: nextTab === 'all' ? undefined : (nextTab as TransactionType),
    }))
    setPage(1)
  }

  const handleViewDetails = (transactionId: string) => {
    setSelectedTransactionId(transactionId)
    setIsDetailsDialogOpen(true)
  }

  const renderTransactionView = () => {
    if (!data && isLoading) {
      return (
        <TransactionTable
          transactions={[]}
          sortBy={sortBy}
          onSort={handleSort}
          onViewDetails={handleViewDetails}
          isLoading
        />
      )
    }

    switch (activeTab) {
      case 'exchange':
        return (
          <ExchangeTransactionsView
            transactions={(data?.transactions as ExchangeTransactionResponse[]) || []}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
          />
        )
      case 'income':
        return (
          <IncomeTransactionsView
            transactions={(data?.transactions as IncomeTransactionResponse[]) || []}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
          />
        )
      case 'expense':
        return (
          <ExpenseTransactionsView
            transactions={(data?.transactions as ExpenseTransactionResponse[]) || []}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
          />
        )
      case 'transfer':
        return (
          <TransferTransactionsView
            transactions={(data?.transactions as TransferTransactionResponse[]) || []}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
          />
        )
      default:
        return (
          <TransactionTable
            transactions={data?.transactions || []}
            sortBy={sortBy}
            onSort={handleSort}
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
          />
        )
    }
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

  const totalPages = Math.ceil((data?.total || 0) / pageSize)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Manage and view all currency exchange transactions</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Transaction
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Transaction Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsExchangeDialogOpen(true)}>
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Currency Exchange
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsIncomeDialogOpen(true)}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Income
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsExpenseDialogOpen(true)}>
              <TrendingDown className="w-4 h-4 mr-2" />
              Expense
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsTransferDialogOpen(true)}>
              <Move className="w-4 h-4 mr-2" />
              Branch Transfer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters */}
      <TransactionFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {/* Type Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="exchange">Exchange</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Results Summary */}
      {data && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {data.transactions.length > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(page * pageSize, data.total)} of {data.total} transactions
          </div>
        </div>
      )}

      {/* Table / Type Views */}
      {renderTransactionView()}

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

      {/* Transaction Dialogs */}
      <ExchangeDialog open={isExchangeDialogOpen} onOpenChange={setIsExchangeDialogOpen} />
      <IncomeDialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen} />
      <ExpenseDialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen} />
      <TransferDialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen} />
      <TransactionDetailsDialog
        transactionId={selectedTransactionId}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
    </div>
  )
}
