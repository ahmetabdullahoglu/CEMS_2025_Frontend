import { useState } from 'react'
import { AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useLowBalanceAlerts, useReportExport } from '@/hooks/useReports'

export default function LowBalanceAlerts() {
  const [severity, setSeverity] = useState<'all' | 'warning' | 'critical'>('all')
  const { data, isLoading, isError } = useLowBalanceAlerts({
    severity: severity === 'all' ? undefined : severity,
  })
  const exportMutation = useReportExport()

  const handleExport = () => {
    exportMutation.mutate({
      report_type: 'low-balance-alerts',
      format: 'pdf',
      filters: { severity: severity === 'all' ? undefined : severity },
    })
  }

  const renderSeverityBadge = (level: 'warning' | 'critical') => (
    <Badge variant={level === 'critical' ? 'destructive' : 'secondary'} className="capitalize">
      {level}
    </Badge>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Balance Alerts
            </CardTitle>
            <p className="text-sm text-muted-foreground">Monitor critical liquidity issues</p>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <Label className="text-xs uppercase">Severity</Label>
              <Select value={severity} onValueChange={(value: 'all' | 'warning' | 'critical') => setSeverity(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="warning">Warnings</SelectItem>
                  <SelectItem value="critical">Critical Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleExport} disabled={exportMutation.isPending}>
              {exportMutation.isPending ? 'Preparing Export...' : 'Export Alerts'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading alerts...</div>
      ) : isError ? (
        <div className="text-center py-10 text-destructive">Unable to load alerts.</div>
      ) : data && data.alerts.length > 0 ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-10 w-10 text-red-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Critical Alerts</p>
                  <p className="text-2xl font-bold">
                    {data.alerts.filter((alert) => alert.severity === 'critical').length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-10 w-10 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-bold">
                    {data.alerts.filter((alert) => alert.severity === 'warning').length}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Branches Impacted</p>
                <p className="text-2xl font-bold">
                  {new Set(data.alerts.map((alert) => alert.branch_id)).size}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Branch</TableHead>
                    <TableHead>Currency</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Shortage</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.alerts.slice(0, 8).map((alert) => (
                    <TableRow key={`${alert.branch_id}-${alert.currency_id}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{alert.branch_name}</p>
                          <p className="text-xs text-muted-foreground">ID: {alert.branch_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {alert.currency_code}
                      </TableCell>
                      <TableCell>${Number(alert.current_balance).toLocaleString()}</TableCell>
                      <TableCell>${Number(alert.threshold).toLocaleString()}</TableCell>
                      <TableCell className="text-destructive font-semibold">
                        -${Number(alert.shortage).toLocaleString()}
                      </TableCell>
                      <TableCell>{renderSeverityBadge(alert.severity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">No low balance alerts 🎉</div>
      )}
    </div>
  )
}
