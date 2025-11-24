import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDailySummary } from '@/hooks/useReports'
import { useBranchSelection } from '@/contexts/BranchContext'
import { formatBranchLabel } from '@/utils/branch'

export default function DailySummary() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const { availableBranches } = useBranchSelection()
  const [branchId, setBranchId] = useState<string>('all')

  const { data, isLoading, isError } = useDailySummary(
    {
      targetDate: selectedDate,
      branchId: branchId === 'all' ? null : branchId,
    },
    !!selectedDate
  )

  const summary = (data as { data?: unknown })?.data ?? data

  const selectedBranch =
    branchId === 'all' ? null : availableBranches.find((branch) => branch.id === branchId)

  const branchScopeLabel =
    branchId === 'all'
      ? 'All branches'
      : selectedBranch
        ? formatBranchLabel(selectedBranch, selectedBranch.name_en, selectedBranch.id)
        : branchId

  const currencyVolumes = Object.entries(summary?.volume_by_currency ?? {}).map(([code, value]) => ({
    currency: code,
    volume: Number(value ?? 0),
  }))

  const revenueTypes = Object.entries(summary?.revenue_by_type ?? {}).map(([type, value]) => ({
    type,
    amount: Number(value ?? 0),
  }))

  const transactionBreakdown = Object.entries(summary?.transaction_breakdown ?? {}).map(([type, value]) => ({
    type,
    count: Number(value ?? 0),
  }))

  return (
    <div className="space-y-6">
      {/* Date Picker */}
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1 max-w-xs">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            <div className="flex-1 max-w-xs">
              <Label htmlFor="branch">Branch</Label>
              <Select value={branchId} onValueChange={(value) => setBranchId(value)}>
                <SelectTrigger id="branch">
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
        <div className="text-center py-8 text-muted-foreground">Loading daily summary...</div>
      )}

      {isError && (
        <div className="text-center py-8 text-red-500">Error loading daily summary. Please try again.</div>
      )}

      {summary && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.total_transactions ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Date: {summary.date}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${Number(summary.total_revenue ?? 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Revenue by type below</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Commission</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {summary.average_commission != null
                    ? `${Number(summary.average_commission).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Average commission across transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Branch</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{branchScopeLabel}</div>
                <p className="text-xs text-muted-foreground mt-1">Scope of the report</p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Type</CardTitle>
              <p className="text-sm text-muted-foreground">Breakdown of revenue streams</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={revenueTypes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis tickFormatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#3b82f6" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transaction Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Breakdown</CardTitle>
              <p className="text-sm text-muted-foreground">Counts by transaction type</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {transactionBreakdown.map((entry) => (
                  <div key={entry.type} className="rounded-md border p-3">
                    <p className="text-xs uppercase text-muted-foreground">{entry.type}</p>
                    <p className="text-xl font-semibold">{entry.count}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Volume by Currency */}
          <Card>
            <CardHeader>
              <CardTitle>Volume by Currency</CardTitle>
              <p className="text-sm text-muted-foreground">Requested amounts per currency</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={currencyVolumes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="currency" />
                  <YAxis tickFormatter={(value) => Number(value).toLocaleString()} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="volume" fill="#10b981" name="Volume" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
