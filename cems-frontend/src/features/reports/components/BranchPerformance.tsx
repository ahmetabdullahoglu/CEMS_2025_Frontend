import { useState } from 'react'
import { format, subDays } from 'date-fns'
import { Calendar, Award } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Badge } from '@/components/ui/badge'
import { useBranchPerformance } from '@/hooks/useReports'

export default function BranchPerformance() {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const { data, isLoading, isError } = useBranchPerformance(startDate, endDate)

  // Sort branches by revenue for ranking
  const sortedBranches = data
    ? [...data.branches].sort((a, b) => Number(b.total_revenue) - Number(a.total_revenue))
    : []

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
        <div className="text-center py-8 text-muted-foreground">
          Loading branch performance...
        </div>
      )}

      {isError && (
        <div className="text-center py-8 text-red-500">
          Error loading branch performance. Please try again.
        </div>
      )}

      {data && (
        <>
          {/* Branch Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Comparison</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total revenue by branch ({format(new Date(data.period_start), 'MMM dd, yyyy')} - {format(new Date(data.period_end), 'MMM dd, yyyy')})
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
                      `$${value.toLocaleString('en-US', {
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
              <p className="text-sm text-muted-foreground">
                Detailed breakdown by branch
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead>Top Currency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBranches.map((branch, index) => (
                    <TableRow key={branch.branch_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {index === 0 && <Award className="w-4 h-4 text-yellow-500" />}
                          <span className="font-medium">#{index + 1}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{branch.branch_name}</TableCell>
                      <TableCell className="text-right">
                        {branch.total_transactions}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        ${Number(branch.total_revenue).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        ${Number(branch.total_expenses).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${Number(branch.net_profit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Number(branch.net_profit).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {branch.top_currency} ({branch.top_currency_volume.toLocaleString()})
                        </Badge>
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
