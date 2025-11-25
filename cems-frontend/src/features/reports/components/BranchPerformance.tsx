import { useState, useMemo } from 'react'
import { format, subDays } from 'date-fns'
import { Calendar, Award } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useBranchPerformance } from '@/hooks/useReports'

export default function BranchPerformance() {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const { data, isLoading, isError } = useBranchPerformance(startDate, endDate)

  const payload = (data as { data?: unknown })?.data ?? data
  const branches = useMemo(() => payload?.branches ?? [], [payload])

  const sortedBranches = useMemo(
    () => [...branches].sort((a, b) => Number(b.total_revenue ?? 0) - Number(a.total_revenue ?? 0)),
    [branches]
  )

  const periodStart = payload?.date_range?.start
  const periodEnd = payload?.date_range?.end

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <Card>
        <CardHeader>
          <CardTitle>Select Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div className="flex gap-4 flex-1 max-w-2xl">
              <div className="flex-1">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center py-8 text-muted-foreground">Loading branch performance...</div>
      )}

      {isError && (
        <div className="text-center py-8 text-red-500">Error loading branch performance. Please try again.</div>
      )}

      {payload && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total System Revenue</CardTitle>
                <p className="text-sm text-muted-foreground">{periodStart} → {periodEnd}</p>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  ${Number(payload.total_system_revenue ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Branch Count</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{payload.branch_count ?? branches.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Best Performer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{sortedBranches[0]?.branch_name ?? 'N/A'}</p>
                <p className="text-sm text-muted-foreground">#{sortedBranches[0]?.rank ?? '—'} overall</p>
              </CardContent>
            </Card>
          </div>

          {/* Branch Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Comparison</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total revenue by branch ({periodStart ? format(new Date(periodStart), 'MMM dd, yyyy') : 'N/A'} -
                {periodEnd ? ` ${format(new Date(periodEnd), 'MMM dd, yyyy')}` : ' N/A'})
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sortedBranches}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="branch_name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) =>
                      `$${Number(value).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    }
                  />
                  <Legend />
                  <Bar dataKey="total_revenue" fill="#3b82f6" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Branch Performance Details</CardTitle>
              <p className="text-sm text-muted-foreground">Detailed breakdown by branch</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Avg. Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBranches.map((branch) => (
                    <TableRow key={branch.branch_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {branch.rank === 1 && <Award className="w-4 h-4 text-yellow-500" />}
                          <span className="font-medium">#{branch.rank}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>{branch.branch_name ?? 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">{branch.branch_code}</div>
                      </TableCell>
                      <TableCell className="text-right">{branch.total_transactions ?? 0}</TableCell>
                      <TableCell className="text-right text-green-600">
                        ${Number(branch.total_revenue ?? 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${Number(branch.avg_transaction_value ?? 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
