import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage customer information and history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>All customers will be displayed here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Customer management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
