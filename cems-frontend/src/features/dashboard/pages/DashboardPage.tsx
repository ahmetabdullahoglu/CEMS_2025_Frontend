import { useState } from 'react'
import {
  ArrowRightLeft,
  DollarSign,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Activity
} from 'lucide-react'
import {
  useDashboard,
  useTransactionVolume,
  useRevenueTrend,
  useCurrencyDistribution,
  useBranchComparison,
  useDashboardAlerts
} from '@/hooks/useDashboard'
import StatCard from '../components/StatCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard()

  // Period filters state
  const [volumePeriod, setVolumePeriod] = useState<'today' | 'week' | 'month' | 'year'>('week')
  const [revenuePeriod, setRevenuePeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [currencyPeriod, setCurrencyPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today')
  const [branchPeriod, setBranchPeriod] = useState<'today' | 'week' | 'month' | 'year'>('week')
  const [branchMetric, setBranchMetric] = useState<'revenue' | 'transactions' | 'profit'>('revenue')

  // Fetch chart data with filters
  const { data: volumeData, isLoading: volumeLoading } = useTransactionVolume({ period: volumePeriod })
  const { data: revenueData, isLoading: revenueLoading } = useRevenueTrend({ period: revenuePeriod })
  const { data: currencyData, isLoading: currencyLoading } = useCurrencyDistribution({ period: currencyPeriod, limit: 5 })
  const { data: branchData, isLoading: branchLoading } = useBranchComparison({ period: branchPeriod, metric: branchMetric, limit: 5 })
  const { data: alertsData } = useDashboardAlerts(false)

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
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to CEMS - Currency Exchange Management System</p>
        {data.generated_at && (
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {new Date(data.generated_at).toLocaleString()}
          </p>
        )}
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
        <StatCard
          title="Pending Approvals"
          value={overview.pending_approvals.toLocaleString()}
          icon={CheckCircle}
          description={overview.pending_approvals > 0 ? 'Requires attention' : 'All clear'}
        />
      </div>

      {/* Alerts and Quick Stats */}
      {(overview.low_balance_alerts > 0 || overview.pending_approvals > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {overview.low_balance_alerts > 0 && (
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
          )}

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
              </CardContent>
            </Card>
          )}
        </div>
      )}

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
              <Select value={volumePeriod} onValueChange={(v: any) => setVolumePeriod(v)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>
              {volumePeriod === 'today' && 'Transactions today'}
              {volumePeriod === 'week' && 'Transactions over the past week'}
              {volumePeriod === 'month' && 'Transactions over the past month'}
              {volumePeriod === 'year' && 'Transactions over the past year'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {volumeLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
              </div>
            ) : volumeData ? (
              <div className="space-y-3">
                {volumeData.data && volumeData.data.length > 0 ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold">{volumeData.total_transactions}</p>
                      <p className="text-sm text-muted-foreground">total transactions</p>
                    </div>
                    <div className="space-y-2">
                      {volumeData.data.slice(-7).map((point) => (
                        <div key={point.date} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {new Date(point.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 bg-primary rounded-full" style={{
                              width: `${Math.min((point.count / Math.max(...volumeData.data.map(d => d.count))) * 100, 100)}px`
                            }} />
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
              <Select value={revenuePeriod} onValueChange={(v: any) => setRevenuePeriod(v)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>
              {revenuePeriod === 'week' && 'Revenue over the past week'}
              {revenuePeriod === 'month' && 'Revenue over the past month'}
              {revenuePeriod === 'quarter' && 'Revenue over the past quarter'}
              {revenuePeriod === 'year' && 'Revenue over the past year'}
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
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Revenue</p>
                        <p className="text-lg font-bold text-green-600">
                          ${Number(revenueData.total_revenue).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Expenses</p>
                        <p className="text-lg font-bold text-red-600">
                          ${Number(revenueData.total_expenses).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Net Profit</p>
                        <p className="text-lg font-bold text-blue-600">
                          ${Number(revenueData.total_profit).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {revenueData.data.slice(-10).reverse().map((point) => (
                        <div key={point.date} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {new Date(point.date).toLocaleDateString()}
                          </span>
                          <div className="flex gap-3">
                            <span className="text-green-600 font-medium">
                              ${Number(point.revenue).toLocaleString()}
                            </span>
                            <span className="text-blue-600 font-medium">
                              ${Number(point.profit).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
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
              <Select value={currencyPeriod} onValueChange={(v: any) => setCurrencyPeriod(v)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>
              {currencyPeriod === 'today' && 'Most traded currencies today'}
              {currencyPeriod === 'week' && 'Most traded currencies this week'}
              {currencyPeriod === 'month' && 'Most traded currencies this month'}
              {currencyPeriod === 'year' && 'Most traded currencies this year'}
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
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Most Traded:</span>
                      <Badge variant="outline">{currencyData.most_traded}</Badge>
                    </div>
                    <div className="space-y-3">
                      {currencyData.data.map((currency) => (
                        <div key={currency.currency_code} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{currency.currency_code}</span>
                              <span className="text-muted-foreground">{currency.currency_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {currency.trend === 'up' && (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              )}
                              {currency.trend === 'down' && (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              )}
                              <span className="font-medium">{currency.percentage.toFixed(1)}%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-600 rounded-full"
                                style={{ width: `${currency.percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-20 text-right">
                              {currency.transaction_count} txns
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
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
                <Select value={branchPeriod} onValueChange={(v: any) => setBranchPeriod(v)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={branchMetric} onValueChange={(v: any) => setBranchMetric(v)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">By Revenue</SelectItem>
                    <SelectItem value="transactions">By Transactions</SelectItem>
                    <SelectItem value="profit">By Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <CardDescription>
              Top performing branches by {branchMetric} for {branchPeriod === 'today' ? 'today' : branchPeriod === 'week' ? 'this week' : branchPeriod === 'month' ? 'this month' : 'this year'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {branchLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
              </div>
            ) : branchData ? (
              <div className="space-y-3">
                {branchData.data && branchData.data.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Top Branch:</span>
                      <Badge variant="default">{branchData.top_branch}</Badge>
                    </div>
                    <div className="space-y-3">
                      {branchData.data.map((branch) => (
                        <div key={branch.branch_id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                                {branch.rank}
                              </Badge>
                              <div>
                                <p className="text-sm font-medium">{branch.branch_name}</p>
                                <p className="text-xs text-muted-foreground">{branch.branch_code}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-green-600">
                                {branchMetric === 'transactions' ? (
                                  `${branch.total_transactions.toLocaleString()} txns`
                                ) : (
                                  `$${Number(branchMetric === 'revenue' ? branch.total_revenue : branch.total_profit).toLocaleString()}`
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {branch.active_customers} customers
                              </p>
                            </div>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-600 rounded-full"
                              style={{
                                width: `${Math.min(
                                  branchMetric === 'transactions'
                                    ? (branch.total_transactions / Math.max(...branchData.data.map(b => b.total_transactions))) * 100
                                    : (Number(branchMetric === 'revenue' ? branch.total_revenue : branch.total_profit) /
                                       Math.max(...branchData.data.map(b => Number(branchMetric === 'revenue' ? b.total_revenue : b.total_profit)))) * 100,
                                  100
                                )}%`
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
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
