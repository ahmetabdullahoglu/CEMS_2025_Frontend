import { useMemo, useState } from 'react'
import { subDays, format } from 'date-fns'
import { Users, Activity } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useReportExport, useUserActivityReport } from '@/hooks/useReports'

export default function UserActivityReport() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const lastMonth = format(subDays(new Date(), 30), 'yyyy-MM-dd')
  const [startDate, setStartDate] = useState(lastMonth)
  const [endDate, setEndDate] = useState(today)
  const [userId, setUserId] = useState('')

  const { data, isLoading, isError } = useUserActivityReport({ startDate, endDate, userId, enabled: !!userId })
  const exportMutation = useReportExport()

  const topUsers = useMemo(() => data?.users.slice(0, 8) ?? [], [data])

  const handleExport = () => {
    if (!userId) return
    exportMutation.mutate({
      report_type: 'user-activity',
      format: 'excel',
      filters: {
        start_date: startDate,
        end_date: endDate,
        user_id: userId,
      },
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle>User Activity Filters</CardTitle>
            <p className="text-sm text-muted-foreground">Review workload and performance per user</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div>
              <Label htmlFor="user-id">User ID</Label>
              <Input
                id="user-id"
                placeholder="User UUID"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="user-activity-start">Start Date</Label>
              <Input
                id="user-activity-start"
                type="date"
                value={startDate}
                max={endDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="user-activity-end">End Date</Label>
              <Input
                id="user-activity-end"
                type="date"
                value={endDate}
                min={startDate}
                max={today}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
            <Button className="self-end" onClick={handleExport} disabled={exportMutation.isPending}>
              {exportMutation.isPending ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {!userId ? (
        <div className="text-center py-10 text-muted-foreground">Enter a user ID to view activity.</div>
      ) : isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading user activity...</div>
      ) : isError ? (
        <div className="text-center py-10 text-destructive">Failed to load user activity.</div>
      ) : data ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topUsers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="username" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_transactions" fill="#22c55e" name="Transactions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" /> Recent User Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Exchanges</TableHead>
                    <TableHead>Income</TableHead>
                    <TableHead>Expenses</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.users.slice(0, 10).map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{user.full_name}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </TableCell>
                      <TableCell>${Number(user.total_amount_handled).toLocaleString()}</TableCell>
                      <TableCell>{user.total_transactions}</TableCell>
                      <TableCell>{user.exchange_count}</TableCell>
                      <TableCell>{user.income_count}</TableCell>
                      <TableCell>{user.expense_count}</TableCell>
                      <TableCell>{new Date(user.last_activity).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">No user activity data.</div>
      )}
    </div>
  )
}
