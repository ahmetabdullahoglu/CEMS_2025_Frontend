import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, ChevronDown, ArrowLeftRight, TrendingUp, TrendingDown, Move } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useTransactions,
  useTransactionsByType,
  usePendingApprovalTransactions,
} from '@/hooks/useTransactions'
import TransactionFiltersComponent from '../components/TransactionFilters'
import TransactionTable from '../components/TransactionTable'
import ExchangeDialog from '../components/ExchangeDialog'
import IncomeDialog from '../components/IncomeDialog'
import ExpenseDialog from '../components/ExpenseDialog'
import TransferDialog from '../components/TransferDialog'
import TransactionDetailsDialog from '../components/TransactionDetailsDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ExpenseTransactionsList,
  ExchangeTransactionsList,
  IncomeTransactionsList,
  TransferTransactionsList,
} from '../components/TransactionTypeViews'
import type {
  TransactionFilters,
  TransactionQueryParams,
  ExchangeTransactionResponse,
  IncomeTransactionResponse,
  ExpenseTransactionResponse,
  TransferTransactionResponse,
  TransactionType,
} from '@/types/transaction.types'

type TransactionsTab = 'all' | 'exchange' | 'income' | 'expense' | 'transfer' | 'approvals'

const LoadingCard = ({ message }: { message: string }) => (
  <Card>
    <CardContent className="py-10 text-center text-sm text-muted-foreground">{message}</CardContent>
  </Card>
)

const ErrorCard = ({ title, description }: { title: string; description: string }) => (
  <Card>
    <CardContent className="py-10 text-center">
      <p className="text-destructive font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
)

