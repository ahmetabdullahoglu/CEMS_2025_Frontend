import { useEffect, useMemo, useState } from 'react'
import { subDays, format } from 'date-fns'
import { TrendingUp, RefreshCcw } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useExchangeTrends, useReportExport } from '@/hooks/useReports'
import { useActiveCurrencies } from '@/hooks/useCurrencies'
import type { CurrencyResponse } from '@/types/currency.types'

export default function ExchangeTrends() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd')

  const [startDate, setStartDate] = useState(weekAgo)
  const [endDate, setEndDate] = useState(today)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')

  const { data: activeCurrencies } = useActiveCurrencies()

  const currencyOptions = useMemo<CurrencyResponse[]>(() => {
    const payload = (activeCurrencies as { data?: CurrencyResponse[]; success?: boolean })?.data ?? activeCurrencies
    return Array.isArray(payload) ? payload : []
  }, [activeCurrencies])

  useEffect(() => {
    if (currencyOptions.length === 0) return
    if (!fromCurrency || !currencyOptions.some((c) => c.code === fromCurrency)) {
      setFromCurrency(currencyOptions[0].code)
    }
    if (!toCurrency || !currencyOptions.some((c) => c.code === toCurrency)) {
      const fallback = currencyOptions.find((c) => c.code !== fromCurrency)
      setToCurrency((fallback ?? currencyOptions[0]).code)
    }
  }, [currencyOptions, fromCurrency, toCurrency])

  const { data, isLoading, isError, refetch, isFetching } = useExchangeTrends({
    startDate,
    endDate,
    fromCurrency,
    toCurrency,
  })

  const exportMutation = useReportExport()

  const handleExport = () => {
    exportMutation.mutate({
      report_type: 'exchange-trends',
      format: 'csv',
      filters: {
        start_date: startDate,
        end_date: endDate,
        from_currency: fromCurrency,
        to_currency: toCurrency,
      },
    })
  }

  const exchangePayload = (data as { data?: unknown; success?: boolean })?.data ?? data
  const trends = exchangePayload?.daily_trends ?? exchangePayload?.trends ?? []
  const periodStart = exchangePayload?.date_range?.start ?? exchangePayload?.period_start
  const periodEnd = exchangePayload?.date_range?.end ?? exchangePayload?.period_end
  const mostTraded = exchangePayload?.most_traded_pair ?? null
  const trendRows = Array.isArray(trends) ? trends : []
  const pairLabel = exchangePayload?.currency_pair ?? `${fromCurrency}/${toCurrency}`

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Exchange Trends Filters</CardTitle>
            <p className="text-sm text-muted-foreground">Select a date range or currency pair</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button onClick={handleExport} disabled={exportMutation.isPending}>
              {exportMutation.isPending ? 'Exporting...' : 'Export Trends'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="exchange-start-date">Start Date</Label>
              <Input
                id="exchange-start-date"
                type="date"
                value={startDate}
                max={endDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="exchange-end-date">End Date</Label>
              <Input
                id="exchange-end-date"
                type="date"
                value={endDate}
                min={startDate}
                max={today}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="from-currency">From Currency</Label>
              <Select
                value={fromCurrency}
                onValueChange={(value) => {
                  setFromCurrency(value)
                  if (value === toCurrency && currencyOptions.length > 1) {
                    const fallback = currencyOptions.find((c) => c.code !== value)
                    if (fallback) setToCurrency(fallback.code)
                  }
                }}
                disabled={currencyOptions.length === 0}
              >
                <SelectTrigger id="from-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency.id ?? currency.code} value={currency.code}>
                      {currency.code} — {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="to-currency">To Currency</Label>
              <Select
                value={toCurrency}
                onValueChange={(value) => setToCurrency(value)}
                disabled={currencyOptions.length === 0}
              >
                <SelectTrigger id="to-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency.id ?? currency.code} value={currency.code}>
                      {currency.code} — {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {exportMutation.isSuccess && exportMutation.data && (
            <p className="text-sm text-muted-foreground mt-4">
              Export ready: <a className="text-primary underline" href={exportMutation.data.download_url}>Download file</a>
            </p>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading exchange trends...</div>
      ) : isError ? (
        <div className="text-center py-10 text-destructive">Unable to load exchange trends.</div>
      ) : data ? (
        <div className="space-y-6">
          {mostTraded && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Most Traded Pair
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Pair</p>
                  <p className="text-2xl font-semibold">
                    {mostTraded.from_currency} / {mostTraded.to_currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Volume</p>
                  <p className="text-2xl font-semibold">{Number(mostTraded.volume).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Period</p>
                  <p className="text-lg font-medium">
                    {periodStart ?? '—'} → {periodEnd ?? '—'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Average Rate Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={trendRows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="average_rate" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Volumes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Pair</TableHead>
                    <TableHead>Avg. Rate</TableHead>
                    <TableHead>Total Volume</TableHead>
                    <TableHead>Transactions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trendRows.slice(0, 10).map((trend) => (
                    <TableRow key={`${trend.date}-${trend.from_currency}-${trend.to_currency}`}>
                      <TableCell>{trend.date}</TableCell>
                      <TableCell>{trend.from_currency ? `${trend.from_currency} / ${trend.to_currency}` : pairLabel}</TableCell>
                      <TableCell>{Number(trend.average_rate).toFixed(4)}</TableCell>
                      <TableCell>{Number(trend.total_volume).toLocaleString()}</TableCell>
                      <TableCell>{trend.transaction_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>Showing the most recent 10 data points</TableCaption>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">No exchange trend data available.</div>
      )}
    </div>
  )
}
