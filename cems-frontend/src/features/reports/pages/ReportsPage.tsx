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
        <TabsList className="grid w-full gap-3 rounded-xl bg-muted/60 p-2 shadow-sm grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:shadow" value="daily">
            Daily
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:shadow" value="monthly">
            Monthly
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:shadow" value="branch">
            Branch Performance
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:shadow" value="exchange">
            Exchange Trends
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:shadow" value="alerts">
            Balance Alerts
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:shadow" value="snapshot">
            Balance Snapshot
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:shadow" value="movement">
            Balance Movement
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:shadow" value="users">
            User Activity
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:shadow" value="custom">
            Custom Analytics
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-background data-[state=active]:shadow" value="export">
            Export
          </TabsTrigger>
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