export default function TransactionsPage() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState<TransactionFilters>({})
  const [activeTab, setActiveTab] = useState<TransactionsTab>('all')
  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false)
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false)
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<{
    id: string
    type?: TransactionType
  } | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const paginationParams = useMemo(
    () => ({
      skip: (page - 1) * pageSize,
      limit: pageSize,
      sort_by: sortBy,
      sort_order: sortOrder,
    }),
    [page, pageSize, sortBy, sortOrder]
  )

  const filtersWithoutType = useMemo(() => {
    const rest: TransactionFilters = { ...filters }
    delete rest.transaction_type
    return rest
  }, [filters])

  const allParams: TransactionQueryParams = {
    ...filters,
    ...paginationParams,
  }

  const typeSpecificParams: TransactionQueryParams = {
    ...filtersWithoutType,
    ...paginationParams,
  }

  const allQuery = useTransactions(allParams, { enabled: activeTab === 'all' })
  const exchangeQuery = useTransactionsByType('exchange', typeSpecificParams, activeTab === 'exchange')
  const incomeQuery = useTransactionsByType('income', typeSpecificParams, activeTab === 'income')
  const expenseQuery = useTransactionsByType('expense', typeSpecificParams, activeTab === 'expense')
  const transferQuery = useTransactionsByType('transfer', typeSpecificParams, activeTab === 'transfer')
  const approvalsQuery = usePendingApprovalTransactions(typeSpecificParams, activeTab === 'approvals')

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
    setPage(1)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as TransactionsTab)
    setPage(1)
  }

  const handleViewDetails = (transactionId: string, transactionType?: TransactionType) => {
    setSelectedTransaction({ id: transactionId, type: transactionType })
    setIsDetailsDialogOpen(true)
  }

  const handleDetailsDialogChange = (open: boolean) => {
    setIsDetailsDialogOpen(open)
    if (!open) {
      setSelectedTransaction(null)
    }
  }
  const totalPages = Math.ceil((allQuery.data?.total || 0) / pageSize)

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

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="exchange">Exchange</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {allQuery.isError ? (
            <ErrorCard
              title="Error Loading Transactions"
              description={
                allQuery.error instanceof Error
                  ? allQuery.error.message
                  : 'Failed to load transactions'
              }
            />
          ) : (
            <>
              {allQuery.data && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    Showing {allQuery.data.transactions.length > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
                    {Math.min(page * pageSize, allQuery.data.total)} of {allQuery.data.total} transactions
                  </div>
                </div>
              )}
              <TransactionTable
                transactions={allQuery.data?.transactions || []}
                sortBy={sortBy}
                onSort={handleSort}
                onViewDetails={handleViewDetails}
                isLoading={allQuery.isLoading}
              />
              {allQuery.data && totalPages > 1 && (
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
            </>
          )}
        </TabsContent>

        <TabsContent value="exchange" className="space-y-4">
          {exchangeQuery.isLoading ? (
            <LoadingCard message="Loading exchange transactions..." />
          ) : exchangeQuery.isError ? (
            <ErrorCard
              title="Failed to load exchange transactions"
              description={
                exchangeQuery.error instanceof Error
                  ? exchangeQuery.error.message
                  : 'Please try again later'
              }
            />
          ) : (
            <ExchangeTransactionsList
              transactions={(exchangeQuery.data?.transactions || []) as ExchangeTransactionResponse[]}
              onViewDetails={handleViewDetails}
            />
          )}
        </TabsContent>

        <TabsContent value="income" className="space-y-4">
          {incomeQuery.isLoading ? (
            <LoadingCard message="Loading income transactions..." />
          ) : incomeQuery.isError ? (
            <ErrorCard
              title="Failed to load income transactions"
              description={
                incomeQuery.error instanceof Error
                  ? incomeQuery.error.message
                  : 'Please try again later'
              }
            />
          ) : (
            <IncomeTransactionsList
              transactions={(incomeQuery.data?.transactions || []) as IncomeTransactionResponse[]}
              onViewDetails={handleViewDetails}
            />
          )}
        </TabsContent>

        <TabsContent value="expense" className="space-y-4">
          {expenseQuery.isLoading ? (
            <LoadingCard message="Loading expense transactions..." />
          ) : expenseQuery.isError ? (
            <ErrorCard
              title="Failed to load expense transactions"
              description={
                expenseQuery.error instanceof Error
                  ? expenseQuery.error.message
                  : 'Please try again later'
              }
            />
          ) : (
            <ExpenseTransactionsList
              transactions={(expenseQuery.data?.transactions || []) as ExpenseTransactionResponse[]}
              onViewDetails={handleViewDetails}
            />
          )}
        </TabsContent>

        <TabsContent value="transfer" className="space-y-4">
          {transferQuery.isLoading ? (
            <LoadingCard message="Loading transfer transactions..." />
          ) : transferQuery.isError ? (
            <ErrorCard
              title="Failed to load transfer transactions"
              description={
                transferQuery.error instanceof Error
                  ? transferQuery.error.message
                  : 'Please try again later'
              }
            />
          ) : (
            <TransferTransactionsList
              transactions={(transferQuery.data?.transactions || []) as TransferTransactionResponse[]}
              onViewDetails={handleViewDetails}
            />
          )}
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          {approvalsQuery.isLoading ? (
            <LoadingCard message="Loading pending approvals..." />
          ) : approvalsQuery.isError ? (
            <ErrorCard
              title="Failed to load pending approvals"
              description={
                approvalsQuery.error instanceof Error
                  ? approvalsQuery.error.message
                  : 'Please try again later'
              }
            />
          ) : (
            <ExpenseTransactionsList
              transactions={(approvalsQuery.data?.transactions || []) as ExpenseTransactionResponse[]}
              onViewDetails={handleViewDetails}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Transaction Dialogs */}
      <ExchangeDialog open={isExchangeDialogOpen} onOpenChange={setIsExchangeDialogOpen} />
      <IncomeDialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen} />
      <ExpenseDialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen} />
      <TransferDialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen} />
      <TransactionDetailsDialog
        transactionId={selectedTransaction?.id ?? null}
        transactionType={selectedTransaction?.type}
        open={isDetailsDialogOpen}
        onOpenChange={handleDetailsDialogChange}
      />
    </div>
  )
}
