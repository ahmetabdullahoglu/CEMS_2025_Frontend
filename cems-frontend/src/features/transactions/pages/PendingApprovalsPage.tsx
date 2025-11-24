import PendingTransferApprovals from '../components/PendingTransferApprovals'
import PendingExpenseApprovals from '../components/PendingExpenseApprovals'
import PendingTransfers from '@/features/vault/components/PendingTransfers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PendingApprovalsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Pending Approvals</h1>
        <p className="text-sm text-muted-foreground">
          Approve or cancel pending vault transfers, branch transfers, and expenses.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Vault Transfers (Vault ⇄ Branch/Vault)</h2>
        <PendingTransfers />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Branch Transfers Awaiting Receipt</CardTitle>
        </CardHeader>
        <CardContent>
          <PendingTransferApprovals />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Expense Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <PendingExpenseApprovals />
        </CardContent>
      </Card>
    </div>
  )
}
