import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useActiveCurrencies, useCurrencyRateHistory } from '@/hooks/useCurrencies'
import type { Currency } from '@/types/currency.types'

interface RateHistoryDialogProps {
  currency: Currency | null
  open: boolean
  onClose: () => void
}

export default function RateHistoryDialog({ currency, open, onClose }: RateHistoryDialogProps) {
  const { data: activeCurrencies } = useActiveCurrencies()
  const baseCurrency = activeCurrencies?.find((entry) => entry.is_base_currency)
  const shouldSkipHistory = !currency || currency.is_base_currency || !baseCurrency

  const { data, isLoading } = useCurrencyRateHistory(
    currency?.id,
    shouldSkipHistory ? undefined : baseCurrency?.id,
    open && !shouldSkipHistory
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
        ) : currency.is_base_currency ? (
          <div className="text-center py-8 text-muted-foreground">
            Base currency does not have exchange history against itself.
          </div>
        ) : !baseCurrency ? (
          <div className="text-center py-8 text-muted-foreground">No base currency is configured.</div>
        ) : isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading rate history...</div>
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No historical rates were found.</div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Showing last {data.data.length} entries updated by treasury for {currency.code} →{' '}
              {baseCurrency?.code}.
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
