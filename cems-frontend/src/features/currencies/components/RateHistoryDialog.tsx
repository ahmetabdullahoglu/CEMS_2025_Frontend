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

interface RateHistoryDialogProps {
  currency: Currency | null
  open: boolean
  onClose: () => void
}

export default function RateHistoryDialog({ currency, open, onClose }: RateHistoryDialogProps) {
  const { data: activeCurrencies } = useActiveCurrencies()
  const [targetCurrencyId, setTargetCurrencyId] = useState<string | undefined>()

  const availableTargets = useMemo(
    () => activeCurrencies?.filter((entry) => entry.id !== currency?.id) ?? [],
    [activeCurrencies, currency?.id]
  )

  useEffect(() => {
    if (open && availableTargets.length > 0) {
      setTargetCurrencyId((prev) => prev ?? availableTargets[0].id)
    }
  }, [open, availableTargets])

  const { data, isLoading } = useCurrencyRateHistory(
    currency?.id,
    targetCurrencyId,
    open && !!currency && !!targetCurrencyId
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Rate history for {currency?.name_en} ({currency?.code})
          </DialogTitle>
        </DialogHeader>
        {!currency ? (
          <div className="text-center py-8 text-muted-foreground">Select a currency to view history.</div>
        ) : availableTargets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No comparison currencies available.</div>
        ) : isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading rate history...</div>
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No historical rates were found.</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">Compare against</div>
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
              Showing {data.data.length} entries for {currency.code} →{' '}
              {availableTargets.find((item) => item.id === targetCurrencyId)?.code}
            </div>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Buy Rate</TableHead>
                    <TableHead className="text-right">Sell Rate</TableHead>
                    <TableHead>Recorded At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">
                        {new Date(rate.effective_from ?? rate.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {rate.buy_rate ? Number(rate.buy_rate).toFixed(4) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        {rate.sell_rate ? Number(rate.sell_rate).toFixed(4) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(rate.updated_at).toLocaleString()}
                      </TableCell>
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
