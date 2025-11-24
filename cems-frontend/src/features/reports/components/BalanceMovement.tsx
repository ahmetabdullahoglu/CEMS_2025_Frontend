import { useMemo, useState } from 'react'
import { format, subDays } from 'date-fns'
import { Activity, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useBalanceMovement } from '@/hooks/useReports'
import { useBranches } from '@/hooks/useBranches'
import { useActiveCurrencies } from '@/hooks/useCurrencies'
import type { Branch } from '@/types/branch.types'
import type { CurrencyResponse } from '@/types/currency.types'
import type { BalanceMovementItem } from '@/types/report.types'
import { formatBranchLabel } from '@/utils/branch'
import { formatAmount } from '@/utils/number'

const ALL_BRANCHES = 'all'
const ALL_CURRENCIES = 'all'

export default function BalanceMovement() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd')

  const [startDate, setStartDate] = useState(weekAgo)
  const [endDate, setEndDate] = useState(today)
  const [branchFilter, setBranchFilter] = useState<string>(ALL_BRANCHES)
  const [currencyFilter, setCurrencyFilter] = useState<string>(ALL_CURRENCIES)

  const { data: branchesResponse, isFetching: loadingBranches } = useBranches({ limit: 100 })
  const { data: currenciesResponse } = useActiveCurrencies()

  const branches: Branch[] = useMemo(() => {
    const payload = (branchesResponse as { data?: Branch[] })?.data ?? branchesResponse
    return Array.isArray(payload) ? payload : []
  }, [branchesResponse])

  const currencies: CurrencyResponse[] = useMemo(() => {
    const payload = (currenciesResponse as { data?: CurrencyResponse[] })?.data ?? currenciesResponse
    return Array.isArray(payload) ? payload : []
  }, [currenciesResponse])

  const selectedBranchId = branchFilter === ALL_BRANCHES ? undefined : branchFilter
  const selectedCurrency = currencyFilter === ALL_CURRENCIES ? undefined : currencyFilter

  const { data, isLoading, isError, refetch, isFetching } = useBalanceMovement({
    branchId: selectedBranchId,
    currencyCode: selectedCurrency,
    startDate,
    endDate,
  })

  const payload = (data as { data?: unknown })?.data ?? data
  const movements = (payload?.movements ?? []) as BalanceMovementItem[]

  const branchLabel = selectedBranchId
    ? formatBranchLabel(branches.find((branch) => branch.id === selectedBranchId))
    : 'All branches'

  const currencyLabel = selectedCurrency ?? 'All currencies'
  const movementCount = payload?.movement_count ?? movements.length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Balance Movement Filters</CardTitle>
            <p className="text-sm text-muted-foreground">Review debits, credits, and running balances within a date range.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching || isLoading}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="movement-branch">Branch</Label>
              <Select value={branchFilter} onValueChange={setBranchFilter} disabled={loadingBranches}>
                <SelectTrigger id="movement-branch">
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_BRANCHES}>All branches</SelectItem>
                  {branches
                    .filter((branch) => branch.id)
                    .map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {formatBranchLabel(branch)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="movement-currency">Currency</Label>
              <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                <SelectTrigger id="movement-currency">
                  <SelectValue placeholder="All currencies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CURRENCIES}>All currencies</SelectItem>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.id ?? currency.code} value={currency.code}>
                      {currency.code} — {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="movement-start">Start Date</Label>
              <Input
                id="movement-start"
                type="date"
                value={startDate}
                max={endDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="movement-end">End Date</Label>
              <Input
                id="movement-end"
                type="date"
                value={endDate}
                min={startDate}
                max={today}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="py-10 text-center text-muted-foreground">Loading balance movements...</div>
      ) : isError ? (
        <div className="py-10 text-center text-destructive">Unable to load balance movements.</div>
      ) : payload ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Branch</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2 text-lg font-semibold">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span>{branchLabel}</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Currency</CardTitle>
              </CardHeader>
              <CardContent className="text-lg font-semibold">{currencyLabel}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Movement Count</CardTitle>
              </CardHeader>
              <CardContent className="text-lg font-semibold">{movementCount}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Range</CardTitle>
              </CardHeader>
              <CardContent className="text-lg font-semibold">
                {payload.date_range?.start ?? startDate} → {payload.date_range?.end ?? endDate}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Balance Movements</CardTitle>
            </CardHeader>
            <CardContent>
              {movements.length === 0 ? (
                <p className="text-sm text-muted-foreground">No movement records in this period.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((movement) => (
                      <TableRow key={`${movement.transaction_number}-${movement.date}`}>
                        <TableCell className="text-sm text-muted-foreground">
                          {movement.date ? new Date(movement.date).toLocaleString() : '—'}
                        </TableCell>
                        <TableCell className="font-medium">{movement.transaction_number}</TableCell>
                        <TableCell className="capitalize">{movement.type}</TableCell>
                        <TableCell className="text-right">{formatAmount(movement.amount)}</TableCell>
                        <TableCell className="text-right">{formatAmount(movement.debit)}</TableCell>
                        <TableCell className="text-right">{formatAmount(movement.credit)}</TableCell>
                        <TableCell className="text-right">{formatAmount(movement.balance)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{movement.description || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
