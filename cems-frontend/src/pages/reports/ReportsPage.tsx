import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate and view financial reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Financial reports and analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Report generation coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
