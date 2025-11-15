import { useEffect, useState } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { Vault, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { VaultBalance, VaultDetailsResponse } from '@/types/vault.types'
import { cn } from '@/lib/utils'
import CurrencyBalanceDetails from './CurrencyBalanceDetails'
import BranchThresholdAlerts from './BranchThresholdAlerts'
import { useBranchBalances, useBranchThresholds } from '@/hooks/useBranches'

interface VaultBalancesProps {
  data: VaultDetailsResponse
  isLoading?: boolean
}

export default function VaultBalances({ data, isLoading }: VaultBalancesProps) {
  const [selectedBalance, setSelectedBalance] = useState<VaultBalance | null>(null)

  useEffect(() => {
    if ((data?.balances?.length ?? 0) === 0) {
      setSelectedBalance(null)
      return
    }

    if (!selectedBalance) {
      setSelectedBalance(data.balances[0])
      return
    }

    const stillExists = data.balances.some(
      (balance) => balance.currency_code === selectedBalance.currency_code
    )

    if (!stillExists) {
      setSelectedBalance(data.balances[0])
    }
  }, [data, selectedBalance])

  const branchId = data.branch_id ?? undefined
  const {
    data: branchBalances,
    isLoading: branchBalancesLoading,
  } = useBranchBalances(branchId || '', Boolean(branchId))
  const {
    data: branchThresholds,
    isLoading: branchThresholdsLoading,
  } = useBranchThresholds(branchId || '', Boolean(branchId))

  const branchDisplayName = branchId ? branchBalances?.branch_name ?? data.name : undefined

  const handleSelectCurrency = (balance: VaultBalance) => {
    setSelectedBalance(balance)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vault Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading vault information...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Vault Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vault className="w-6 h-6" />
              <div>
                <CardTitle>{data.name ?? 'N/A'}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {data.vault_code ?? 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={data.is_active ? 'default' : 'secondary'}>
                {data.is_active ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="outline">
                {data.vault_type === 'main' ? 'Main Vault' : 'Branch Vault'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{data.description}</p>
              </div>
            )}
            {data.location && (
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </div>
                <p className="font-medium">{data.location}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">
                {data.created_at ? format(new Date(data.created_at), 'PPP') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {data.updated_at ? formatDistanceToNow(new Date(data.updated_at), { addSuffix: true }) : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balances Card */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Currency Balances</CardTitle>
            <p className="text-sm text-muted-foreground">
              Total of {data.balances?.length ?? 0} currencies
            </p>
          </CardHeader>
          <CardContent>
            {(data?.balances ?? []).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No balances found in vault.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data?.balances ?? []).map((balance) => {
                    const isSelected = selectedBalance?.currency_code === balance.currency_code
                    return (
                      <TableRow
                        key={balance.currency_code}
                        onClick={() => handleSelectCurrency(balance)}
                        className={cn('cursor-pointer', isSelected && 'bg-muted/60')}
                      >
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-bold">{balance.currency_code ?? 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">
                              {balance.currency_name ?? 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-bold text-lg">
                            {Number(balance.balance ?? 0).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {balance.last_updated
                              ? formatDistanceToNow(new Date(balance.last_updated), { addSuffix: true })
                              : 'N/A'}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <CurrencyBalanceDetails
          currencyId={selectedBalance?.currency_id}
          currencyCode={selectedBalance?.currency_code}
        />
      </div>

      <BranchThresholdAlerts
        branchName={branchDisplayName}
        balances={branchBalances?.balances}
        thresholds={branchThresholds?.thresholds}
        isLoading={branchBalancesLoading || branchThresholdsLoading}
      />
    </div>
  )
}
