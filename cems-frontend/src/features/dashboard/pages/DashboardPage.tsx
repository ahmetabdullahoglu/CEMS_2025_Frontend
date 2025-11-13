import { ArrowRightLeft, DollarSign, Users, Vault } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import StatCard from '../components/StatCard'
import RevenueChart from '../components/RevenueChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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

  const stats = data.stats ?? {
    total_transactions: 0,
    transactions_change: 0,
    total_revenue: 0,
    revenue_change: 0,
    active_customers: 0,
    customers_change: 0,
    vault_balance: 0,
  }
  const revenue_trend = data.revenue_trend ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to CEMS - Currency Exchange Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Transactions"
          value={(stats.total_transactions ?? 0).toLocaleString()}
          change={stats.transactions_change ?? 0}
          icon={ArrowRightLeft}
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats.total_revenue ?? 0).toLocaleString()}`}
          change={stats.revenue_change ?? 0}
          icon={DollarSign}
        />
        <StatCard
          title="Active Customers"
          value={(stats.active_customers ?? 0).toLocaleString()}
          change={stats.customers_change ?? 0}
          icon={Users}
        />
        <StatCard
          title="Vault Balance"
          value={`$${(stats.vault_balance ?? 0).toLocaleString()}`}
          description="Across all currencies"
          icon={Vault}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart data={revenue_trend} />
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest transactions and system updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenue_trend.length > 0 ? (
                  <div className="text-sm text-muted-foreground">
                    <p>Last update: {new Date(revenue_trend[revenue_trend.length - 1].date).toLocaleDateString()}</p>
                    <p className="mt-2">Dashboard data is refreshed every 5 minutes</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activity to display.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
