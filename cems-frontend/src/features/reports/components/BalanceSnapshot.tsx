import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { CalendarDays, RefreshCcw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useBalanceSnapshot } from '@/hooks/useReports'
import { useBranches } from '@/hooks/useBranches'
import type { Branch } from '@/types/branch.types'
import type { BalanceSnapshotEntry } from '@/types/report.types'
import { formatBranchLabel } from '@/utils/branch'
import { formatAmount } from '@/utils/number'

const ALL_BRANCHES = 'all'

export default function BalanceSnapshot() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const [snapshotDate, setSnapshotDate] = useState(today)
  const [branchFilter, setBranchFilter] = useState<string>(ALL_BRANCHES)

  const { data: branchesResponse, isFetching: loadingBranches } = useBranches({
    limit: 100,
    include_balances: false,
  })

  const branches: Branch[] = useMemo(() => {
    const payload = (branchesResponse as { data?: Branch[] })?.data ?? branchesResponse
    return Array.isArray(payload) ? payload : []
  }, [branchesResponse])

  const selectedBranchId = branchFilter === ALL_BRANCHES ? undefined : branchFilter

  const { data, isLoading, isFetching, refetch, isError } = useBalanceSnapshot({
    branchId: selectedBranchId,
    snapshotDate,
  })

  const snapshot = (data as { data?: unknown })?.data ?? data
  const balances = (snapshot?.balances ?? []) as BalanceSnapshotEntry[]

  const branchLabel = selectedBranchId
    ? formatBranchLabel(
        branches.find((branch) => branch.id === selectedBranchId),
        snapshot?.branch?.name,
        snapshot?.branch?.id
      )
    : 'All branches'

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Balance Snapshot Filters</CardTitle>
            <p className="text-sm text-muted-foreground">Capture balances for a specific date or all branches.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()} disabled={isFetching || isLoading}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="snapshot-branch">Branch</Label>
              <Select
                value={branchFilter}
                onValueChange={setBranchFilter}
                disabled={loadingBranches}
              >
                <SelectTrigger id="snapshot-branch">
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_BRANCHES}>All branches</SelectItem>
                  {branches
                    .filter((branch) => branch.id)
                    .map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {formatBranchLabel(branch)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="snapshot-date">Snapshot Date</Label>
              <Input
                id="snapshot-date"
                type="date"
                value={snapshotDate}
                max={today}
                onChange={(event) => setSnapshotDate(event.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="py-10 text-center text-muted-foreground">Loading snapshot...</div>
      ) : isError ? (
        <div className="py-10 text-center text-destructive">Unable to load balance snapshot.</div>
      ) : snapshot ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Scope</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2 text-lg font-semibold">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{branchLabel}</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Snapshot Date</CardTitle>
              </CardHeader>
              <CardContent className="text-lg font-semibold">{snapshot.snapshot_date ?? snapshotDate}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Currencies</CardTitle>
              </CardHeader>
              <CardContent className="text-lg font-semibold">{snapshot.currency_count ?? balances.length}</CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Balances</CardTitle>
            </CardHeader>
            <CardContent>
              {balances.length === 0 ? (
                <p className="text-sm text-muted-foreground">No balances returned for this snapshot.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Currency</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balances.map((entry) => (
                      <TableRow key={entry.currency_code}>
                        <TableCell className="font-medium">{entry.currency_code}</TableCell>
                        <TableCell className="text-right">{formatAmount(entry.balance)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {entry.last_updated ? new Date(entry.last_updated).toLocaleString() : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
