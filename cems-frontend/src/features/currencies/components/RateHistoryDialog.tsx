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
import { useActiveCurrencies, useCurrencyRateHistory } from '@/hooks/useCurrencies'
import type { Currency } from '@/types/currency.types'
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

  const { data, isLoading } = useCurrencyRateHistory(
    baseCurrency?.id,
    targetCurrencyId,
    open && !!baseCurrency && !!targetCurrencyId
  )

  const historyEntries = data?.data ?? []

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
        ) : isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading rate history...</div>
        ) : historyEntries.length === 0 ? (
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
              Showing {historyEntries.length} entries for {baseCurrency?.code} →{' '}
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
                  {historyEntries.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">
                        {new Date(rate.changed_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={rate.change_type === 'created' ? 'default' : 'secondary'}>
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
