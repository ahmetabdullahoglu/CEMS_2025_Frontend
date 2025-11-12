import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useVaultBalances } from '@/hooks/useVault'
import VaultBalances from '../components/VaultBalances'
import PendingTransfers from '../components/PendingTransfers'
import TransferDialog from '../components/TransferDialog'

export default function VaultPage() {
  const [showTransferDialog, setShowTransferDialog] = useState(false)

  const { data: balancesData, isLoading: balancesLoading } = useVaultBalances()

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
        </TabsList>

        <TabsContent value="balances">
          {balancesData ? (
            <VaultBalances data={balancesData} isLoading={balancesLoading} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {balancesLoading ? 'Loading balances...' : 'No balance data available'}
            </div>
          )}
        </TabsContent>

        <TabsContent value="transfers">
          <PendingTransfers />
        </TabsContent>
      </Tabs>

      <TransferDialog
        open={showTransferDialog}
        onClose={() => setShowTransferDialog(false)}
      />
    </div>
  )
}
