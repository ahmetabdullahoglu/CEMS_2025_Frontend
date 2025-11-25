import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import {
  ComposedChart,
  Line,
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
import { useMonthlyRevenue } from '@/hooks/useReports'
import { useBranchSelection } from '@/contexts/BranchContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatBranchLabel } from '@/utils/branch'

export default function MonthlyRevenue() {
  const currentDate = new Date()
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)
  const { availableBranches } = useBranchSelection()
  const [branchId, setBranchId] = useState<string>('all')

  const { data, isLoading, isError } = useMonthlyRevenue(
    { year: selectedYear, month: selectedMonth, branchId: branchId === 'all' ? null : branchId },
    !!selectedYear && !!selectedMonth
  )

  const revenue = (data as { data?: unknown })?.data ?? data

  const dailyBreakdown = useMemo(() => {
    if (!revenue?.daily_breakdown) return []
    return Object.entries(revenue.daily_breakdown).map(([day, info]) => {
      const date = new Date(revenue.year, revenue.month - 1, Number(day))
      return {
        day,
        date,
        revenue: Number(info.revenue ?? 0),
        count: info.count,
      }
    })
  }, [revenue])

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month] = e.target.value.split('-')
    setSelectedYear(parseInt(year))
    setSelectedMonth(parseInt(month))
  }

  const monthInputValue = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`

  return (
    <div className="space-y-6">
      {/* Month Picker */}
      <Card>
        <CardHeader>
          <CardTitle>Select Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1 max-w-xs">
              <Label htmlFor="month">Month</Label>
              <Input
                id="month"
                type="month"
                value={monthInputValue}
                onChange={handleMonthChange}
                max={format(new Date(), 'yyyy-MM')}
              />
            </div>
            <div className="flex-1 max-w-xs">
              <Label htmlFor="revenue-branch">Branch</Label>
              <Select value={branchId} onValueChange={(value) => setBranchId(value)}>
                <SelectTrigger id="revenue-branch">
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All branches</SelectItem>
                  {availableBranches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {formatBranchLabel(branch, branch.name_en, branch.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && <div className="text-center py-8 text-muted-foreground">Loading monthly revenue...</div>}

      {isError && <div className="text-center py-8 text-red-500">Error loading monthly revenue. Please try again.</div>}

      {revenue && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${Number(revenue.total_revenue ?? 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Month {revenue.month}/{revenue.year}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{revenue.total_transactions ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Overall monthly count</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Daily Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${Number(revenue.average_daily_revenue ?? 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Across all active days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Min / Max Daily</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-600">
                  Max: ${Number(revenue.max_daily_revenue ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
                <div className="text-lg font-bold text-red-500">
                  Min: ${Number(revenue.min_daily_revenue ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue</CardTitle>
              <p className="text-sm text-muted-foreground">Daily breakdown for the selected month</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={dailyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value: Date) => {
                      const date = new Date(value)
                      return format(date, 'MMM dd')
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => {
                      const date = new Date(value as string)
                      return format(date, 'PPP')
                    }}
                    formatter={(value: number) =>
                      `$${Number(value).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    }
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Transactions" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
