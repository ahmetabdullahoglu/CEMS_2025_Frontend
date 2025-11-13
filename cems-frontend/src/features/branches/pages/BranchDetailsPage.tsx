import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone, Mail, Building2, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBranch, useBranchBalances } from '@/hooks/useBranches'
import { useTransactions } from '@/hooks/useTransactions'
import BranchBalances from '../components/BranchBalances'
import type {
  AnyTransactionResponse,
  ExchangeTransactionResponse,
  IncomeTransactionResponse,
  ExpenseTransactionResponse,
  TransferTransactionResponse,
} from '@/types/transaction.types'

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

export default function BranchDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const branchId = id || ''

  const [transactionsPage, setTransactionsPage] = useState(1)
  const [transactionsPageSize] = useState(10)
  const transactionsSkip = (transactionsPage - 1) * transactionsPageSize

  const { data: branch, isLoading: branchLoading, isError: branchError } = useBranch(branchId, !!branchId)
  const { data: balancesData, isLoading: balancesLoading } = useBranchBalances(branchId, !!branchId)

  // Fetch transactions filtered by branch ID
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({
    skip: transactionsSkip,
    limit: transactionsPageSize,
    branch_id: branchId,
  })

  if (branchLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-muted-foreground">
          Loading branch details...
        </div>
      </div>
    )
  }

  if (branchError || !branch) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-red-500">
          Error loading branch details. Please try again.
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      pending: 'secondary',
      cancelled: 'destructive',
    }
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
  }

  const getTypeBadge = (type: string) => {
    return <Badge variant="outline">{type}</Badge>
  }

  // Calculate which page numbers to show for transactions
  const getPageNumbers = () => {
    if (!transactionsData) return []
    const totalPages = Math.ceil((transactionsData?.total || 0) / transactionsPageSize)
    const current = transactionsPage
    const delta = 2

    const pages: (number | string)[] = []

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= current - delta && i <= current + delta)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }

    return pages
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/branches')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{branch.name}</h1>
          <p className="text-muted-foreground">Branch Details</p>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Branch Information</CardTitle>
                <Badge variant={branch.is_active ? 'default' : 'secondary'}>
                  {branch.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Building2 className="w-4 h-4" />
                      Branch Code
                    </div>
                    <div className="font-medium font-mono">{branch.code}</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Building2 className="w-4 h-4" />
                      Branch Name
                    </div>
                    <div className="font-medium">{branch.name}</div>
                  </div>

                  {branch.address && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <MapPin className="w-4 h-4" />
                        Address
                      </div>
                      <div className="font-medium">{branch.address}</div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {branch.phone && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Phone className="w-4 h-4" />
                        Phone
                      </div>
                      <div className="font-medium">{branch.phone}</div>
                    </div>
                  )}

                  {branch.email && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Mail className="w-4 h-4" />
                        Email
                      </div>
                      <div className="font-medium">{branch.email}</div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      Created
                    </div>
                    <div className="font-medium">
                      {format(new Date(branch.created_at), 'PPP')}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      Last Updated
                    </div>
                    <div className="font-medium">
                      {format(new Date(branch.updated_at), 'PPP')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balances">
          {balancesData ? (
            <BranchBalances data={balancesData} isLoading={balancesLoading} />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  {balancesLoading ? 'Loading balances...' : 'No balance data available'}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Branch Transactions</CardTitle>
              <p className="text-sm text-muted-foreground">
                All transactions for this branch
              </p>
            </CardHeader>
            <CardContent>
              {transactionsLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  Loading transactions...
                </div>
              )}

              {transactionsData && transactionsData.transactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions found for this branch.
                </div>
              )}

              {transactionsData && transactionsData.transactions.length > 0 && (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Customer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionsData.transactions.map((transaction) => {
                        // Get amount based on transaction type with proper type safety
                        const amount = getTransactionAmount(transaction)

                        return (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {format(new Date(transaction.created_at), 'PPP')}
                            </TableCell>
                            <TableCell>{getTypeBadge(transaction.transaction_type)}</TableCell>
                            <TableCell className="font-medium">
                              {amount ? Number(amount).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) : 'N/A'}
                            </TableCell>
                            <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              -
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {(() => {
                    const totalPages = Math.ceil((transactionsData?.total || 0) / transactionsPageSize)
                    return totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTransactionsPage(transactionsPage - 1)}
                          disabled={transactionsPage === 1}
                        >
                          Previous
                        </Button>

                        {getPageNumbers().map((pageNum, idx) =>
                          pageNum === '...' ? (
                            <span key={`ellipsis-${idx}`} className="px-2">
                              ...
                            </span>
                          ) : (
                            <Button
                              key={pageNum}
                              variant={transactionsPage === pageNum ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setTransactionsPage(pageNum as number)}
                            >
                              {pageNum}
                            </Button>
                          )
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTransactionsPage(transactionsPage + 1)}
                          disabled={transactionsPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    )
                  })()}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
