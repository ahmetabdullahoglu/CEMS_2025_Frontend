import { Fragment, useMemo, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Edit, History, Plus, Search, Trash2 } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  useActivateCurrency,
  useCurrencies,
  useCurrencyWithRates,
  useDeactivateCurrency,
  useDeleteCurrency,
} from '@/hooks/useCurrencies'
import UpdateRateDialog from '../components/UpdateRateDialog'
import RateHistoryDialog from '../components/RateHistoryDialog'
import type { Currency } from '@/types/currency.types'
import { CurrencyDialog } from '../components/CurrencyDialog'

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
  const [expandedCurrencyId, setExpandedCurrencyId] = useState<string | null>(null)
  const [showCurrencyDialog, setShowCurrencyDialog] = useState(false)
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null)
  const [includeInactive, setIncludeInactive] = useState(false)
  const [region, setRegion] = useState('')

  const { mutate: activateCurrency } = useActivateCurrency()
  const { mutate: deactivateCurrency } = useDeactivateCurrency()
  const { mutate: deleteCurrency } = useDeleteCurrency()

  const { data, isLoading, isError } = useCurrencies({
    skip,
    limit: pageSize,
    search,
    include_inactive: includeInactive,
    region: region || null,
  })

  const { data: expandedCurrencyRates, isLoading: expandedRatesLoading } = useCurrencyWithRates(
    expandedCurrencyId ?? undefined,
    { includeHistorical: true, enabled: !!expandedCurrencyId }
  )

  const rateEntries = useMemo(() => expandedCurrencyRates?.rates ?? [], [expandedCurrencyRates])

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

  const handleToggleHistory = (currency: Currency) => {
    setExpandedCurrencyId((prev) => (prev === currency.id ? null : currency.id))
  }

  const handleViewPairHistory = (currency: Currency) => {
    setHistoryCurrency(currency)
    setShowHistoryDialog(true)
  }

  const handleOpenCurrencyDialog = (currency?: Currency) => {
    setEditingCurrency(currency ?? null)
    setShowCurrencyDialog(true)
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Currency Management</h1>
            <p className="text-muted-foreground">Manage currencies and exchange rates</p>
          </div>
          <Button onClick={() => handleOpenCurrencyDialog()}>
            <Plus className="w-4 h-4 mr-2" /> Add Currency
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Currencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <Input
                  placeholder="Search by code or name..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Input
                placeholder="Region"
                className="w-40"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox checked={includeInactive} onCheckedChange={(val) => setIncludeInactive(!!val)} />
              Include inactive currencies
            </label>
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
                    <TableHead className="text-center">Decimals</TableHead>
                    <TableHead className="text-center">Active</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data.data ?? []).map((currency) => (
                    <Fragment key={currency.id}>
                      <TableRow
                        onClick={() => handleToggleHistory(currency)}
                        className="cursor-pointer"
                      >
                        <TableCell className="font-medium">{currency.code ?? 'N/A'}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{currency.name ?? currency.name_en ?? 'N/A'}</div>
                            {currency.name_ar && <div className="text-sm text-muted-foreground">{currency.name_ar}</div>}
                          </div>
                        </TableCell>
                        <TableCell className="text-xl">{currency.symbol ?? '-'}</TableCell>
                        <TableCell className="text-center">{currency.decimal_places}</TableCell>
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
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleHistory(currency)
                              }}
                            >
                              <History className="w-4 h-4 mr-2" />
                              History
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewPairHistory(currency)
                              }}
                            >
                              <History className="w-4 h-4 mr-2" />
                              Pair History
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUpdateRate(currency)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Add Rate
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpenCurrencyDialog(currency)
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Currency
                            </Button>
                            {currency.is_active ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deactivateCurrency(currency.id)
                                }}
                              >
                                Deactivate
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  activateCurrency(currency.id)
                                }}
                              >
                                Activate
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteCurrency(currency.id)
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {expandedCurrencyId === currency.id && (
                        <TableRow>
                          <TableCell colSpan={7} className="bg-muted/50">
                            <div className="py-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold">
                                    Rate history for {currency.code} ({currency.name || currency.name_en})
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Showing all recorded rates for this currency against other listed currencies.
                                  </p>
                                </div>
                                {expandedRatesLoading && <div className="text-sm text-muted-foreground">Loading...</div>}
                              </div>

                              {!expandedRatesLoading && rateEntries.length === 0 && (
                                <div className="text-sm text-muted-foreground">
                                  No exchange rates recorded for this currency.
                                </div>
                              )}

                              {!expandedRatesLoading && rateEntries.length > 0 && (
                                <div className="rounded-md border bg-background">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Pair</TableHead>
                                        <TableHead className="text-right">Mid Rate</TableHead>
                                        <TableHead className="text-right">Buy Rate</TableHead>
                                        <TableHead className="text-right">Sell Rate</TableHead>
                                        <TableHead>Effective From</TableHead>
                                        <TableHead>Effective To</TableHead>
                                        <TableHead>Status</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {rateEntries.map((rate) => (
                                        <TableRow key={rate.id}>
                                          <TableCell className="font-medium">
                                            {(rate.from_currency?.code ?? currency.code) || '—'} →{' '}
                                            {rate.to_currency?.code ?? '—'}
                                          </TableCell>
                                          <TableCell className="text-right">{rate.rate}</TableCell>
                                          <TableCell className="text-right">{rate.buy_rate ?? '—'}</TableCell>
                                          <TableCell className="text-right">{rate.sell_rate ?? '—'}</TableCell>
                                          <TableCell className="text-sm text-muted-foreground">
                                            {rate.effective_from
                                              ? new Date(rate.effective_from).toLocaleString()
                                              : rate.created_at
                                              ? new Date(rate.created_at).toLocaleString()
                                              : '—'}
                                          </TableCell>
                                          <TableCell className="text-sm text-muted-foreground">
                                            {rate.effective_to ? new Date(rate.effective_to).toLocaleString() : '—'}
                                          </TableCell>
                                          <TableCell>
                                            {rate.is_current ? (
                                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                                                Current
                                              </span>
                                            ) : (
                                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                                                Historical
                                              </span>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
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
        onViewHistory={(currency) => handleViewPairHistory(currency)}
      />

      <RateHistoryDialog
        currency={historyCurrency}
        open={showHistoryDialog}
        onClose={handleCloseHistory}
      />

      <CurrencyDialog
        open={showCurrencyDialog}
        onClose={() => setShowCurrencyDialog(false)}
        currency={editingCurrency}
      />

    </div>
  )
}
