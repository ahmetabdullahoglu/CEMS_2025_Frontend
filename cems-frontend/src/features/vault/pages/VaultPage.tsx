import { useEffect, useMemo, useState } from 'react'
import { Plus, RefreshCw, ShieldCheck, CircleDollarSign, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useAdjustVaultBalance,
  useApproveVaultTransfer,
  useCancelVaultTransfer,
  useCompleteVaultTransfer,
  useCreateVault,
  useRejectVaultTransfer,
  useReconcileVault,
  useVaultBalances,
  useVaultDetails,
  useVaultReconciliationReport,
  useVaultStatistics,
  useVaultTransferDetails,
  useVaultTransferStatistics,
  useVaultTransfers,
  useVaultsList,
  useUpdateVault,
} from '@/hooks/useVault'
import VaultBalances from '../components/VaultBalances'
import PendingTransfers from '../components/PendingTransfers'
import TransferDialog from '../components/TransferDialog'
import VaultReconciliationTable from '../components/VaultReconciliationTable'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { useBranches } from '@/hooks/useBranches'
import type { VaultResponse, VaultTransferStatus, VaultTransferType } from '@/types/vault.types'
import { cn } from '@/lib/utils'

export default function VaultPage() {
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [selectedVaultId, setSelectedVaultId] = useState<string>()

  const [vaultFilters, setVaultFilters] = useState({ search: '', vault_type: '' })
  const [vaultPage, setVaultPage] = useState(1)
  const vaultPageSize = 10

  const [adjustOpen, setAdjustOpen] = useState(false)
  const [adjustCurrencyId, setAdjustCurrencyId] = useState('')
  const [adjustValue, setAdjustValue] = useState('')
  const [adjustReason, setAdjustReason] = useState('')

  const [vaultDialogOpen, setVaultDialogOpen] = useState(false)
  const [editingVault, setEditingVault] = useState<VaultResponse | null>(null)
  const [vaultForm, setVaultForm] = useState({
    vault_code: '',
    name: '',
    vault_type: 'main',
    branch_id: '',
    description: '',
    location: '',
    is_active: true,
  })

  const [historyFilters, setHistoryFilters] = useState<{ 
    status?: VaultTransferStatus
    transfer_type?: VaultTransferType
    vault_id?: string
    branch_id?: string
  }>({ status: 'pending', transfer_type: undefined })
  const [historyPage, setHistoryPage] = useState(1)
  const historyPageSize = 10
  const [notesDialog, setNotesDialog] = useState<{ action: 'approve' | 'reject' | 'cancel' | null; id?: string }>({
    action: null,
    id: undefined,
  })
  const [actionNotes, setActionNotes] = useState('')
  const [detailId, setDetailId] = useState<string | undefined>()

  const { data: balancesData, isLoading: balancesLoading, refetch: refetchMainVault } = useVaultBalances()
  const activeVaultId = selectedVaultId || balancesData?.id
  const { data: selectedVault, isLoading: selectedVaultLoading, refetch: refetchSelectedVault } =
    useVaultDetails(activeVaultId)

  const {
    data: reconciliationReport,
    isLoading: reconciliationLoading,
    isFetching: reconciliationFetching,
    refetch: refetchReconciliation,
  } = useVaultReconciliationReport(activeVaultId)

  const { data: vaultsList, isLoading: vaultsLoading } = useVaultsList({
    search: vaultFilters.search || undefined,
    vault_type: vaultFilters.vault_type || undefined,
    skip: (vaultPage - 1) * vaultPageSize,
    limit: vaultPageSize,
  })

  useEffect(() => {
    if (!selectedVaultId && balancesData?.id) {
      setSelectedVaultId(balancesData.id)
    }
  }, [balancesData, selectedVaultId])

  const { data: branchesData } = useBranches({ limit: 200, is_active: true })

  const { mutate: adjustBalance, isPending: adjustingBalance } = useAdjustVaultBalance()
  const { mutate: createVault, isPending: creatingVault } = useCreateVault()
  const { mutate: updateVault, isPending: updatingVault } = useUpdateVault()

  const { mutate: reconcile, isPending: reconciling } = useReconcileVault()

  const historySkip = (historyPage - 1) * historyPageSize
  const {
    data: transferHistory,
    isLoading: historyLoading,
    refetch: refetchTransferHistory,
  } = useVaultTransfers({
    skip: historySkip,
    limit: historyPageSize,
    ...historyFilters,
    vault_id: historyFilters.vault_id || activeVaultId,
  })

  const { data: transferDetails, refetch: refetchTransferDetails } = useVaultTransferDetails(detailId)
  const { mutate: approveVaultTransfer, isPending: approving } = useApproveVaultTransfer()
  const { mutate: rejectVaultTransfer, isPending: rejecting } = useRejectVaultTransfer()
  const { mutate: completeVaultTransfer, isPending: completing } = useCompleteVaultTransfer()
  const { mutate: cancelVaultTransfer, isPending: cancelling } = useCancelVaultTransfer()

  const { data: vaultStats } = useVaultStatistics(activeVaultId)
  const { data: vaultTransferStats } = useVaultTransferStatistics(activeVaultId, 30)

  const totalVaultPages = useMemo(() => {
    const totalFromResponse = (vaultsList as { total?: number })?.total
    const list = (vaultsList as { data?: VaultResponse[] })?.data
    const totalCount =
      typeof totalFromResponse === 'number'
        ? totalFromResponse
        : Array.isArray(list)
          ? list.length
          : Array.isArray(vaultsList)
            ? (vaultsList as VaultResponse[]).length
            : 0
    return Math.max(1, Math.ceil(totalCount / vaultPageSize))
  }, [vaultsList])

  const totalHistoryPages = useMemo(() => {
    const total = (transferHistory as { total?: number })?.total ?? 0
    return Math.max(1, Math.ceil(total / historyPageSize))
  }, [transferHistory])

  const activeVault = selectedVault ?? balancesData

  const handleSaveVault = () => {
    if (!vaultForm.name || !vaultForm.vault_code) return
    if (editingVault) {
      updateVault(
        { vaultId: editingVault.id, payload: { ...vaultForm, vault_type: undefined } },
        {
          onSuccess: () => {
            setVaultDialogOpen(false)
            setEditingVault(null)
          },
        }
      )
    } else {
      createVault(
        {
          vault_code: vaultForm.vault_code,
          name: vaultForm.name,
          vault_type: vaultForm.vault_type as 'main' | 'branch',
          branch_id: vaultForm.branch_id || null,
          description: vaultForm.description || null,
          location: vaultForm.location || null,
        },
        {
          onSuccess: (newVault) => {
            setVaultDialogOpen(false)
            setSelectedVaultId((newVault as VaultResponse).id)
            setVaultForm({
              vault_code: '',
              name: '',
              vault_type: 'main',
              branch_id: '',
              description: '',
              location: '',
              is_active: true,
            })
          },
        }
      )
    }
  }

  const handleAdjustBalance = () => {
    if (!activeVault?.id || !adjustCurrencyId || !adjustValue || adjustReason.trim().length < 10) return
    adjustBalance(
      {
        vault_id: activeVault.id,
        currency_id: adjustCurrencyId,
        new_balance: adjustValue,
        reason: adjustReason,
      },
      {
        onSuccess: () => {
          setAdjustOpen(false)
          setAdjustReason('')
          setAdjustCurrencyId('')
          setAdjustValue('')
          refetchSelectedVault()
          refetchMainVault()
        },
      }
    )
  }

  const handleReconcile = () => {
    if (!activeVaultId) return
    reconcile(
      { vault_id: activeVaultId, currency_id: undefined, notes: undefined },
      {
        onSuccess: () => {
          refetchReconciliation()
        },
      }
    )
  }

  const handleActionWithNotes = () => {
    if (!notesDialog.action || !notesDialog.id) return
    const trimmed = actionNotes.trim() || undefined
    if (notesDialog.action === 'approve') {
      approveVaultTransfer(
        { id: notesDialog.id, notes: trimmed },
        {
          onSuccess: () => {
            setNotesDialog({ action: null })
            setActionNotes('')
            refetchTransferDetails()
          },
        }
      )
      return
    }
    if (notesDialog.action === 'reject') {
      rejectVaultTransfer(
        { id: notesDialog.id, notes: trimmed },
        {
          onSuccess: () => {
            setNotesDialog({ action: null })
            setActionNotes('')
            refetchTransferDetails()
          },
        }
      )
      return
    }
    cancelVaultTransfer(
      { id: notesDialog.id, reason: trimmed },
      {
        onSuccess: () => {
          setNotesDialog({ action: null })
          setActionNotes('')
          refetchTransferDetails()
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vault Management</h1>
          <p className="text-muted-foreground">Manage vault balances and transfers</p>
        </div>
        <Button onClick={() => setShowTransferDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Transfer
        </Button>
      </div>

      <Tabs defaultValue="balances" className="space-y-6">
        <TabsList>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="transfers">Pending Transfers</TabsTrigger>
          <TabsTrigger value="history">Transfer History</TabsTrigger>
          <TabsTrigger value="vaults">Vaults</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="balances" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Showing balances for {activeVault?.name ?? '—'}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setAdjustOpen(true)} disabled={!activeVault}>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Adjust Balance
                </Button>
                <Button size="sm" variant="outline" onClick={handleReconcile} disabled={!activeVaultId || reconciling}>
                  <RefreshCw className={cn('w-4 h-4 mr-2', reconciling && 'animate-spin')} />
                  Run Reconciliation
                </Button>
              </div>
            </div>
            <div className="space-y-1 text-right text-sm text-muted-foreground">
              <p>Selected Vault: {activeVault?.vault_code ?? '—'}</p>
              <p>Type: {activeVault?.vault_type ?? '—'}</p>
            </div>
          </div>

          {activeVault ? (
            <VaultBalances data={activeVault} isLoading={balancesLoading || selectedVaultLoading} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {balancesLoading ? 'Loading balances...' : 'No balance data available'}
            </div>
          )}
        </TabsContent>

        <TabsContent value="transfers">
          <PendingTransfers />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <Label>Status</Label>
              <Select
                value={historyFilters.status ?? ''}
                onValueChange={(val) =>
                  setHistoryFilters((prev) => ({ ...prev, status: (val || undefined) as VaultTransferStatus }))
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Transfer Type</Label>
              <Select
                value={historyFilters.transfer_type ?? ''}
                onValueChange={(val) =>
                  setHistoryFilters((prev) => ({ ...prev, transfer_type: (val || undefined) as VaultTransferType }))
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="vault_to_vault">Vault to Vault</SelectItem>
                  <SelectItem value="vault_to_branch">Vault to Branch</SelectItem>
                  <SelectItem value="branch_to_vault">Branch to Vault</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Branch Filter</Label>
              <Select
                value={historyFilters.branch_id ?? ''}
                onValueChange={(val) =>
                  setHistoryFilters((prev) => ({ ...prev, branch_id: val || undefined }))
                }
              >
                <SelectTrigger className="w-60">
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All branches</SelectItem>
                  {(branchesData?.data ?? []).map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.code} - {branch.name_en ?? branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1" />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  refetchTransferHistory()
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />Refresh
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transfer #</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Initiated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(transferHistory?.data ?? transferHistory?.transactions ?? transferHistory?.items ?? []).map(
                  (transfer) => (
                    <TableRow key={transfer.id} className="hover:bg-muted/50">
                      <TableCell className="font-semibold">{transfer.transfer_number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="destructive" className="capitalize">
                            {transfer.transfer_type.replaceAll('_', ' ')}
                          </Badge>
                          <span className="text-muted-foreground">{transfer.from_vault_code ?? transfer.to_branch_code ?? '—'} →</span>
                          <span className="font-medium">{transfer.to_branch_code ?? transfer.to_vault_code ?? '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{transfer.currency_code ?? transfer.currency_id}</TableCell>
                      <TableCell className="text-right">{transfer.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {transfer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {transfer.initiated_at ? format(new Date(transfer.initiated_at), 'PP') : '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setDetailId(transfer.id)}>
                            View
                          </Button>
                          {transfer.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => setNotesDialog({ action: 'approve', id: transfer.id })}
                                disabled={approving || rejecting}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setNotesDialog({ action: 'reject', id: transfer.id })}
                                disabled={approving || rejecting}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {transfer.status === 'approved' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => completeVaultTransfer(transfer.id)}
                              disabled={completing}
                            >
                              Mark Completed
                            </Button>
                          )}
                          {transfer.status !== 'completed' && transfer.status !== 'cancelled' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setNotesDialog({ action: 'cancel', id: transfer.id })}
                              disabled={cancelling}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
                {!transferHistory && !historyLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No transfers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              Page {historyPage} of {totalHistoryPages}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={historyPage === 1} onClick={() => setHistoryPage((p) => p - 1)}>
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={historyPage >= totalHistoryPages}
                onClick={() => setHistoryPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vaults" className="space-y-4">
          <div className="flex items-end gap-3 flex-wrap">
            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search vaults"
                value={vaultFilters.search}
                onChange={(e) => {
                  setVaultFilters((prev) => ({ ...prev, search: e.target.value }))
                  setVaultPage(1)
                }}
                className="w-64"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={vaultFilters.vault_type}
                onValueChange={(val) => {
                  setVaultFilters((prev) => ({ ...prev, vault_type: val }))
                  setVaultPage(1)
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="main">Main</SelectItem>
                  <SelectItem value="branch">Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1" />
            <Button onClick={() => setVaultDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> New Vault
            </Button>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(vaultsList?.data ?? vaultsList ?? []).map((vault: VaultResponse) => (
                  <TableRow key={vault.id} className="hover:bg-muted/50">
                    <TableCell className="font-semibold">{vault.vault_code}</TableCell>
                    <TableCell>{vault.name}</TableCell>
                    <TableCell className="capitalize">{vault.vault_type}</TableCell>
                    <TableCell>{vault.branch_id || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={vault.is_active ? 'default' : 'secondary'}>
                        {vault.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedVaultId(vault.id)}>
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingVault(vault)
                            setVaultForm({
                              vault_code: vault.vault_code,
                              name: vault.name,
                              vault_type: vault.vault_type,
                              branch_id: vault.branch_id ?? '',
                              description: vault.description ?? '',
                              location: vault.location ?? '',
                              is_active: vault.is_active,
                            })
                            setVaultDialogOpen(true)
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(vaultsList?.data ?? vaultsList ?? []).length === 0 && !vaultsLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No vaults found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              Page {vaultPage} of {totalVaultPages}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={vaultPage === 1} onClick={() => setVaultPage((p) => p - 1)}>
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={vaultPage >= totalVaultPages}
                onClick={() => setVaultPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reconciliation">
          <VaultReconciliationTable
            report={reconciliationReport}
            isLoading={reconciliationLoading}
            isFetching={reconciliationFetching}
            onRefresh={() => refetchReconciliation()}
          />
        </TabsContent>

        <TabsContent value="statistics" className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border p-4 space-y-2">
            <div className="flex items-center gap-2">
              <CircleDollarSign className="w-5 h-5" />
              <h3 className="font-semibold">Vault Statistics</h3>
            </div>
            {vaultStats ? (
              <div className="space-y-1 text-sm">
                <p>
                  Total Balance (USD): <span className="font-semibold">{vaultStats.total_balance_usd_equivalent}</span>
                </p>
                <p>Currency Count: {vaultStats.currency_count}</p>
                <p>Pending Transfers In: {vaultStats.pending_transfers_in}</p>
                <p>Pending Transfers Out: {vaultStats.pending_transfers_out}</p>
                <p>Last Transfer: {vaultStats.last_transfer_date ? format(new Date(vaultStats.last_transfer_date), 'PP') : '—'}</p>
                <p>
                  Last Reconciliation:{' '}
                  {vaultStats.last_reconciliation_date
                    ? format(new Date(vaultStats.last_reconciliation_date), 'PP')
                    : '—'}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No statistics available.</p>
            )}
          </div>
          <div className="rounded-md border p-4 space-y-2">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5" />
              <h3 className="font-semibold">Transfer Statistics (30 days)</h3>
            </div>
            {vaultTransferStats ? (
              <div className="space-y-1 text-sm">
                <p>Total Transfers: {vaultTransferStats.total_transfers}</p>
                <p>Completed: {vaultTransferStats.completed_transfers}</p>
                <p>Pending: {vaultTransferStats.pending_transfers}</p>
                <p>Cancelled: {vaultTransferStats.cancelled_transfers}</p>
                <p>Total Amount: {vaultTransferStats.total_amount_transferred}</p>
                <p>Average Amount: {vaultTransferStats.average_transfer_amount}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No transfer statistics available.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <TransferDialog
        open={showTransferDialog}
        onClose={() => setShowTransferDialog(false)}
      />

      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Vault Balance</DialogTitle>
            <DialogDescription>Requires a reason with at least 10 characters.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Currency</Label>
              <Select value={adjustCurrencyId} onValueChange={setAdjustCurrencyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {(activeVault?.balances ?? []).map((bal) => (
                    <SelectItem key={bal.currency_id ?? bal.currency_code} value={bal.currency_id ?? bal.currency_code}>
                      {bal.currency_code} - {bal.currency_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>New Balance</Label>
              <Input value={adjustValue} onChange={(e) => setAdjustValue(e.target.value)} type="number" />
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="Explain why the balance is being adjusted"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdjustBalance} disabled={adjustingBalance}>
              Save Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={vaultDialogOpen} onOpenChange={setVaultDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingVault ? 'Update Vault' : 'Create Vault'}</DialogTitle>
            <DialogDescription>Fill in vault details to save.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-1">
              <Label>Vault Code</Label>
              <Input
                value={vaultForm.vault_code}
                onChange={(e) => setVaultForm((prev) => ({ ...prev, vault_code: e.target.value }))}
                disabled={!!editingVault}
              />
            </div>
            <div className="md:col-span-1">
              <Label>Name</Label>
              <Input
                value={vaultForm.name}
                onChange={(e) => setVaultForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={vaultForm.vault_type}
                onValueChange={(val) => setVaultForm((prev) => ({ ...prev, vault_type: val }))}
                disabled={!!editingVault}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main</SelectItem>
                  <SelectItem value="branch">Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Branch</Label>
              <Select
                value={vaultForm.branch_id}
                onValueChange={(val) => setVaultForm((prev) => ({ ...prev, branch_id: val }))}
                disabled={vaultForm.vault_type === 'main'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {(branchesData?.data ?? []).map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.code} - {branch.name_en ?? branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={vaultForm.is_active ? 'active' : 'inactive'}
                onValueChange={(val) => setVaultForm((prev) => ({ ...prev, is_active: val === 'active' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={vaultForm.description}
                onChange={(e) => setVaultForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Location</Label>
              <Input
                value={vaultForm.location}
                onChange={(e) => setVaultForm((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVaultDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveVault} disabled={creatingVault || updatingVault}>
              {editingVault ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(detailId)} onOpenChange={(open) => !open && setDetailId(undefined)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Transfer Details</DialogTitle>
            <DialogDescription>Full information for the selected vault transfer.</DialogDescription>
          </DialogHeader>
          {transferDetails ? (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground">Transfer #</p>
                  <p className="font-semibold">{transferDetails.transfer_number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge className="capitalize">{transferDetails.status}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <Badge variant="secondary" className="capitalize">
                    {transferDetails.transfer_type.replaceAll('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Currency</p>
                  <p className="font-semibold">{transferDetails.currency_code ?? transferDetails.currency_id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-semibold">{transferDetails.amount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Initiated</p>
                  <p>{transferDetails.initiated_at ? format(new Date(transferDetails.initiated_at), 'PPpp') : '—'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground">From</p>
                  <p className="font-semibold">{transferDetails.from_vault_code ?? transferDetails.to_branch_code ?? '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">To</p>
                  <p className="font-semibold">{transferDetails.to_vault_code ?? transferDetails.to_branch_code ?? '—'}</p>
                </div>
              </div>
              {transferDetails.notes && (
                <div>
                  <p className="text-muted-foreground">Notes</p>
                  <p>{transferDetails.notes}</p>
                </div>
              )}
              {transferDetails.rejection_reason && (
                <div>
                  <p className="text-muted-foreground">Rejection Reason</p>
                  <p>{transferDetails.rejection_reason}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Loading transfer details...</p>
          )}
          <DialogFooter className="justify-between">
            <div className="flex gap-2">
              {transferDetails?.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => setNotesDialog({ action: 'approve', id: transferDetails.id })}
                    disabled={approving || rejecting}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setNotesDialog({ action: 'reject', id: transferDetails.id })}
                    disabled={approving || rejecting}
                  >
                    Reject
                  </Button>
                </>
              )}
              {transferDetails && transferDetails.status === 'approved' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => completeVaultTransfer(transferDetails.id)}
                  disabled={completing}
                >
                  Mark Completed
                </Button>
              )}
              {transferDetails && transferDetails.status !== 'completed' && transferDetails.status !== 'cancelled' && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setNotesDialog({ action: 'cancel', id: transferDetails.id })}
                  disabled={cancelling}
                >
                  Cancel
                </Button>
              )}
            </div>
            <Button variant="outline" onClick={() => setDetailId(undefined)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(notesDialog.action)} onOpenChange={(open) => !open && setNotesDialog({ action: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide Notes</DialogTitle>
            <DialogDescription>Optional notes for this action.</DialogDescription>
          </DialogHeader>
          <Textarea value={actionNotes} onChange={(e) => setActionNotes(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesDialog({ action: null })}>
              Cancel
            </Button>
            <Button onClick={handleActionWithNotes} disabled={approving || rejecting || cancelling}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
