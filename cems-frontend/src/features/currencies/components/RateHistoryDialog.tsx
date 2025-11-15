import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCurrencyRateHistory } from '@/hooks/useCurrencies'
import type { Currency } from '@/types/currency.types'

interface RateHistoryDialogProps {
  currency: Currency | null
  open: boolean
  onClose: () => void
}

export default function RateHistoryDialog({ currency, open, onClose }: RateHistoryDialogProps) {
  const { data, isLoading } = useCurrencyRateHistory(currency?.id, open)

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
        ) : isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading rate history...</div>
        ) : !data || data.rates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No historical rates were found.</div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Showing last {data.rates.length} entries updated by treasury.
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
                  {data.rates.map((rate, index) => (
                    <TableRow key={`${rate.date}-${index}`}>
                      <TableCell className="font-medium">
                        {new Date(rate.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">{Number(rate.buy_rate).toFixed(4)}</TableCell>
                      <TableCell className="text-right">{Number(rate.sell_rate).toFixed(4)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(rate.created_at).toLocaleString()}
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
