import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function BranchesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Branches</h1>
        <p className="text-muted-foreground">Manage branch locations and settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Branch List</CardTitle>
          <CardDescription>All branches will be displayed here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Branch management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
