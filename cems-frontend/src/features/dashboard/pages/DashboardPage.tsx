import { ArrowRightLeft, DollarSign, Building2, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import StatCard from '../components/StatCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard()

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
                      ${currency.total_amount.toLocaleString()}
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
    </div>
  )
}
