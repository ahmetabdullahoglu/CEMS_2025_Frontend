import { useEffect, useState } from 'react'
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
  const { availableBranches, currentBranchId } = useBranchSelection()
  const [branchId, setBranchId] = useState<string>('all')

  useEffect(() => {
    if (currentBranchId && branchId === 'all') {
      setBranchId(currentBranchId)
    }
  }, [branchId, currentBranchId])

  const { data, isLoading, isError } = useMonthlyRevenue(
    { year: selectedYear, month: selectedMonth, branchId: branchId === 'all' ? null : branchId },
    !!selectedYear && !!selectedMonth
  )

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

      {isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          Loading monthly revenue...
        </div>
      )}

      {isError && (
        <div className="text-center py-8 text-red-500">
          Error loading monthly revenue. Please try again.
        </div>
      )}

      {data && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${Number(data.total_revenue ?? 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  For {data.month ?? 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ${Number(data.total_expenses ?? 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  For {data.month ?? 'N/A'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${Number(data.total_profit ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Number(data.total_profit ?? 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Revenue - Expenses
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Daily Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue & Expenses</CardTitle>
              <p className="text-sm text-muted-foreground">
                Daily breakdown for {data.month ?? 'N/A'}
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={data.daily_data ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => {
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
                      `$${value.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    }
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Profit"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
