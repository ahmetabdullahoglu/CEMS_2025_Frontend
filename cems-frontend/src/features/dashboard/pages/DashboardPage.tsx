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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard()

  // Fetch chart data
  const { data: volumeData } = useTransactionVolume({ period: 'week' })
  const { data: revenueData } = useRevenueTrend({ period: 'month' })
  const { data: currencyData } = useCurrencyDistribution({ period: 'today', limit: 5 })
  const { data: branchData } = useBranchComparison({ period: 'week', metric: 'revenue', limit: 5 })
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
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">System Alerts</h2>
          <div className="grid gap-3">
            {alertsData.alerts.slice(0, 3).map((alert) => (
              <Alert
                key={alert.id}
                variant={alert.severity === 'error' || alert.severity === 'critical' ? 'destructive' : 'default'}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Transaction Volume Chart */}
        {volumeData && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>Transaction Volume</CardTitle>
              </div>
              <CardDescription>Transactions over the past week</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}

        {/* Revenue Trend Chart */}
        {revenueData && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <CardTitle>Revenue Trend</CardTitle>
              </div>
              <CardDescription>Revenue over the past month</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}

        {/* Currency Distribution */}
        {currencyData && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                <CardTitle>Currency Distribution</CardTitle>
              </div>
              <CardDescription>Most traded currencies today</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}

        {/* Branch Comparison */}
        {branchData && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <CardTitle>Branch Performance</CardTitle>
              </div>
              <CardDescription>Top performing branches this week</CardDescription>
            </CardHeader>
            <CardContent>
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
                                ${Number(branch.total_revenue).toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {branch.total_transactions} txns
                              </p>
                            </div>
                          </div>
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-600 rounded-full"
                              style={{
                                width: `${Math.min((Number(branch.total_revenue) / Math.max(...branchData.data.map(b => Number(b.total_revenue)))) * 100, 100)}%`
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
