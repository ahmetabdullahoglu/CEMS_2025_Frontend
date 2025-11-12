import { useState } from 'react'
import { format } from 'date-fns'
import { Check, X, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  useVaultTransfers,
  useApproveVaultTransfer,
  useCompleteVaultTransfer,
  useRejectVaultTransfer,
} from '@/hooks/useVault'

export default function PendingTransfers() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)

  const { data, isLoading, isError } = useVaultTransfers({
    page,
    page_size: pageSize,
    status: 'pending',
  })

  const { mutate: approve, isPending: isApproving } = useApproveVaultTransfer()
  const { mutate: complete, isPending: isCompleting } = useCompleteVaultTransfer()
  const { mutate: reject, isPending: isRejecting } = useRejectVaultTransfer()

  const handleApprove = (id: number) => {
    if (window.confirm('Are you sure you want to approve this transfer?')) {
      approve(id)
    }
  }

  const handleComplete = (id: number) => {
    if (window.confirm('Are you sure you want to complete this transfer?')) {
      complete(id)
    }
  }

  const handleReject = (id: number) => {
    if (window.confirm('Are you sure you want to reject this transfer?')) {
      reject(id)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      approved: 'default',
      completed: 'outline',
      rejected: 'destructive',
    }
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>
  }

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    if (!data) return []
    const totalPages = data.total_pages
    const current = page
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pending Transfers</CardTitle>
          {data && (
            <span className="text-sm text-muted-foreground">
              {data.transfers.length} pending transfer(s)
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            Loading pending transfers...
          </div>
        )}

        {isError && (
          <div className="text-center py-8 text-red-500">
            Error loading transfers. Please try again.
          </div>
        )}

        {data && data.transfers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No pending transfers.
          </div>
        )}

        {data && data.transfers.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transfer</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>
                      {format(new Date(transfer.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {transfer.from_branch_name || 'Vault'}
                        </span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">
                          {transfer.to_branch_name || 'Vault'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{transfer.currency_code}</TableCell>
                    <TableCell className="text-right font-medium">
                      {transfer.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {transfer.requested_by || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {transfer.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(transfer.id)}
                              disabled={isApproving || isCompleting || isRejecting}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(transfer.id)}
                              disabled={isApproving || isCompleting || isRejecting}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {transfer.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleComplete(transfer.id)}
                            disabled={isApproving || isCompleting || isRejecting}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {data.total_pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
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
                      variant={page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pageNum as number)}
                    >
                      {pageNum}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.total_pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
