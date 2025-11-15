import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Edit, History, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCurrencies } from '@/hooks/useCurrencies'
import UpdateRateDialog from '../components/UpdateRateDialog'
import RateHistoryDialog from '../components/RateHistoryDialog'
import type { Currency } from '@/types/currency.types'

export default function CurrenciesPage() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const skip = (page - 1) * pageSize
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [historyCurrency, setHistoryCurrency] = useState<Currency | null>(null)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)

  const { data, isLoading, isError } = useCurrencies({
    skip,
    limit: pageSize,
    search,
  })

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleUpdateRate = (currency: Currency) => {
    setSelectedCurrency(currency)
    setShowUpdateDialog(true)
  }

  const handleCloseDialog = () => {
    setShowUpdateDialog(false)
    setSelectedCurrency(null)
  }

  const handleViewHistory = (currency: Currency) => {
    setHistoryCurrency(currency)
    setShowHistoryDialog(true)
  }

  const handleCloseHistory = () => {
    setShowHistoryDialog(false)
    setHistoryCurrency(null)
  }

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    if (!data) return []
    const totalPages = Math.ceil((data?.total || 0) / pageSize)
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Currency Management</h1>
        <p className="text-muted-foreground">Manage currency exchange rates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Currencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by code or name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Currencies</CardTitle>
            {data && (
              <span className="text-sm text-muted-foreground">
                Showing {data.data?.length ?? 0} of {data.total ?? 0} currencies
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Loading currencies...
            </div>
          )}

          {isError && (
            <div className="text-center py-8 text-red-500">
              Error loading currencies. Please try again.
            </div>
          )}

          {data && (data.data?.length ?? 0) === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No currencies found.
            </div>
          )}

          {data && (data.data?.length ?? 0) > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-center">Base Currency</TableHead>
                    <TableHead className="text-center">Active</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data.data ?? []).map((currency) => (
                    <TableRow key={currency.id}>
                      <TableCell className="font-medium">{currency.code ?? 'N/A'}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{currency.name_en ?? 'N/A'}</div>
                          {currency.name_ar && (
                            <div className="text-sm text-muted-foreground">{currency.name_ar}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xl">{currency.symbol ?? '-'}</TableCell>
                      <TableCell className="text-center">
                        {currency.is_base_currency ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            Base
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {currency.is_active ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {currency.updated_at ? formatDistanceToNow(new Date(currency.updated_at), {
                          addSuffix: true,
                        }) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewHistory(currency)}
                          >
                            <History className="w-4 h-4 mr-2" />
                            History
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUpdateRate(currency)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {(() => {
                const totalPages = data?.total_pages || Math.ceil((data?.total || 0) / pageSize)
                return totalPages > 1 && (
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
                      disabled={page === totalPages}
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

      <UpdateRateDialog
        currency={selectedCurrency}
        open={showUpdateDialog}
        onClose={handleCloseDialog}
        onViewHistory={(currency) => handleViewHistory(currency)}
      />

      <RateHistoryDialog
        currency={historyCurrency}
        open={showHistoryDialog}
        onClose={handleCloseHistory}
      />
    </div>
  )
}
