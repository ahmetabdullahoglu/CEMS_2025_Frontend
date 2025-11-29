import { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useActiveCurrencies, useCurrencyRateHistory, useExchangeRate } from '@/hooks/useCurrencies'
import type { Currency, ExchangeRate, RateChangeLogEntry } from '@/types/currency.types'
import { Badge } from '@/components/ui/badge'

interface RateHistoryDialogProps {
  currency: Currency | null
  open: boolean
  onClose: () => void
}

export default function RateHistoryDialog({ currency, open, onClose }: RateHistoryDialogProps) {
  const { data: activeCurrencies } = useActiveCurrencies()
  const [targetCurrencyId, setTargetCurrencyId] = useState<string | undefined>()

  const baseCurrency = useMemo(
    () => activeCurrencies?.find((entry) => entry.is_base_currency),
    [activeCurrencies]
  )

  const availableTargets = useMemo(
    () => activeCurrencies?.filter((entry) => entry.id !== baseCurrency?.id) ?? [],
    [activeCurrencies, baseCurrency?.id]
  )

  useEffect(() => {
    if (!open) return

    if (currency && currency.id !== baseCurrency?.id) {
      setTargetCurrencyId(currency.id)
      return
    }

    if (availableTargets.length > 0) {
      setTargetCurrencyId((prev) => (prev && availableTargets.some((c) => c.id === prev) ? prev : availableTargets[0].id))
    }
  }, [open, currency, baseCurrency?.id, availableTargets])

  const { data, isLoading } = useCurrencyRateHistory(baseCurrency?.id, targetCurrencyId, {
    enabled: open && !!baseCurrency && !!targetCurrencyId,
    limit: 50,
  })

  const { data: currentRate, isLoading: isCurrentRateLoading } = useExchangeRate(
    baseCurrency?.id,
    targetCurrencyId
  )

  const historyEntries = useMemo(() => {
    const entries = data?.data ?? []
    return [...entries].sort(
      (a, b) => new Date(b.changed_at ?? '').getTime() - new Date(a.changed_at ?? '').getTime()
    )
  }, [data?.data])

  const currentEntry = useMemo<RateChangeLogEntry | null>(() => {
    if (!currentRate) return null

    const mapRate = (rate: ExchangeRate): RateChangeLogEntry => ({
      id: `${rate.id}-current`,
      exchange_rate_id: rate.id,
      from_currency_code:
        (rate as unknown as { from_currency_code?: string }).from_currency_code ??
        rate.from_currency?.code ??
        '',
      to_currency_code:
        (rate as unknown as { to_currency_code?: string }).to_currency_code ?? rate.to_currency?.code ?? '',
      old_rate: null,
      old_buy_rate: null,
      old_sell_rate: null,
      new_rate: rate.rate,
      new_buy_rate: rate.buy_rate ?? null,
      new_sell_rate: rate.sell_rate ?? null,
      change_type: 'current',
      changed_by: rate.set_by ?? null,
      changed_at: rate.updated_at ?? rate.effective_from ?? rate.created_at,
      reason: rate.notes ?? null,
      rate_change_percentage: null,
    })

    return mapRate(currentRate)
  }, [currentRate])

  const rowsToRender = useMemo(
    () => (currentEntry ? [currentEntry, ...historyEntries] : historyEntries),
    [currentEntry, historyEntries]
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Pair history for {currency?.name_en ?? currency?.name} ({currency?.code})
          </DialogTitle>
        </DialogHeader>
        {!currency ? (
          <div className="text-center py-8 text-muted-foreground">Select a currency to view history.</div>
        ) : !baseCurrency ? (
          <div className="text-center py-8 text-muted-foreground">Base currency not found.</div>
        ) : availableTargets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No comparison currencies available.</div>
        ) : isLoading || isCurrentRateLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading rate history...</div>
        ) : rowsToRender.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No historical rates were found.</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">Select pair currency</div>
              <Select value={targetCurrencyId} onValueChange={(val) => setTargetCurrencyId(val)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {availableTargets.map((target) => (
                    <SelectItem key={target.id} value={target.id}>
                      {target.code} — {target.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {rowsToRender.length} entries for {baseCurrency?.code} →{' '}
              {availableTargets.find((item) => item.id === targetCurrencyId)?.code}
            </div>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Changed At</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead className="text-right">Old Rate</TableHead>
                    <TableHead className="text-right">New Rate</TableHead>
                    <TableHead className="text-right">Δ %</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rowsToRender.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">
                        {rate.changed_at ? new Date(rate.changed_at).toLocaleString() : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={rate.change_type === 'created' || rate.change_type === 'current' ? 'default' : 'secondary'}
                        >
                          {rate.change_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{rate.old_rate ?? '—'}</TableCell>
                      <TableCell className="text-right">{rate.new_rate}</TableCell>
                      <TableCell className="text-right">
                        {rate.rate_change_percentage
                          ? `${Number(rate.rate_change_percentage).toFixed(2)}%`
                          : '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{rate.reason ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
