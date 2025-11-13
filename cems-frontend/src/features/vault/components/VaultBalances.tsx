import { formatDistanceToNow } from 'date-fns'
import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { VaultBalancesResponse } from '@/types/vault.types'

interface VaultBalancesProps {
  data: VaultBalancesResponse
  isLoading?: boolean
}

export default function VaultBalances({ data, isLoading }: VaultBalancesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vault Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading vault balances...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Vault Balances</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated {formatDistanceToNow(new Date(data.last_updated), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center gap-2 text-2xl font-bold">
            <DollarSign className="w-6 h-6" />
            {Number(data.total_value_usd).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Total USD Value</p>
      </CardHeader>
      <CardContent>
        {data.balances.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No balances found in vault.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Reserved</TableHead>
                <TableHead className="text-right">Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.balances.map((balance) => (
                <TableRow key={balance.currency_code}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{balance.currency_code}</div>
                      <div className="text-sm text-muted-foreground">
                        {balance.currency_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {Number(balance.balance).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right text-yellow-600">
                    {Number(balance.reserved).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    {Number(balance.available).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
