import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DailySummary from '../components/DailySummary'
import MonthlyRevenue from '../components/MonthlyRevenue'
import BranchPerformance from '../components/BranchPerformance'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">View financial reports and performance metrics</p>
      </div>

      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="branch">Branch Performance</TabsTrigger>
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
      </Tabs>
    </div>
  )
}
