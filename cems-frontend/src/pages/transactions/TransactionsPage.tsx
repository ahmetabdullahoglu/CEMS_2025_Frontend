import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">Manage and view all currency exchange transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction List</CardTitle>
          <CardDescription>All transactions will be displayed here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Transaction management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
