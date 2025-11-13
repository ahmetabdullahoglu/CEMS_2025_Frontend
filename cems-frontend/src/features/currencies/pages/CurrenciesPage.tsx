import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Edit, Search } from 'lucide-react'
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
import type { Currency } from '@/types/currency.types'

export default function CurrenciesPage() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const skip = (page - 1) * pageSize
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)

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
                Showing {data.currencies?.length ?? 0} of {data.total ?? 0} currencies
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

          {data && (data.currencies?.length ?? 0) === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No currencies found.
            </div>
          )}

          {data && (data.currencies?.length ?? 0) > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Buy Rate</TableHead>
                    <TableHead className="text-right">Sell Rate</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data.currencies ?? []).map((currency) => (
                    <TableRow key={currency.id}>
                      <TableCell className="font-medium">{currency.code ?? 'N/A'}</TableCell>
                      <TableCell>{currency.name ?? 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        {Number(currency.buy_rate ?? 0).toFixed(4)}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(currency.sell_rate ?? 0).toFixed(4)}
                      </TableCell>
                      <TableCell>
                        {currency.updated_at ? formatDistanceToNow(new Date(currency.updated_at), {
                          addSuffix: true,
                        }) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateRate(currency)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Update Rates
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {(() => {
                const totalPages = Math.ceil((data?.total || 0) / pageSize)
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
      />
    </div>
  )
}
