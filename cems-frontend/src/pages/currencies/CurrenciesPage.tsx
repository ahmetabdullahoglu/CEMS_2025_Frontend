import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CurrenciesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Currencies</h1>
        <p className="text-muted-foreground">Manage currencies and exchange rates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Currency List</CardTitle>
          <CardDescription>All currencies and rates will be displayed here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Currency management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
