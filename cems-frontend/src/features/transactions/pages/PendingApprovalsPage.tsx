import PendingTransferApprovals from '../components/PendingTransferApprovals'

export default function PendingApprovalsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Pending Transfer Approvals</h1>
        <p className="text-sm text-muted-foreground">
          Review pending transfer receipts and approve or cancel them.
        </p>
      </div>
      <PendingTransferApprovals />
    </div>
  )
}
