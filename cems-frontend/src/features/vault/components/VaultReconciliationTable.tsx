import { History, RefreshCw } from 'lucide-react'
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
import type { VaultReconciliationReport } from '@/types/vault.types'

interface VaultReconciliationTableProps {
  report?: VaultReconciliationReport
  isLoading?: boolean
  isFetching?: boolean
  onRefresh?: () => void
}

const formatAmount = (value?: string | null) => {
  if (!value) return '-'
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function VaultReconciliationTable({ report, isLoading, isFetching, onRefresh }: VaultReconciliationTableProps) {
  return (
    <Card>
      <CardHeader className="flex items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" /> Daily Reconciliation
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Latest variance report for the main vault
          </p>
          {report?.reconciliation_date && (
            <p className="text-xs text-muted-foreground">
              Last run: {new Date(report.reconciliation_date).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {report?.total_discrepancies ?? 0} discrepancy{(report?.total_discrepancies ?? 0) === 1 ? '' : 'ies'}
          </Badge>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={!onRefresh}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading reconciliation data...</div>
        ) : !report ? (
          <div className="text-center py-8 text-muted-foreground">
            No reconciliation report found for this vault yet.
          </div>
        ) : report.results.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No reconciliation entries were recorded.</div>
        ) : (
          <div className="space-y-4">
            {report.notes && (
              <div className="rounded-md border bg-muted/50 p-3 text-sm text-muted-foreground">
                {report.notes}
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">System Balance</TableHead>
                  <TableHead className="text-right">Physical Count</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead>Last Reconciled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.results.map((result) => (
                  <TableRow key={`${result.currency_id}-${result.currency_code}`}>
                    <TableCell>
                      <div className="font-medium">{result.currency_code}</div>
                    </TableCell>
                    <TableCell className="text-right">{formatAmount(result.system_balance)}</TableCell>
                    <TableCell className="text-right">{formatAmount(result.physical_count)}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={result.discrepancy && Number(result.discrepancy) !== 0 ? 'destructive' : 'secondary'}
                      >
                        {formatAmount(result.discrepancy)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {result.last_reconciled_at
                        ? new Date(result.last_reconciled_at).toLocaleString()
                        : 'Not recorded'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
