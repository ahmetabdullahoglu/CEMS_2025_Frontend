import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage system users and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>All system users will be displayed here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">User management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
