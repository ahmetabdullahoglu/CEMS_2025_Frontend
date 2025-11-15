import { RefreshCw, TrendingUp, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useVaultCurrencyBalance } from '@/hooks/useVault'

interface CurrencyBalanceDetailsProps {
  currencyId?: string
  currencyCode?: string
}

export default function CurrencyBalanceDetails({ currencyId, currencyCode }: CurrencyBalanceDetailsProps) {
  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useVaultCurrencyBalance(currencyId || currencyCode)

  const displayCode = data?.currency_code || currencyCode || 'Select a currency'

  return (
    <Card>
      <CardHeader className="flex items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Currency Insight
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Detailed position for {displayCode}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={!currencyId && !currencyCode}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {!currencyId && !currencyCode ? (
          <div className="text-center py-6 text-muted-foreground">
            Select a currency from the balances table to view detailed insights.
          </div>
        ) : isLoading ? (
          <div className="text-center py-6 text-muted-foreground">Loading currency details...</div>
        ) : !data ? (
          <div className="text-center py-6 text-muted-foreground">
            Unable to load extra details for {displayCode}.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold">
                  {Number(data.balance).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {Number(data.available).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Includes funds ready for transfers</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Reserved</p>
                <p className="text-2xl font-bold text-amber-600">
                  {Number(data.reserved).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Allocated for pending operations</p>
              </div>
            </div>

            {data.branch_allocations && data.branch_allocations.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <p className="text-sm font-medium">Branch Allocations</p>
                  <Badge variant="secondary">{data.branch_allocations.length} branches</Badge>
                </div>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Branch</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead className="text-right">Reserved</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.branch_allocations.map((allocation) => (
                        <TableRow key={allocation.branch_id}>
                          <TableCell className="font-medium">{allocation.branch_name}</TableCell>
                          <TableCell className="text-right">
                            {Number(allocation.balance).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            {allocation.reserved ? (
                              Number(allocation.reserved).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {allocation.last_updated
                              ? new Date(allocation.last_updated).toLocaleString()
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
