import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DailySummary from '../components/DailySummary'
import MonthlyRevenue from '../components/MonthlyRevenue'
import BranchPerformance from '../components/BranchPerformance'
import ExchangeTrends from '../components/ExchangeTrends'
import LowBalanceAlerts from '../components/LowBalanceAlerts'
import UserActivityReport from '../components/UserActivityReport'
import CustomAnalytics from '../components/CustomAnalytics'
import ReportExportPanel from '../components/ReportExportPanel'
import BalanceSnapshot from '../components/BalanceSnapshot'
import BalanceMovement from '../components/BalanceMovement'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">View financial reports and performance metrics</p>
      </div>

      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="grid w-full gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="branch">Branch Performance</TabsTrigger>
          <TabsTrigger value="exchange">Exchange Trends</TabsTrigger>
          <TabsTrigger value="alerts">Balance Alerts</TabsTrigger>
          <TabsTrigger value="snapshot">Balance Snapshot</TabsTrigger>
          <TabsTrigger value="movement">Balance Movement</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
          <TabsTrigger value="custom">Custom Analytics</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <DailySummary />
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyRevenue />
        </TabsContent>

        <TabsContent value="branch">
          <BranchPerformance />
        </TabsContent>

        <TabsContent value="exchange">
          <ExchangeTrends />
        </TabsContent>

        <TabsContent value="alerts">
          <LowBalanceAlerts />
        </TabsContent>

        <TabsContent value="snapshot">
          <BalanceSnapshot />
        </TabsContent>

        <TabsContent value="movement">
          <BalanceMovement />
        </TabsContent>

        <TabsContent value="users">
          <UserActivityReport />
        </TabsContent>

        <TabsContent value="custom">
          <CustomAnalytics />
        </TabsContent>

        <TabsContent value="export">
          <ReportExportPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
