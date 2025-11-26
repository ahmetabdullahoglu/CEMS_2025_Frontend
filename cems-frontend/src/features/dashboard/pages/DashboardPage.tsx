import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRightLeft,
  DollarSign,
  Building2,
  AlertTriangle,
  Clock,
  TrendingUp,
  PieChart,
  BarChart3,
  Activity,
  ShieldAlert,
} from 'lucide-react'
import {
  useDashboard,
  useTransactionVolume,
  useRevenueTrend,
  useCurrencyDistribution,
  useBranchComparison,
  useDashboardAlerts
} from '@/hooks/useDashboard'
import { useLowBalanceAlerts } from '@/hooks/useReports'
import { useBranchSelection } from '@/contexts/BranchContext'
import type {
  TransactionVolumePeriod,
  RevenueTrendPeriod,
  GeneralChartPeriod,
  BranchComparisonMetric,
  TransactionVolumeDataPoint,
} from '@/types/dashboard.types'
import StatCard from '../components/StatCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatBranchLabel } from '@/utils/branch'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { availableBranches: branchOptions, currentBranchId } = useBranchSelection()
  const [selectedBranchId, setSelectedBranchId] = useState<string>(currentBranchId ?? 'all')
  const hasInitializedBranch = useRef(false)

  const branchFilter = selectedBranchId === 'all' ? undefined : selectedBranchId

  const { data, isLoading, isError, error } = useDashboard({ branch_id: branchFilter })

  useEffect(() => {
    if (currentBranchId && !hasInitializedBranch.current) {
      setSelectedBranchId(currentBranchId)
      hasInitializedBranch.current = true
    }
  }, [currentBranchId])

  // Period filters state - Different periods for different endpoints
  const [volumePeriod, setVolumePeriod] = useState<TransactionVolumePeriod>('daily')
  const [revenuePeriod, setRevenuePeriod] = useState<RevenueTrendPeriod>('monthly')
  const [currencyPeriod, setCurrencyPeriod] = useState<GeneralChartPeriod>('weekly')
  const [comparisonPeriod, setComparisonPeriod] = useState<GeneralChartPeriod>('weekly')
  const [branchMetric, setBranchMetric] = useState<BranchComparisonMetric>('revenue')

  // Fetch chart data with filters
  const { data: volumeData, isLoading: volumeLoading } = useTransactionVolume({
    period: volumePeriod,
    branch_id: branchFilter
  })
  const { data: revenueData, isLoading: revenueLoading } = useRevenueTrend({
    period: revenuePeriod,
    branch_id: branchFilter
  })
  const { data: currencyData, isLoading: currencyLoading } = useCurrencyDistribution({
    period: currencyPeriod,
    branch_id: branchFilter,
    limit: 5
  })
  const { data: branchComparisonData, isLoading: branchComparisonLoading } = useBranchComparison({
    period: comparisonPeriod,
    metric: branchMetric,
    limit: 5,
    branch_id: branchFilter
  })
  const { data: alertsData } = useDashboardAlerts({
    unreadOnly: false,
    branch_id: branchFilter,
  })
  const { data: criticalBalanceData, isLoading: criticalAlertsLoading } = useLowBalanceAlerts({
    severity: 'critical',
    branchId: branchFilter,
  })

  const createSelectHandler = <T extends string>(setter: (value: T) => void) => {
    return (value: string) => setter(value as T)
  }

  const handleVolumePeriodChange = createSelectHandler<TransactionVolumePeriod>(setVolumePeriod)
  const handleRevenuePeriodChange = createSelectHandler<RevenueTrendPeriod>(setRevenuePeriod)
  const handleCurrencyPeriodChange = createSelectHandler<GeneralChartPeriod>(setCurrencyPeriod)
  const handleComparisonPeriodChange = createSelectHandler<GeneralChartPeriod>(setComparisonPeriod)
  const handleBranchMetricChange = createSelectHandler<BranchComparisonMetric>(setBranchMetric)

  const branchMetricLabels: Record<BranchComparisonMetric, string> = {
    revenue: 'revenue',
    transactions: 'transactions',
    efficiency: 'transactions per staff',
  }

  const normalizeWeeklyPeriod = (period: string) => {
    const match = period.match(/^(\d{4})-W(\d{1,2})$/)
    if (!match) return 0

    const [, yearStr, weekStr] = match
    const year = Number(yearStr)
    const week = Number(weekStr)

    // Start from the first day of the year, then add weeks to approximate chronological order
    const firstDayOfYear = new Date(Date.UTC(year, 0, 1))
    const dayOffset = firstDayOfYear.getUTCDay() === 0 ? -6 : 1 - firstDayOfYear.getUTCDay()
    const weekStart = new Date(firstDayOfYear)
    weekStart.setUTCDate(firstDayOfYear.getUTCDate() + dayOffset + (week - 1) * 7)

    return weekStart.getTime()
  }

  const getVolumeSortValue = (
    point: TransactionVolumeDataPoint,
    periodSelection: TransactionVolumePeriod
  ) => {
    const reference = point.date ?? point.period ?? ''

    if (periodSelection === 'weekly' && point.period) {
      return normalizeWeeklyPeriod(point.period)
    }

    if (periodSelection === 'monthly' && reference) {
      const periodDate = new Date(reference.length === 7 ? `${reference}-01` : reference)
      return Number.isNaN(periodDate.getTime()) ? 0 : periodDate.getTime()
    }

    if (reference) {
      const dateValue = new Date(reference)
      return Number.isNaN(dateValue.getTime()) ? 0 : dateValue.getTime()
    }

    return 0
  }

  const getVolumeLabel = (
    point: TransactionVolumeDataPoint,
    periodSelection: TransactionVolumePeriod
  ): string => {
    if (point.label) return point.label

    if (periodSelection === 'daily') {
      const dateValue = point.date ?? point.period
      if (dateValue) {
        const parsed = new Date(dateValue)
        if (!Number.isNaN(parsed.getTime())) {
          return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }
      }
    }

    if (periodSelection === 'monthly') {
      const periodValue = point.period ?? point.date?.slice(0, 7)
      if (periodValue) {
        const parsed = new Date(`${periodValue}-01`)
        if (!Number.isNaN(parsed.getTime())) {
          return parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        }
        return periodValue
      }
    }

    if (periodSelection === 'weekly' && point.period) {
      return point.period
    }

    return point.date ?? point.period ?? 'Unknown'
  }

  const effectiveVolumePeriod = (volumeData?.period as TransactionVolumePeriod) ?? volumePeriod
  const normalizedVolumePoints = [...(volumeData?.data ?? [])]
    .map((point, index) => {
      const count = point.count ?? point.value ?? 0
      return {
        key: point.date ?? point.period ?? point.label ?? `${effectiveVolumePeriod}-${index}`,
        label: getVolumeLabel(point, effectiveVolumePeriod),
        count,
        sortValue: getVolumeSortValue(point, effectiveVolumePeriod),
      }
    })
    .sort((a, b) => a.sortValue - b.sortValue)

  const maxVolumeCount = normalizedVolumePoints.reduce((max, point) => Math.max(max, point.count), 0)
  const totalTransactions =
    volumeData?.total_transactions ?? normalizedVolumePoints.reduce((sum, point) => sum + point.count, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : 'Failed to load dashboard data'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please try refreshing the page or contact support if the problem persists.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const overview = data.overview ?? {
    total_transactions_today: 0,
    total_revenue_today: 0,
    active_branches: 0,
    low_balance_alerts: 0,
    pending_approvals: 0,
    transaction_growth_percent: 0,
  }

  const topCurrencies = data.top_currencies ?? []
  const quickStats = data.quick_stats ?? {
    transactions_yesterday: 0,
    average_transaction_value: 0,
    busiest_hour: 'N/A',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to CEMS - Currency Exchange Management System</p>
          {data.generated_at && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {new Date(data.generated_at).toLocaleString()}
            </p>
          )}
        </div>
        {/* Branch Filter */}
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branchOptions.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {formatBranchLabel(branch, branch.name, branch.id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Transactions Today"
          value={overview.total_transactions_today.toLocaleString()}
          change={overview.transaction_growth_percent}
          icon={ArrowRightLeft}
          description={`${quickStats.transactions_yesterday} yesterday`}
        />
        <StatCard
          title="Revenue Today"
          value={`$${overview.total_revenue_today.toLocaleString()}`}
          icon={DollarSign}
          description={`Avg: $${quickStats.average_transaction_value.toFixed(2)}`}
        />
        <StatCard
          title="Active Branches"
          value={overview.active_branches.toLocaleString()}
          icon={Building2}
          description="Operating branches"
        />
        {overview.pending_approvals > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base">Pending Approvals</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700">{overview.pending_approvals}</p>
              <p className="text-sm text-blue-600 mt-1">Transactions awaiting approval</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => navigate('/transactions/pending-approvals')}
              >
                Review Pending Transfers
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Alerts and Quick Stats */}
      {overview.low_balance_alerts > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-base">Low Balance Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-700">{overview.low_balance_alerts}</p>
              <p className="text-sm text-yellow-600 mt-1">Currency balances need attention</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            <CardTitle>Critical Liquidity Alerts</CardTitle>
          </div>
          <CardDescription>Live feed from detailed reports</CardDescription>
        </CardHeader>
        <CardContent>
          {criticalAlertsLoading ? (
            <p className="text-sm text-muted-foreground">Checking balances...</p>
          ) : criticalBalanceData && criticalBalanceData.alerts.length > 0 ? (
            <div className="space-y-3">
              {criticalBalanceData.alerts.slice(0, 4).map((alert) => (
                <div key={`${alert.branch_id}-${alert.currency_id}`} className="flex flex-col gap-1 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{alert.branch_name}</p>
                      <p className="text-xs text-muted-foreground">{alert.currency_code}</p>
                    </div>
                    <Badge variant="destructive" className="capitalize">
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current ${Number(alert.current_balance).toLocaleString()} vs threshold $
                    {Number(alert.threshold).toLocaleString()} — shortage $
                    {Number(alert.shortage).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No critical balance alerts detected.</p>
          )}
        </CardContent>
      </Card>

      {/* Top Currencies and Quick Stats */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {/* Top Currencies */}
        <Card>
          <CardHeader>
            <CardTitle>Top Currencies</CardTitle>
            <CardDescription>Most traded currencies today</CardDescription>
          </CardHeader>
          <CardContent>
            {topCurrencies.length > 0 ? (
              <div className="space-y-3">
                {topCurrencies.map((currency, index) => (
                  <div key={currency.currency_code} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 text-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{currency.currency_code}</p>
                        <p className="text-sm text-muted-foreground">
                          {currency.transaction_count} transactions
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ${Number(currency.total_amount ?? 0).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No currency data available for today
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Statistics</CardTitle>
            <CardDescription>Performance insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <p className="text-sm text-muted-foreground">Transactions Yesterday</p>
                  <p className="text-2xl font-bold">{quickStats.transactions_yesterday}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <p className="text-sm text-muted-foreground">Average Transaction Value</p>
                  <p className="text-2xl font-bold">
                    ${quickStats.average_transaction_value.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Busiest Hour</p>
                  <p className="text-2xl font-bold">{quickStats.busiest_hour}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Alerts */}
      {alertsData && alertsData.alerts && alertsData.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle>System Alerts</CardTitle>
            </div>
            <CardDescription>
              {alertsData.unread_count > 0 ? `${alertsData.unread_count} unread alerts` : 'All alerts'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertsData.alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.severity === 'critical' || alert.severity === 'error'
                      ? 'border-red-200 bg-red-50'
                      : alert.severity === 'warning'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={`h-4 w-4 mt-0.5 ${
                        alert.severity === 'critical' || alert.severity === 'error'
                          ? 'text-red-600'
                          : alert.severity === 'warning'
                          ? 'text-yellow-600'
                          : 'text-blue-600'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={alert.read ? 'outline' : 'default'} className="text-xs">
                          {alert.read ? 'Read' : 'Unread'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Transaction Volume Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>Transaction Volume</CardTitle>
              </div>
              <Select value={volumePeriod} onValueChange={handleVolumePeriodChange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Last 30 days</SelectItem>
                  <SelectItem value="weekly">Last 12 weeks</SelectItem>
                  <SelectItem value="monthly">Last 12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>
              {volumePeriod === 'daily' && 'Transactions over the past 30 days'}
              {volumePeriod === 'weekly' && 'Transactions over the past 12 weeks'}
              {volumePeriod === 'monthly' && 'Transactions over the past 12 months'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {volumeLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
              </div>
            ) : volumeData ? (
              <div className="space-y-3">
                {normalizedVolumePoints.length > 0 ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold">{totalTransactions}</p>
                      <p className="text-sm text-muted-foreground">total transactions</p>
                    </div>
                    <div className="space-y-2">
                      {normalizedVolumePoints.map((point) => (
                        <div key={point.key} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{point.label}</span>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 bg-primary rounded-full"
                              style={{
                                width: `${maxVolumeCount ? (point.count / maxVolumeCount) * 100 : 0}%`,
                              }}
                            />
                            <span className="text-sm font-medium w-12 text-right">{point.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No transaction volume data available
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No transaction volume data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <CardTitle>Revenue Trend</CardTitle>
              </div>
              <Select value={revenuePeriod} onValueChange={handleRevenuePeriodChange}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>
              {revenuePeriod === 'monthly' && 'Revenue over the past 12 months'}
              {revenuePeriod === 'yearly' && 'Revenue by year'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
              </div>
            ) : revenueData ? (
              <div className="space-y-3">
                {revenueData.data && revenueData.data.length > 0 ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-green-600">
                        ${revenueData.data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">total revenue</p>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {revenueData.data.slice().reverse().map((point) => {
                        const maxRevenue = Math.max(...revenueData.data.map(d => d.revenue))
                        const percentage = maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0

                        return (
                          <div key={point.period} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{point.period}</span>
                              <span className="font-medium text-green-600">
                                ${point.revenue.toLocaleString()}
                              </span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-600 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No revenue trend data available
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No revenue trend data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Currency Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                <CardTitle>Currency Distribution</CardTitle>
              </div>
              <Select value={currencyPeriod} onValueChange={handleCurrencyPeriodChange}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Today</SelectItem>
                  <SelectItem value="weekly">This Week</SelectItem>
                  <SelectItem value="monthly">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>
              {currencyPeriod === 'daily' && 'Most traded currencies today'}
              {currencyPeriod === 'weekly' && 'Most traded currencies this week'}
              {currencyPeriod === 'monthly' && 'Most traded currencies this month'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currencyLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
              </div>
            ) : currencyData ? (
              <div className="space-y-3">
                {currencyData.data && currencyData.data.length > 0 ? (
                  <div className="space-y-3">
                    {currencyData.data.map((currency) => (
                      <div key={currency.currency} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-purple-600">{currency.currency}</span>
                            <span className="text-xs text-muted-foreground">
                              {currency.count} txns
                            </span>
                          </div>
                          <span className="font-medium">{currency.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full transition-all"
                            style={{ width: `${currency.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No currency distribution data available
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No currency distribution data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Branch Comparison */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <CardTitle>Branch Performance</CardTitle>
              </div>
              <div className="flex gap-2">
                <Select value={comparisonPeriod} onValueChange={handleComparisonPeriodChange}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Today</SelectItem>
                    <SelectItem value="weekly">This Week</SelectItem>
                    <SelectItem value="monthly">This Month</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={branchMetric} onValueChange={handleBranchMetricChange}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">By Revenue</SelectItem>
                    <SelectItem value="transactions">By Transactions</SelectItem>
                    <SelectItem value="efficiency">By Efficiency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription>
              Top performing branches by {branchMetricLabels[branchMetric]} for{' '}
              {comparisonPeriod === 'daily' ? 'today' : comparisonPeriod === 'weekly' ? 'this week' : 'this month'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {branchComparisonLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
              </div>
            ) : branchComparisonData ? (
              <div className="space-y-3">
                {branchComparisonData.data && branchComparisonData.data.length > 0 ? (
                  <div className="space-y-3">
                    {branchComparisonData.data.map((branch, index) => {
                      const maxValue = Math.max(...branchComparisonData.data.map(b => b.value))
                      const percentage = maxValue > 0 ? (branch.value / maxValue) * 100 : 0

                      return (
                        <div key={branch.branch_code} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                                {index + 1}
                              </Badge>
                              <div>
                                <p className="text-sm font-medium">{branch.branch_name}</p>
                                <p className="text-xs text-muted-foreground">{branch.branch_code}</p>
                              </div>
                            </div>
                            <p className="text-sm font-bold text-orange-600">
                              {branchMetric === 'transactions'
                                ? `${branch.value.toLocaleString()} txns`
                                : branchMetric === 'efficiency'
                                  ? `${branch.value.toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })} txns/staff`
                                  : `$${branch.value.toLocaleString()}`}
                            </p>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-600 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No branch comparison data available
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No branch comparison data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
