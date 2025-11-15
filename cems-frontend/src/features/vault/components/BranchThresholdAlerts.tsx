import { AlertTriangle, CheckCircle2, Building } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { BranchBalance, BranchThreshold } from '@/types/branch.types'

interface BranchThresholdAlertsProps {
  branchName?: string
  balances?: BranchBalance[]
  thresholds?: BranchThreshold[]
  isLoading?: boolean
}

const formatAmount = (value?: string | null) => {
  if (!value) return '-'
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function BranchThresholdAlerts({
  branchName,
  balances,
  thresholds,
  isLoading,
}: BranchThresholdAlertsProps) {
  const hasBranchContext = Boolean(branchName)

  if (!hasBranchContext) {
    return null
  }

  const thresholdMap = new Map<string, BranchThreshold>()
  thresholds?.forEach((threshold) => {
    thresholdMap.set(threshold.currency_id || threshold.currency_code, threshold)
  })

  const rows = (balances ?? []).map((balance) => {
    const threshold =
      thresholdMap.get(balance.currency_code) || (balance.currency_id ? thresholdMap.get(balance.currency_id) : undefined)

    const amount = Number(balance.balance ?? 0)
    const min = threshold?.min_balance ? Number(threshold.min_balance) : undefined
    const max = threshold?.max_balance ? Number(threshold.max_balance) : undefined

    let status: 'ok' | 'low' | 'high' = 'ok'
    if (typeof min === 'number' && amount < min) {
      status = 'low'
    } else if (typeof max === 'number' && amount > max) {
      status = 'high'
    }

    return {
      balance,
      threshold,
      status,
      min,
      max,
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              {branchName} Thresholds
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Monitor branch balances against configured limits
            </p>
          </div>
          <Badge variant="secondary">{balances?.length ?? 0} currencies</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6 text-muted-foreground">Loading threshold alerts...</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No currency balances available for this branch yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Min</TableHead>
                <TableHead className="text-right">Max</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ balance, threshold, status }, idx) => (
                <TableRow key={`${balance.currency_code}-${idx}`}>
                  <TableCell>
                    <div className="font-medium">{balance.currency_code}</div>
                    <p className="text-xs text-muted-foreground">{balance.currency_name}</p>
                  </TableCell>
                  <TableCell className="text-right">{formatAmount(balance.balance)}</TableCell>
                  <TableCell className="text-right">
                    {formatAmount(threshold?.min_balance || threshold?.alert_threshold)}
                  </TableCell>
                  <TableCell className="text-right">{formatAmount(threshold?.max_balance)}</TableCell>
                  <TableCell>
                    {status === 'ok' ? (
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> OK
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {status === 'low' ? 'Below minimum' : 'Above maximum'}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
