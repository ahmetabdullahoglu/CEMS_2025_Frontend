import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function VaultPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vault</h1>
        <p className="text-muted-foreground">Manage vault cash balances and operations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vault Operations</CardTitle>
          <CardDescription>Cash management and balance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Vault management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
